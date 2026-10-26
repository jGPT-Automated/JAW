// Owner routes for the GitHub section. Responses are cached in Neon so pages load fast,
// stay within GitHub's rate limits, and still show the last good copy if GitHub fails.
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Env } from "../auth.js";
import { one, q } from "../db.js";
import { buildSnapshot, pullFiles } from "../lib/github.js";
import { isTrackedAccount } from "../../src/hub/github-accounts.js";

export const github = new Hono<Env>();

const ACCOUNT_TTL_MS = 15 * 60_000;
const PULL_TTL_MS = 5 * 60_000;

async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>, force = false) {
  const row = await one<{ data: T; fetched_at: string }>(`SELECT data, fetched_at FROM github_cache WHERE key = $1`, [key]);
  if (row && !force && Date.now() - new Date(row.fetched_at).getTime() < ttlMs) {
    return { data: row.data, fetched_at: row.fetched_at, stale: false, error: null };
  }
  try {
    const data = await load();
    const saved = await one<{ fetched_at: string }>(
      `INSERT INTO github_cache (key, data, fetched_at, error) VALUES ($1, $2, now(), NULL)
       ON CONFLICT (key) DO UPDATE SET data = $2, fetched_at = now(), error = NULL RETURNING fetched_at`,
      [key, JSON.stringify(data)],
    );
    return { data, fetched_at: saved!.fetched_at, stale: false, error: null };
  } catch (e) {
    const message = (e as Error).message;
    if (!row) throw new HTTPException(502, { message });
    await q(`UPDATE github_cache SET error = $2 WHERE key = $1`, [key, message]);
    return { data: row.data, fetched_at: row.fetched_at, stale: true, error: message };
  }
}

github.get("/accounts/:login", async (c) => {
  const login = c.req.param("login");
  if (!isTrackedAccount(login)) throw new HTTPException(404, { message: "Not one of the tracked accounts" });
  return c.json(await cached(`account:${login.toLowerCase()}`, ACCOUNT_TTL_MS, () => buildSnapshot(login), c.req.query("refresh") === "1"));
});

github.get("/pulls/:owner/:repo/:number", async (c) => {
  const { owner, repo } = c.req.param();
  const number = Number(c.req.param("number"));
  if (!isTrackedAccount(owner) || !Number.isInteger(number)) throw new HTTPException(404, { message: "Pull request not found" });
  const full = `${owner}/${repo}`;
  const files = await cached(`pull:${full.toLowerCase()}#${number}`, PULL_TTL_MS, () => pullFiles(full, number));
  const decisions = await q<{ path: string; decision: string }>(
    `SELECT path, decision FROM review_decisions WHERE lower(repo) = lower($1) AND pr_number = $2`,
    [full, number],
  );
  return c.json({ ...files, decisions: Object.fromEntries(decisions.map((d) => [d.path, d.decision])) });
});

/** The owner's call on one file of a pull request. Agents read these from /api/agent/reviews. */
github.put("/reviews", async (c) => {
  const b = await c.req.json<{ repo?: string; pr_number?: number; path?: string; decision?: string }>();
  if (!b.repo || !Number.isInteger(b.pr_number) || !b.path || !["pending", "accepted", "rejected"].includes(b.decision ?? "")) {
    throw new HTTPException(400, { message: "repo, pr_number, path and decision are required" });
  }
  await q(
    `INSERT INTO review_decisions (repo, pr_number, path, decision) VALUES ($1, $2, $3, $4)
     ON CONFLICT (repo, pr_number, path) DO UPDATE SET decision = $4, decided_at = now()`,
    [b.repo, b.pr_number, b.path, b.decision],
  );
  return c.json({ ok: true });
});

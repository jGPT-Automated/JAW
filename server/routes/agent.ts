// Agent API. Agents authenticate with their own inbound token (Authorization: Bearer jaw_…).
// This is how Hyperagent/Letta replies come back, and how the JAW voice agent saves and
// recalls memory and hands work to other agents.
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAgent, type Env } from "../auth.js";
import { one, q } from "../db.js";
import { addLibrary } from "../lib/catalog-store.js";
import { saveMemory, searchMemories } from "../lib/memory.js";
import { addResource } from "../lib/resources.js";
import { enqueue, processQueue } from "../lib/queue.js";
import { inboundUrl } from "../lib/urls.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EVENT_RE = /^[a-z_]{1,40}$/;

function pickText(body: Record<string, unknown>) {
  for (const key of ["content", "message", "text", "reply", "output"]) {
    const v = body[key];
    if (typeof v === "string" && v.trim()) return v.slice(0, 20_000);
  }
  return "";
}

export const agentApi = new Hono<Env>();
agentApi.use("*", requireAgent);

/** Who am I, and which agents can I delegate to. */
agentApi.get("/me", async (c) => {
  const agent = c.get("agent");
  const peers = await q(
    `SELECT id, name, type, provider, description, status FROM agents WHERE id <> $1 AND webhook_enabled ORDER BY name`,
    [agent.id],
  );
  return c.json({ agent, peers });
});

/** Replies and events from an agent. */
agentApi.post("/inbound", async (c) => {
  const agent = c.get("agent");
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}) as Record<string, unknown>);
  const content = pickText(body);
  if (!content) throw new HTTPException(400, { message: "content required" });
  const conversationId =
    typeof body.conversation_id === "string" && UUID_RE.test(body.conversation_id) ? body.conversation_id : crypto.randomUUID();
  const eventType = typeof body.event_type === "string" && EVENT_RE.test(body.event_type) ? body.event_type : "agent_report";
  const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};

  const msg = await one<{ id: string }>(
    `INSERT INTO agent_messages (conversation_id, from_kind, from_agent_id, from_label, to_kind, to_label, channel, content, metadata)
     VALUES ($1, 'agent', $2, $3, 'user', 'Hub', $4, $5, $6) RETURNING id`,
    [conversationId, agent.id, agent.name, body.channel === "voice" ? "voice" : "webhook", content, JSON.stringify({ ...metadata, via: "inbound" })],
  );
  await q(`INSERT INTO activity_logs (agent_id, agent_name, event_type, message, metadata) VALUES ($1, $2, $3, $4, $5)`, [
    agent.id,
    agent.name,
    eventType,
    content.length > 160 ? `${content.slice(0, 157)}…` : content,
    JSON.stringify({ conversation_id: conversationId, message_id: msg!.id }),
  ]);
  await q(`UPDATE agents SET last_heartbeat = now(), status = 'active' WHERE id = $1`, [agent.id]);
  return c.json({ ok: true, conversation_id: conversationId, message_id: msg!.id });
});

agentApi.post("/memory", async (c) => {
  const b = await c.req.json<{ content?: string; kind?: string; tags?: string[]; conversation_id?: string }>();
  if (!b.content?.trim()) throw new HTTPException(400, { message: "content required" });
  const memory = await saveMemory({
    content: b.content,
    kind: b.kind,
    tags: b.tags,
    source: "agent",
    agent_id: c.get("agent").id,
    conversation_id: b.conversation_id && UUID_RE.test(b.conversation_id) ? b.conversation_id : null,
  });
  return c.json(memory, 201);
});

agentApi.get("/memory", async (c) => {
  const limit = Math.min(20, Math.max(1, Number(c.req.query("limit")) || 6));
  return c.json(await searchMemories(c.req.query("q"), limit));
});

/** Hand a task to another agent through the rate-limited queue. */
agentApi.post("/delegate", async (c) => {
  const from = c.get("agent");
  const b = await c.req.json<{ to?: string; task?: string; conversation_id?: string }>();
  if (!b.to?.trim() || !b.task?.trim()) throw new HTTPException(400, { message: "to and task are required" });
  const target = await one<{ id: string; name: string }>(
    `SELECT id, name FROM agents WHERE id <> $2 AND webhook_enabled AND (id::text = $1 OR lower(name) = lower($1)) LIMIT 1`,
    [b.to.trim(), from.id],
  );
  if (!target) throw new HTTPException(404, { message: `No connected agent called ${b.to}` });
  const queued = await enqueue({
    agent_id: target.id,
    payload: b.task.trim(),
    source: "agent",
    from_agent_id: from.id,
    conversation_id: b.conversation_id && UUID_RE.test(b.conversation_id) ? b.conversation_id : null,
  });
  await q(`INSERT INTO activity_logs (agent_id, agent_name, event_type, message) VALUES ($1, $2, 'task_routed', $3)`, [
    from.id,
    from.name,
    `Delegated to ${target.name}: ${b.task.trim().slice(0, 120)}`,
  ]);
  if (queued.status === "pending") await processQueue(inboundUrl(c.req.url), 5);
  return c.json({ to: target.name, ...queued }, 201);
});

/** Voice transcript lines, so a call shows up in the Inbox. */
agentApi.post("/transcript", async (c) => {
  const agent = c.get("agent");
  const b = await c.req.json<{ conversation_id?: string; role?: string; text?: string }>();
  if (!b.conversation_id || !UUID_RE.test(b.conversation_id) || !b.text?.trim()) {
    throw new HTTPException(400, { message: "conversation_id and text are required" });
  }
  const fromUser = b.role === "user";
  await q(
    `INSERT INTO agent_messages (conversation_id, from_kind, from_agent_id, from_label, to_kind, to_agent_id, to_label, channel, content)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'voice', $8)`,
    [
      b.conversation_id,
      fromUser ? "voice" : "agent",
      fromUser ? null : agent.id,
      fromUser ? "You" : agent.name,
      fromUser ? "agent" : "user",
      fromUser ? agent.id : null,
      fromUser ? agent.name : "You",
      b.text.trim().slice(0, 8000),
    ],
  );
  await q(`UPDATE agents SET last_heartbeat = now(), status = 'active' WHERE id = $1`, [agent.id]);
  return c.json({ ok: true });
});

/** End-of-call summary, so a long conversation can be read main points first. */
agentApi.post("/summary", async (c) => {
  const b = await c.req.json<{
    conversation_id?: string;
    title?: string;
    summary?: string;
    key_points?: string[];
    decisions?: string[];
    action_items?: string[];
  }>();
  if (!b.conversation_id || !UUID_RE.test(b.conversation_id) || !b.summary?.trim()) {
    throw new HTTPException(400, { message: "conversation_id and summary are required" });
  }
  const list = (v?: string[]) => JSON.stringify((v ?? []).map((x) => String(x).trim()).filter(Boolean).slice(0, 30));
  const row = await one(
    `UPDATE voice_sessions SET title = $2, summary = $3, key_points = $4, decisions = $5, action_items = $6,
            ended_at = coalesce(ended_at, now())
     WHERE conversation_id = $1 RETURNING conversation_id`,
    [b.conversation_id, b.title?.trim().slice(0, 140) || null, b.summary.trim().slice(0, 4000), list(b.key_points), list(b.decisions), list(b.action_items)],
  );
  if (!row) throw new HTTPException(404, { message: "Conversation not found" });
  return c.json({ ok: true });
});

/** The owner's accept / reject calls on pull request files, newest first. */
agentApi.get("/reviews", async (c) => {
  const repo = c.req.query("repo");
  return c.json(
    await q(
      `SELECT repo, pr_number, path, decision, decided_at FROM review_decisions
       WHERE ($1::text IS NULL OR lower(repo) = lower($1)) ORDER BY decided_at DESC LIMIT 200`,
      [repo ?? null],
    ),
  );
});

/** Add a component library by its registry index URL; it is synced into the catalog at once. */
agentApi.post("/component-libraries", async (c) => c.json(await addLibrary(await c.req.json(), c.get("agent").name), 201));

/** Add a design reference or other resource by link: { url, title?, collection?, notes?, kind? }. */
agentApi.post("/resources", async (c) => c.json(await addResource(await c.req.json(), c.get("agent").name), 201));

/** A tool the agent ran: once with status "running", again with "done" or "error" and the output. */
agentApi.post("/tool-calls", async (c) => {
  const b = await c.req.json<{
    call_id?: string;
    conversation_id?: string;
    name?: string;
    args?: unknown;
    output?: string;
    status?: string;
  }>();
  if (!b.call_id || !b.name || !["running", "done", "error"].includes(b.status ?? "")) {
    throw new HTTPException(400, { message: "call_id, name and status (running, done, error) are required" });
  }
  const conversation = b.conversation_id && UUID_RE.test(b.conversation_id) ? b.conversation_id : null;
  await q(
    `INSERT INTO tool_calls (call_id, conversation_id, agent_id, name, args, output, status, ended_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, CASE WHEN $7 = 'running' THEN NULL ELSE now() END)
     ON CONFLICT (call_id) DO UPDATE SET output = coalesce($6, tool_calls.output), status = $7,
       ended_at = CASE WHEN $7 = 'running' THEN tool_calls.ended_at ELSE now() END`,
    [b.call_id.slice(0, 200), conversation, c.get("agent").id, b.name.slice(0, 100), JSON.stringify(b.args ?? {}), b.output?.slice(0, 4000) ?? null, b.status],
  );
  return c.json({ ok: true });
});

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ownerKeyConfigured, ownerKeyMode, OWNER_KEY_MIN, requireOwner, type Env } from "./auth.js";
import { one } from "./db.js";
import { agentApi } from "./routes/agent.js";
import { github } from "./routes/github.js";
import { owner } from "./routes/owner.js";
import { publicApi } from "./routes/public.js";

export const app = new Hono<Env>().basePath("/api");

// Owner session is required everywhere except the health check, the public read-only
// surface, and the agent API (which has its own token check).
const OPEN = ["/api/health", "/api/status", "/api/public/", "/api/agent/"];
app.use("*", async (c, next) => (OPEN.some((p) => c.req.path === p || c.req.path.startsWith(p)) ? next() : requireOwner(c, next)));

app.get("/health", (c) => c.json({ ok: true }));

/**
 * What this deployment still needs, by setting name only (never values), so the app can
 * show one setup screen instead of failing page by page.
 */
app.get("/status", async (c) => {
  const database: "ok" | "unreachable" = await one("SELECT 1 AS ok").then(
    () => "ok" as const,
    () => "unreachable" as const,
  );
  const key = database === "ok" ? await ownerKeyConfigured() : ownerKeyMode() === "ok";
  const auth = process.env.JAW_AUTH_DISABLED === "1" ? "disabled" : key ? "key" : process.env.NEON_AUTH_JWKS_URL ? "neon" : "none";
  const missing: string[] = [];
  if (database !== "ok") missing.push(process.env.DATABASE_URL ? "DATABASE_URL" : "NEON_KEY");
  if (auth === "none") missing.push("JAW_OWNER_KEY");
  return c.json({
    database,
    auth,
    owner_key: ownerKeyMode() === "short" ? `JAW_OWNER_KEY must be at least ${OWNER_KEY_MIN} characters` : null,
    missing,
    optional_missing: ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET", "GITHUB_TOKEN"].filter((k) => !process.env[k]),
  });
});

app.route("/public", publicApi);
app.route("/agent", agentApi);
app.route("/github", github);
app.route("/", owner);

app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
  console.error("api error", err);
  return c.json({ error: "Something went wrong on the server" }, 500);
});

export default app;

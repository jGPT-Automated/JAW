import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireOwner, type Env } from "./auth.js";
import { agentApi } from "./routes/agent.js";
import { owner } from "./routes/owner.js";
import { publicApi } from "./routes/public.js";

export const app = new Hono<Env>().basePath("/api");

// Owner session is required everywhere except the health check, the public read-only
// surface, and the agent API (which has its own token check).
const OPEN = ["/api/health", "/api/public/", "/api/agent/"];
app.use("*", async (c, next) => (OPEN.some((p) => c.req.path === p || c.req.path.startsWith(p)) ? next() : requireOwner(c, next)));

app.get("/health", (c) => c.json({ ok: true }));
app.route("/public", publicApi);
app.route("/agent", agentApi);
app.route("/", owner);

app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
  console.error("api error", err);
  return c.json({ error: "Something went wrong on the server" }, 500);
});

export default app;

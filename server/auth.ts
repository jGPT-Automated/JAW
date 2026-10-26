import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { timingSafeEqual } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { one } from "./db.js";

export type Env = {
  Variables: {
    ownerId: string;
    agent: { id: string; name: string };
  };
};

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function bearer(header: string | undefined) {
  return header?.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

/** Owner key: one long secret set in JAW_OWNER_KEY. Too short to be safe means not configured. */
export const OWNER_KEY_MIN = 16;
export function ownerKeyMode(): "ok" | "short" | "unset" {
  const key = process.env.JAW_OWNER_KEY ?? "";
  return !key ? "unset" : key.length < OWNER_KEY_MIN ? "short" : "ok";
}

function matchesOwnerKey(token: string) {
  if (ownerKeyMode() !== "ok" || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(process.env.JAW_OWNER_KEY!);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * The owner's dashboard. Either the owner key (JAW_OWNER_KEY) or a Neon Auth (managed Better Auth) JWT is verified against the
 * branch JWKS. Fails closed: without NEON_AUTH_JWKS_URL every request is refused, unless
 * JAW_AUTH_DISABLED=1 is set for local development.
 */
export const requireOwner = createMiddleware<Env>(async (c, next) => {
  if (process.env.JAW_AUTH_DISABLED === "1") {
    c.set("ownerId", "local-dev");
    return next();
  }
  const token = bearer(c.req.header("authorization"));
  if (matchesOwnerKey(token)) {
    c.set("ownerId", "owner");
    return next();
  }
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
  if (!jwksUrl) {
    if (ownerKeyMode() === "ok") throw new HTTPException(401, { message: token ? "That owner key is not right" : "Enter your owner key" });
    throw new HTTPException(503, { message: "Sign-in is not configured on the server" });
  }
  if (!token) throw new HTTPException(401, { message: "Sign in to continue" });
  jwks ??= createRemoteJWKSet(new URL(jwksUrl));
  try {
    const { payload } = await jwtVerify(token, jwks);
    const allowed = (process.env.JAW_OWNER_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const email = String(payload.email ?? "").toLowerCase();
    if (allowed.length && !allowed.includes(email)) throw new HTTPException(403, { message: "This account is not allowed" });
    c.set("ownerId", String(payload.sub));
  } catch (e) {
    if (e instanceof HTTPException) throw e;
    throw new HTTPException(401, { message: "Session expired, sign in again" });
  }
  return next();
});

/** An agent calling back into the hub with the inbound token issued at registration. */
export const requireAgent = createMiddleware<Env>(async (c, next) => {
  const token = bearer(c.req.header("authorization")) || c.req.header("x-jaw-token") || "";
  if (!token) throw new HTTPException(401, { message: "missing token" });
  const agent = await one<{ id: string; name: string }>(
    `SELECT a.id, a.name FROM agent_credentials c JOIN agents a ON a.id = c.agent_id WHERE c.inbound_token = $1`,
    [token],
  );
  if (!agent) throw new HTTPException(401, { message: "invalid token" });
  c.set("agent", agent);
  return next();
});

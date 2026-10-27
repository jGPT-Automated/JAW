import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// JAW's Neon project (NeonJess). Not a secret: it only works together with an API key.
const NEON_PROJECT_ID = process.env.NEON_PROJECT_ID || "solitary-tree-57753514";

let client: Promise<NeonQueryFunction<false, false>> | null = null;

/**
 * The connection string: DATABASE_URL when set, otherwise looked up once per instance from the
 * Neon API with NEON_KEY, so a deployment with only the Neon API key still reaches the database.
 */
export async function databaseUrl(): Promise<string> {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const key = process.env.NEON_KEY || process.env.NEON_API_KEY;
  if (!key) throw new Error("No database: set DATABASE_URL, or NEON_KEY to look it up");
  const res = await fetch(
    `https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/connection_uri?database_name=neondb&role_name=neondb_owner&pooled=true`,
    { headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }, signal: AbortSignal.timeout(10_000) },
  );
  const body = (await res.json().catch(() => ({}))) as { uri?: string; message?: string };
  if (!res.ok || !body.uri) throw new Error(`Neon API couldn't provide the connection string: ${body.message ?? res.status}`);
  return body.uri;
}

/** Neon over HTTPS: no connection to keep alive between serverless invocations. */
export function db() {
  client ??= databaseUrl().then(
    (url) => neon(url),
    (e) => {
      client = null; // Try again on the next request.
      throw e;
    },
  );
  return client;
}

/** Parameterized query returning rows. */
export async function q<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  return (await (await db()).query(text, params)) as T[];
}

export async function one<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T | null> {
  return (await q<T>(text, params))[0] ?? null;
}

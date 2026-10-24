// Applies db/migrations/*.sql to DATABASE_URL in order, once each.
// Uses Neon's HTTPS driver, so it runs anywhere outbound HTTPS works.
// Statements in a file are split on ";" at the end of a line.
import { neon } from "@neondatabase/serverless";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = neon(url);
const dir = join(import.meta.dirname, "..", "db", "migrations");

await sql.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
const done = new Set((await sql.query("SELECT name FROM schema_migrations")).map((r) => r.name));

for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(file)) continue;
  const statements = readFileSync(join(dir, file), "utf8")
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
  // One HTTP transaction per file: all statements apply or none do.
  await sql.transaction([...statements.map((s) => sql.query(s)), sql.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file])]);
  console.log(`applied ${file} (${statements.length} statements)`);
}
console.log("migrations up to date");

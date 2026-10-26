// Upserts the skills directory (table `skills`) from the skills installed in this repo
// (skills-lock.json + .claude/skills/*/SKILL.md) plus a few recommended ones not installed.
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = neon(url);
const root = join(import.meta.dirname, "..");

const TAGS = {
  "find-skills": ["skills", "discovery"],
  shadcn: ["ui", "design"],
  "frontend-design": ["design", "ui"],
  "web-design-guidelines": ["design", "accessibility", "review"],
  "vercel-react-best-practices": ["react", "performance"],
  "neon-postgres": ["database", "neon"],
  "neon-auth": ["auth", "neon"],
  "building-livekit-agents": ["voice", "livekit"],
  "reading-livekit-docs": ["voice", "livekit", "docs"],
  "operating-livekit-agents": ["voice", "livekit", "deploy"],
  "inngest-durable-functions": ["orchestration", "inngest"],
  "inngest-steps": ["orchestration", "inngest"],
  "inngest-setup": ["orchestration", "inngest"],
  "better-auth-best-practices": ["auth"],
  handoff: ["handoff", "memory"],
  docs: ["voice", "deepgram", "docs"],
};

// Worth knowing about, not installed here yet.
const RECOMMENDED = [
  ["mattpocock/skills/grill-me", "grill-me", "mattpocock/skills", "Interview the user hard about a plan before building it.", ["planning"]],
  ["vercel/ai/ai-sdk", "ai-sdk", "vercel/ai", "Build with the Vercel AI SDK: streaming, tools, agents, providers.", ["ai", "llm"]],
  ["livekit/agent-skills/testing-livekit-agents", "testing-livekit-agents", "livekit/agent-skills", "Write turn-level tests for LiveKit agents with Vitest or pytest.", ["voice", "livekit", "testing"]],
  ["neondatabase/agent-skills/neon-realtime", "neon-realtime", "neondatabase/agent-skills", "Live queries and reactive UIs on Neon.", ["database", "neon", "realtime"]],
  ["pbakaus/impeccable/impeccable", "impeccable", "pbakaus/impeccable", "Design critique and polish passes for UI work.", ["design", "review"]],
];

function frontmatter(name) {
  const text = readFileSync(join(root, ".claude/skills", name, "SKILL.md"), "utf8");
  const block = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const folded = block.match(/description:\s*(?:>-?|\|)?\s*\n((?:\s{2,}.*\n?)+)/);
  const inline = block.match(/description:\s*['"]?(.+?)['"]?\s*$/m);
  const raw = folded ? folded[1].replace(/\s+/g, " ") : (inline?.[1] ?? "");
  const first = raw.trim().split(/(?<=\.)\s/)[0];
  return first.length > 240 ? `${first.slice(0, 237)}…` : first;
}

const lock = JSON.parse(readFileSync(join(root, "skills-lock.json"), "utf8")).skills;
const rows = Object.entries(lock).map(([name, s]) => [
  `${s.source}/${name}`,
  name,
  s.source,
  frontmatter(name),
  `npx skills add ${s.source} -s ${name}`,
  `https://skills.sh/${s.source}/${name}`,
  TAGS[name] ?? [],
  true,
]);
for (const [id, name, source, description, tags] of RECOMMENDED) {
  rows.push([id, name, source, description, `npx skills add ${source} -s ${name}`, `https://skills.sh/${id}`, tags, false]);
}

await sql.transaction(
  rows.map((r) =>
    sql.query(
      `INSERT INTO skills (id, name, source, description, install, url, tags, installed_in_repo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET description = $4, install = $5, url = $6, tags = $7, installed_in_repo = $8`,
      r,
    ),
  ),
);
console.log(`upserted ${rows.length} skills`);

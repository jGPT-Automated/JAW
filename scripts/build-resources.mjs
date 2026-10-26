// Publishes the repo's agent skills as plain text any agent can fetch:
//   /skills/index.json      name, description, source and URL of every skill
//   /skills/<name>.md       the skill itself (its SKILL.md, unchanged)
// Source of truth: .claude/skills (installed with `npx skills add`, pinned in skills-lock.json).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const src = join(root, ".claude", "skills");
const out = join(root, "public", "skills");
const lock = JSON.parse(readFileSync(join(root, "skills-lock.json"), "utf8")).skills ?? {};

/** name and description from YAML front matter: plain, quoted, or block (| / >) values. */
function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fields = {};
  if (!m) return fields;
  const lines = m[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (/^[|>][+-]?$/.test(value)) {
      const block = [];
      while (i + 1 < lines.length && (/^\s+/.test(lines[i + 1]) || lines[i + 1] === "")) block.push(lines[++i].trim());
      value = block.join(" ").trim();
    } else if (/^["'].*["']$/.test(value)) {
      value = value.slice(1, -1).replace(/\\"/g, '"');
    }
    fields[kv[1]] = value;
  }
  return fields;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const index = [];
for (const dir of readdirSync(src).sort()) {
  const file = join(src, dir, "SKILL.md");
  if (!existsSync(file)) continue;
  const text = readFileSync(file, "utf8");
  const fm = frontMatter(text);
  writeFileSync(join(out, `${dir}.md`), text);
  const pin = lock[dir];
  index.push({
    name: fm.name || dir,
    description: fm.description ?? "",
    url: `/skills/${dir}.md`,
    source: pin ? `https://github.com/${pin.source}` : null,
    bytes: Buffer.byteLength(text),
  });
}

writeFileSync(join(out, "index.json"), `${JSON.stringify({ skills: index }, null, 2)}\n`);
console.log(`published ${index.length} skills to public/skills`);

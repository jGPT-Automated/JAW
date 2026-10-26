// Imports one real conversation (the JAW rebuild planning session, 24 Oct 2026) so the
// Conversations page has a long transcript to read summary-first. Idempotent.
// Owner turns are the owner's own dictated words, trimmed; JAW turns are the replies given.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = neon(url);

const ID = "5b0a7c1e-2f4d-4e8a-9c61-0d3f2a9b7e10";
const START = new Date("2026-10-24T17:05:00Z");

const turns = [
  ["you", 38, "The pain point is voice. I send these long messages and every new conversation starts fresh. Let's start simple: a place where I can have a voice conversation, and then the transcript is saved and viewable for me."],
  ["jaw", 14, "Got it. One screen to talk, one place where every call lands. Do you want the memory and agent wiring now, or after you've seen the screens?"],
  ["you", 31, "Forget all the memory for now. Make it animated. I'm going to Vercel right now to drop in all the keys, but I don't want to look at placeholder nonsense."],
  ["jaw", 12, "Understood. The orb will breathe on its own until audio arrives, so the screen is alive before the keys are in."],
  ["you", 44, "How are you going to handle conversations that are very long? They need the main points taken out. I don't want to scroll a wall of text to find what I decided."],
  ["jaw", 18, "Each call opens on its summary: main points, decisions, follow-ups. The full transcript sits underneath and only expands when you want it."],
  ["you", 52, "The roadmap: fill that out with the stuff from LocalCheck. And the inbox, why would it not just be the whole page? The tabs look free coded. No theater."],
  ["jaw", 16, "The roadmap gets LocalCheck's forty tracked requests on a kanban board from cult-ui. Pages go full width, no panels inside cards."],
  ["you", 47, "Make a page called Resources. Skills are just text. Make it so they're fetchable and an agent can go read the skill directly. And my own taste, my references, a library I can point agents to."],
  ["jaw", 15, "Each skill will be a plain markdown file at a fixed URL, plus an index agents can read. Your Dribbble and Behance references go in a taste library next to them."],
  ["you", 58, "Long term it should track all my GitHub accounts as a feed, with open PRs separated into an inbox. Agents post updates, share files, move cards on the kanban, and document decisions in one shared state. There should be an agent.md that says how to update it."],
  ["jaw", 17, "Noted for the next pass: GitHub feed with a PR inbox, the agent.md contract, and a decisions log in the shared state. This pass is the four screens."],
  ["you", 26, "The best pages are the protocol and the manifesto. Find real components and pull screenshots of their UI. Don't free code it."],
  ["jaw", 13, "Every screen is composed from shadcn, beUI, cult-ui or Kokonut UI as their demos use them, and the sources are written down in DESIGN.md."],
];

const summary = {
  title: "Rebuilding JAW around voice",
  summary:
    "Narrowed the hub to what matters now: talk to JAW by voice and keep every call readable afterwards. Memory and agent plumbing wait until the screens are right.",
  key_points: [
    "Start with voice: one screen to talk, one place where every transcript is saved.",
    "Long calls open on their summary; the full transcript expands on demand.",
    "Roadmap is filled from LocalCheck's tracked requests.",
    "Resources holds skills as fetchable text plus the owner's taste references.",
    "Protocol and Manifesto are the reference for page quality.",
  ],
  decisions: [
    "Only shadcn, beUI, cult-ui and Kokonut UI components, composed as their demos use them.",
    "Dark mode is the default.",
    "Full-page layouts; no panels inside cards, no hand-built tabs.",
  ],
  action_items: [
    "Owner: add LiveKit, Neon and auth keys in Vercel.",
    "Next pass: GitHub feed across all accounts with an open-PR inbox.",
    "Next pass: agent.md contract and a shared decisions log.",
  ],
};

await sql.query("DELETE FROM agent_messages WHERE conversation_id = $1", [ID]);
await sql.query("DELETE FROM voice_sessions WHERE conversation_id = $1", [ID]);

let t = START.getTime();
const rows = turns.map(([who, seconds, text]) => {
  const at = new Date(t).toISOString();
  t += seconds * 1000;
  return [who, at, text];
});

await sql.transaction([
  sql.query(
    `INSERT INTO voice_sessions (room, conversation_id, started_at, ended_at, title, summary, key_points, decisions, action_items)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      `jaw-import-${ID}`,
      ID,
      START.toISOString(),
      new Date(t).toISOString(),
      summary.title,
      summary.summary,
      JSON.stringify(summary.key_points),
      JSON.stringify(summary.decisions),
      JSON.stringify(summary.action_items),
    ],
  ),
  ...rows.map(([who, at, text]) =>
    sql.query(
      `INSERT INTO agent_messages (conversation_id, from_kind, from_label, to_kind, to_label, channel, content, created_at)
       VALUES ($1, $2, $3, $4, $5, 'voice', $6, $7)`,
      who === "you" ? [ID, "voice", "You", "agent", "JAW", text, at] : [ID, "agent", "JAW", "user", "You", text, at],
    ),
  ),
]);
console.log(`seeded conversation ${ID} (${rows.length} turns)`);

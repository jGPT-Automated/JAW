// Makes (or replaces) the token the LiveKit voice agent uses to reach the hub, and prints it once.
// Paste the printed value into GitHub → Settings → Secrets and variables → Actions as JAW_AGENT_TOKEN.
//
//   DATABASE_URL=... node scripts/voice-agent-token.mjs
//
// Running it again replaces the token, so the old one stops working (redeploy the agent after).
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = neon(url);

const NAME = "JAW";
let [agent] = await sql.query(`SELECT id FROM agents WHERE provider = 'internal' AND name = $1 LIMIT 1`, [NAME]);
if (!agent) {
  [agent] = await sql.query(
    `INSERT INTO agents (name, type, provider, description, system_instructions)
     VALUES ($1, 'assistant', 'internal', 'The JAW voice agent (LiveKit).', '') RETURNING id`,
    [NAME],
  );
}

const token = "jaw_" + Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString("hex");
await sql.query(
  `INSERT INTO agent_credentials (agent_id, inbound_token) VALUES ($1, $2)
   ON CONFLICT (agent_id) DO UPDATE SET inbound_token = $2, updated_at = now()`,
  [agent.id, token],
);
console.log(token);

// Rate-limited delivery to agent webhooks, ported from the Supabase enqueue-message and
// queue-processor functions. enqueue() honours each agent's daily cap and minimum gap;
// processQueue() delivers whatever is due. Async providers (Letta answers 202 {"ok":true})
// are marked delivered and their reply arrives later through /api/agent/inbound.
import { one, q } from "../db.js";

export type Provider = "hyperagent" | "letta" | "webhook" | "internal";

interface AgentRow {
  id: string;
  name: string;
  provider: Provider;
  webhook_url: string | null;
  daily_message_limit: number;
  min_seconds_between_messages: number;
  tasks_completed: number;
}

interface QueueRow {
  id: string;
  agent_id: string;
  payload: string;
  source: string;
  reply_channel: string;
  conversation_id: string | null;
  parent_message_id: string | null;
  from_agent_id: string | null;
  attempts: number;
  status: string;
}

export interface EnqueueInput {
  agent_id: string;
  payload: string;
  source?: string;
  reply_channel?: string;
  conversation_id?: string | null;
  from_agent_id?: string | null;
}

export async function enqueue(input: EnqueueInput) {
  const agent = await one<AgentRow>(`SELECT * FROM agents WHERE id = $1`, [input.agent_id]);
  if (!agent) throw new Error("agent not found");

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const sentToday = await one<{ n: string }>(
    `SELECT count(*) AS n FROM message_queue WHERE agent_id = $1 AND status = 'sent' AND updated_at >= $2`,
    [agent.id, startOfDay.toISOString()],
  );

  let status = "pending";
  let scheduledFor = new Date();
  if (Number(sentToday?.n ?? 0) >= agent.daily_message_limit) {
    status = "rate_limited";
    scheduledFor = new Date(startOfDay.getTime() + 86_400_000);
  } else {
    const last = await one<{ updated_at: string }>(
      `SELECT updated_at FROM message_queue WHERE agent_id = $1 AND status = 'sent' ORDER BY updated_at DESC LIMIT 1`,
      [agent.id],
    );
    const earliest = last ? new Date(last.updated_at).getTime() + agent.min_seconds_between_messages * 1000 : 0;
    if (earliest > Date.now()) scheduledFor = new Date(earliest);
  }

  const row = await one<{ id: string }>(
    `INSERT INTO message_queue (agent_id, payload, source, reply_channel, conversation_id, from_agent_id, status, scheduled_for)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [
      agent.id,
      input.payload,
      input.source ?? "ui",
      input.reply_channel ?? "ui",
      input.conversation_id ?? null,
      input.from_agent_id ?? null,
      status,
      scheduledFor.toISOString(),
    ],
  );
  return { id: row!.id, status, scheduled_for: scheduledFor.toISOString() };
}

export function authHeaders(provider: string, secret: string | null | undefined): Record<string, string> {
  if (!secret) return {};
  switch (provider) {
    case "letta":
      return { Authorization: `Basic ${Buffer.from(`webhook:${secret}`).toString("base64")}` };
    case "webhook":
      return { Authorization: `Bearer ${secret}` };
    default:
      return { "X-Hyperagent-Webhook-Secret": secret };
  }
}

/** A bare acknowledgement is not a reply. */
export function isAck(status: number, text: string) {
  if (status === 202 || !text.trim()) return true;
  try {
    const j = JSON.parse(text);
    if (!j || typeof j !== "object" || Array.isArray(j)) return false;
    const keys = Object.keys(j).filter((k) => !["ok", "status", "success", "id", "request_id", "run_id"].includes(k));
    return keys.length === 0;
  } catch {
    return false;
  }
}

export function replyText(text: string) {
  try {
    const j = JSON.parse(text);
    return String(j.reply || j.message || j.text || j.content || j.output || text);
  } catch {
    return text;
  }
}

async function log(agentId: string, agentName: string, eventType: string, message: string, metadata: object = {}) {
  await q(`INSERT INTO activity_logs (agent_id, agent_name, event_type, message, metadata) VALUES ($1, $2, $3, $4, $5)`, [
    agentId,
    agentName,
    eventType,
    message.slice(0, 500),
    JSON.stringify(metadata),
  ]);
}

async function deliver(item: QueueRow, inboundUrl: string) {
  // Claim the row so concurrent processors never deliver it twice.
  const claimed = await one(
    `UPDATE message_queue SET status = 'processing', attempts = attempts + 1, updated_at = now()
     WHERE id = $1 AND status = $2 RETURNING id`,
    [item.id, item.status],
  );
  if (!claimed) return;

  const agent = await one<AgentRow>(`SELECT * FROM agents WHERE id = $1`, [item.agent_id]);
  if (!agent) {
    await q(`UPDATE message_queue SET status = 'failed', last_error = 'agent missing', updated_at = now() WHERE id = $1`, [item.id]);
    return;
  }
  const cred = await one<{ webhook_secret: string | null; inbound_token: string }>(
    `SELECT webhook_secret, inbound_token FROM agent_credentials WHERE agent_id = $1`,
    [agent.id],
  );
  const conversationId = item.conversation_id ?? crypto.randomUUID();

  const outbound = await one<{ id: string }>(
    `INSERT INTO agent_messages (conversation_id, from_kind, from_agent_id, from_label, to_kind, to_agent_id, to_label, channel, content, parent_message_id)
     VALUES ($1, $2, $3, $4, 'agent', $5, $6, $7, $8, $9) RETURNING id`,
    [
      conversationId,
      item.from_agent_id ? "agent" : item.source === "voice" ? "voice" : "user",
      item.from_agent_id,
      item.from_agent_id ? null : item.source === "voice" ? "Voice" : "You",
      agent.id,
      agent.name,
      agent.webhook_url ? "webhook" : "system",
      item.payload,
      item.parent_message_id,
    ],
  );

  let reply = "";
  let delivered = false;
  try {
    if (!agent.webhook_url) throw new Error("agent has no webhook_url configured");
    const resp = await fetch(agent.webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(agent.provider, cred?.webhook_secret) },
      body: JSON.stringify({
        prompt: item.payload,
        agent_id: agent.id,
        agent_name: agent.name,
        conversation_id: conversationId,
        source: item.source,
        reply_url: inboundUrl,
        // This agent's own token for replying into the hub (it can only post as this agent).
        reply_token: cred?.inbound_token,
        reply_how: `To reply, POST {"content": "...", "conversation_id": "${conversationId}"} to reply_url with the header Authorization: Bearer <reply_token>.`,
      }),
      signal: AbortSignal.timeout(25_000),
    });
    const text = await resp.text();
    if (!resp.ok) throw new Error(`webhook ${resp.status}: ${text.slice(0, 200)}`);
    if (agent.provider === "letta" || isAck(resp.status, text)) delivered = true;
    else reply = replyText(text);
  } catch (e) {
    const message = (e as Error).message;
    await q(
      `UPDATE message_queue SET status = $2, scheduled_for = now() + interval '1 minute', last_error = $3, updated_at = now() WHERE id = $1`,
      [item.id, item.attempts >= 2 ? "failed" : "pending", message],
    );
    await log(agent.id, agent.name, "error", `Webhook failed: ${message.slice(0, 160)}`);
    return;
  }

  await q(`UPDATE message_queue SET status = 'sent', last_error = NULL, updated_at = now() WHERE id = $1`, [item.id]);
  await q(`UPDATE agents SET last_heartbeat = now(), status = 'active', tasks_completed = tasks_completed + $2 WHERE id = $1`, [
    agent.id,
    delivered ? 0 : 1,
  ]);

  if (delivered) {
    await log(agent.id, agent.name, "task_routed", `Delivered to ${agent.provider} webhook, waiting for the reply`, {
      conversation_id: conversationId,
    });
    return;
  }
  await q(
    `INSERT INTO agent_messages (conversation_id, from_kind, from_agent_id, from_label, to_kind, to_agent_id, to_label, channel, content, parent_message_id)
     VALUES ($1, 'agent', $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      conversationId,
      agent.id,
      agent.name,
      item.from_agent_id ? "agent" : "user",
      item.from_agent_id,
      item.from_agent_id ? null : "You",
      "webhook",
      reply,
      outbound?.id ?? null,
    ],
  );
  await log(agent.id, agent.name, "task_complete", "Replied via webhook", { conversation_id: conversationId });
}

/** Deliver up to `limit` due messages. Safe to call from many places at once. */
export async function processQueue(inboundUrl: string, limit = 10) {
  const due = await q<QueueRow>(
    `SELECT * FROM message_queue WHERE status IN ('pending', 'rate_limited') AND scheduled_for <= now()
     ORDER BY scheduled_for LIMIT $1`,
    [limit],
  );
  for (const item of due) await deliver(item, inboundUrl);
  return { processed: due.length };
}

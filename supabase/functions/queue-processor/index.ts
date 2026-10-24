// Drains pending messages from message_queue, respecting per-agent rate limits.
// Calls the agent's webhook (auth depends on agents.provider), captures the reply, mirrors
// both legs to agent_messages, and (if reply_channel = telegram) sends the reply back over
// Telegram. Async providers (Letta answers 202 {"ok":true}) are marked delivered; their
// reply arrives later through agent-inbound.
// Designed to be called frequently (every ~30s) by a cron OR triggered manually.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_PER_INVOCATION = 10;

function authHeaders(provider: string, secret: string | null | undefined): Record<string, string> {
  if (!secret) return {};
  switch (provider) {
    case "letta":
      return { Authorization: `Basic ${btoa(`webhook:${secret}`)}` };
    case "webhook":
      return { Authorization: `Bearer ${secret}` };
    default:
      return { "X-Hyperagent-Webhook-Secret": secret };
  }
}

// A bare acknowledgement is not a reply.
function isAck(status: number, text: string) {
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

async function callTelegram(token: string, method: string, body: unknown) {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function processOne(supabase: ReturnType<typeof createClient>, item: any) {
  // Claim
  const { data: claimed } = await supabase
    .from("message_queue")
    .update({ status: "processing", attempts: item.attempts + 1 })
    .eq("id", item.id).eq("status", item.status)
    .select().single();
  if (!claimed) return; // someone else got it

  const { data: agent } = await supabase.from("agents").select("*").eq("id", item.agent_id).single();
  const { data: cred } = await supabase
    .from("agent_credentials").select("*").eq("agent_id", item.agent_id).maybeSingle();

  if (!agent) {
    await supabase.from("message_queue").update({ status: "failed", last_error: "agent missing" }).eq("id", item.id);
    return;
  }

  const conversationId = item.conversation_id || crypto.randomUUID();

  // Mirror outbound user→agent message
  const { data: outboundMsg } = await supabase.from("agent_messages").insert({
    conversation_id: conversationId,
    from_kind: item.from_agent_id ? "agent" : (item.source === "telegram" ? "telegram" : item.source === "orchestrator" ? "orchestrator" : "user"),
    from_agent_id: item.from_agent_id || null,
    from_label: item.from_agent_id ? null : (item.source === "telegram" ? "Telegram" : item.source),
    to_kind: "agent",
    to_agent_id: item.agent_id,
    to_label: agent.name,
    channel: agent.webhook_url ? "webhook" : "system",
    content: item.payload,
    parent_message_id: item.parent_message_id || null,
  }).select("id").single();

  let replyText = "";
  let delivered = false; // accepted by an async provider; reply comes via agent-inbound
  let failure: string | null = null;

  try {
    if (!agent.webhook_url) {
      throw new Error("agent has no webhook_url configured");
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...authHeaders(agent.provider || "hyperagent", cred?.webhook_secret),
    };

    const resp = await fetch(agent.webhook_url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt: item.payload,
        agent_id: agent.id,
        agent_name: agent.name,
        conversation_id: conversationId,
        source: item.source,
        // Where the agent can POST its answer (needs its inbound token as a Bearer token).
        reply_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/agent-inbound`,
      }),
    });
    const text = await resp.text();
    if (!resp.ok) throw new Error(`webhook ${resp.status}: ${text.slice(0, 200)}`);
    if (agent.provider === "letta" || isAck(resp.status, text)) {
      delivered = true;
    } else {
      // Try to extract a reply field; fall back to raw body
      try {
        const j = JSON.parse(text);
        replyText = j.reply || j.message || j.text || j.content || j.output || text;
      } catch { replyText = text; }
    }
  } catch (e) {
    failure = (e as Error).message;
  }

  if (failure) {
    await supabase.from("message_queue").update({
      status: item.attempts >= 2 ? "failed" : "pending",
      scheduled_for: new Date(Date.now() + 60_000).toISOString(),
      last_error: failure,
    }).eq("id", item.id);
    await supabase.from("activity_logs").insert({
      agent_id: agent.id, agent_name: agent.name, event_type: "error",
      message: `Webhook failed: ${failure.slice(0, 160)}`,
    });
    return;
  }

  if (delivered) {
    await supabase.from("agents").update({ last_heartbeat: new Date().toISOString() }).eq("id", agent.id);
    await supabase.from("message_queue").update({ status: "sent", last_error: null }).eq("id", item.id);
    await supabase.from("activity_logs").insert({
      agent_id: agent.id, agent_name: agent.name, event_type: "task_routed",
      message: `Delivered to ${agent.provider} webhook — awaiting reply`,
      metadata: { conversation_id: conversationId },
    });
    return;
  }

  // Mirror reply
  await supabase.from("agent_messages").insert({
    conversation_id: conversationId,
    from_kind: "agent",
    from_agent_id: agent.id,
    from_label: agent.name,
    to_kind: item.from_agent_id ? "agent" : (item.reply_channel === "telegram" ? "telegram" : "user"),
    to_agent_id: item.from_agent_id || null,
    to_label: item.from_agent_id ? null : (item.reply_channel === "telegram" ? "Telegram" : "User"),
    channel: item.reply_channel === "telegram" ? "telegram" : "ui",
    content: replyText,
    parent_message_id: outboundMsg?.id || null,
  });

  // Reply on Telegram if requested
  if (item.reply_channel === "telegram" && item.reply_chat_id && cred?.telegram_bot_token) {
    await callTelegram(cred.telegram_bot_token, "sendMessage", {
      chat_id: item.reply_chat_id,
      text: replyText.slice(0, 4000),
    }).catch((e) => console.error("telegram send failed", e));
  }

  // Bump agent stats
  await supabase.from("agents").update({
    tasks_completed: (agent.tasks_completed || 0) + 1,
    last_heartbeat: new Date().toISOString(),
    status: "active",
  }).eq("id", agent.id);

  await supabase.from("message_queue").update({
    status: "sent", last_error: null,
  }).eq("id", item.id);

  await supabase.from("activity_logs").insert({
    agent_id: agent.id, agent_name: agent.name, event_type: "task_complete",
    message: `Replied via ${item.reply_channel === "telegram" ? "Telegram" : "webhook"}`,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const now = new Date().toISOString();
    const { data: items } = await supabase
      .from("message_queue")
      .select("*")
      .in("status", ["pending", "rate_limited"])
      .lte("scheduled_for", now)
      .order("scheduled_for", { ascending: true })
      .limit(MAX_PER_INVOCATION);

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    for (const item of items) {
      await processOne(supabase, item);
    }
    return new Response(JSON.stringify({ processed: items.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("queue-processor error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
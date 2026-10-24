// Inbound endpoint for agents to report back into the hub.
// An agent (Hyperagent, Letta, or anything that can POST JSON) authenticates with the
// inbound token issued by register-agent, either as `Authorization: Bearer <token>` or
// `X-JAW-Token: <token>`. The message is mirrored to agent_messages and activity_logs,
// so it shows up live in the hub.
//
// Body (all optional except some text):
//   { "content" | "message" | "text" | "reply" | "output": string,
//     "conversation_id": uuid, "event_type": string, "metadata": object }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-jaw-token, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_CONTENT = 20_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EVENT_RE = /^[a-z_]{1,40}$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function pickText(body: Record<string, unknown>): string {
  for (const key of ["content", "message", "text", "reply", "output"]) {
    const v = body[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const auth = req.headers.get("authorization") ?? "";
  const token = (auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : req.headers.get("x-jaw-token") ?? "").trim();
  if (!token) return json({ error: "missing token" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "body must be JSON" }, 400);
  }

  const content = pickText(body).slice(0, MAX_CONTENT);
  if (!content) return json({ error: "content required" }, 400);

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: cred } = await supabase
      .from("agent_credentials")
      .select("agent_id")
      .eq("inbound_token", token)
      .maybeSingle();
    if (!cred) return json({ error: "invalid token" }, 401);

    const { data: agent } = await supabase
      .from("agents")
      .select("id, name, tasks_completed")
      .eq("id", cred.agent_id)
      .single();
    if (!agent) return json({ error: "agent missing" }, 404);

    const conversationId =
      typeof body.conversation_id === "string" && UUID_RE.test(body.conversation_id)
        ? body.conversation_id
        : crypto.randomUUID();
    const eventType =
      typeof body.event_type === "string" && EVENT_RE.test(body.event_type) ? body.event_type : "agent_report";
    const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};

    const { data: msg, error: msgErr } = await supabase
      .from("agent_messages")
      .insert({
        conversation_id: conversationId,
        from_kind: "agent",
        from_agent_id: agent.id,
        from_label: agent.name,
        to_kind: "user",
        to_label: "Hub",
        channel: "webhook",
        content,
        metadata: { ...metadata, via: "agent-inbound" },
      })
      .select("id")
      .single();
    if (msgErr) throw msgErr;

    await supabase.from("activity_logs").insert({
      agent_id: agent.id,
      agent_name: agent.name,
      event_type: eventType,
      message: content.length > 160 ? `${content.slice(0, 157)}…` : content,
      metadata: { conversation_id: conversationId, message_id: msg.id },
    });

    await supabase
      .from("agents")
      .update({ last_heartbeat: new Date().toISOString(), status: "active" })
      .eq("id", agent.id);

    return json({ ok: true, conversation_id: conversationId, message_id: msg.id });
  } catch (e) {
    console.error("agent-inbound error", e);
    return json({ error: "internal error" }, 500);
  }
});

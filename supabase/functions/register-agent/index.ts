// Registers a new agent (or updates an existing one) and stores its credentials
// in the service-role-only agent_credentials table.
// New agents get an inbound token (returned once) for posting back via agent-inbound;
// pass rotate_inbound_token to issue a fresh one.
// Public-facing: gated by the same access pattern as the rest of the dashboard.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PROVIDERS = ["hyperagent", "letta", "webhook"] as const;
type Provider = (typeof PROVIDERS)[number];

function newInboundToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return "jaw_" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

interface Body {
  id?: string;
  name: string;
  provider?: Provider;
  rotate_inbound_token?: boolean;
  type?: string;
  description?: string;
  model?: string;
  system_instructions?: string;
  webhook_url?: string;
  webhook_secret?: string;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  daily_message_limit?: number;
  min_seconds_between_messages?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const body = (await req.json()) as Body;
    if (!body.name || typeof body.name !== "string") {
      return new Response(JSON.stringify({ error: "name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.provider !== undefined && !PROVIDERS.includes(body.provider)) {
      return new Response(JSON.stringify({ error: `provider must be one of ${PROVIDERS.join(", ")}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const webhookEnabled = !!(body.webhook_url && body.webhook_url.trim());
    const telegramEnabled = !!(body.telegram_bot_token && body.telegram_bot_token.trim());

    const agentRow: Record<string, unknown> = {
      name: body.name,
      type: body.type || "executor",
      provider: body.provider || "hyperagent",
      description: body.description ?? null,
      model: body.model ?? null,
      system_instructions: body.system_instructions ?? "",
      webhook_url: webhookEnabled ? body.webhook_url!.trim() : null,
      telegram_chat_id: body.telegram_chat_id?.trim() || null,
      webhook_enabled: webhookEnabled,
      telegram_enabled: telegramEnabled,
      is_user_added: true,
      status: "idle",
      daily_message_limit: body.daily_message_limit ?? 3,
      min_seconds_between_messages: body.min_seconds_between_messages ?? 60,
    };

    let agentId = body.id;
    const isNew = !agentId;
    if (agentId) {
      // Partial update: only touch fields the caller sent, so e.g. rotating the
      // inbound token does not wipe the webhook URL.
      const patch: Record<string, unknown> = { name: body.name };
      if (body.type !== undefined) patch.type = agentRow.type;
      if (body.provider !== undefined) patch.provider = agentRow.provider;
      if (body.description !== undefined) patch.description = agentRow.description;
      if (body.model !== undefined) patch.model = agentRow.model;
      if (body.system_instructions !== undefined) patch.system_instructions = agentRow.system_instructions;
      if (body.webhook_url !== undefined) {
        patch.webhook_url = agentRow.webhook_url;
        patch.webhook_enabled = webhookEnabled;
      }
      if (body.telegram_bot_token !== undefined) patch.telegram_enabled = telegramEnabled;
      if (body.telegram_chat_id !== undefined) patch.telegram_chat_id = agentRow.telegram_chat_id;
      if (body.daily_message_limit !== undefined) patch.daily_message_limit = agentRow.daily_message_limit;
      if (body.min_seconds_between_messages !== undefined) {
        patch.min_seconds_between_messages = agentRow.min_seconds_between_messages;
      }
      const { error } = await supabase.from("agents").update(patch).eq("id", agentId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("agents").insert(agentRow).select("id").single();
      if (error) throw error;
      agentId = data.id;
    }

    // Upsert credentials (only the fields the user provided)
    const credPatch: Record<string, unknown> = { agent_id: agentId };
    if (body.webhook_secret !== undefined) credPatch.webhook_secret = body.webhook_secret || null;
    if (body.telegram_bot_token !== undefined) credPatch.telegram_bot_token = body.telegram_bot_token || null;
    let inboundToken: string | null = null;
    if (isNew || body.rotate_inbound_token) {
      inboundToken = newInboundToken();
      credPatch.inbound_token = inboundToken;
    }

    if (Object.keys(credPatch).length > 1) {
      const { error: cErr } = await supabase
        .from("agent_credentials")
        .upsert(credPatch, { onConflict: "agent_id" });
      if (cErr) throw cErr;
    }

    // Initialize telegram poll state if enabled
    if (telegramEnabled) {
      await supabase.from("telegram_bot_state").upsert({ agent_id: agentId }, { onConflict: "agent_id" });
    }

    await supabase.from("activity_logs").insert({
      agent_id: agentId,
      agent_name: body.name,
      event_type: "agent_registered",
      message: isNew
        ? `Agent ${body.name} registered (${body.provider || "hyperagent"}, webhook:${webhookEnabled}, telegram:${telegramEnabled})`
        : `Agent ${body.name} updated`,
    });

    return new Response(JSON.stringify({ id: agentId, inbound_token: inboundToken }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("register-agent error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
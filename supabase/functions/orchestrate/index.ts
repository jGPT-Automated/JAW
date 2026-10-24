// Chief of Staff orchestration layer.
// Receives a directive, asks the Chief of Staff which specialist agent(s) to route to,
// invokes those specialists in parallel via Lovable AI Gateway, then synthesizes a final response.
// Every step is streamed back to the client as Server-Sent Events and persisted to activity_logs.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface Agent {
  id: string;
  name: string;
  type: string;
  model: string | null;
  system_instructions: string | null;
}

async function callModel(model: string, messages: any[], tools?: any[], tool_choice?: any) {
  const body: any = { model, messages };
  if (tools) body.tools = tools;
  if (tool_choice) body.tool_choice = tool_choice;

  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    if (resp.status === 429) throw new Error("RATE_LIMIT");
    if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
    throw new Error(`Gateway ${resp.status}: ${text}`);
  }
  return await resp.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    const { directive } = await req.json();
    if (!directive || typeof directive !== "string") {
      return new Response(JSON.stringify({ error: "directive required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: agents } = await supabase
      .from("agents")
      .select("id, name, type, model, system_instructions");

    if (!agents) throw new Error("No agents available");
    const fleet = agents as Agent[];
    const cos = fleet.find((a) => a.name === "Chief of Staff");
    const specialists = fleet.filter((a) => a.name !== "Chief of Staff");

    if (!cos) throw new Error("Chief of Staff not found");

    const log = async (agent: Agent, event_type: string, message: string) => {
      await supabase.from("activity_logs").insert({
        agent_id: agent.id,
        agent_name: agent.name,
        event_type,
        message,
      });
    };

    // Stream SSE back to client
    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        const send = (obj: any) =>
          controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));

        try {
          send({ type: "start", agent: "Chief of Staff" });
          await log(cos, "task_routed", `Directive received: "${directive.slice(0, 80)}"`);

          // Step 1: Chief of Staff routes via tool calling
          const routingTool = {
            type: "function",
            function: {
              name: "route_to_specialists",
              description: "Choose which specialist agents should handle this directive.",
              parameters: {
                type: "object",
                properties: {
                  assignments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        agent_name: {
                          type: "string",
                          enum: specialists.map((a) => a.name),
                        },
                        subtask: { type: "string", description: "Specific subtask for this agent." },
                      },
                      required: ["agent_name", "subtask"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["assignments"],
                additionalProperties: false,
              },
            },
          };

          const routerSysPrompt = `${cos.system_instructions}\n\nAvailable specialists:\n${specialists
            .map((a) => `- ${a.name} (${a.type}): ${a.system_instructions?.slice(0, 140)}`)
            .join("\n")}\n\nDecompose the directive and route to 1-3 specialists. Always include Ralph for memory context if any prior decisions might apply.`;

          const routing = await callModel(
            cos.model || "openai/gpt-5-mini",
            [
              { role: "system", content: routerSysPrompt },
              { role: "user", content: directive },
            ],
            [routingTool],
            { type: "function", function: { name: "route_to_specialists" } },
          );

          const toolCall = routing.choices?.[0]?.message?.tool_calls?.[0];
          const assignments: { agent_name: string; subtask: string }[] = toolCall
            ? JSON.parse(toolCall.function.arguments).assignments
            : [];

          send({ type: "routed", assignments });

          // Step 2: dispatch in parallel.
          // If the specialist has a real webhook (Hyperagent), enqueue via the rate-limited
          // queue and call its webhook directly here for an immediate reply. Otherwise fall
          // back to a direct AI call. Either way we mirror to agent_messages so the
          // topology drill-in shows the conversation.
          const conversationId = crypto.randomUUID();
          const results = await Promise.all(
            assignments.map(async (a) => {
              const agent = (await supabase.from("agents").select("*").eq("name", a.agent_name).maybeSingle()).data;
              if (!agent) return null;
              send({ type: "dispatch", agent: agent.name, subtask: a.subtask });
              await log(agent as Agent, "task_routed", a.subtask);

              // Mirror outbound message
              const { data: outMsg } = await supabase.from("agent_messages").insert({
                conversation_id: conversationId,
                from_kind: "orchestrator", from_agent_id: cos.id, from_label: "Chief of Staff",
                to_kind: "agent", to_agent_id: agent.id, to_label: agent.name,
                channel: agent.webhook_url ? "webhook" : "orchestrator",
                content: a.subtask,
              }).select("id").single();

              let content = "";
              try {
                if (agent.webhook_url) {
                  const { data: cred } = await supabase
                    .from("agent_credentials").select("webhook_secret").eq("agent_id", agent.id).maybeSingle();
                  const headers: Record<string, string> = { "Content-Type": "application/json" };
                  if (cred?.webhook_secret) {
                    if (agent.provider === "letta") headers.Authorization = `Basic ${btoa(`webhook:${cred.webhook_secret}`)}`;
                    else if (agent.provider === "webhook") headers.Authorization = `Bearer ${cred.webhook_secret}`;
                    else headers["X-Hyperagent-Webhook-Secret"] = cred.webhook_secret;
                  }
                  const r = await fetch(agent.webhook_url, {
                    method: "POST", headers,
                    body: JSON.stringify({
                      prompt: a.subtask, agent_id: agent.id, agent_name: agent.name,
                      conversation_id: conversationId, source: "orchestrator",
                      reply_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/agent-inbound`,
                    }),
                  });
                  const text = await r.text();
                  if (!r.ok) throw new Error(`webhook ${r.status}`);
                  if (agent.provider === "letta" || r.status === 202) {
                    content = "[delivered — reply will arrive via agent-inbound]";
                  } else try {
                    const j = JSON.parse(text);
                    content = j.reply || j.message || j.text || j.content || j.output || text;
                  } catch { content = text; }
                } else {
                  const out = await callModel(agent.model || "openai/gpt-5-mini", [
                    { role: "system", content: agent.system_instructions || "" },
                    { role: "user", content: a.subtask },
                  ]);
                  content = out.choices?.[0]?.message?.content || "";
                }
              } catch (err) {
                content = `[error: ${(err as Error).message}]`;
              }

              await supabase.from("agent_messages").insert({
                conversation_id: conversationId,
                from_kind: "agent", from_agent_id: agent.id, from_label: agent.name,
                to_kind: "orchestrator", to_agent_id: cos.id, to_label: "Chief of Staff",
                channel: agent.webhook_url ? "webhook" : "orchestrator",
                content, parent_message_id: outMsg?.id || null,
              });
              await log(agent as Agent, "task_complete", `Returned ${content.length} chars`);
              send({ type: "result", agent: agent.name, content });
              return { agent: agent.name, content };
            }),
          );

          // Step 3: Chief of Staff synthesizes
          send({ type: "synthesizing", agent: "Chief of Staff" });
          const synth = await callModel(cos.model || "openai/gpt-5-mini", [
            { role: "system", content: cos.system_instructions || "" },
            { role: "user", content: directive },
            {
              role: "user",
              content: `Specialist outputs:\n\n${results
                .filter(Boolean)
                .map((r: any) => `## ${r.agent}\n${r.content}`)
                .join("\n\n")}\n\nSynthesize into one decisive response for the principal.`,
            },
          ]);
          const final = synth.choices?.[0]?.message?.content || "";
          await log(cos, "task_complete", "Synthesis returned to principal");
          send({ type: "final", content: final });
          send({ type: "done" });
        } catch (err: any) {
          send({ type: "error", message: err?.message || "unknown" });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
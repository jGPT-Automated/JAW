// Dashboard API. Everything here requires the owner's Neon Auth session.
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";
import { AccessToken } from "livekit-server-sdk";
import { GoogleGenAI, Modality } from "@google/genai";
import { runVoiceTool, VOICE_TOOLS, voiceInstructions } from "../lib/voice-tools.js";
import { OWNER_KEY_MIN, setOwnerKey, type Env } from "../auth.js";
import { one, q } from "../db.js";
import { addLibrary, listComponents, listLibraries, syncLibrary } from "../lib/catalog-store.js";
import { saveMemory, searchMemories } from "../lib/memory.js";
import { addResource, listResources, storeUpload } from "../lib/resources.js";
import { enqueue, processQueue } from "../lib/queue.js";
import { inboundUrl } from "../lib/urls.js";

const PROVIDERS = ["hyperagent", "letta", "webhook", "internal"];
export const VOICE_AGENT_NAME = "jaw-voice";

function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return "jaw_" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function clampInt(v: unknown, min: number, max: number, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
}

export const owner = new Hono<Env>();

/** Change the owner sign-in key (stored as a scrypt hash). Every device signs in again with the new one. */
owner.put("/owner-key", async (c) => {
  const b = await c.req.json<{ key?: string }>();
  const key = b.key?.trim() ?? "";
  if (key.length < OWNER_KEY_MIN) throw new HTTPException(400, { message: `Use at least ${OWNER_KEY_MIN} characters` });
  await setOwnerKey(key);
  return c.json({ ok: true });
});


// Agents ----------------------------------------------------------------------
owner.get("/agents", async (c) => c.json(await q(`SELECT * FROM agents ORDER BY name`)));

owner.post("/agents", async (c) => {
  const b = await c.req.json<Record<string, unknown>>();
  const name = String(b.name ?? "").trim();
  if (!name) throw new HTTPException(400, { message: "Give the agent a name" });
  const provider = String(b.provider ?? "hyperagent");
  if (!PROVIDERS.includes(provider)) throw new HTTPException(400, { message: "Unknown platform" });
  const url = String(b.webhook_url ?? "").trim();
  if (url && !url.startsWith("https://")) throw new HTTPException(400, { message: "The webhook URL must start with https://" });

  const agent = await one<{ id: string }>(
    `INSERT INTO agents (name, type, provider, description, model, system_instructions, webhook_url, webhook_enabled,
       telegram_enabled, daily_message_limit, min_seconds_between_messages)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
    [
      name,
      String(b.type ?? "executor"),
      provider,
      b.description ? String(b.description) : null,
      b.model ? String(b.model) : null,
      String(b.system_instructions ?? ""),
      url || null,
      !!url,
      !!String(b.telegram_bot_token ?? "").trim(),
      clampInt(b.daily_message_limit, 1, 1000, 3),
      clampInt(b.min_seconds_between_messages, 0, 86400, 60),
    ],
  );
  const token = newToken();
  await q(
    `INSERT INTO agent_credentials (agent_id, webhook_secret, telegram_bot_token, inbound_token) VALUES ($1, $2, $3, $4)`,
    [agent!.id, b.webhook_secret ? String(b.webhook_secret) : null, b.telegram_bot_token ? String(b.telegram_bot_token) : null, token],
  );
  await q(`INSERT INTO activity_logs (agent_id, agent_name, event_type, message) VALUES ($1, $2, 'agent_registered', $3)`, [
    agent!.id,
    name,
    `${name} registered on ${provider}${url ? " with a webhook" : ""}`,
  ]);
  return c.json({ id: agent!.id, inbound_token: token }, 201);
});

owner.patch("/agents/:id", async (c) => {
  const b = await c.req.json<Record<string, unknown>>();
  const fields: string[] = [];
  const params: unknown[] = [];
  const set = (col: string, v: unknown) => {
    params.push(v);
    fields.push(`${col} = $${params.length}`);
  };
  if (b.system_instructions !== undefined) set("system_instructions", String(b.system_instructions));
  if (b.daily_message_limit !== undefined) set("daily_message_limit", clampInt(b.daily_message_limit, 1, 1000, 3));
  if (b.min_seconds_between_messages !== undefined) {
    set("min_seconds_between_messages", clampInt(b.min_seconds_between_messages, 0, 86400, 60));
  }
  if (b.description !== undefined) set("description", b.description ? String(b.description) : null);
  if (!fields.length) throw new HTTPException(400, { message: "Nothing to update" });
  params.push(c.req.param("id"));
  const row = await one(`UPDATE agents SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING id`, params);
  if (!row) throw new HTTPException(404, { message: "Agent not found" });
  return c.json(row);
});

owner.post("/agents/:id/token", async (c) => {
  const token = newToken();
  const row = await one(
    `INSERT INTO agent_credentials (agent_id, inbound_token) VALUES ($1, $2)
     ON CONFLICT (agent_id) DO UPDATE SET inbound_token = $2, updated_at = now() RETURNING agent_id`,
    [c.req.param("id"), token],
  );
  if (!row) throw new HTTPException(404, { message: "Agent not found" });
  return c.json({ inbound_token: token });
});

owner.delete("/agents/:id", async (c) => {
  const row = await one(`DELETE FROM agents WHERE id = $1 RETURNING id`, [c.req.param("id")]);
  if (!row) throw new HTTPException(404, { message: "Agent not found" });
  return c.json(row);
});

// Activity, messages, queue -----------------------------------------------------
owner.get("/activity", async (c) => {
  const limit = clampInt(c.req.query("limit"), 1, 500, 100);
  return c.json(await q(`SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1`, [limit]));
});

owner.get("/activity/days", async (c) => {
  const weeks = clampInt(c.req.query("weeks"), 1, 52, 12);
  const rows = await q<{ created_at: string }>(
    `SELECT created_at FROM activity_logs WHERE created_at >= now() - make_interval(weeks => $1) ORDER BY created_at DESC LIMIT 5000`,
    [weeks],
  );
  return c.json(rows.map((r) => r.created_at));
});

owner.get("/messages", async (c) => {
  const agentId = c.req.query("agent_id");
  const rows = agentId
    ? await q(`SELECT * FROM agent_messages WHERE from_agent_id = $1 OR to_agent_id = $1 ORDER BY created_at DESC LIMIT 300`, [agentId])
    : await q(`SELECT * FROM agent_messages ORDER BY created_at DESC LIMIT 300`);
  return c.json(rows.reverse());
});

owner.post("/messages", async (c) => {
  const b = await c.req.json<{ agent_id?: string; payload?: string; conversation_id?: string }>();
  if (!b.agent_id || !b.payload?.trim()) throw new HTTPException(400, { message: "agent_id and payload are required" });
  const queued = await enqueue({ agent_id: b.agent_id, payload: b.payload.trim(), conversation_id: b.conversation_id, source: "ui" });
  // Deliver right away when the agent's pacing allows; the scheduled sweep covers the rest.
  if (queued.status === "pending") await processQueue(inboundUrl(c.req.url), 5);
  // Report what actually happened: sent, still pending (pacing or a retry), or failed with the reason.
  const result = await one(`SELECT id, status, scheduled_for, last_error FROM message_queue WHERE id = $1`, [queued.id]);
  return c.json(result ?? queued, 201);
});

owner.get("/queue", async (c) => c.json(await q(`SELECT * FROM message_queue ORDER BY created_at DESC LIMIT 200`)));

owner.post("/queue/process", async (c) => c.json(await processQueue(inboundUrl(c.req.url))));

// Roadmap -----------------------------------------------------------------------
owner.get("/roadmap", async (c) => c.json(await q(`SELECT * FROM roadmap_tasks ORDER BY created_at`)));

owner.patch("/roadmap/:id", async (c) => {
  const b = await c.req.json<{ status?: string; progress?: number }>();
  if (!["planned", "in_progress", "completed"].includes(String(b.status))) {
    throw new HTTPException(400, { message: "Unknown status" });
  }
  const row = await one(
    `UPDATE roadmap_tasks SET status = $2, progress = COALESCE($3, progress), updated_at = now() WHERE id = $1 RETURNING id`,
    [c.req.param("id"), b.status, b.progress === undefined ? null : clampInt(b.progress, 0, 100, 0)],
  );
  if (!row) throw new HTTPException(404, { message: "Task not found" });
  return c.json(row);
});

// Memory ------------------------------------------------------------------------
owner.get("/memories", async (c) => c.json(await searchMemories(c.req.query("q"), clampInt(c.req.query("limit"), 1, 200, 50))));

owner.post("/memories", async (c) => {
  const b = await c.req.json<{ content?: string; kind?: string; tags?: string[]; pinned?: boolean }>();
  if (!b.content?.trim()) throw new HTTPException(400, { message: "Write something to remember" });
  return c.json(await saveMemory({ ...b, content: b.content, source: "ui" }), 201);
});

owner.delete("/memories/:id", async (c) => {
  const row = await one(`DELETE FROM memories WHERE id = $1 RETURNING id`, [c.req.param("id")]);
  if (!row) throw new HTTPException(404, { message: "Memory not found" });
  return c.json(row);
});

// Docs (context for agents) -----------------------------------------------------------
owner.get("/docs", async (c) => c.json(await q(`SELECT * FROM docs ORDER BY updated_at DESC`)));

owner.put("/docs/:slug", async (c) => {
  const b = await c.req.json<{ title?: string; body?: string; source_url?: string; public?: boolean; tags?: string[] }>();
  const slug = c.req.param("slug").toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug)) throw new HTTPException(400, { message: "Use lowercase letters, numbers and dashes" });
  if (!b.title?.trim()) throw new HTTPException(400, { message: "Give the doc a title" });
  const row = await one(
    `INSERT INTO docs (slug, title, body, source_url, public, tags) VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET title = $2, body = $3, source_url = $4, public = $5, tags = $6, updated_at = now()
     RETURNING *`,
    [slug, b.title.trim(), b.body ?? "", b.source_url ?? null, !!b.public, b.tags ?? []],
  );
  return c.json(row);
});

// Component catalog: libraries (shadcn registries) and their items by category -----------
owner.get("/component-libraries", async (c) => c.json(await listLibraries()));
owner.post("/component-libraries", async (c) => c.json(await addLibrary(await c.req.json(), "owner"), 201));
owner.post("/component-libraries/:slug/sync", async (c) => c.json(await syncLibrary(c.req.param("slug"))));
owner.delete("/component-libraries/:slug", async (c) => {
  await q(`DELETE FROM component_libraries WHERE slug = $1`, [c.req.param("slug")]);
  return c.json({ ok: true });
});
owner.get("/components", async (c) => c.json(await listComponents(c.req.query("category"), c.req.query("q"))));

// Resources: design references by link, upload or agent --------------------------------
owner.get("/resources", async (c) => c.json(await listResources(c.req.query("kind"))));
owner.post("/resources", async (c) => c.json(await addResource(await c.req.json(), "owner"), 201));
owner.post("/resources/upload", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new HTTPException(400, { message: "Attach an image as 'file'" });
  const image_url = await storeUpload(file);
  return c.json(
    await addResource(
      { image_url, title: String(form.get("title") || file.name.replace(/\.[^.]+$/, "")), collection: String(form.get("collection") || "") },
      "owner",
    ),
    201,
  );
});
owner.patch("/resources/:id", async (c) => {
  const b = await c.req.json<{ title?: string; collection?: string; notes?: string }>();
  const row = await one(
    `UPDATE resources SET title = coalesce($2, title), collection = coalesce($3, collection), notes = coalesce($4, notes)
     WHERE id = $1 RETURNING *`,
    [c.req.param("id"), b.title?.trim() || null, b.collection?.trim() || null, b.notes ?? null],
  );
  if (!row) throw new HTTPException(404, { message: "Not found" });
  return c.json(row);
});
owner.delete("/resources/:id", async (c) => {
  const row = await one<{ image_url: string | null }>(`DELETE FROM resources WHERE id = $1 RETURNING image_url`, [c.req.param("id")]);
  const file = row?.image_url?.match(/^\/api\/public\/files\/([0-9a-f-]{36})$/)?.[1];
  if (file) await q(`DELETE FROM resource_files WHERE id = $1`, [file]);
  return c.json({ ok: true });
});

// Conversations: voice calls, summary first, transcript from agent_messages -------------
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TOOL_CALL_COLUMNS = "call_id, conversation_id, name, args, output, status, started_at, ended_at";

/** The agent's most recent tool calls across conversations, newest first. */
owner.get("/tool-calls", async (c) => {
  const limit = Math.min(Number(c.req.query("limit")) || 30, 200);
  return c.json(await q(`SELECT ${TOOL_CALL_COLUMNS} FROM tool_calls ORDER BY started_at DESC LIMIT $1`, [limit]));
});

owner.get("/conversations", async (c) => {
  const rows = await q(
    `SELECT s.conversation_id AS id, s.title, s.summary, s.started_at, s.ended_at,
            jsonb_array_length(s.key_points) AS point_count,
            count(m.id)::int AS turns, max(m.created_at) AS last_message_at
     FROM voice_sessions s
     LEFT JOIN agent_messages m ON m.conversation_id = s.conversation_id
     GROUP BY s.id
     HAVING count(m.id) > 0 OR s.summary IS NOT NULL
     ORDER BY s.started_at DESC
     LIMIT 200`,
  );
  return c.json(rows);
});

owner.get("/conversations/:id", async (c) => {
  const id = c.req.param("id");
  if (!UUID_RE.test(id)) throw new HTTPException(400, { message: "Not a conversation id" });
  const session = await one(
    `SELECT conversation_id AS id, title, summary, key_points, decisions, action_items, started_at, ended_at
     FROM voice_sessions WHERE conversation_id = $1`,
    [id],
  );
  if (!session) throw new HTTPException(404, { message: "Conversation not found" });
  const [messages, tool_calls] = await Promise.all([
    q(
      `SELECT id, from_kind, from_label, content, created_at FROM agent_messages
       WHERE conversation_id = $1 ORDER BY created_at`,
      [id],
    ),
    q(`SELECT ${TOOL_CALL_COLUMNS} FROM tool_calls WHERE conversation_id = $1 ORDER BY started_at`, [id]),
  ]);
  return c.json({ ...session, messages, tool_calls });
});

// Voice with Gemini Live: the browser talks to Gemini directly with a short-lived token.
// Instructions and tools are locked into the token here, so the browser can't change them.
export const GEMINI_LIVE_MODEL = process.env.GEMINI_LIVE_MODEL || "gemini-3.8-live";
export const geminiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

owner.post("/voice/gemini-token", async (c) => {
  const apiKey = geminiKey();
  if (!apiKey) throw new HTTPException(503, { message: "Voice needs GEMINI_API_KEY in Vercel" });
  const session = await one<{ conversation_id: string }>(
    `INSERT INTO voice_sessions (room) VALUES ($1) RETURNING conversation_id`,
    [`gemini-${crypto.randomUUID()}`],
  );
  const ai = new GoogleGenAI({ apiKey });
  const token = await ai.authTokens.create({
    config: {
      uses: 1,
      expireTime: new Date(Date.now() + 30 * 60_000).toISOString(),
      newSessionExpireTime: new Date(Date.now() + 60_000).toISOString(),
      liveConnectConstraints: {
        model: GEMINI_LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: await voiceInstructions(),
          tools: [{ functionDeclarations: VOICE_TOOLS as never }],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: process.env.GEMINI_VOICE || "Kore" } } },
        },
      },
    },
  });
  if (!token.name) throw new HTTPException(502, { message: "Gemini didn't return a token" });
  return c.json({ token: token.name, model: GEMINI_LIVE_MODEL, conversation_id: session!.conversation_id });
});

owner.post("/voice/tool", async (c) => {
  const b = await c.req.json<{ call_id?: string; name?: string; args?: Record<string, unknown>; conversation_id?: string }>();
  if (!b.call_id || !b.name) throw new HTTPException(400, { message: "call_id and name are required" });
  const conversation = b.conversation_id && UUID_RE.test(b.conversation_id) ? b.conversation_id : null;
  return c.json(
    await runVoiceTool({ call_id: b.call_id.slice(0, 200), name: b.name, args: b.args ?? {}, conversation_id: conversation, inboundUrl: inboundUrl(c.req.url) }),
  );
});

/** One finished line of a voice call (yours or JAW's), so the call shows up in Conversations. */
owner.post("/voice/transcript", async (c) => {
  const b = await c.req.json<{ conversation_id?: string; role?: string; text?: string }>();
  if (!b.conversation_id || !UUID_RE.test(b.conversation_id) || !b.text?.trim()) {
    throw new HTTPException(400, { message: "conversation_id and text are required" });
  }
  const you = b.role === "user";
  await q(
    `INSERT INTO agent_messages (conversation_id, from_kind, from_label, to_kind, to_label, channel, content)
     VALUES ($1, $2, $3, $4, $5, 'voice', $6)`,
    [b.conversation_id, you ? "voice" : "agent", you ? "You" : "JAW", you ? "agent" : "user", you ? "JAW" : "You", b.text.trim().slice(0, 8000)],
  );
  await q(`UPDATE voice_sessions SET ended_at = now() WHERE conversation_id = $1`, [b.conversation_id]);
  return c.json({ ok: true });
});

// Voice: a LiveKit room with the JAW voice agent dispatched into it ---------------------
owner.post("/voice/token", async (c) => {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new HTTPException(503, { message: "Voice is not configured on the server" });
  }
  const session = await one<{ room: string; conversation_id: string }>(
    `INSERT INTO voice_sessions (room) VALUES ($1) RETURNING room, conversation_id`,
    [`jaw-${crypto.randomUUID()}`],
  );
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity: `owner-${c.get("ownerId")}`, name: "Owner", ttl: "15m" });
  at.addGrant({ room: session!.room, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: true });
  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: VOICE_AGENT_NAME, metadata: JSON.stringify({ conversation_id: session!.conversation_id }) })],
  });
  return c.json({ server_url: LIVEKIT_URL, token: await at.toJwt(), room: session!.room, conversation_id: session!.conversation_id });
});

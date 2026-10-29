import {
  type JobContext,
  ServerOptions,
  cli,
  defineAgent,
  inference,
  llm,
  log,
  voice,
} from '@livekit/agents';
import { EnhancerModel, audioEnhancement } from '@livekit/plugins-ai-coustics';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { type ToolReporter, createAgent } from './agent.ts';
import { AGENT_NAME, ConfigError, TOOL_TOPIC, loadConfig, parseConversationId } from './config.ts';
import { HubClient } from './hub.ts';

// Load a local env file for `dev`. In LiveKit Cloud, values arrive as injected secrets.
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ path: '.env', quiet: true });

// Fail fast, with every problem listed, before the worker registers with LiveKit.
let config: ReturnType<typeof loadConfig>;
try {
  config = loadConfig();
} catch (err) {
  console.error(err instanceof ConfigError ? err.message : err);
  process.exit(1);
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    const hub = new HubClient({
      baseUrl: config.jawApiUrl,
      token: config.jawAgentToken,
      conversationId: parseConversationId(ctx.job.metadata),
    });
    // The Talk screen passes its conversation in the dispatch metadata. A phone call comes in
    // through the SIP dispatch rule with none, so it opens its own conversation in the hub.
    if (!hub.conversationId) await hub.startConversation(ctx.job.room?.name ?? '', 'Phone call');
    const conversationId = hub.conversationId;
    const logger = log().child({ conversationId, room: ctx.room.name });
    if (!conversationId) {
      logger.warn('no hub conversation for this call; transcript mirroring is disabled');
    }

    // Recall recent memory in parallel with building the pipeline. Short timeout so a slow
    // hub delays the greeting by at most a few seconds; an empty list is the fallback.
    const memoryPromise = hub.fetchMemory(6, 4_000);
    const contextPromise = hub.fetchContext(4_000);

    const session = new voice.AgentSession({
      // unverified: docs show inference.TurnDetector in the starter paired with AssemblyAI STT;
      // pairing it with deepgram/nova-3 follows the generic STT contract but was not run here.
      stt: new inference.STT({
        model: config.models.stt,
        language: 'en',
      }),
      llm: new inference.LLM({ model: config.models.llm }),
      tts: new inference.TTS({
        model: config.models.tts,
        voice: config.models.ttsVoice,
        language: 'en',
      }),
      turnHandling: {
        // Audio turn detector; AgentSession supplies the bundled Silero VAD automatically.
        turnDetection: new inference.TurnDetector(),
        preemptiveGeneration: { enabled: true },
      },
    });

    // Mirror the final transcript to the hub. Fire-and-forget, but serialized through a
    // promise chain so lines reach the hub in order.
    let mirrorTail: Promise<void> = Promise.resolve();
    session.on(voice.AgentSessionEventTypes.ConversationItemAdded, (event) => {
      if (!conversationId) return;
      const item = event.item;
      if (!(item instanceof llm.ChatMessage)) return;
      if (item.role !== 'user' && item.role !== 'assistant') return;
      const text = item.textContent?.trim();
      if (!text) return;
      const role = item.role;
      mirrorTail = mirrorTail.then(async () => {
        const error = await hub.sendTranscript(role, text);
        if (error) logger.warn({ role, error }, 'transcript mirror failed');
      });
    });

    session.on(voice.AgentSessionEventTypes.Error, (event) => {
      logger.error({ error: event.error }, 'agent session error');
    });

    // Let queued transcript posts finish inside the shutdown drain.
    ctx.addShutdownCallback(async () => {
      await mirrorTail;
      await toolTail;
    });

    // Each tool call goes to the room (the Talk screen shows it live) and to the hub
    // (history). Both are fire-and-forget; hub posts are serialized so start precedes finish.
    let toolTail: Promise<void> = Promise.resolve();
    const reportTool: ToolReporter = (call) => {
      ctx.room.localParticipant
        ?.sendText(JSON.stringify({ ...call, at: new Date().toISOString() }), { topic: TOOL_TOPIC })
        .catch((error: unknown) => logger.warn({ error }, 'tool call broadcast failed'));
      toolTail = toolTail.then(async () => {
        const error = await hub.sendToolCall(call);
        if (error) logger.warn({ tool: call.name, error }, 'tool call report failed');
      });
    };

    const [memory, context] = await Promise.all([memoryPromise, contextPromise]);
    logger.info({ memoryItems: memory.length }, 'starting voice session');

    await session.start({
      agent: createAgent(hub, memory, reportTool, context),
      room: ctx.room,
      inputOptions: {
        // ai-coustics audio enhancement, as in the current LiveKit Node starter.
        noiseCancellation: audioEnhancement({ model: EnhancerModel.QuailVfS }),
      },
    });

    await ctx.connect();

    session.generateReply({
      instructions:
        'Greet Jesse in one short sentence. If the recent memory has something clearly relevant and open, mention it in a few words; otherwise just ask how you can help.',
    });
  },
});

// Run the agent server. agentName enables explicit dispatch: the hub dispatches "jaw-voice".
cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: AGENT_NAME,
  }),
);

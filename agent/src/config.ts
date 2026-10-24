import { z } from 'zod';

/**
 * Model identifiers served by LiveKit Inference. Verified against:
 *   STT  https://docs.livekit.io/agents/models/stt/deepgram.md   (deepgram/nova-3)
 *   LLM  https://docs.livekit.io/agents/models/llm/gemini.md     (google/gemini-3.8-flash)
 *   TTS  https://docs.livekit.io/agents/models/tts/cartesia.md   (cartesia/sonic-3 + suggested voice)
 * Each can be overridden by env var so a model can be swapped without a code change.
 */
export const DEFAULT_MODELS = {
  stt: 'deepgram/nova-3',
  llm: 'google/gemini-3.8-flash',
  tts: 'cartesia/sonic-3',
  // Cartesia "Jacqueline" (confident American female), from the TTS suggested-voices list.
  ttsVoice: '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc',
} as const;

export const AGENT_NAME = 'jaw-voice';

const nonEmpty = (name: string) =>
  z
    .string({ error: `${name} is required` })
    .trim()
    .min(1, `${name} is required`);

const envSchema = z.object({
  LIVEKIT_URL: nonEmpty('LIVEKIT_URL').refine((v) => /^(wss?|https?):\/\//.test(v), {
    message: 'LIVEKIT_URL must start with wss:// (or ws://, https://, http://)',
  }),
  LIVEKIT_API_KEY: nonEmpty('LIVEKIT_API_KEY'),
  LIVEKIT_API_SECRET: nonEmpty('LIVEKIT_API_SECRET'),
  JAW_API_URL: nonEmpty('JAW_API_URL').refine(
    (v) => {
      try {
        const u = new URL(v);
        return u.protocol === 'https:' || u.protocol === 'http:';
      } catch {
        return false;
      }
    },
    { message: 'JAW_API_URL must be an absolute http(s) URL, e.g. https://jaw.vercel.app' },
  ),
  JAW_AGENT_TOKEN: nonEmpty('JAW_AGENT_TOKEN'),
  JAW_STT_MODEL: z.string().trim().optional(),
  JAW_LLM_MODEL: z.string().trim().optional(),
  JAW_TTS_MODEL: z.string().trim().optional(),
  JAW_TTS_VOICE: z.string().trim().optional(),
});

export interface Config {
  jawApiUrl: string;
  jawAgentToken: string;
  models: { stt: string; llm: string; tts: string; ttsVoice: string };
}

export class ConfigError extends Error {
  readonly problems: string[];
  constructor(problems: string[]) {
    super(
      `Invalid JAW voice agent configuration:\n${problems.map((p) => `  - ${p}`).join('\n')}\n` +
        'See agent/.env.example for the required variables.',
    );
    this.name = 'ConfigError';
    this.problems = problems;
  }
}

/** Validate the environment once at startup. Throws ConfigError listing every problem. */
export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    throw new ConfigError(
      parsed.error.issues.map((i) => `${i.path.join('.') || 'env'}: ${i.message}`),
    );
  }
  const e = parsed.data;
  return {
    jawApiUrl: e.JAW_API_URL.replace(/\/+$/, ''),
    jawAgentToken: e.JAW_AGENT_TOKEN,
    models: {
      stt: e.JAW_STT_MODEL || DEFAULT_MODELS.stt,
      llm: e.JAW_LLM_MODEL || DEFAULT_MODELS.llm,
      tts: e.JAW_TTS_MODEL || DEFAULT_MODELS.tts,
      ttsVoice: e.JAW_TTS_VOICE || DEFAULT_MODELS.ttsVoice,
    },
  };
}

/** The dispatch metadata is JSON like {"conversation_id": "<uuid>"}. Tolerate anything else. */
export function parseConversationId(metadata: string | undefined): string | null {
  if (!metadata) return null;
  try {
    const parsed: unknown = JSON.parse(metadata);
    if (parsed && typeof parsed === 'object' && 'conversation_id' in parsed) {
      const id = (parsed as { conversation_id: unknown }).conversation_id;
      if (typeof id === 'string' && id.trim()) return id.trim();
    }
  } catch {
    // not JSON: treat as no conversation id
  }
  return null;
}

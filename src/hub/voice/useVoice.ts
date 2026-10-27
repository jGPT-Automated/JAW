import { useQuery } from "@tanstack/react-query";
import { useGeminiVoice } from "./useGeminiVoice";
import { useVoiceSession } from "./useVoiceSession";

/**
 * The voice the Talk screen uses: Gemini Live when GEMINI_API_KEY is set (no agent to deploy),
 * otherwise the LiveKit agent. Both hooks are idle until start(), so calling both is cheap.
 */
export function useVoice() {
  const status = useQuery({
    queryKey: ["status"],
    queryFn: async () => (await (await fetch("/api/status")).json()) as { voice?: { gemini: boolean; livekit: boolean } },
    staleTime: 60_000,
  });
  const gemini = useGeminiVoice();
  const livekit = useVoiceSession();
  const useGemini = status.data?.voice?.gemini ?? true;
  return { ...(useGemini ? gemini : livekit), provider: useGemini ? ("gemini" as const) : ("livekit" as const) };
}

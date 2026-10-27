import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGeminiVoice } from "./useGeminiVoice";
import { useVoiceSession } from "./useVoiceSession";

const AGENT_WAIT_MS = 12_000;
const SKIP_KEY = "jaw-livekit-unavailable-until";

const skipLiveKit = () => {
  try {
    return Number(localStorage.getItem(SKIP_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
};

/**
 * The voice the Talk screen uses. LiveKit (the deployed JAW agent) first; if the agent doesn't
 * join within a few seconds or LiveKit fails, Gemini Live takes over in the same tap, and LiveKit
 * is skipped for the next ten minutes. Both hooks stay idle until start().
 */
export function useVoice() {
  const status = useQuery({
    queryKey: ["status"],
    queryFn: async () => (await (await fetch("/api/status")).json()) as { voice?: { gemini: boolean; livekit: boolean } },
    staleTime: 60_000,
  });
  const gemini = useGeminiVoice();
  const livekit = useVoiceSession();
  const canLiveKit = status.data?.voice?.livekit ?? false;
  const canGemini = status.data?.voice?.gemini ?? false;
  const [active, setActive] = useState<"livekit" | "gemini">("gemini");
  const timer = useRef<number | null>(null);

  const fallBack = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    try {
      localStorage.setItem(SKIP_KEY, String(Date.now() + 10 * 60_000));
    } catch {
      // Private mode: just fall back this time.
    }
    livekit.stop();
    setActive("gemini");
    void gemini.start();
  }, [gemini, livekit]);

  // LiveKit failed, or connected but no agent showed up in time.
  useEffect(() => {
    if (active !== "livekit" || !canGemini) return;
    if (livekit.status === "error") fallBack();
    if (["listening", "thinking", "speaking", "initializing"].includes(livekit.status) && timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, [active, canGemini, livekit.status, fallBack]);

  const start = useCallback(async () => {
    if (canLiveKit && !skipLiveKit()) {
      setActive("livekit");
      if (canGemini) timer.current = window.setTimeout(fallBack, AGENT_WAIT_MS);
      await livekit.start();
    } else {
      setActive("gemini");
      await gemini.start();
    }
  }, [canLiveKit, canGemini, livekit, gemini, fallBack]);

  const voice = active === "livekit" ? livekit : gemini;
  return { ...voice, start, provider: active };
}

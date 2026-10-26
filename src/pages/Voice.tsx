import { Link } from "react-router-dom";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { History, Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceOrb } from "@/components/agents/voice-orb";
import { TextShimmer } from "@/components/motion/text-shimmer";
import { useVoiceSession, type VoiceStatus } from "@/hub/voice/useVoiceSession";

// Orb pigment from the brand palette: lime pulse, linen highlight, graphite shadow.
const ORB_COLORS = ["#4cc02b", "#edede8", "#141414"] as const;

const HINT: Record<VoiceStatus, string> = {
  idle: "Tap the mic to talk",
  connecting: "Connecting",
  waiting: "Waking JAW up",
  initializing: "Waking JAW up",
  listening: "Go ahead, I'm listening",
  thinking: "Thinking",
  speaking: "JAW is talking",
  ended: "Saved to Conversations",
  error: "Couldn't connect",
};

const BUSY: VoiceStatus[] = ["connecting", "waiting", "initializing", "thinking"];

/**
 * Same drive as beUI's voice-orb preview: a slow phrase envelope with syllable flutter.
 * Runs until the agent's audio arrives, then the analyser takes over.
 */
function useBreathing(scale: number) {
  const activity = useMotionValue(0);
  const reduced = useReducedMotion();
  useAnimationFrame((time) => {
    if (reduced) return activity.set(0);
    const t = time / 1000;
    const phrase = Math.max(0, Math.sin(t * 0.85));
    const syllable = Math.max(0, Math.sin(t * 9.3 + Math.sin(t * 2.1)));
    activity.set(phrase * (0.12 + syllable ** 2 * 0.72) * scale);
  });
  return activity;
}

export default function Voice() {
  const voice = useVoiceSession();
  const activity = useBreathing(voice.live ? 0.6 : 0.35);
  const caption = [...voice.captions].reverse().find((c) => c.text.trim());
  const hint = voice.error ?? HINT[voice.status];

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7.5rem)] w-full max-w-md flex-col items-center justify-between gap-8 pt-4 pb-2">
      <AnimatePresence mode="wait">
        <motion.p
          key={hint}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          role="status"
          className={`rounded-full border px-4 py-1.5 text-caption ${voice.error ? "border-destructive/40 text-destructive" : "text-muted-foreground"}`}
        >
          {BUSY.includes(voice.status) ? <TextShimmer as="span">{hint}</TextShimmer> : hint}
        </motion.p>
      </AnimatePresence>

      <div className="flex flex-col items-center gap-8">
        <VoiceOrb
          activity={activity}
          analyser={voice.analyser}
          colors={ORB_COLORS}
          aria-label={`Voice assistant: ${HINT[voice.status].toLowerCase()}`}
          className="aspect-square w-[min(74vw,340px)]"
        />
        <div className="flex min-h-[5.5rem] max-w-sm items-start justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={caption?.id ?? "greeting"}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={
                caption
                  ? `line-clamp-3 text-body ${caption.from === "user" ? "text-muted-foreground" : "text-foreground"}`
                  : "text-subheading font-medium"
              }
            >
              {caption?.text ?? "What's on your mind?"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button variant="secondary" size="icon" className="size-14 rounded-full" asChild>
          <Link to="/conversations" aria-label="Conversations">
            <History className="size-5" />
          </Link>
        </Button>
        {voice.live ? (
          <Button
            size="icon"
            className="size-20 rounded-full"
            onClick={voice.toggleMute}
            aria-pressed={voice.muted}
            aria-label={voice.muted ? "Unmute microphone" : "Mute microphone"}
          >
            {voice.muted ? <MicOff className="size-7" /> : <Mic className="size-7" />}
          </Button>
        ) : (
          <Button size="icon" className="size-20 rounded-full" onClick={voice.start} aria-label="Start talking">
            <Mic className="size-7" />
          </Button>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="size-14 rounded-full"
          onClick={voice.stop}
          disabled={!voice.live}
          aria-label="End conversation"
        >
          <X className="size-5" />
        </Button>
      </div>
    </div>
  );
}

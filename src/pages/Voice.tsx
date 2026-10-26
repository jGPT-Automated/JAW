import { useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { History, Mic, MicOff, X } from "lucide-react";
import { useTheme } from "next-themes";
import { type OrbState, ThinkingOrb } from "thinking-orbs";
import { VoiceBeam } from "voice-glow";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceOrb } from "@/components/agents/voice-orb";
import { HistoryPanel } from "@/hub/components/HistoryPanel";
import { MemoryPanel } from "@/hub/components/MemoryPanel";
import { ToolCallsPanel } from "@/hub/components/ToolCallsPanel";
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

// Thinking orbs beside the status while JAW is busy (libraries.dev: waits of two seconds or more).
const ORB_STATE: Partial<Record<VoiceStatus, OrbState>> = {
  connecting: "connecting",
  waiting: "connecting",
  initializing: "connecting",
  listening: "listening",
  thinking: "breathing",
};

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
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const activity = useBreathing(voice.live ? 0.6 : 0.35);
  const caption = [...voice.captions].reverse().find((c) => c.text.trim());
  const hint = voice.error ?? HINT[voice.status];
  const orbState = voice.error ? undefined : ORB_STATE[voice.status];
  const [panel, setPanel] = useState(false);

  const workspace = (tabs: ("tools" | "history" | "memory")[], className?: string) => (
    <Tabs defaultValue={tabs[0]} className={className}>
      <TabsList>
        {tabs.includes("tools") ? <TabsTrigger value="tools">Tool calls</TabsTrigger> : null}
        {tabs.includes("history") ? <TabsTrigger value="history">History</TabsTrigger> : null}
        {tabs.includes("memory") ? <TabsTrigger value="memory">Memory</TabsTrigger> : null}
      </TabsList>
      <TabsContent value="tools" className="mt-3">
        <ToolCallsPanel live={voice.toolCalls} active={voice.live} />
      </TabsContent>
      <TabsContent value="history" className="mt-3">
        <HistoryPanel />
      </TabsContent>
      <TabsContent value="memory" className="mt-3">
        <MemoryPanel />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="grid min-h-[calc(100dvh-7.5rem)] gap-6 lg:h-[calc(100dvh-7.5rem)] lg:min-h-0 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)_minmax(280px,360px)]">
      <aside className="hidden min-w-0 flex-col gap-3 overflow-y-auto lg:flex" aria-label="Conversation history">
        <h2 className="text-caption font-medium text-muted-foreground">History</h2>
        <HistoryPanel />
      </aside>

      <VoiceBeam
        type="mobile"
        level={voice.live ? voice.level : 0}
        colorVariant="forest"
        theme={theme}
        className="min-h-[calc(100dvh-7.5rem)] lg:h-full lg:min-h-0"
      >
        <section className="flex h-full min-h-[inherit] flex-col items-center justify-between gap-8 rounded-[28px] border bg-card px-4 pt-6 pb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={hint}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              role="status"
              className={`relative z-[5] flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-caption ${voice.error ? "border-destructive/40 text-destructive" : "text-muted-foreground"}`}
            >
              {orbState ? <ThinkingOrb state={orbState} size={20} theme={theme} aria-hidden /> : null}
              {hint}
            </motion.p>
          </AnimatePresence>

          <div className="relative z-[5] flex flex-col items-center gap-8">
            <VoiceOrb
              activity={activity}
              analyser={voice.analyser}
              colors={ORB_COLORS}
              aria-label={`Voice assistant: ${HINT[voice.status].toLowerCase()}`}
              className="aspect-square w-[min(66vw,300px)]"
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

          <div className="relative z-[5] flex items-center gap-6">
            <Button
              variant="secondary"
              size="icon"
              className="size-14 rounded-full lg:invisible"
              onClick={() => setPanel(true)}
              aria-label="Tool calls, history and memory"
            >
              <History className="size-5" />
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
        </section>
      </VoiceBeam>

      <aside className="hidden min-w-0 overflow-y-auto pr-1 lg:block" aria-label="Tool calls and memory">
        {workspace(["tools", "memory"])}
      </aside>

      <Sheet open={panel} onOpenChange={setPanel}>
        <SheetContent side="bottom" className="h-[82dvh] rounded-t-3xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Tool calls, history and memory</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8">{workspace(["tools", "history", "memory"])}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

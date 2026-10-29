import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { Mic, MicOff, Minimize2, PanelsTopLeft, PhoneOff, X } from "lucide-react";
import { useTheme } from "next-themes";
import { type OrbState, ThinkingOrb } from "thinking-orbs";
import { VoiceBeam } from "voice-glow";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentActivity } from "@/components/agents/agent-activity";
import { VoiceOrb } from "@/components/agents/voice-orb";
import { HistoryPanel } from "@/hub/components/HistoryPanel";
import { MemoryPanel } from "@/hub/components/MemoryPanel";
import { ToolCallsPanel, toolCallItem } from "@/hub/components/ToolCallsPanel";
import { type VoiceStatus } from "@/hub/voice/useVoiceSession";
import { useVoice } from "@/hub/voice/useVoice";
import { cn } from "@/lib/utils";

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

type View = "tools" | "history" | "memory";
// What the agent's show_canvas tool asks for.
const CANVAS_VIEW: Record<string, View | null> = { tool_calls: "tools", history: "history", memory: "memory", close: null };

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
  const voice = useVoice();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const activity = useBreathing(voice.live ? 0.6 : 0.35);
  const caption = [...voice.captions].reverse().find((c) => c.text.trim());
  const hint = voice.error ?? HINT[voice.status];
  const orbState = voice.error ? undefined : ORB_STATE[voice.status];
  const [view, setView] = useState<View | null>(null);
  const toolRunning = voice.toolCalls.some((c) => c.status === "running");

  // "Open the canvas" by voice: the agent's show_canvas call arrives with the other tool calls.
  const handled = useRef(new Set<string>());
  useEffect(() => {
    for (const call of voice.toolCalls) {
      if (call.name !== "show_canvas" || handled.current.has(call.call_id)) continue;
      handled.current.add(call.call_id);
      const next = CANVAS_VIEW[String(call.args.view)];
      if (next !== undefined) setView(next);
    }
  }, [voice.toolCalls]);

  const orb = (className: string) => (
    <motion.div layoutId="jaw-orb" transition={{ type: "spring", duration: 0.8, bounce: 0.12 }} className={className}>
      <VoiceOrb
        activity={activity}
        analyser={voice.analyser}
        colors={ORB_COLORS}
        aria-label={`Voice assistant: ${HINT[voice.status].toLowerCase()}`}
        className="size-full"
      />
    </motion.div>
  );

  const mic = (size: string, icon: string) =>
    voice.live ? (
      <Button
        size="icon"
        className={cn(size, "rounded-full")}
        onClick={voice.toggleMute}
        aria-pressed={voice.muted}
        aria-label={voice.muted ? "Unmute microphone" : "Mute microphone"}
      >
        {voice.muted ? <MicOff className={icon} /> : <Mic className={icon} />}
      </Button>
    ) : (
      <Button size="icon" className={cn(size, "rounded-full")} onClick={voice.start} aria-label="Start talking">
        <Mic className={icon} />
      </Button>
    );

  return (
    <LayoutGroup>
      <VoiceBeam
        type="mobile"
        level={voice.live ? voice.level : 0}
        colorVariant="forest"
        theme={theme}
        className={cn("mx-auto h-[calc(100dvh-7.5rem)] w-full transition-[max-width] duration-500", view ? "max-w-3xl" : "max-w-xl")}
      >
        <section className="flex h-full flex-col rounded-[28px] border bg-card">
          {view ? (
            <Tabs value={view} onValueChange={(v) => setView(v as View)} className="relative z-[5] flex min-h-0 flex-1 flex-col gap-0 p-4">
              <TabsList>
                <TabsTrigger value="tools">Tool calls</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
              </TabsList>
              <div className="-mx-1 mt-4 min-h-0 flex-1 overflow-y-auto px-1 pb-4">
                <TabsContent value="tools">
                  <ToolCallsPanel live={voice.toolCalls} active={voice.live} />
                </TabsContent>
                <TabsContent value="history">
                  <HistoryPanel limit={30} />
                </TabsContent>
                <TabsContent value="memory">
                  <MemoryPanel />
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="relative z-[5] flex flex-1 flex-col items-center justify-between gap-6 px-4 pt-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={hint}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  role="status"
                  className={cn(
                    "flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-caption",
                    voice.error ? "border-destructive/40 text-destructive" : "text-muted-foreground",
                  )}
                >
                  {orbState ? <ThinkingOrb state={orbState} size={20} theme={theme} aria-hidden /> : null}
                  {hint}
                </motion.p>
              </AnimatePresence>
              {orb("aspect-square w-[min(66vw,300px)]")}
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
              {/* What JAW is doing right now, without opening the canvas: the last few tool calls, live. */}
              {voice.toolCalls.length ? (
                <AgentActivity
                  items={voice.toolCalls.slice(-3).map(toolCallItem)}
                  status={toolRunning ? "working" : "complete"}
                  defaultOpen
                  collapseOnComplete={false}
                  activeLabel="Running a tool…"
                  summary={`${voice.toolCalls.length} ${voice.toolCalls.length === 1 ? "step" : "steps"} this conversation`}
                  maxHeight={132}
                  className="w-full max-w-sm"
                />
              ) : null}
            </div>
          )}

          {view ? (
            // The voice dock: the orb settles here while the canvas is open; the glow rises from this edge.
            <div className="relative z-[5] flex items-center gap-3 border-t px-4 pt-3 pb-5">
              {orb("size-11 shrink-0")}
              <div className="min-w-0 flex-1" role="status">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {orbState ? <ThinkingOrb state={orbState} size={20} theme={theme} aria-hidden /> : null}
                  {hint}
                </p>
                {caption ? <p className="truncate text-sm">{caption.text}</p> : null}
              </div>
              {mic("size-11", "size-5")}
              {voice.live ? (
                <Button variant="secondary" size="icon" className="size-11 rounded-full" onClick={voice.stop} aria-label="End conversation">
                  <PhoneOff className="size-5" />
                </Button>
              ) : null}
              <Button variant="ghost" size="icon" className="size-11 rounded-full" onClick={() => setView(null)} aria-label="Close canvas">
                <Minimize2 className="size-5" />
              </Button>
            </div>
          ) : (
            <div className="relative z-[5] flex items-center justify-center gap-6 px-4 pt-4 pb-8">
              <Button
                variant="secondary"
                size="icon"
                className="size-14 rounded-full"
                onClick={() => setView("tools")}
                aria-label="Open canvas: tool calls, history and memory"
              >
                <PanelsTopLeft className="size-5" />
              </Button>
              {mic("size-20", "size-7")}
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
          )}
        </section>
      </VoiceBeam>
    </LayoutGroup>
  );
}

import { Link } from "react-router-dom";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Message, MessageBubble, MessageBubbleContent, MessageContent, MessageScroller } from "@/components/agents/message";
import { VoiceOrb } from "@/components/agents/voice-orb";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/motion/animated-badge";
import { TextShimmer } from "@/components/motion/text-shimmer";
import { useVoiceSession, type VoiceStatus } from "@/hub/voice/useVoiceSession";

// Orb pigment from the brand palette: lime pulse, linen highlight, graphite shadow.
const ORB_COLORS = ["#4cc02b", "#edede8", "#141414"] as const;

const STATUS: Record<VoiceStatus, { label: string; badge: AnimatedBadgeStatus }> = {
  idle: { label: "Ready", badge: "neutral" },
  connecting: { label: "Connecting", badge: "loading" },
  waiting: { label: "Waking JAW up", badge: "loading" },
  initializing: { label: "Waking JAW up", badge: "loading" },
  listening: { label: "Listening", badge: "success" },
  thinking: { label: "Thinking", badge: "info" },
  speaking: { label: "Speaking", badge: "info" },
  ended: { label: "Call ended", badge: "neutral" },
  error: { label: "Couldn't connect", badge: "danger" },
};

export default function Voice() {
  const voice = useVoiceSession();
  const status = STATUS[voice.status];
  const finalCaptions = voice.captions.filter((c) => c.text.trim());

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-xl flex-col items-center gap-6">
      <AnimatedBadge status={status.badge} pulse={voice.status === "listening"} contentKey={voice.status}>
        {status.label}
      </AnimatedBadge>

      <VoiceOrb
        analyser={voice.analyser}
        active={voice.live}
        colors={ORB_COLORS}
        aria-label={`Voice assistant, ${status.label.toLowerCase()}`}
        className="aspect-square w-[min(72vw,320px)]"
      />

      {!voice.live ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-subheading font-semibold">Talk to JAW</h2>
          <p className="max-w-sm text-caption text-muted-foreground">
            It remembers what you tell it, recalls it next time, and can hand work to your other agents.
          </p>
        </div>
      ) : voice.status === "thinking" ? (
        <TextShimmer className="text-caption">Working on it</TextShimmer>
      ) : null}

      {voice.error ? (
        <Alert variant="destructive" className="max-w-sm">
          <AlertTitle>Couldn&apos;t start the call</AlertTitle>
          <AlertDescription>{voice.error}</AlertDescription>
        </Alert>
      ) : null}

      {finalCaptions.length ? (
        <MessageScroller label="Live transcript" className="max-h-[30dvh] w-full" contentClassName="gap-2 px-1 py-2">
          {finalCaptions.map((c) => (
            <Message key={c.id} from={c.from === "user" ? "user" : "assistant"}>
              <MessageContent className="max-w-[85%]">
                <MessageBubble variant={c.from === "user" ? "solid" : "soft"} className={c.final ? undefined : "opacity-70"}>
                  <MessageBubbleContent>
                    <p>{c.text}</p>
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          ))}
        </MessageScroller>
      ) : null}

      <div className="sticky bottom-4 mt-auto flex items-center gap-3 rounded-full border bg-card/90 p-2 backdrop-blur">
        {voice.live ? (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={voice.toggleMute}
              aria-pressed={voice.muted}
              aria-label={voice.muted ? "Unmute microphone" : "Mute microphone"}
            >
              {voice.muted ? <MicOff data-icon="inline-start" /> : <Mic data-icon="inline-start" />}
              {voice.muted ? "Unmute" : "Mute"}
            </Button>
            <Button variant="destructive" size="lg" onClick={voice.stop}>
              <PhoneOff data-icon="inline-start" />
              End
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" onClick={voice.start}>
              <Mic data-icon="inline-start" />
              {voice.status === "ended" ? "Talk again" : "Start talking"}
            </Button>
            {voice.status === "ended" && voice.conversationId ? (
              <Button variant="ghost" size="lg" asChild>
                <Link to={`/inbox?c=${voice.conversationId}`}>See transcript</Link>
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

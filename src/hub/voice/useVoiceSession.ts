import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Participant,
  type RemoteTrack,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { useVoiceToken } from "@/hub/data/queries";

/** Agent lifecycle published as the `lk.agent.state` participant attribute. */
type AgentState = "initializing" | "idle" | "listening" | "thinking" | "speaking";

export type VoiceStatus = "idle" | "connecting" | "waiting" | AgentState | "ended" | "error";

/** A tool the agent ran, as broadcast on the room's tool-call topic. */
export interface LiveToolCall {
  call_id: string;
  name: string;
  args: Record<string, unknown>;
  status: "running" | "done" | "error";
  output?: string;
  at: string;
}

// Must match agent/src/config.ts TOOL_TOPIC.
const TOOL_TOPIC = "jaw.tool-calls";

/** Loudness of an analyser's current frame, scaled to roughly 0–1 for speech. */
function rms(node: AnalyserNode | null, buf: { current: Float32Array<ArrayBuffer> | null }) {
  if (!node) return 0;
  if (buf.current?.length !== node.fftSize) buf.current = new Float32Array(node.fftSize);
  node.getFloatTimeDomainData(buf.current);
  let sum = 0;
  for (const v of buf.current) sum += v * v;
  return Math.min(1, Math.sqrt(sum / buf.current.length) * 8);
}

export interface Caption {
  id: string;
  from: "user" | "agent";
  text: string;
  final: boolean;
}

/**
 * One voice conversation with the JAW agent: mints a token, joins the LiveKit room,
 * publishes the mic, plays the agent, exposes an analyser for the orb and live captions.
 */
export function useVoiceSession() {
  const token = useVoiceToken();
  const roomRef = useRef<Room | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [muted, setMuted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [toolCalls, setToolCalls] = useState<LiveToolCall[]>([]);
  const micAnalyser = useRef<AnalyserNode | null>(null);
  const agentAnalyser = useRef<AnalyserNode | null>(null);
  const micBuf = useRef<Float32Array<ArrayBuffer> | null>(null);
  const agentBuf = useRef<Float32Array<ArrayBuffer> | null>(null);

  /** Per-frame level for the voice glow: whichever side is speaking. */
  const level = useCallback(() => Math.max(rms(micAnalyser.current, micBuf), rms(agentAnalyser.current, agentBuf)), []);

  const teardown = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    void audioCtx.current?.close();
    audioCtx.current = null;
    setAnalyser(null);
    micAnalyser.current = null;
    agentAnalyser.current = null;
    document.querySelectorAll("audio[data-jaw-voice]").forEach((el) => el.remove());
  }, []);

  useEffect(() => teardown, [teardown]);

  const start = useCallback(async () => {
    setError(null);
    setCaptions([]);
    setToolCalls([]);
    setStatus("connecting");
    try {
      const { server_url, token: jwt, conversation_id } = await token.mutateAsync();
      setConversationId(conversation_id);
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;
      // Created inside the click, so mobile browsers allow audio playback.
      audioCtx.current = new AudioContext();

      const isAgent = (p: Participant) => p.isAgent;

      room.on(RoomEvent.ParticipantAttributesChanged, (_changed, participant) => {
        if (!isAgent(participant)) return;
        const state = participant.attributes["lk.agent.state"] as AgentState | undefined;
        if (state) setStatus(state);
      });
      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub, participant) => {
        if (track.kind !== Track.Kind.Audio || !isAgent(participant)) return;
        const el = track.attach();
        el.setAttribute("data-jaw-voice", "");
        document.body.appendChild(el);
        const ctx = audioCtx.current;
        if (ctx) {
          const node = ctx.createAnalyser();
          node.fftSize = 256;
          ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack])).connect(node);
          agentAnalyser.current = node;
          setAnalyser(node);
        }
      });
      room.on(RoomEvent.Disconnected, () => setStatus((s: VoiceStatus) => (s === "error" ? s : "ended")));

      room.registerTextStreamHandler("lk.transcription", async (reader, participantInfo) => {
        const attrs = reader.info.attributes ?? {};
        const id = attrs["lk.segment_id"] ?? reader.info.id;
        const final = attrs["lk.transcription_final"] === "true";
        const from: Caption["from"] = participantInfo.identity === room.localParticipant.identity ? "user" : "agent";
        let text = "";
        try {
          for await (const chunk of reader) {
            text += chunk;
            const snapshot = text;
            setCaptions((list) => {
              const rest = list.filter((c) => c.id !== id);
              return [...rest, { id, from, text: snapshot, final }].slice(-30);
            });
          }
        } catch {
          // A stream can end early when the agent is interrupted; keep what arrived.
        }
      });

      room.registerTextStreamHandler(TOOL_TOPIC, async (reader) => {
        try {
          const call = JSON.parse(await reader.readAll()) as LiveToolCall;
          if (!call.call_id || !call.name) return;
          setToolCalls((list) => {
            const i = list.findIndex((c) => c.call_id === call.call_id);
            return i < 0 ? [...list, call] : list.map((c, j) => (j === i ? { ...c, ...call } : c));
          });
        } catch {
          // Ignore malformed events; the hub keeps the record.
        }
      });

      await room.connect(server_url, jwt);
      const mic = await room.localParticipant.setMicrophoneEnabled(true);
      const micTrack = mic?.track?.mediaStreamTrack;
      if (micTrack && audioCtx.current) {
        const node = audioCtx.current.createAnalyser();
        node.fftSize = 1024;
        audioCtx.current.createMediaStreamSource(new MediaStream([micTrack])).connect(node);
        micAnalyser.current = node;
      }
      setMuted(false);
      setStatus(room.remoteParticipants.size ? "listening" : "waiting");
    } catch (e) {
      teardown();
      setStatus("error");
      const message = (e as Error).message ?? "";
      setError(
        /permission|notallowed/i.test(message)
          ? "Microphone access was blocked. Allow it in the browser settings and try again."
          : message || "Couldn't start the conversation.",
      );
    }
  }, [teardown, token]);

  const stop = useCallback(() => {
    teardown();
    setStatus("ended");
  }, [teardown]);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(muted);
    setMuted(!muted);
  }, [muted]);

  const live = !["idle", "ended", "error"].includes(status);
  return { status, error, analyser, captions, toolCalls, level, muted, live, conversationId, start, stop, toggleMute };
}

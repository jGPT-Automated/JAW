import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleGenAI, type LiveServerMessage, Modality, type Session } from "@google/genai";
import { api } from "@/hub/lib/api";
import type { Caption, LiveToolCall, VoiceStatus } from "./useVoiceSession";

/**
 * Voice with Gemini Live, straight from the browser: the server mints a short-lived token (with
 * JAW's instructions and tools locked in), the mic streams 16 kHz PCM up, 24 kHz PCM plays back.
 * Tools run on the server through /api/voice/tool. Same shape as useVoiceSession.
 */

// Collects mic samples into ~100 ms blocks of 16-bit PCM.
const WORKLET = `
class Pcm16 extends AudioWorkletProcessor {
  constructor() { super(); this.buf = new Int16Array(1600); this.n = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) for (let i = 0; i < ch.length; i++) {
      const s = Math.max(-1, Math.min(1, ch[i]));
      this.buf[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.n === this.buf.length) { this.port.postMessage(this.buf.slice(0)); this.n = 0; }
    }
    return true;
  }
}
registerProcessor("pcm16", Pcm16);`;

function toBase64(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function fromBase64Pcm(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const pcm = new Int16Array(bytes.buffer, 0, Math.floor(bytes.length / 2));
  const out = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) out[i] = pcm[i] / 0x8000;
  return out;
}

function rms(node: AnalyserNode | null, buf: { current: Float32Array<ArrayBuffer> | null }) {
  if (!node) return 0;
  if (buf.current?.length !== node.fftSize) buf.current = new Float32Array(node.fftSize);
  node.getFloatTimeDomainData(buf.current);
  let sum = 0;
  for (const v of buf.current) sum += v * v;
  return Math.min(1, Math.sqrt(sum / buf.current.length) * 8);
}

export function useGeminiVoice() {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [toolCalls, setToolCalls] = useState<LiveToolCall[]>([]);
  const [muted, setMuted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const session = useRef<Session | null>(null);
  const mic = useRef<{ ctx: AudioContext; stream: MediaStream; analyser: AnalyserNode } | null>(null);
  const out = useRef<{ ctx: AudioContext; analyser: AnalyserNode; next: number; sources: Set<AudioBufferSourceNode> } | null>(null);
  const mutedRef = useRef(false);
  const convRef = useRef<string | null>(null);
  const turn = useRef<{ user: string; agent: string; n: number }>({ user: "", agent: "", n: 0 });
  const micBuf = useRef<Float32Array<ArrayBuffer> | null>(null);
  const outBuf = useRef<Float32Array<ArrayBuffer> | null>(null);

  const level = useCallback(() => Math.max(rms(mic.current?.analyser ?? null, micBuf), rms(out.current?.analyser ?? null, outBuf)), []);

  const teardown = useCallback(() => {
    session.current?.close();
    session.current = null;
    mic.current?.stream.getTracks().forEach((t) => t.stop());
    void mic.current?.ctx.close();
    mic.current = null;
    void out.current?.ctx.close();
    out.current = null;
    setAnalyser(null);
  }, []);

  useEffect(() => teardown, [teardown]);

  const caption = useCallback((from: Caption["from"], text: string, final: boolean) => {
    const id = `${from}-${turn.current.n}`;
    setCaptions((list) => [...list.filter((c) => c.id !== id), { id, from, text, final }].slice(-30));
  }, []);

  const saveLine = (role: "user" | "assistant", text: string) => {
    const id = convRef.current;
    if (!id || !text.trim()) return;
    void api("/voice/transcript", { method: "POST", json: { conversation_id: id, role, text } }).catch(() => {});
  };

  const stopPlayback = () => {
    const o = out.current;
    if (!o) return;
    o.sources.forEach((s) => s.stop());
    o.sources.clear();
    o.next = o.ctx.currentTime;
  };

  const play = (b64: string) => {
    const o = out.current;
    if (!o) return;
    const samples = fromBase64Pcm(b64);
    const buffer = o.ctx.createBuffer(1, samples.length, 24000);
    buffer.copyToChannel(samples, 0);
    const src = o.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(o.analyser);
    o.next = Math.max(o.next, o.ctx.currentTime + 0.03);
    src.start(o.next);
    o.next += buffer.duration;
    o.sources.add(src);
    setStatus("speaking");
    src.onended = () => {
      o.sources.delete(src);
      if (!o.sources.size) setStatus((s) => (s === "speaking" ? "listening" : s));
    };
  };

  const runTools = async (calls: { id?: string; name?: string; args?: Record<string, unknown> }[]) => {
    setStatus("thinking");
    const responses = await Promise.all(
      calls.map(async (fc) => {
        const call: LiveToolCall = {
          call_id: fc.id || `${fc.name}-${Date.now()}`,
          name: fc.name ?? "unknown",
          args: fc.args ?? {},
          status: "running",
          at: new Date().toISOString(),
        };
        setToolCalls((list) => [...list, call]);
        const r = await api<{ status: "done" | "error"; output: string }>("/voice/tool", {
          method: "POST",
          json: { call_id: call.call_id, name: call.name, args: call.args, conversation_id: convRef.current },
        }).catch((e: Error) => ({ status: "error" as const, output: e.message }));
        setToolCalls((list) => list.map((c) => (c.call_id === call.call_id ? { ...c, status: r.status, output: r.output } : c)));
        return { id: fc.id, name: fc.name, response: { result: r.output } };
      }),
    );
    session.current?.sendToolResponse({ functionResponses: responses });
  };

  const onMessage = (m: LiveServerMessage) => {
    const sc = m.serverContent;
    if (sc?.interrupted) stopPlayback();
    for (const part of sc?.modelTurn?.parts ?? []) if (part.inlineData?.data) play(part.inlineData.data);
    if (sc?.inputTranscription?.text) {
      turn.current.user += sc.inputTranscription.text;
      caption("user", turn.current.user, false);
    }
    if (sc?.outputTranscription?.text) {
      turn.current.agent += sc.outputTranscription.text;
      caption("agent", turn.current.agent, false);
    }
    if (sc?.turnComplete) {
      const { user, agent } = turn.current;
      if (user) caption("user", user, true);
      if (agent) caption("agent", agent, true);
      saveLine("user", user);
      saveLine("assistant", agent);
      turn.current = { user: "", agent: "", n: turn.current.n + 1 };
    }
    if (m.toolCall?.functionCalls?.length) void runTools(m.toolCall.functionCalls);
  };

  const start = useCallback(async () => {
    setError(null);
    setCaptions([]);
    setToolCalls([]);
    setStatus("connecting");
    try {
      // Audio contexts are created inside the click so mobile browsers allow sound.
      const micCtx = new AudioContext({ sampleRate: 16000 });
      const outCtx = new AudioContext({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const { token, model, conversation_id } = await api<{ token: string; model: string; conversation_id: string }>(
        "/voice/gemini-token",
        { method: "POST" },
      );
      convRef.current = conversation_id;
      setConversationId(conversation_id);

      const outAnalyser = outCtx.createAnalyser();
      outAnalyser.fftSize = 1024;
      outAnalyser.connect(outCtx.destination);
      out.current = { ctx: outCtx, analyser: outAnalyser, next: 0, sources: new Set() };
      setAnalyser(outAnalyser);

      const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: "v1beta" } });
      session.current = await ai.live.connect({
        model,
        config: { responseModalities: [Modality.AUDIO] },
        callbacks: {
          onopen: () => setStatus("listening"),
          onmessage: onMessage,
          onerror: (e) => {
            setError(e.message || "The voice connection failed.");
            setStatus("error");
          },
          onclose: () => setStatus((s) => (s === "error" ? s : "ended")),
        },
      });

      await micCtx.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET], { type: "text/javascript" })));
      const source = micCtx.createMediaStreamSource(stream);
      const micAnalyser = micCtx.createAnalyser();
      micAnalyser.fftSize = 1024;
      const worklet = new AudioWorkletNode(micCtx, "pcm16");
      worklet.port.onmessage = (e: MessageEvent<Int16Array>) => {
        if (mutedRef.current || !session.current) return;
        session.current.sendRealtimeInput({
          audio: { data: toBase64(new Uint8Array(e.data.buffer)), mimeType: "audio/pcm;rate=16000" },
        });
      };
      source.connect(micAnalyser);
      source.connect(worklet);
      mic.current = { ctx: micCtx, stream, analyser: micAnalyser };
      setMuted(false);
      mutedRef.current = false;
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
    // onMessage only reads refs and stable setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teardown]);

  const stop = useCallback(() => {
    const { user, agent } = turn.current;
    saveLine("user", user);
    saveLine("assistant", agent);
    turn.current = { user: "", agent: "", n: turn.current.n + 1 };
    teardown();
    setStatus("ended");
     
  }, [teardown]);

  const toggleMute = useCallback(async () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
  }, []);

  const live = !["idle", "ended", "error"].includes(status);
  return { status, error, analyser, captions, toolCalls, level, muted, live, conversationId, start, stop, toggleMute };
}

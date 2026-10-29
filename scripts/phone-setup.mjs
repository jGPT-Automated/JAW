// Point phone calls at the JAW voice agent: one LiveKit inbound trunk (only your phone may call)
// and one dispatch rule that starts the "jaw-voice" agent in a fresh room per call.
//
//   node scripts/phone-setup.mjs --line +15551234567 --allow +15557654321
//
//   --line   the number people dial (your Photon iMessage line, or a LiveKit phone number)
//   --allow  the caller(s) allowed through, comma-separated. Everyone else is rejected.
//
// Needs LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET in the environment. Safe to re-run:
// it reuses what it already made. Photon then sends calls to your project's SIP URI
// (LiveKit Cloud → Settings → Project → SIP URI).
import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";
import { SipClient } from "livekit-server-sdk";

const TRUNK = "JAW phone";
const RULE = "JAW phone → jaw-voice";
const AGENT = "jaw-voice";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const e164 = (v) => /^\+[1-9]\d{6,14}$/.test(v);

const line = arg("line")?.trim();
const allow = (arg("allow") ?? "").split(",").map((n) => n.trim()).filter(Boolean);
const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

const problems = [
  !line || !e164(line) ? "--line must be a phone number like +15551234567" : null,
  !allow.length || !allow.every(e164) ? "--allow must be one or more numbers like +15557654321" : null,
  !LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET ? "LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set" : null,
].filter(Boolean);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

// The server SDK talks HTTPS; the stored URL is often wss:// and sometimes upper case.
const host = LIVEKIT_URL.trim().toLowerCase().replace(/^wss:/, "https:").replace(/^ws:/, "http:");
const sip = new SipClient(host, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

let trunk = (await sip.listSipInboundTrunk()).find((t) => t.name === TRUNK);
if (trunk) {
  console.log(`Trunk "${TRUNK}" already exists (${trunk.sipTrunkId}); numbers ${trunk.numbers.join(", ")}.`);
} else {
  trunk = await sip.createSipInboundTrunk(TRUNK, [line], { allowedNumbers: allow, krispEnabled: true });
  console.log(`Created trunk "${TRUNK}" (${trunk.sipTrunkId}) for ${line}, allowing ${allow.join(", ")}.`);
}

const rule = (await sip.listSipDispatchRule()).find((r) => r.name === RULE);
if (rule) {
  console.log(`Dispatch rule "${RULE}" already exists (${rule.sipDispatchRuleId}).`);
} else {
  const created = await sip.createSipDispatchRule(
    { type: "individual", roomPrefix: "call-" },
    {
      name: RULE,
      trunkIds: [trunk.sipTrunkId],
      roomConfig: new RoomConfiguration({ agents: [new RoomAgentDispatch({ agentName: AGENT })] }),
    },
  );
  console.log(`Created dispatch rule "${RULE}" (${created.sipDispatchRuleId}).`);
}

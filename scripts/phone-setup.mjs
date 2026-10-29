// Point phone calls at the JAW voice agent, following Photon's LiveKit guide
// (https://photon.codes/docs/beta/cookbooks/voice/livekit.md): one inbound trunk that only Photon
// can reach (SIP username + password) and only your phone may call through, and one dispatch rule
// that starts the "jaw-voice" agent in a fresh room per call.
//
//   node scripts/phone-setup.mjs --line +15551234567 --allow +15557654321 --secret-file ./sip.txt
//
//   --line         the number people dial (your Photon number, or a LiveKit phone number)
//   --allow        the caller(s) allowed through, comma-separated. Everyone else is rejected.
//   --secret-file  where to write the SIP username and password to paste into Photon
//                  (Voice → Default profile → Inbound calls). Never printed.
//
// Needs LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET in the environment. Safe to re-run:
// it reuses what it already made. In Photon, the SIP address is your project's SIP URI
// (LiveKit Cloud → Telephony → SIP trunks), with TLS.
import { writeFileSync } from "node:fs";
import { RoomAgentDispatch, RoomConfiguration, SIPMediaEncryption } from "@livekit/protocol";
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
const secretFile = arg("secret-file");
const allow = (arg("allow") ?? "").split(",").map((n) => n.trim()).filter(Boolean);
const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

const problems = [
  !line || !e164(line) ? "--line must be a phone number like +15551234567" : null,
  !allow.length || !allow.every(e164) ? "--allow must be one or more numbers like +15557654321" : null,
  !secretFile ? "--secret-file is required (the SIP password for Photon is written there)" : null,
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
  const authUsername = "photon-jaw";
  const authPassword = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString("base64url");
  trunk = await sip.createSipInboundTrunk(TRUNK, [line], {
    allowedNumbers: allow,
    authUsername,
    authPassword,
    mediaEncryption: SIPMediaEncryption.SIP_MEDIA_ENCRYPT_ALLOW,
    krispEnabled: true,
  });
  writeFileSync(secretFile, `SIP username: ${authUsername}\nSIP password: ${authPassword}\n`, { mode: 0o600 });
  console.log(`Created trunk "${TRUNK}" (${trunk.sipTrunkId}) for ${line}, allowing ${allow.join(", ")}.`);
  console.log(`SIP username and password for Photon written to ${secretFile}.`);
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

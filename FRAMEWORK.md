# The JAW core: voice, memory, conversations

The repeatable part of JAW, without the custom pages. Copy this repo, set the keys below, and you
get: talk on the web (and by phone), every conversation saved with its transcript and tool calls,
memory the voice and other agents share, and delegation to other agents.

## Keys

### Required (Vercel → Project → Settings → Environment Variables)

| Key | What it is | Where it comes from |
| --- | --- | --- |
| `DATABASE_URL` | The Neon database | Neon console → Connect, or `neon claim create --env-pull` (below) |
| `GEMINI_API_KEY` | Web voice (Gemini Live) | aistudio.google.com → API keys |

That's a working core. The site password is set on the first visit and kept in the database; no key.

`NEON_KEY` works instead of `DATABASE_URL` (the server looks the connection string up), but it
also needs `NEON_PROJECT_ID`, so `DATABASE_URL` is simpler.

### For the better voice and phone calls (LiveKit)

Same three keys in **both** places: Vercel environment variables and GitHub → Settings →
Secrets and variables → Actions.

| Key | Where it comes from |
| --- | --- |
| `LIVEKIT_URL` | LiveKit Cloud → Settings → Keys (starts with `wss://`) |
| `LIVEKIT_API_KEY` | same page |
| `LIVEKIT_API_SECRET` | same page |

Plus one GitHub secret:

| Key | Where it comes from |
| --- | --- |
| `JAW_AGENT_TOKEN` | Run `DATABASE_URL=... node scripts/voice-agent-token.mjs` and paste what it prints |

If the app isn't at `https://jaw-three.vercel.app`, add a GitHub repository **variable**
`JAW_API_URL` with its address.

### Optional

| Key | For |
| --- | --- |
| `FIRECRAWL_KEY` | GitHub pages when GitHub's API refuses |
| `GEMINI_LIVE_MODEL`, `GEMINI_VOICE` | Swap the web voice model or voice |

Everything else in the Vercel list (Inngest, Supabase, Deepgram, AWS, Photon) isn't used by the
core. Photon calls need no key in Vercel; see Phone calls.

## Setup order

1. Database: `neon claim create --env-pull` (or copy `DATABASE_URL` from Neon), then
   `npm run db:migrate`.
2. Vercel: import the repo, add `DATABASE_URL` and `GEMINI_API_KEY`, deploy. Open the site and set
   the password. The orb works now (Gemini).
3. LiveKit (optional): add the three LiveKit keys to Vercel and GitHub, add `JAW_AGENT_TOKEN`,
   then GitHub → Actions → "Voice agent" → Run workflow → `create`. Merge the PR it opens. From then
   on, merging changes to `agent/` redeploys the agent. The orb tries LiveKit first and falls back
   to Gemini if no agent answers in 12 seconds.
4. Phone (optional): see below.

## Claimable Neon

`neon claim create --env-pull` makes a real Neon database with no account or key and writes
`DATABASE_URL` to `.env`. It expires unless claimed: `neon claim accept` moves it into your Neon
account. That's the fastest start for a new copy, and it removes `NEON_KEY` from the list.
Source: https://neon.com/docs/reference/claimable-neon

## Phone calls

A call reaches the same LiveKit agent as the orb, with the same memory and tools, and is saved in
Conversations as "Phone call".

1. LiveKit: `node scripts/phone-setup.mjs --line <number people dial> --allow <your cell>`
   (with the three LiveKit keys in the environment). It makes a trunk that only lets your cell
   through and a rule that starts the `jaw-voice` agent for each call.
2. Photon (iMessage line): Spectrum dashboard → the line → Inbound route →
   `sips:<your LiveKit SIP URI>` (LiveKit Cloud → Settings → Project → SIP URI).
   Source: https://photon.codes/docs/spectrum-ts/providers/voice
3. Or skip Photon: buy a number in LiveKit Cloud → Telephony → Phone numbers and pass it as
   `--line`. Source: https://docs.livekit.io/telephony/start/phone-numbers/

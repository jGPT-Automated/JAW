# JAW Hub

**One place to run your agents.** Talk to JAW by voice, keep shared memory, track and message every connected agent, and give any agent with fetch the context and skills it needs.

The dashboard is mobile-friendly and gated behind sign-in. A small read-only surface (`/api/public/*`) stays open so agents outside the dashboard can read public docs and the skills directory.

---

## What's in the hub

| Route | What it does |
|---|---|
| `/` **Overview** | Agents online, deliveries today, queue backlog, tasks in progress, 24-hour delivery health, 12-week activity, latest events |
| `/voice` **Talk** | Voice conversation with JAW (beUI voice orb + LiveKit). JAW recalls memory at the start of each call, saves what you tell it, and can delegate to your other agents. The transcript lands in the Inbox |
| `/agents` | Register Hyperagent, Letta or any HTTPS webhook agent; each agent's stats, transcript, settings and inbound token |
| `/inbox` | Every conversation across voice, the hub, webhooks and agent-to-agent delegation |
| `/activity` | Event stream and the delivery queue |
| `/memory` | Shared memory: search, add, forget. Same store the voice agent and other agents use |
| `/roadmap` | Tasks by stage |
| `/integrations` | Setup per platform, the outbound payload, the inbound endpoint |
| `/skills` | Skills directory for agents (also served as `/api/public/llms.txt`) |
| `/protocol`, `/manifesto` | Reference writing |

`⌘K` / `Ctrl K` opens the command palette anywhere.

---

## Architecture

```
Browser (Vite + React, shadcn/ui + beUI)
   │  Neon Auth session → Bearer JWT
   ▼
/api  (one Vercel Function: api/index.ts → server/app.ts, Hono)
   ├─ owner routes      agents, messages, queue, memory, docs, roadmap, voice token
   ├─ /api/agent/*      agents with an inbound token: inbound replies, memory, delegate, transcript
   └─ /api/public/*     read-only: public docs, skills, llms.txt
   │
   ▼
Neon Postgres (project NeonJess, branch production)  ← shared state for every agent
   agents · agent_credentials · agent_messages · message_queue · activity_logs
   memories (full-text + trigram) · work_tasks · work_units · handoffs · docs · skills · voice_sessions

LiveKit Cloud
   /api/voice/token creates a room and dispatches the `jaw-voice` agent (agent/)
   agent/ uses LiveKit Inference for STT, LLM and TTS and calls /api/agent/* for memory and delegation
```

| Piece | Where |
|---|---|
| Database schema | `db/migrations/*.sql`, applied by `npm run db:migrate` |
| API | `server/` (Hono), entry `api/index.ts`; served by Vite in dev |
| Delivery queue | `server/lib/queue.ts`: daily cap + minimum gap per agent, provider-aware auth, async (202) replies via `/api/agent/inbound` |
| Memory | `server/lib/memory.ts`: Postgres full-text with typo-tolerant trigram fallback |
| Auth | Neon Auth (managed Better Auth): `src/hub/lib/auth.ts` in the browser, JWKS verification in `server/auth.ts` |
| Voice | `src/pages/Voice.tsx` + `src/hub/voice/useVoiceSession.ts` (browser), `agent/` (LiveKit Agents worker) |

### Agent platforms

| Provider | The hub sends the secret as |
|---|---|
| `hyperagent` | `X-Hyperagent-Webhook-Secret: <secret>` |
| `letta` | `Authorization: Basic base64("webhook:<security key>")` (omit for a public Letta webhook) |
| `webhook` | `Authorization: Bearer <secret>` |
| `internal` | Built in (JAW itself) |

Each registered agent gets an **inbound token** (shown once, rotatable). With it the agent can:

```bash
curl -X POST https://<host>/api/agent/inbound -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"content": "Done: shipped the release notes", "event_type": "task_complete"}'
curl "https://<host>/api/agent/memory?q=release%20day" -H "Authorization: Bearer <token>"
curl -X POST https://<host>/api/agent/delegate -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"to": "Mya", "task": "Draft the launch post"}'
```

---

## Environment

Server-side only (Vercel → Project → Settings → Environment Variables). Never prefix these with `VITE_`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon pooled connection string (NeonJess, production branch) |
| `NEON_AUTH_JWKS_URL` | Neon Auth JWKS, to verify sign-in tokens |
| `JAW_OWNER_EMAILS` | Comma-separated emails allowed into the dashboard |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Voice rooms and agent dispatch |
| `JAW_PUBLIC_URL` | Optional: canonical origin for the inbound URL sent to agents |

Browser (public by design): `VITE_NEON_AUTH_URL`, the Neon Auth base URL.

Local development: put the same values in `.env.local` (git-ignored). `JAW_AUTH_DISABLED=1` skips sign-in **locally only**; the server refuses every owner request when auth isn't configured.

---

## Running locally

```bash
npm install
npm run db:migrate   # applies db/migrations to DATABASE_URL
npm run dev          # http://localhost:8080 (UI + /api)
npm test
npm run lint
npm run build
```

Node 22+. Behind an HTTP proxy, run with `NODE_USE_ENV_PROXY=1` so server-side fetch uses it.

The voice worker lives in `agent/` with its own README (local dev and `lk agent create` deploy).

---

## UI rule: shadcn/ui + beUI only

| Library | Where | Used for |
|---|---|---|
| [shadcn/ui](https://ui.shadcn.com) | `src/components/ui` | Shell, cards, forms, dialogs, sheets, tables, menus, badges, empty states, toasts |
| [beUI](https://beui.dev) | `src/components/{motion,agents,charts}`, helpers in `src/lib` | Voice orb, animated tabs and badges, ⌘K palette, chat transcript and prompt input, charts |

```bash
npx shadcn@latest add <component>
npx shadcn@latest add @beui/<component>   # registry configured in components.json
```

Brand tokens (linen canvas, graphite ink, lime pulse, Switzer, pill buttons, 12px cards) live in `src/index.css`.

## Skills

Agent skills used to build this repo are installed in `.claude/skills` and pinned in `skills-lock.json` (design, shadcn, Neon, Neon Auth, LiveKit, Inngest, Better Auth, handoff). `npm run skills:seed` syncs them into the hub's skills directory so every agent can find them.

```bash
npx skills add <owner/repo> -s <skill>   # find more at https://skills.sh
```

---

## Next

1. **Inngest durable loop**: break a task into small units, do one, verify it, write a handoff note, sleep, resume from the handoff on the next wake-up (`work_tasks`, `work_units`, `handoffs` are already in the schema).
2. Embeddings for memory through Neon's AI Gateway (semantic recall on top of full-text).
3. Photon: a phone number for voice, plus Telegram / WhatsApp / SMS / email channels.

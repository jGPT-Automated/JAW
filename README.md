# JAW Hub

**One place to run your agents.** Talk to JAW by voice, keep shared memory, track and message every connected agent, and give any agent with fetch the context and skills it needs.

The dashboard is mobile-friendly and gated behind sign-in. A small read-only surface (`/api/public/*`) stays open so agents outside the dashboard can read public docs and the skills directory.

---

## What's in the hub

| Route | What it does |
|---|---|
| `/` **Talk** | Voice conversation with JAW (beUI voice orb in a libraries.dev voice glow, LiveKit). Beside it: every tool JAW runs, live; past conversations; and memory (search, add, forget) |
| `/conversations` | Every call, read summary first: main points, decisions, follow-ups, then the full transcript (Kokonut synced transcript) |
| `/roadmap` | LocalCheck's locked requests on a cult-ui kanban board, from `public/localcheck/data/decisions.json` |
| `/github/:account` | Per account (GenJess, AgenticJess-Star, jGPT-Automated, Generative-Jesse): profile, contribution terrain, open pull requests with per-file review, recent activity, projects |
| `/resources` | **Components**: every item from each component library, by category, with docs and install command; add a library by its registry URL. **Designs**: references added by link, upload, paste or agent. **Skills**: plain text agents fetch |
| `/protocol`, `/manifesto` | Reference writing |

Agents can fetch without signing in: `/skills/index.json`, `/skills/<name>.md`, `/api/public/resources?kind=design`, `/api/public/components?category=&q=`, `/api/public/component-libraries`.

With their inbound token, agents can also report tool calls (`POST /api/agent/tool-calls`), add a design (`POST /api/agent/resources {url, collection?, notes?}`), add a component library (`POST /api/agent/component-libraries {name, registry_url, namespace?}`) and read your pull request reviews (`GET /api/agent/reviews?repo=`).

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
| `GITHUB_TOKEN` | Optional: raises GitHub's rate limit for the account pages (public data only; no scopes needed) |
| `FIRECRAWL_API_KEY` | Optional: when GitHub refuses a request (rate limit, block, outage), the same public URL is fetched through Firecrawl |

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

## UI rule: allowlisted libraries only

Every screen is composed from [shadcn/ui](https://ui.shadcn.com), [beUI](https://beui.dev), [cult-ui](https://www.cult-ui.com) and [Kokonut UI](https://kokonutui.com), used the way their demos use them. `DESIGN.md` records which component each screen uses.

```bash
npx shadcn@latest add <component>
npx shadcn@latest add @beui/<item>      # also @cult-ui/<item>, @kokonutui/<item> (registries in components.json)
```

Brand tokens (linen, graphite, lime pulse, Switzer) live in `src/index.css`. Dark is the default.

## Skills

Agent skills used to build this repo are installed in `.claude/skills` and pinned in `skills-lock.json` (design, shadcn, Neon, Neon Auth, LiveKit, Inngest, Better Auth, handoff). `npm run resources` (also run before every build) publishes them to `public/skills` as plain markdown plus `index.json`.

```bash
npx skills add <owner/repo> -s <skill>   # find more at https://skills.sh
```

---

## Next

1. **Inngest durable loop**: break a task into small units, do one, verify it, write a handoff note, sleep, resume from the handoff on the next wake-up (`work_tasks`, `work_units`, `handoffs` are already in the schema).
2. Embeddings for memory through Neon's AI Gateway (semantic recall on top of full-text).
3. Photon: a phone number for voice, plus Telegram / WhatsApp / SMS / email channels.

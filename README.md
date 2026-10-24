# JAW Hub

**One place to run your agents**: who is online, what they were asked, what they said back, and what is still in flight.

JAW Hub is the command center for an agent fleet. It registers agents that live on other platforms (Hyperagent, Letta, any HTTPS webhook, Telegram bots), delivers messages to them through a rate-limited queue, takes their replies and events back through an inbound endpoint, and shows all of it live.

---

## UI rule: shadcn/ui + beUI only

Every screen is composed from two libraries and nothing else:

| Library | Where it lives | Used for |
|---|---|---|
| [shadcn/ui](https://ui.shadcn.com) (new-york, Tailwind v4) | `src/components/ui` | Sidebar shell, cards, dialogs, sheets, fields, tables, menus, badges, empty states, toasts |
| [beUI](https://beui.dev) | `src/components/motion`, `src/components/agents`, `src/components/charts` + helpers in `src/lib` | Animated tabs, ⌘K command palette, animated badges and numbers, chat transcript and prompt input, status bar and heat calendar charts, text and scroll reveals, timeline |

Both are copied-in source, installed the way their CLIs install them. To add more:

```bash
npx shadcn@latest add dialog            # shadcn/ui
npx shadcn@latest add @beui/dock        # beUI (registry configured in components.json)
```

App code in `src/hub` and `src/pages` only composes these primitives; there are no hand-rolled widgets, inline styles or other UI kits.

---

## What's in the hub

| Route | What it does |
|---|---|
| `/` **Overview** | Agents online, deliveries today, queue backlog, tasks in progress; 24-hour delivery health; 12-week activity heat map; fleet and latest events |
| `/agents` | Fleet grid with filters and search. Register agents (Hyperagent / Letta / custom webhook, optional Telegram). Each agent opens a sheet with stats, its full transcript and a message box, and settings (instructions, rate limits, inbound token, delete) |
| `/inbox` | Every conversation across the hub, Telegram, the orchestrator and inbound webhooks, with a composer that can address any agent |
| `/activity` | Live event stream with agent and event filters, plus the delivery queue (status, errors, due times) and a "process now" button |
| `/roadmap` | Tasks by stage; move them between stages |
| `/integrations` | Setup guides per platform, the outbound payload, and the inbound endpoint with a copyable example |
| `/protocol` | Omni-Protocol Sentinel v2.0 doctrine |
| `/manifesto` | The Sovereign Architecture: thesis, stack, frameworks, work, profile |
| `/localcheck/…` | LocalCheck working files (static, served from `public/localcheck`) |

`⌘K` / `Ctrl K` opens the command palette anywhere: jump to a page or agent, register an agent, drain the queue, switch theme. Data updates live through one Supabase Realtime channel. Dark theme by default, light theme available.

---

## Connecting agents

### Hub → agent

Messages are written to `message_queue` by `enqueue-message`, which enforces each agent's **daily cap** and **minimum gap**. `queue-processor` (pg_cron, every minute, or "Process queue now") POSTs:

```json
{ "prompt": "…", "agent_id": "…", "agent_name": "…", "conversation_id": "…", "source": "ui", "reply_url": "https://<project>.supabase.co/functions/v1/agent-inbound" }
```

Authentication depends on the agent's platform (`agents.provider`):

| Provider | Sent as |
|---|---|
| `hyperagent` | `X-Hyperagent-Webhook-Secret: <secret>` |
| `letta` | `Authorization: Basic base64("webhook:<security key>")` (omit the key for a public Letta webhook) |
| `webhook` | `Authorization: Bearer <secret>` |

A synchronous answer (`{"reply": "…"}`, or `message` / `text` / `content` / `output`) is mirrored straight into the transcript. A bare acknowledgement (HTTP `202`, `{"ok": true}`; Letta always) is marked delivered and the reply is expected through the inbound endpoint.

### Agent → hub

Each agent gets an **inbound token** when it is registered (shown once; rotate it from the agent's settings). The agent posts back to `agent-inbound`:

```bash
curl -X POST https://<project>.supabase.co/functions/v1/agent-inbound \
  -H "Authorization: Bearer <inbound token>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Done: shipped the release notes", "event_type": "task_complete", "conversation_id": "<optional>"}'
```

The message lands in `agent_messages`, the event in `activity_logs`, and the agent's heartbeat is refreshed.

### Telegram

Add a bot token when registering an agent. `telegram-poll` (pg_cron, every minute) routes DMs to the agent; synchronous replies go back to the chat.

Credentials (webhook secrets, bot tokens, inbound tokens) live in `agent_credentials`, readable only with the service role. They never come back to the browser.

---

## Stack

- **Frontend**: React 19, TypeScript (strict), Vite, Tailwind CSS v4, shadcn/ui, beUI (Motion), TanStack Query, React Router
- **Backend**: Supabase (Postgres, Realtime, Edge Functions on Deno, pg_cron)

| Edge function | Purpose |
|---|---|
| `register-agent` | Create or update an agent, store credentials, issue or rotate its inbound token |
| `enqueue-message` | Rate-limit-aware enqueue |
| `queue-processor` | Drain the queue, call webhooks with provider auth, mirror replies |
| `agent-inbound` | Agents post replies and events back (token auth, no project JWT) |
| `telegram-poll` | Pull Telegram DMs per agent bot |
| `orchestrate` | Chief-of-Staff routing and synthesis (SSE) |

Tables: `agents`, `agent_credentials`, `agent_messages`, `message_queue`, `telegram_bot_state`, `activity_logs`, `roadmap_tasks`.

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:8080
npm test           # vitest
npm run lint
npm run build
```

Requires Node 20+. Supabase connection settings come from `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).

```
src/
├── App.tsx                 # providers + routes
├── pages/                  # one file per route
├── hub/
│   ├── layout/             # sidebar shell, header, ⌘K palette
│   ├── components/         # agent sheet, register dialog, transcript, composer, …
│   ├── data/               # TanStack Query hooks + one Realtime channel
│   └── lib/                # types, labels/icons, endpoints, metrics, time
├── content/                # manifesto + protocol copy
├── components/ui/          # shadcn/ui
├── components/{motion,agents,charts}/  # beUI
└── lib/                    # cn() + beUI helpers (ease, hooks, …)
supabase/
├── functions/              # edge functions above
└── migrations/
```

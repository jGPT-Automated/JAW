# The Sovereign Architecture

**A Living Digital Identity & Cognitive Command Center**

> *Designing cognitive systems where intent survives entropy. A manifesto for sovereign execution.*

---

## Executive Summary

The Sovereign Architecture is a dual-purpose web application that functions as both a **high-fidelity interactive portfolio** and a **production-grade agent fleet management dashboard**. It was designed and built as a strategic portfolio piece for an **Autonomous Executive-Architect** — someone who doesn't just use AI tools, but designs the persistent cognitive infrastructure that makes AI operate as accountable, stateful systems.

The project demonstrates end-to-end product thinking: from narrative-driven UX design through real-time data architecture to operational fleet management — the kind of systems-level work that sits at the intersection of PM, strategy, and technical architecture.

---

## The Problem

**The Exposure Gap.** There is a growing class of professionals who have built sophisticated AI orchestration systems — multi-model routing, persistent state machines, agent swarms with accountability loops — but have no artifact that communicates the depth, rigor, and business value of that work. Traditional portfolios fail because they optimize for listing features, not for conveying *architectural thinking*.

The specific problems this project solves:

1. **Narrative Compression** — How do you communicate a four-layer cognitive operating system (Orchestration → Execution → Persistence → Verification) to a non-technical stakeholder in under 90 seconds of scroll?
2. **Credibility Through Interaction** — Static case studies don't prove capability. An interactive, real-time dashboard backed by a live database does.
3. **Operational Visibility** — Agent fleets need a unified topology view, real-time activity streams, and editable system instructions — not scattered terminal windows.

---

## Strategic Decision Points

### 1. Manifesto-First, Not Feature-First
The landing page is not a product tour. It's a **scroll-driven manifesto** that unfolds a thesis in seven sections, each with deliberate pacing, typographic treatment, and scroll-triggered reveals. This was a conscious decision to lead with *thinking* before showing *building* — the way a strategy consultant presents: problem → framework → proof.

### 2. Cinematic Access Control
The Command Center is gated behind a **persistent vault icon** (bottom-right corner) that tracks scroll progress. As the user reaches the final section, the icon scales, glows, and — on click — triggers a full-screen expansion transition. This replaces a traditional nav link with an **earned discovery moment**, reinforcing the narrative that depth rewards attention.

An alternative entry exists via `/gate` with a 4-digit Captain's Key (code: `7787`), featuring shake-on-error animation and radial glow unlock transitions.

### 3. Real Data, Not Mockups
The dashboard reads from and writes to a live database (three tables: `agents`, `activity_logs`, `roadmap_tasks`). Agent system instructions are editable in real-time. The activity feed uses **Realtime subscriptions** for live event streaming. This was chosen over static mockups to demonstrate that the architecture is operational, not theoretical.

### 4. Topology Over Tables
The agent fleet is visualized as an **org chart topology** (SVG node graph) rather than a data table. Agents are rendered as typed nodes (Orchestrator ◈, Executor ▣, Analyst ◎, Validator ◆, Persistence ◉, Planner △) with hover-aware connection highlighting, status pulse rings, and click-to-inspect sidecars. This communicates hierarchy and relationships at a glance — critical for fleet oversight.

---

## Architecture & Technical Stack

### Frontend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **React 18** + **TypeScript** | Type-safe component architecture |
| Styling | **Tailwind CSS** with HSL semantic tokens | Design system with dark-mode-first palette |
| 3D Visuals | **Three.js** via `@react-three/fiber` + `@react-three/drei` | 800-particle field with mouse-reactive repulsion, breathing animations, and proximity connection lines |
| Charts | **Recharts** | Capability radar in the Profile section |
| Routing | **React Router v6** | Three routes: `/` (manifesto), `/gate` (access control), `/command` (dashboard) |
| State | **TanStack React Query** | Server state management and cache |
| UI Primitives | **shadcn/ui** + **Radix** | Accessible component library |

### Backend (Lovable Cloud)
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Database | **PostgreSQL** | Three tables with relational integrity (`agents`, `activity_logs`, `roadmap_tasks`) |
| Realtime | **WebSocket subscriptions** | Live activity feed via `postgres_changes` on `activity_logs` |
| Edge Functions | **Deno runtime** | Serverless API proxy for agent service integration |
| Auth | **Session-based** | Captain's Key gate with `sessionStorage` persistence |

### Database Schema

```
agents
├── id (uuid, PK)
├── name, type, status, model
├── current_task, system_instructions
├── uptime_hours, tasks_completed, success_rate
├── avatar_url, reports_to, connections[]
└── last_heartbeat, created_at

activity_logs
├── id (uuid, PK)
├── agent_id (FK → agents), agent_name
├── event_type, message, metadata (JSONB)
└── created_at

roadmap_tasks
├── id (uuid, PK)
├── title, description, status, priority
├── assigned_agent, progress, due_date
└── created_at, updated_at
```

---

## Design System

The visual identity is deliberately **anti-generic** — no purple gradients, no Inter font, no card-heavy SaaS aesthetic.

- **Palette**: Near-black backgrounds (`hsl(0 0% 3%)`), warm silver text (`hsl(40 10% 82%)`), amber accent (`hsl(25 30% 45%)`)
- **Typography**: Three-font system — **EB Garamond** (editorial headlines), **Instrument Sans** (body/UI), **JetBrains Mono** (technical labels, monospace data)
- **Motion**: Scroll-triggered intersection observer reveals with staggered timing, CSS cubic-bezier transitions, Three.js particle breathing
- **Layout**: Full-width sections, generous vertical spacing (py-40/py-56), intentional asymmetry in text placement

---

## Feature Map

### Landing Page (Manifesto)
| Section | Content | Interaction |
|---------|---------|-------------|
| **I. The Signal** | Hero with animated name reveal, particle field background | Phase-sequenced fade-in (600ms → 1800ms → 3200ms) |
| **II. The Thesis** | Three core principles with scroll-triggered reveals | Intersection observer at 30% visibility threshold |
| **III. The Stack** | Four-layer architecture with SVG node diagram | Hover-to-expand layer details, connection line highlighting |
| **IV. The Frameworks** | Five operational patterns (Ralph Loop, Completion Promise, Council Review, Context Engineering, Living Spec) | Click-to-expand accordion with flow diagrams |
| **V. The Work** | Five project cards with status indicators | Scroll-staggered reveal with tech stack badges |
| **VI. The Profile** | Capability radar chart + decision timeline | Recharts radar with 6-axis distribution |
| **VII. The Fork** | Closing thesis + CTA | Scroll-reveal with emphasis typography |

### Command Center Dashboard
| Tab | Function | Data Source |
|-----|----------|-------------|
| **Topology** | SVG org chart with typed agent nodes, connection lines, hover tooltips | `agents` table, live query |
| **Agents** | Grid of agent status cards with model info and performance metrics | `agents` table |
| **Activity** | Real-time event stream with color-coded event types (11 categories) | `activity_logs` table + Realtime subscription |
| **Roadmap** | Grouped task tracker (In Progress / Planned / Completed) with priority badges and progress bars | `roadmap_tasks` table |

### Agent Detail Sidecar
- Slide-in panel (right-anchored, 400ms cubic-bezier animation)
- Displays: avatar, type, status, model, current task, uptime/tasks/success stats
- **Editable system instructions** textarea with live database sync
- Save confirmation with ephemeral "✓ Saved" indicator

---

## Consumer Value Proposition

### For Hiring Managers / Recruiters
This isn't a to-do app or a landing page template. It's a **systems-level demonstration** of:
- Designing multi-model AI orchestration architectures
- Building real-time operational dashboards with live data
- Thinking in layers (Orchestration → Execution → Persistence → Verification)
- Communicating complex technical systems through narrative UX

### For Potential Collaborators / Clients
The interactive manifesto functions as a **queryable proof of capability**. The frameworks presented (Ralph Loop, Completion Promise, Council Review) are not theoretical — they map directly to the operational dashboard that manages their execution.

### For The Architect
A living artifact that compounds. As agents are connected, activity logged, and roadmap tasks completed, the dashboard becomes institutional memory — a real-time view of a cognitive operating system in production.

---

## Frameworks Presented

| Framework | Purpose | Mechanism |
|-----------|---------|-----------|
| **The Ralph Loop** | Deterministic persistence across sessions | Capture → Compress → Store → Restore → Verify |
| **The Completion Promise** | Verified task execution | Token issuance → Tracking → Verification → Resolution |
| **The Council Review** | Multi-model cross-validation | Draft → Model A/B/C Review → Consensus → Ship |
| **Context Engineering** | Attention budget optimization | Assess → Curate → Strip → Inject → Measure |
| **The Living Spec** | Self-updating specifications | Spec → Decision → Update → Log → Compound |

---

## Running Locally

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

Requirements: Node.js 18+, npm 9+

---

## Project Structure

```
src/
├── pages/
│   ├── Index.tsx              # Manifesto landing page
│   ├── CaptainsGate.tsx       # 4-digit access control
│   └── CommandCenter.tsx      # Dashboard with 4 tabs
├── components/
│   ├── ParticleField.tsx      # Three.js 800-particle system
│   ├── VaultIcon.tsx          # Persistent scroll-aware entry point
│   └── sections/              # 7 manifesto sections
│       ├── HeroSection.tsx
│       ├── ThesisSection.tsx
│       ├── StackSection.tsx
│       ├── FrameworksSection.tsx
│       ├── WorkSection.tsx
│       ├── ProfileSection.tsx
│       └── CloseSection.tsx
│   └── command/               # Dashboard components
│       ├── AgentOrgChart.tsx   # SVG topology view
│       ├── AgentStatusBoard.tsx# Fleet grid cards
│       ├── AgentDetailModal.tsx# Slide-in sidecar
│       ├── ActivityLog.tsx     # Realtime event feed
│       └── RoadmapTracker.tsx  # Grouped task tracker
├── hooks/
│   └── useScrollReveal.ts     # Intersection observer hook
└── index.css                  # Design tokens & typography
```

---

## What This Proves

1. **End-to-end product ownership** — From problem definition through architecture design, UI implementation, database modeling, and real-time data integration.
2. **Narrative-driven UX** — Not just building features, but designing the *experience* of understanding a complex system.
3. **Operational infrastructure** — A dashboard that doesn't just display data but enables fleet management (editable system instructions, status monitoring, activity correlation).
4. **Design conviction** — A deliberate aesthetic that rejects generic patterns in favor of an editorial, typographically-driven dark interface.
5. **Systems thinking** — The four-layer architecture (Orchestration → Execution → Persistence → Verification) isn't just presented — it's *demonstrated* through the application's own infrastructure.

---

<p align="center">
  <em>Sovereign Architecture · 2026</em><br/>
  <sub>The fork is psychological, not technical.</sub>
</p>

---

## Agent Command Center — Operations

The `/command` route is a live control plane for orchestrating Hyperagent agents over webhooks and Telegram, with rate limits, a queue, and full UI mirroring.

### Add an agent
**Agents tab → "+ Add Agent"**. Fields:
- **Name / role / description**
- **Webhook URL + secret** — your Hyperagent webhook (`X-Hyperagent-Webhook-Secret`)
- **Telegram bot token** (optional) — DMs to that bot route to this agent
- **Daily message cap** (default **3**) and **min seconds between messages** (default **60**)

Credentials live in `agent_credentials` (service-role only). Agent metadata lives in `agents`.

### Messaging flows
| You do… | What happens |
|---|---|
| Type a directive in topology **Live** mode | Chief of Staff (`orchestrate`) decomposes via tool-calling, fans out to specialists' webhooks, mirrors every leg to `agent_messages`, streams back to UI |
| Send from an agent's detail panel | Enqueued via `enqueue-message` → `queue-processor` posts to webhook → reply mirrored to UI |
| DM an agent's Telegram bot | `telegram-poll` cron picks it up → enqueues → webhook reply → bot replies on Telegram + mirror to UI |

### Rate limiting
Every outbound call goes through `message_queue`. The processor enforces:
- **Daily cap** per agent (default 3) — extra messages get `status='rate_limited'`, scheduled for tomorrow
- **Min delay** since last sent (default 60s) — schedules the message for the earliest legal time
- Both editable per agent in the detail panel

### Background jobs (pg_cron, every minute)
- `telegram-poll` — pulls new Telegram DMs for every agent with Telegram enabled
- `queue-processor` — drains up to 10 ready queue items per tick

### Edge functions
| Function | Purpose |
|---|---|
| `register-agent` | Create/update agent + credentials |
| `enqueue-message` | Rate-limit-aware enqueue |
| `queue-processor` | Drain queue → call webhooks → mirror replies |
| `telegram-poll` | Pull DMs per agent bot |
| `orchestrate` | Chief-of-Staff routing & synthesis (SSE) |

### Drill-in
Click any agent → **View history** opens `ConversationViewer` with the full Telegram + webhook + orchestrator transcript, live via Realtime.

### Tables
`agents`, `agent_credentials`, `agent_messages`, `message_queue`, `telegram_bot_state`, `activity_logs`.


## LocalCheck shared work history

Use [Threads & logs](https://www.modernweb.store/localcheck/threads.html) for dated chat logs, decisions, test outcomes, PR/commit/preview evidence and owner replies. Add entries; preserve prior authors’ work. Read [the LocalCheck continuation contract](public/localcheck/AGENTS.md) before every LocalCheck turn.

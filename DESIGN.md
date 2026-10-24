# JAW design record

Rule: every screen is composed from an allowlisted library, used the way its own demo uses it. No hand-built widgets.

**Allowlisted sources:** [shadcn/ui](https://ui.shadcn.com), [beUI](https://beui.dev), [cult-ui](https://www.cult-ui.com), [Kokonut UI](https://kokonutui.com). Registries are configured in `components.json`; install with `npx shadcn@latest add @<registry>/<item>`.

**Taste references:** owner's Dribbble collection "Jesse-Taste" and Behance moodboard "Desktop Web" (see `src/content/taste.ts`, served to agents at `/taste.json`). Read across them: near-black surfaces, large soft-rounded cards, one bright accent, a single centered voice visual with a short status line above and round controls below, plain list rows for history.

## Tokens

Owner-supplied palette in `src/index.css` (linen, graphite, lime pulse, Switzer). **Dark is the default** (graphite surfaces); light stays available.

## Screens

| Screen | Source | Notes |
|---|---|---|
| Shell | shadcn `sidebar-07` (collapses to icons) | Four destinations plus library. |
| Talk `/` | beUI `voice-orb`, driven like its preview (simulated breathing until audio arrives); layout from the Zeno / AI Voice Coach references | Orb centered, status line above, one live caption line below, round controls at the bottom (conversations, mic, end). No chat log on this screen. |
| Conversations `/conversations` | shadcn `item` rows for the list; Kokonut `synced-transcript` for the transcript | Long calls are read summary-first: summary, main points, decisions, follow-ups. The full transcript sits below and follows playback. Full page, never a panel inside a card. |
| Roadmap `/roadmap` | cult-ui `kanban-board` composed like its demo (columns + drag) | Filled from LocalCheck's 40 tracked requests (`public/localcheck/data/decisions.json`). |
| Resources `/resources` | shadcn `tabs`, `item`, `scroll-area`; Kokonut `lightbox-grid` for taste | Skills are readable text, and each one is fetchable by agents at `/skills/<name>.md`. |
| Protocol, Manifesto | Existing pages | Unchanged in this pass. |

## States

Empty and error states use shadcn `empty` / `alert` with a clear next step. Skeletons only while a request is actually in flight; a failed request never leaves a skeleton on screen.

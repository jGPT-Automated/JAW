# JAW design record

Rule: every screen is composed from an allowlisted library, used the way its own demo uses it. No hand-built widgets.

**Allowlisted sources:** [shadcn/ui](https://ui.shadcn.com), [beUI](https://beui.dev), [cult-ui](https://www.cult-ui.com), [Kokonut UI](https://kokonutui.com), [Beautiful UI](https://www.beautifului.dev), and the [libraries.dev](https://libraries.dev) npm effects (placement rules in `.claude/skills/libraries-dev`). Registries are configured in `components.json`; install with `npx shadcn@latest add @<registry>/<item>`.

**Taste references:** owner's Dribbble collection "Jesse-Taste" and Behance moodboard "Desktop Web" (imported into the Designs board, served to agents at `/api/public/resources?kind=design`). Read across them: near-black surfaces, large soft-rounded cards, one bright accent, a single centered voice visual with a short status line above and round controls below, plain list rows for history.

## Tokens

Owner-supplied palette in `src/index.css` (linen, graphite, lime pulse, Switzer). **Dark is the default** (graphite surfaces); light stays available.

## Screens

| Screen | Source | Notes |
|---|---|---|
| Shell | shadcn `sidebar-07` (collapses to icons) | Four destinations plus library. |
| Talk `/` | beUI `voice-orb` (breathing until audio arrives) inside libraries.dev `VoiceBeam` (`type="mobile"`, level from both voices); `thinking-orbs` beside the status; beUI `agent-activity` for tool calls; shadcn `tabs`, `sheet`, `item` | Workspace: history left, voice stage centre, tool calls and memory right. On a phone, the left button opens all three in a bottom sheet. |
| Conversations `/conversations` | shadcn `item` rows for the list; beUI `agent-activity` for the call's tool calls; Kokonut `synced-transcript` for the transcript | Long calls are read summary-first: summary, main points, decisions, follow-ups. The full transcript sits below and follows playback. Full page, never a panel inside a card. |
| Roadmap `/roadmap` | cult-ui `kanban-board` composed like its demo (columns + drag), tags retinted to theme tokens | Filled from LocalCheck's 40 tracked requests (`public/localcheck/data/decisions.json`). |
| GitHub `/github/:account` | shadcn `sidebar` sub-menu (sidebar-07), `avatar`, `item`, `sheet`; Kokonut `topo-background` (header), `activity-terrain` (contributions), `ai-diff-review` (pull request files) | Terrain recoloured graphite → lime. Review calls are saved for agents. |
| Resources `/resources` | shadcn `tabs`, `item`, `input-group`, `dialog`, `field`; Kokonut `lightbox-grid` (designs), `marking-menu` (the add pad) | Components are grouped by one shared set of categories across every library. Skills are readable text, fetchable at `/skills/<name>.md`. |
| Protocol, Manifesto | Existing pages | Unchanged in this pass. |

## States

Empty and error states use shadcn `empty` / `alert` with a clear next step. Skeletons only while a request is actually in flight; a failed request never leaves a skeleton on screen.

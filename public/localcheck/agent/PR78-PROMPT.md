# LocalCheck — next Home / Schedule PR (intended #78)

## Release boundary
PR #77 is the existing polish release. Jesse will merge it and publish its OTA separately. Do not amend #77 with this work. Start a new branch from the verified main commit AFTER #77 is merged. GitHub assigns the next PR number; #78 is the intended delivery slot, not an instruction to rename another PR. No merge, build, OTA, store submission, credential setup or SDK upgrade in this task.

First verify the actual repository and base SHA. The last reviewed #77 head is d018a570624bd3b96ee606f585dfaa5e5cc6d5aa; it was still open when checked October 18. Do not assume it has merged. If it has not, prepare the work without changing #77 and report the dependency.

## Source of truth and visual gate
Read the latest AGENTS.md, PRODUCT/design docs and .claude/skills/ui-done/SKILL.md in jGPT-Automated/LocalCheck_Expo. Preserve existing SDK54, runtime1.0.4, styling tokens, canonical components, permissions and paywalls.

Visual workspace: https://www.modernweb.store/localcheck/index.html . The current v3 mock revision is public/localcheck/index.html in jGPT-Automated/JAW; verify its V3 banner. Use this current published revision, not an older screenshot. The HTML embeds the original reference images and interactive demonstrations. Original screenshot references + explicit latest owner comments outrank incidental prototype fonts/sample data. Exact blur/focus sizes and new inline Create Game placement are shown for review, not already approved pixel values. Have Jesse review the new mock targets before implementing those visual details; do not reopen the selected Overview/Activity architecture.

H-REF-01 = expanded drawer screenshot09-explore-drawer-expanded.jpg. H-REF-02 / owner Ref99 = upcoming-timeline.png, also identified by the owner as the schedule/timeline reference in later comments. S-REF-01 = schedule-2d.png, with corrected axes and latest changes below. The previous hand-drawn nested Schedule card was explicitly rejected. Do not rebuild it.

## Outcome A — Home Overview
Home has exactly Overview and Activity. This supersedes Feed/Upcoming and the old Feed/Locals/Schedule Home layout.

Overview closely reuses the expanded Explore drawer's dashboard composition: existing court header and metrics; Check In/Check Out + Court near the top; Here Now; Up Next; today's activity chart; compact Recent Activity. No bottom Games/Players/Feed/Week drawer pills on Home and no pinned Plan/CheckIn/Court action stack. Keep check-in reachable on Home and Explore drawer. Court goes to the same existing court route.

Reuse the current actual app bottom tab bar unchanged: icons, label typography, dimensions, active tint and safe-area behavior from app/(tabs)/_layout.tsx / TabFloor. The HTML uses an image of the REAL bar solely as mock reference; do not implement it as an image. Full-size h separated from its number. Use selected quiet dot/VS/calendar feed treatment, no glow or new bright orange icon palette. Preserve event hierarchy and real counts.

## Outcome B — Home Activity
Match H-REF-02's timeblock/card/roster treatment, not the earlier thin empty outlined-row approximation.

- Descending chronological time: future ABOVE Now; earlier hours and days BELOW. At5PM:8PM,7PM,6PM,5PMNow,4PM,3PM…6AM, then the previous date's latest hours. Scroll UP to future and DOWN to past across day boundaries.
- Initial position: Now LINE roughly midway in the timeline. Top edge has the reference's subtle scroll fade/blur. Remove the detached FUTURE/NOW header row.
- Middle few timeblocks are focused/larger; focused blocks show player NAMES and a dropdown/expand control when the roster exceeds the row. Keep surrounding blocks condensed. Expanding focus/rosters must preserve scroll anchor; no jumping or reset when data loads or updates.
- Past blocks remain normal readable blocks with an explicit past-state distinction. Do not rely on color alone. Slight dimming is a proposed treatment, not permission to make text unreadable.
- A floating/displaced Now button returns the timeline to current time. Respect reduced motion.
- Focused future blocks include Going/attendance action, carrying selected court/date/time into the existing canonical availability flow. Reuse current semantics and validation; do not create a second backend model. The latest owner request explicitly supersedes the earlier blanket ban on a Home attendance entry point.
- Populate from actual visit history, heatmap availability/planned visits and existing scheduled games. Distinguish past actual visits, live presence, plans and games. Never turn a planned visitor into a check-in.
- Keep game date/time, format and capacity clear. Opening a game goes to its existing detail route. Do not copy every old +Game control into every timeline row.

Before code, identify real sources and bounded past/future range, pagination/timezone rules and empty/error states. Existing services include plannedVisitService and court/week history. Do not fabricate missing history; report an API gap before adding unrelated schema/RLS changes. Preserve position on app resume/time crossing Now, data refresh, and range loading. Use the installed Motion/gesture stack; no new native library or runtime change for this UI.

## Outcome C — Standalone Schedule
Match S-REF-01's composition with these explicit updates:
- Taller heatmap showing more rows: seven days across X, 6AM through midnight down Y. No Busiest summary/filler. Never squeeze text or cells to fit an arbitrary phone height.
- Selected-time card full width, positioned close to bottom navigation, with appropriate content clearance. Remove FAB and horizontal game carousel.
- Replace the rejected nested-card + two-large-actions layout with the original reference's simpler attendance row and game row.
- Attendance row: avatars/overflow and a Going button on its RIGHT. Scheduled game row preserves Join / existing game-opening behavior and date/time. Do not confuse marking availability with joining a game.
- Short strip below heatmap and above selected card: left toggle + Plan your week. On, allow selecting multiple time boxes then Save; Cancel exits without writing. Off, tapping a cell inspects one slot and does not silently change availability.
- Existing availability must preload correctly. Persist through existing services; disabled/loading/error/partial-save handling must be honest. Keep failed selections available for retry; do not claim all times saved after partial failure. Past-time validation and timezone behavior use existing rules.
- Remove floating Create Game entry, not game creation itself. New mock shows a compact inline Create Game in this strip for review. Use existing Create Game drawer and preserve its validation, host/team/notification logic.

## Outcome D — Court information boundary
Court route and tab structure remain. Remove its shared bottom Check In / Plan Visit footer. Court Week is informational: tap a time to inspect who is going and games, using Schedule's visual language. Remove Week's attendance-editing and Create Game controls. Roster expansion/game navigation remain. Do NOT remove the existing Court Games tab or its Create Game entry; Jesse explicitly wants those preserved. Do not remove check-in from Home/Explore via a shared-component side effect. Preserve other Court content, paywalls and visibility rules.

## Implementation and review discipline
Keep this ONE next app PR with reviewable commits: (1) Overview/shared header actions, (2) Activity timeline, (3) Schedule + Court Week action boundaries. After each, report exact files and screenshots against target; no neighboring cleanup. Inspect actual consumers before editing shared components. Likely owners: components/HomeScreen.tsx, components/ui/HomeCourtHero.tsx, components/sheet/CourtSheetContent.tsx, components/CourtSchedulePanel.tsx, app/(tabs)/schedule.tsx, app/court/[id].tsx and canonical game/availability components. Verify paths first. Reuse existing components; do not replace the real bottom nav, sheet library, typography tokens, native permissions or Expo configuration.

## Acceptance evidence
Run repository-required pnpm check, release checks and ui-done visual QA. Capture actual before/after at375x667,393x852,430x932. No clipped text, FAB overlap, keyboard-hidden action, tiny text introduced, or new horizontal page scrolling. Do not make tests pass by silently updating a baseline.

Exercise: Overview/Activity switching; actual nav/back; Home check-in/out and Court destination; timeline Now/up/down/date boundaries; roster overflow; focused future attendance with correct time; plan mode multi-select/Save/Cancel/error/retry/reload; Going vs Join; Create Game from Schedule and Court Games; read-only Court Week; empty/loading/error and long names; safe areas/large text/reduced motion. Verify Explore card→peek→expanded continuity and paywall did not regress. Native-only behavior needs device evidence; browser screenshots alone do not prove it.

Final handoff: exact base/head, scoped changes, screenshots vs references, test results/failures, missing native evidence, remaining decisions. Create draft PR only. Do not merge, publish OTA, build, configure Google credentials, alter auto-check-in, or change challenge/inbox/scoring flows in this PR. Owner wants the remaining release work tightly bounded before App Store submission, aiming no later than the #80 delivery slot.

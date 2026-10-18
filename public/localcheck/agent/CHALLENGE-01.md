# CHALLENGE-01 / conditional implementation handoff

Status: target proposal prepared, NOT approved for implementation or release. Read challenge.html and resolve Q-C1–C3 with owner first. This file is the scoped Codex Cloud prompt once those gates are answered.

Repository: jGPT-Automated/LocalCheck_Expo. Verify real current head. PR77 inspected at d018a570624bd3b96ee606f585dfaa5e5cc6d5aa; main 03fcd664b46187e45507465ab47f792f9035ec02. Do not publish all of unmerged PR77 as a small challenge fix. Identify actual release/test baseline.

Goal: Both Game On and Waiting on Player2 cards open the dedicated challenge detail. Accepted ranked challenges stop redirecting to Compete Log Game. Preserve links from notifications/other surfaces consistently. Before scheduled time show prominent date and countdown. After scheduled time, show only existing LogGameForm-style score inputs and bottom Missed | Log Score. Metadata and players remain prefilled/read-only. Reuse scoreError validation; missing values on submit show Enter both scores. and focus missing input. Missed opens a confirmation before any mutation. No forced navigation to generic Log Game.

Existing app/challenge/[id].tsx useEffect redirects accepted ranked challenges; remove only this behavior and corresponding Inbox routing. Pending recipient accept/decline, sender cancellation, completed result link, casual no-score flow, authorization and idempotency must remain intact.

Existing components/game/LogGameForm.tsx has inline score markup. Extract a narrow shared input component preserving styling/keyboard/accessibility so the challenge page does not invent another score UI. Use existing challengeService.logChallengeResult and established courtId/playedOn/request-id handling. Use server state to prevent duplicate/unauthorized result writes. Do not rewrite rating math or review/dispute behavior.

Open gates: Missed currently has no model status: choose existing cancelled/no Elo versus distinct status. Result deadline unspecified: retain existing behavior only if approved or define and enforce exact server policy. Choose fallback for accepted games lacking scheduled timestamp and clarify timezone. Reuse authoritative timestamp and handle app resume/time passing. Do not fabricate date/time or a client-only expiry rule.

Verify in two accounts: pending sender/recipient; accept future; countdown crossing time on resume; blank/one invalid/tied/valid score; successful submit; already submitted; error/retry; confirmed/aborted Missed; unauthorized nonparticipant; casual unchanged; completed View Game; inbox and notification route parity. Check keyboard/safe area and final-score position above bottom action at 393x852 and narrow screens. Run current package scripts and relevant model/component tests. Compare screenshots against owner-approved target. Report native gaps.

OTA: JS-only scope may be eligible only on compatible native runtime/channel. appVersion/runtime policy1.0.4; preview channel exists, production separate. No native dependency/config changes for this card. No update/build/merge without explicit release authorization after verification. Android currently lacks a current installable APK; build history only expired1.0.0. Auto-check-in returns unavailable on Android and is outside this card.

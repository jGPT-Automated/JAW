---
name: guiding-step-by-step-processes
description: >-
  Guide a person through an actionable, multi-step how-to process with exact,
  sequential instructions and no missing prerequisites. Use for setup,
  configuration, migration, device or storage management, account transfers,
  deployments, integrations, automation, or troubleshooting workflows when the
  user needs to carry out steps manually. Especially useful when operating
  system, platform, account setup, or desired outcome changes the path. Ask
  only branching questions that matter; confirm end state and risks; provide
  verifiable screen-level micro-actions. Do not use for implementing code on
  the user's behalf or for a simple one-step factual answer.
---

# Guide Step-by-Step Processes

Help a person successfully perform a real task, not merely understand the concept. Research changing facts, narrow material branches, align on the destination, then provide a dependency-complete sequence of small actions. The user must never need to infer a hidden prerequisite. Be concise without omitting an action they need to take.

## Communication and depth routing

- **Complete process, focused messages.** A setup or learning task deserves enough explanation and steps to succeed. Do not compress a complex procedure into a few sentences to satisfy a generic brevity preference. Instead, make each turn relevant to the user's present decision or action.
- **Teach the mental model when it helps.** Explain *why* a meaningful choice, prerequisite, or checkpoint matters in plain language. Keep explanations tied to the user's system and goal, not tangential background.
- **Personalize before prescribing.** Use the device, skill level, constraints, existing progress, and answers already supplied. Never restart the tutorial or ask the same question again.
- **Separate overview from execution.** Give a short, concrete destination picture, then full micro-actions. Use checkpoints for interactive coaching and a complete runbook for self-service; neither mode should omit required steps.
- **Be direct and precise.** Drop rhetorical setup, repeated cautions, irrelevant alternate scenarios, and reflexive hedging. State consequential unknowns and verified source details plainly.
- **Evidence where it changes actions.** Verify current UI/commands when version-sensitive; do not cite generic background for appearance. If verification is unavailable, distinguish the unverified step instead of inventing it.

## 1. Establish the current path

1. Identify the goal, starting state, target end state, tools/platforms, and the user's preference for an interactive walkthrough versus a complete runbook. If the user is learning rather than only executing, include enough explanation to understand the key choices and verify the outcome.
2. **Verify current details when they can change the answer.** For version-dependent apps, UI labels, vendor flows, CLI flags, pricing, policy, compatibility, and prerequisites, consult up-to-date official documentation first when browsing is available. Use reputable secondary sources for gaps, and distinguish verified facts from inference. Do not require live research for timeless, straightforward operations. If live sources are unavailable, state the uncertainty rather than inventing a current button or command.
3. Map the actual decision forks: device/OS, app vs. browser, existing state and data, hosting/DNS ownership, permissions, desired final behavior, and account limitations. Ignore variables that do not change the procedure.
4. Prefer a supported, simpler route when several options meet the goal. Explain a material tradeoff in one sentence instead of cataloging options.

## 2. Ask only branching questions

- If missing information **would change commands, introduce destructive risk, or alter the outcome**, ask 1–3 high-leverage questions, each with a short explanation of why it matters. Then stop for the answer.
- Ask a second set only when the first answers reveal another material fork. Never repeat questions already answered by the user or available context.
- If the route is sufficiently known, proceed without clarification. For low-impact uncertainty, state a reasonable assumption instead of interrogating the user.
- Do not withhold obvious, safe, immediately useful guidance just because a question remains.

## 3. Describe the destination before the clicks

In a brief, concrete overview, explain the approach, the resulting experience, and how the user will recognize success. Use the space needed to explain an important tradeoff or concept, without dumping irrelevant alternatives. Mention consequential risks and prerequisites **before** the steps: erased data, downtime, cost, reboots, irreversible operations, lost email, backup requirements, or account access. Distinguish user actions from operations the assistant can directly execute.

For destructive or difficult-to-reverse actions, identify the exact affected data/resources and a verified backup/recovery option; obtain explicit confirmation before directing irreversible execution when the scope is not already authorized.

## 4. Give dependency-complete micro-actions

- Write numbered steps in strict chronological order. Begin at the user's actual starting point (open the website/app, connect the device, or locate the terminal).
- Each step describes one small, observable action. Split multi-click, multi-screen, or multi-command milestones into their constituent actions.
- Use exact labels and spatial cues **only when verified or reliably established**. Say where to find a control and what visible state confirms success. Give an alternative navigation cue if layouts plausibly differ.
- For every value, file, key, command, menu, permission, or item used later, create, locate, or copy it in an earlier step. Never tell the user to paste a key, select a disk, or upload a file without first showing where it came from.
- Put commands in copyable code blocks with a note on where to run them and what expected output means. Never insert fake values into a destructive or production-changing command. Clearly label any placeholders and how to obtain them.
- Give explicit confirmation checks at meaningful boundaries (saved setting, successful test, expected disk/URL/status). Include a safe recovery action for likely failures.
- Mark actions requiring payment, credential entry, admin access, or potentially irreversible changes, and never request users to paste secrets into chat.

### Choose a delivery mode

**Interactive walkthrough (default for lengthy, unfamiliar, or risky tasks):** Give the overview and one coherent segment ending at a meaningful observable checkpoint (e.g., “Tell me when the new volume appears”). Choose segment length by cognitive load and risk, not an arbitrary number of steps. After the user confirms, continue without repeating completed steps. Explain the next key concept at the point it becomes useful. Continue across turns until the user's goal is met; short individual messages must not become an incomplete process. Do not claim an unseen action succeeded.

**Complete runbook:** If the user requests the whole process, prefers self-service, or the procedure is short and stable, give all necessary actions at once, even when the resulting answer is long. Add brief phase labels and checks when they reduce confusion. Do not force unnecessary turn-taking.

## 5. Final integrity pass

Before sending a runbook, silently test:

1. **No phantom dependencies:** every used input has a creation/lookup step.
2. **Correct branch:** instructions match the user's platform and desired result.
3. **Safe order:** backups, prerequisites, and confirmations precede destructive actions.
4. **Observable success:** the user can check the end state without guessing.
5. **Truthfulness:** version-specific UI wording, commands, and availability are verified or qualified.
6. **Human readability:** direct verbs, unambiguous nouns, no jargon-only milestones, repeated warnings, or filler.

If the task is to **write or change the software itself**, hand implementation to the software engineering workflow; use this Skill only for user-executed setup or handoff steps. If the task is to **rewrite a feed of short text items**, use the readable-output workflow instead.

For example branching and checkpoints, consult `references/interaction-patterns.md` only when needed.

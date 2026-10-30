# Repository reference notes

These links were supplied by the user as potential patterns, not as mandatory dependencies or universal architecture. **Inspect current content before adopting any idea**; sample repositories may change or may contain project-specific decisions that should not be generalized.

- https://github.com/jGPT-Automated?tab=repositories
- https://github.com/GenJess?tab=repositories
- https://github.com/agenticjess-star?tab=repositories

## Reusable observations from a dated inspection (2026-10-29)

**`jGPT-Automated/LocalCheck_Expo`** contained an `AGENTS.md` contributor contract with concrete documentation-update requirements and careful status distinctions: branch code, live backend, and device-tested features are different evidence states. Its README also distinguishes Expo Go browser/preview behavior from capabilities that require a native or TestFlight build. **Generalize the verification and agent-handoff discipline**, not its specific tools, file names, test account rules, deployment policy, or business decisions. A concise chat status is not a substitute for fresh, complete canonical docs and evidence that the next agent can use.

**`jGPT-Automated/GenJess_OS`** and **`agenticjess-star/LocalCheck_Expo`** show workspace/project structures that need inspection before assuming the runtime, package manager, or build workflow. The former exposed a pnpm-based workspace manifest; the latter included a product-design README. **Generalize the instruction to inspect the local manifest and project docs first**, not a particular package manager or design style.

**`jGPT-Automated/flow-genie`** exposed an app with existing React, UI, and test dependencies; it reinforces checking current libraries before introducing new packages or rebuilding a capability from scratch.

If a referenced repository is inaccessible, irrelevant, or stale, proceed with the current project's checked-in code and official documentation instead. Never assume these repositories are exhaustive catalogs or the same product.

## Decision examples

| Situation | Preferred move |
| --- | --- |
| A maintained dependency already provides the needed operation | Use it; avoid a custom helper stack |
| Obsolete internal endpoint has no active consumers | Remove it, with tests, instead of dual-routing |
| An external client still uses an old endpoint | Ask about breaking-change permission and an explicit transition |
| A feature works in web preview but relies on native APIs | Report preview verification separately from on-device testing |
| The repo requires docs updates alongside code | Update the specified docs in the same change |

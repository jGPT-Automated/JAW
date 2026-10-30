# AGENTS.md — Reusable Software Contributor Contract

These are default rules for a coding agent working in this repository. Replace the optional project-specific fields below when adopting this file. A direct user instruction and any more-specific `AGENTS.md` for a subdirectory can refine these defaults. Never assume this template overrides system or safety constraints.

## Project context (customize once)

- **Purpose:** [What the product does and who uses it.]
- **Stack:** [Main languages, frameworks, runtimes, infrastructure.]
- **Source of truth:** [Key architecture docs, product requirements, API contracts, or decision log.]
- **Install / dev / test / build commands:** [Copy exact commands from the repository's manifests; do not guess.]
- **High-risk assets:** [Production databases, customer data, DNS, credentials, payments, published APIs.]
- **Release and verification path:** [How preview, staging, production, and on-device behavior are checked.]

If these fields are not filled in, inspect the repository to discover them. Do not treat the placeholders as factual instructions.

## Route communication by reader and purpose

1. **Conversation with a human:** lead with the conclusion, action, or decision. For an initial question or grounding discussion, be concise, relevant, and non-repetitive. Offer a specific deeper thread instead of dumping possible details.
2. **Agent-facing documentation:** be fresh, sufficiently comprehensive, and independently usable by the next agent. Do not shorten source-of-truth files, plans, runbooks, or handoffs just to satisfy chat brevity.
3. **Learning or manual setup:** explain the useful mental model and provide all required steps. Use focused, sequential messages and checkpoints when appropriate; a complete process may take many turns.
4. **Evidence over theater:** cite actual code, checks, or observations. Distinguish current truth from proposals, branch-only work, previews, deployments, and device-tested behavior. State material unknowns plainly rather than hiding them behind generic hedges.
5. **Remove empty words, not important information:** no filler, invented scenarios, repetitive disclaimers, or decorative complexity. Depth follows the reader's job and the user's request; do not impose a uniform word count.

## Engineering principles

1. **Choose the smallest durable implementation.** Meet current requirements end to end without speculative abstraction, flags, indirection, or complexity for hypothetical features.
2. **Grow in working slices.** Build and verify the smallest complete user-visible path before adding capabilities. Do not replace a functioning path with unfinished scaffolding.
3. **Keep concerns separated.** Use clear modules and boundaries for UI, business logic, persistence, and integrations where separation aids comprehension or testing. Avoid structure for its own sake.
4. **Use the project's dependencies first.** Inspect package manifests, APIs, type definitions, and official docs before writing a custom solution or adding a library. Prefer maintained libraries when they genuinely reduce total complexity.
5. **Use proven patterns.** For consequential design choices, study established implementations and maintained framework guidance; adopt the appropriate convention without importing unrelated architecture.
6. **Design for the long term.** Do not choose a knowingly disposable stopgap that will immediately require a rewrite. Keep the solution simple but structurally sound.
7. **Remove obsolete internal paths.** Do not add compatibility layers or fallbacks just to retain unused code. When authorized, delete dead implementations rather than maintaining duplicates.
8. **Protect real contracts and data.** Never silently break published APIs, active integrations, persisted customer data, or production workflows. Ask before intentional breaking changes and before destructive operations; identify backups, migrations, rollbacks, and affected users where applicable.

## Workflow for every change

1. Read applicable `AGENTS.md`, repository documentation, and the code directly involved. Check the current branch and working tree; preserve unrelated edits.
2. Define the user-observable outcome and any constraints. Separate known requirements from assumptions.
3. Inspect nearby patterns and existing dependencies. Use the shortest coherent design that fits the project.
4. Implement in one small end-to-end slice, then add remaining behavior incrementally.
5. Add or update focused regression/unit/integration tests where relevant. Run the project's actual formatting, linting, typechecking, build, and test commands as applicable.
6. Test important failure modes, loading/empty states, access control, and integration boundaries where relevant.
7. Update affected canonical documentation, API contracts, status records, and decisions in the same change. Check for stale or conflicting claims; respect any stricter repository documentation rules. Do not treat a passing build or an unmerged PR as shipped functionality.
8. Review the diff for unnecessary changes, dead code, unhandled errors, and undocumented risk before handing off.

## Documentation and agent-to-agent continuity

Maintain the repository's documentation as an operational source of truth for a different agent starting without this conversation. Correctness, completeness, and freshness matter more than word count.

- **Find authority first.** Use the existing canonical docs and repository instructions. Do not introduce a competing status log, duplicate runbook, or independent set of product rules.
- **Record the actual state.** Distinguish approved decisions, code committed on a branch, changes merged into `main`, backend changes verified live, preview results, and real-device tests. Include dates, branch/commit references, and evidence when necessary to disambiguate.
- **Capture what the next agent needs.** Explain purpose and scope; current behavior; key files/contracts; decisions and rejected approaches; exact successful/failed checks; unresolved blockers; user approvals needed; and the next executable action. Provide actionable paths/links and commands where they save reconstruction.
- **Refresh on change.** Update affected docs in the same change, check neighboring docs for contradictions, and correct stale claims instead of merely appending new notes. Preserve the history of decisions where the project requires it.
- **Keep the shape usable.** Front-load current state, organize by task and authority, use stable terminology, and link to detailed sources rather than copying them. Comprehensive does not mean repetitive.

## Human-facing delivery

Report the outcome, meaningful verification, and remaining blocker/decision concisely. Link the detailed artifact or handoff rather than pasting it all into chat unless asked.

- State evidence level precisely: **implemented locally**, **committed/on branch**, **previewed**, **deployed/live**, and **tested on device** are different states.
- Identify material unverified behavior and the next action when one remains.
- Never disclose secrets in logs, screenshots, chat output, or committed files.

## Optional repository-specific rules (fill in or delete)

- **Documentation map:** [Which docs must change when UI, backend, CI, data, or releases change?]
- **Testing boundaries:** [What requires browser, real device, staging, or production verification?]
- **Deployment permissions:** [What can an agent deploy, and what requires approval?]
- **Data changes:** [Backup, migration, rollback, and access-control requirements.]
- **Design and terminology:** [Where approved tokens, copy terms, and UI conventions are defined.]

This file defines *repository-wide defaults*. A specialized Skill may add a task-specific workflow but should not duplicate all these rules.

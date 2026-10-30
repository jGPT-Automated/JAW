---
name: pragmatic-software-engineering
description: >-
  Implement, refactor, debug, review, or extend software and maintain accurate
  engineering documentation, plans, or agent-to-agent handoffs. Use when
  changing code, choosing architecture, updating repository status, or
  documenting work for another agent to continue. Inspect existing code and
  contributor rules; reuse proven libraries; build small working slices;
  verify tests and actual runtime state. Make human-facing updates concise,
  but keep agent-facing documentation fresh, thorough, traceable, and usable
  without the prior conversation. Protect live contracts and data. Not for
  ordinary manual setup walkthroughs or copyediting short-text feeds.
---

# Pragmatic Software Engineering

Ship the simplest maintainable implementation that fully satisfies the current requirements. Favor a complete, working vertical slice over a speculative future architecture. Treat verification as part of implementation. Communicate the result with the same economy as the code.

## Route communication by audience and purpose

- **Human-facing conversation:** lead with the outcome, decision, or next action. Keep routine updates compact and relevant to what the user needs now. Offer deeper investigation as a specific follow-up instead of dumping all possible details.
- **Agent-facing docs, plans, and handoffs:** optimize for an agent starting later without the current conversation. Be fresh, comprehensive *where needed*, structured, and directly usable. Do not impose chat-length limits on durable documentation or omit context to be concise.
- **Implementation and verification:** provide exact code, commands, tests, and evidence when the task requires them. Preserve relevant complexity; remove only filler, duplication, speculative scenarios, and generic warnings.
- Cite a file, test, or observation only when it supports a material claim. Separate static checks, previews, deployed behavior, and device tests. Identify material uncertainty without evasive boilerplate.

## 1. Understand the real project

1. Read applicable `AGENTS.md` files and existing project docs before editing. More specific repository instructions and user requests take precedence over generic preferences here.
2. Inspect the actual entry points, core modules, dependency manifests/lockfiles, tests, scripts, state/data model, and relevant recent changes. Record what exists; do not infer a clean-slate project or assume a dependency is incapable without checking docs and types.
3. Define the requested user-observable behavior and boundaries. Distinguish **must work now** from possible future requirements. Note externally consumed interfaces, production data, migrations, permissions, and deployment impact.
4. For nontrivial or contested architectural decisions, look at maintained framework documentation and proven implementations in established products. Copy the *pattern*, not their incidental complexity. Use links in `references/project-reference-sources.md` only if relevant to the current project; never treat a sample repository as authority.

## 2. Make a durable, small design

- Choose the fewest moving parts that meet the complete requirement. Avoid speculative configuration, wrappers, abstraction layers, and indirection.
- Build in layers: a runnable end-to-end implementation first, then add behavior in small, tested increments. Avoid halfway rewrites that leave core paths broken.
- Separate presentation, domain logic, persistence, and integrations where doing so genuinely improves understanding or testability; do not create empty architectural ceremonies.
- Prefer established, maintained libraries if they **reduce total complexity**. Reuse project dependencies first and verify their existing capabilities in docs, API shapes, or type definitions.
- Make a long-term architectural choice now rather than intentionally introducing a temporary system that requires replacement. “Simple” does not mean fragile.
- **No automatic compatibility theater:** delete dead internal code and obsolete paths when authorized; do not add fallback implementations, duplicate endpoints, or migration scaffolding solely to keep unused designs alive.
- **Safety boundary:** do not silently break public APIs, active clients, external integrations, or persisted data. A breaking change, irreversible data cleanup, or schema replacement needs explicit scope and a concrete safe transition or rollback plan. Respect constraints from existing users and repository instructions.

## 3. Implement and check each slice

1. Make the smallest coherent change that proves the main flow works. Preserve unrelated work; review the diff before writing over files.
2. Write or update focused tests around changed behavior and important failure modes. Prefer a regression test for a reproduced bug where practical.
3. Run project-prescribed checks (format, lint, typecheck, unit/integration tests, build, smoke test). Use existing scripts rather than inventing new commands. Report any check that could not be run and why.
4. Check user-visible edges: loading/error/empty states, validation, auth/access, meaningful accessibility, idempotency where relevant, and failure recovery. Verify integrations and observability rather than assuming a successful build equals working production behavior.
5. Update required docs and contracts in the same change, especially when the project has a policy linking code and documentation. Verify existing claims against the current code and environment, resolve newly discovered contradictions, and avoid competing sources of truth. Agent-readable docs must explain the actual state, not just note that a file changed.
6. If runtime deployment is requested and permitted, separately verify the deploy and any device-specific behavior. A local pass or PR preview is not proof of a production deployment.

## 4. Document the state for the next agent

When producing or updating an agent-facing handoff, plan, README, or status document, write enough to resume accurately without reconstructing the preceding conversation:

1. **Authority and scope:** repository, branch/commit, relevant canonical docs, task goal, approved decisions, and boundaries. Do not promote a proposal or branch change into shipped product truth.
2. **Current state:** what exists and works, what changed, where the relevant code/contracts live, and what was deliberately excluded. Resolve stale or contradictory claims against the actual source of truth.
3. **Evidence:** exact checks executed and outcomes, preview or device evidence, deployment status, and tests not run. Preserve commands, references, and dates when their precision matters.
4. **Continuity:** unresolved decisions, blockers, dependencies, risks, and the **next executable action**. Include paths and links a later agent can follow without hunting.
5. **Maintenance:** update the repository's authoritative documents in the same change. Prefer links to existing detailed sources over copying long sections into competing notes; update summaries that are now stale.

A durable handoff may be extensive. Optimize it for correctness, completeness, findability, and freshness—not chat brevity. Never replace actual documentation with a short chat recap.

## 5. Report back to the human

Give a compact answer-first status containing the applicable facts: **what changed, what was verified, what remains blocked, and the next decision/action**. Link the authoritative documentation or PR for detail; expand in chat if the user asks.

Do not launch into a manual setup tutorial unless the user is carrying out steps; then use the step-by-step guidance Skill. Do not apply feed/dashboard microcopy rules to engineering docs; route repeated short-item rewrites to the readable-output Skill.

See `references/project-reference-sources.md` for the user-supplied sample repositories and exactly what they can teach, if relevant.

---
name: human-readable-ai-outputs
description: >-
  Create or revise collections of AI-generated short text for fast human
  scanning: activity feeds, dashboard cards, issue summaries, session titles,
  notification stacks, release updates, review themes, and status lists.
  Use when many similar items must be compared at a glance and inconsistent
  grammar, terms, ordering, or sentiment could confuse readers. Front-load
  distinct information, keep parallel sentence structure and vocabulary,
  vary presentation only to encode real differences, and match verbs to
  grounded meaning. Do not rigidly apply feed rules to general prose,
  stories, or single standalone answers.
---

# Human-Readable AI Outputs

Optimize collections of short items for rapid, accurate comparison. The unit of design is the **set of items**, not each item in isolation. Consistency should reduce rereading without hiding meaningful differences. Shorter is better when the factual meaning survives.

## Audience and output routing

- **Repeated human-facing items:** optimize for quick scanning, predictable structure, and minimal redundant wording. Return the edited set directly.
- **Human-facing explanations about the set:** start with the important finding; expand only when readers need the method, exceptions, or evidence to interpret it.
- **Agent-to-agent handoffs, technical docs, decision records, and learning walkthroughs:** do **not** treat them as short-text feeds. These require durable context, instructions, and evidence or complete steps. Preserve information needed for action even if the result is long.
- **Integrity:** state what source data supports; preserve material exceptions and uncertainty. Avoid fabricated examples, reflexive qualifiers, generic citations, and length added just to appear thorough.

## 1. Identify the scan task

Determine who scans the items, what they need to tell apart first (status, subject, action, urgency, count, sentiment, or date), and whether items represent current activity, past events, or requested actions. Identify the exact factual fields available from source data. Preserve uncertainty and do not invent counts, examples, chronology, sentiment, or causal claims.

## 2. Choose one item schema for the collection

Use these five rules, adapted from the user-provided Full Stack Data Lab article:

1. **Start with the actor or action.** Favor direct subject–verb–object phrasing. When every item has the same actor, omit it and begin with the action. Keep the verb tense consistent with what the feed represents: ongoing work, completed events, or future actions.
2. **Lead with what distinguishes the item.** Put status, action, or topic in the opening words, not after generic boilerplate. Readers often scan only the start.
3. **Reuse structure and vocabulary.** Define one order of fields and one term per concept. E.g., do not alternate between “ticket,” “issue,” and “case” for the same source object. Keep time and number formats consistent.
4. **Vary only for meaningful reasons.** A different color, card length, field, title style, or emphasis implies a difference. Apply the same fields to comparable items; show missing data explicitly where it matters rather than silently dropping a field.
5. **Match connotation to verified meaning.** In feedback summaries, “praise,” “report,” “request,” and “complain” communicate different observations. Use neutral verbs for neutral or mixed evidence. Do not label a theme as positive or negative based on a minority example.

Select a short, repeatable template such as `Status: action — object`, `Actor + verb + result`, or `Theme — evidence count — finding — representative example`. Do not force the same schema across genuinely different types of item; group by type first.

## 3. Draft and audit the whole set

- Draft each item from its own supporting data; do not launder guesses into fact.
- Read the **first 2–4 words down the list**. If many entries begin with the same filler, reorder them to put differentiating information first.
- Check parallel grammar, tense, terminology, field presence, and comparable length. Distinguish systematic fields from optional exceptions explicitly.
- Check that verbs reflect the actual direction and confidence of the evidence. Preserve important mixed or minority findings when material.
- Keep source links, counts, dates, and examples accessible when precision matters; never make a beautiful short summary at the expense of factual completeness.
- Prefer a brief legend or one sentence of schema explanation over repeating boilerplate inside every card.

## 4. Output

Provide the rewritten set in a scan-friendly, consistent format. When revising supplied text, preserve its meaning and factual scope. Mention missing fields only if they materially limit interpretation. When asked for a template or design system, provide the schema once plus representative examples.

Read `references/feed-patterns.md` for concrete before/after patterns and source attribution when needed.

**Boundary:** This Skill is for repeated short-form items, not all writing. For code, repository docs, or agent-to-agent handoffs, use the software engineering workflow and preserve the context needed by later agents. For sequential user-operated learning or setup, use the step-by-step workflow and deliver the complete process over an appropriate number of turns. For ordinary chat, respond directly and surface optional detail only when useful; do not force a feed schema.

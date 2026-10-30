# Pattern examples and attribution

Core reading: Shreya Shankar, **“Five Principles for Generating Readable AI Text in Bulk,”** Full Stack Data Lab, October 29, 2026.
https://fsdatalab.github.io/blog/agent-text-at-scale/

This Skill paraphrases the article's five concepts; the examples below are original illustrative data, not quotations from the article.

## 1. Agent session titles (ongoing work)

Less scannable:
- Login issue
- Refactoring checkout state
- New billing dashboard

More scannable:
- Fixing login redirects
- Refactoring checkout state
- Building billing dashboard

**Schema:** gerund + object; ongoing tense throughout. If sessions are completed, use past tense throughout instead.

## 2. Status-oriented notifications

Less scannable:
- Your report for Monday has been generated
- Your import for April failed
- Your invoice for September was approved

More scannable:
- Ready: Monday report
- Failed: April import
- Approved: September invoice

**Schema:** meaningful status + object. Add timestamps as a consistent field only if they inform the scan task.

## 3. Customer feedback themes

Less scannable:
- Onboarding: the product is easy for new customers, but a few note confusion.
- Mobile: feedback mentions repeated crashes and slow loading.
- Pricing: users have asked for more plan options.

More scannable (assuming the evidence supports each item):
- Users praise simple onboarding — 31 reviews — “Getting started took minutes.”
- Users report mobile crashes — 12 reviews — “It closes when I upload.”
- Users request more plan options — 8 reviews — “A smaller tier would help.”

**Schema:** user + evidence verb + topic — count — sourced example. Counts and quotations above are *fabricated for layout demonstration only*; never carry them into a real analysis.

## 4. Comparable dashboard cards

Bad comparison: one card gives a count and percentage, another gives only an anecdote, and a third gives a platform version. Readers may assume the omissions are significant.

Better comparison: define fields `Theme / Number of records / Finding / Example / Confidence` and apply them consistently. Use `Not available` when a field is material but missing; use a separate footnote when a true exception merits additional detail.

## 5. Audit of an output set

- Can readers distinguish most items from the opening 2–4 words?
- Does every item follow the same grammar and field sequence within its group?
- Does one concept always use the same term?
- Do visual/textual deviations represent real differences?
- Do verbs, counts, and examples match the evidence?
- Are important exceptions or mixed signals still visible?

Do not use forced positive/negative wording for inherently neutral events, or uniformly suppress relevant nuance to make cards match.

# Keep LocalCheck knowledge in one place

Shared page: https://www.modernweb.store/localcheck/threads.html

## Before work

1. Fetch JAW main. Read the shared page, source JSON and published owner replies. Reuse the existing branch/agent context when appropriate.
2. Find your exact thread ID and title. If new, append its metadata to `threads`; preserve all existing records. Use source chat metadata for creation time. Imported history is dated when recorded, not fabricated as an original event.
3. Put a bounded proposal/question under your thread when a decision is required. Give it a stable entry ID. Show purpose, model, scope and output; await the real owner reply. Routine log maintenance is preapproved. Never use the chat question widget.

## Every work turn

Append to `public/localcheck/data/thread-log.json`. Each entry needs:

```json
{
  "id": "thread-shortname-20261019T040000Z-01",
  "thread_id": "EXACT-CODEX-THREAD-ID",
  "recorded_at": "2026-10-19T04:00:00Z",
  "kind": "Completed / Proposed / Decision / Test result / Correction / Blocked",
  "title": "Concrete result",
  "summary": "What changed, why, approval source, actual checks and next unfinished item.",
  "links": [{"label": "PR / commit / exact deployment / source", "url": "https://..."}],
  "follows": ["earlier-entry-id"]
}
```

For a device result, retain the owner's wording, date and tested scope. Label owner report and independent artifacts accurately. Do not mark the test unperformed solely because a recording is missing. For code work record PR, full commit, exact preview URL and real checks/status. Append new PR state snapshots as new work entries; never alter a historical snapshot to make it look current.

Write the new entry to a temporary JSON file, then run:

```sh
node scripts/localcheck-log.mjs append /absolute/path/new-entry.json
node scripts/localcheck-log.mjs check
```

The append command validates IDs, source links, record-time order and backwards references, and renders `threads.html`. The page is static HTML, so logs are readable without JavaScript. `threads.js` only adds search and reply/draft controls.

Commit only your scoped changes; preserve dirty files belonging to others. Use a PR with its immutable commit and exact Vercel preview, check the browser and relevant package scripts, and publish within the owner's authorized block. Add delivery/check evidence in another entry. Do not claim a local file or queued deploy is live. Read main again before pushing to avoid overwriting another agent's newer addition.

## Owner replies

The page's form retains a clearly labelled device draft and opens a prefilled GitHub issue. The owner finishes GitHub's Submit new issue action to publish it under their own identity. Refresh published replies reads those records back into the page in creation order. This avoids embedding credentials or permitting anonymous visitors to act as Jesse.

Questions go in the dated log, with a question ID. A response includes the thread, question/entry ID and source permalink. Owner identity and authorization scope must be checked before execution; arbitrary public comments do not grant approval. If GitHub read limits are reached, direct source links remain available. A device draft or downloaded file is never silently treated as a shared answer.

## Preserve history

New entries only. Corrections link to the superseded entry and state the newer fact. Do not delete, reorder or rewrite another thread's entries, original reference images, design pages or decisions. Derived HTML may be regenerated from the preserved source record. All older work stays reachable from the shared navigation.

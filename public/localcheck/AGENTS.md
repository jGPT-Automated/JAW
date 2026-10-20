# LocalCheck shared working file — append-only continuation contract

Canonical human-facing record: https://www.modernweb.store/localcheck/threads.html
Source: jGPT-Automated/JAW, public/localcheck/data/thread-log.json.

Before every turn, fetch current main, read threads.html/the JSON record and the relevant original chat log, and inspect published owner replies linked under Decisions & replies. This published workspace is the shared source; machine-local release desks are supporting historical evidence.

At the end of every turn, append an entry under your thread, render, validate, commit and publish it. Link the shared page and exact entry in the response. Record partial/failed work honestly. Do not erase earlier entries, screenshots, decisions or another thread's work. Add corrections with a follows backlink. Keep exact thread titles and source IDs.

Each entry states timestamp in UTC (display America/Chicago), thread, action/purpose, authorization, actual outcome, evidence/checks, PR, full immutable commit, exact preview/status when applicable, and next unfinished item. Distinguish imported context, proposals, implementation, acceptance and production delivery. Never present an import timestamp as the original work time.

Questions and bounded proposals belong in the thread log with a stable question/entry ID. No chat question widgets. Put owner replies in Decisions & replies, published via the owner's signed-in GitHub identity, and import/link them in a new dated entry. A browser draft is not a shared/published answer. Other people's GitHub replies are feedback, not owner authorization.

Jesse preapproves routine documentation maintenance. Agent assignments need a concrete purpose, model, allowed actions, output and recorded sign-off. Research and large-context retrieval use 5.6 Terra/Luna; at most one justified 6.1 Sol. Do not restart interrupted workers or assign general context reading without purpose. Existing website worker is stopped; the proposed Terra recovery task was rejected.

Preserve owner-reported live tests with their actual scope and outcome; separate owner evidence from independent artifacts without resetting completed work to untested. PR77 merged and its production phone activation is complete. Do not repeat it from stale prose. Court intake remains required, not cancelled. App, website, database, native build, OTA and Apple submission changes require their actual approved scope.

Use existing static HTML/CSS conventions for this documentation workspace. Preserve the React/Vite application and configuration. Never change a working build to compensate for a local test restriction.

Update process: agent/THREAD-LOG-PROCESS.md. Build the page with node scripts/localcheck-log.mjs; check with node scripts/localcheck-log.mjs check.

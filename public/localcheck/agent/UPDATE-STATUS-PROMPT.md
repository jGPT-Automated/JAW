# Update the LocalCheck status page

Use this when work changes in LocalCheck_Expo (a PR opens, CI changes, a fact is verified, a blocker appears).

## Where things live
- Data: `public/localcheck/data/status.json` in jGPT-Automated/JAW. The status page reads it at runtime, so a JSON-only change updates the page.
- Work log (time-ordered agent work): `public/localcheck/data/worklog.json`. Add one entry per piece of work: time (UTC), thread, title, summary, why, basis (verified or reported), PR link, preview links (Vercel and Expo Go), files with +/- counts, and a short diff excerpt.
- PR evidence for the Files tab: `public/localcheck/data/files.json`.
- Page: https://www.modernweb.store/localcheck/status.html

## Rules
1. Mark each item `verified` only if you checked it directly (command output, test run, screenshot, merged PR). Anything reported by someone else is `belief`.
2. Put anything the owner must do in `needs_you`. Say what is blocked.
3. Append one line to `log` per update, dated.
4. Components: every UI element must come from beui.dev or shadcn. No hand-coded components. If something is missing, find the closest beui or shadcn component and use it.
5. Open or update one PR in JAW. Do not merge it.

## Render check (required before you say anything is verified)
From `localcheck-ui/`: `npm run build` then `npm run check` (needs Playwright and Chromium). It opens every /localcheck page at 393x852 and 1280x900, fails on any pageerror, console error, failed request, empty body or horizontal overflow, and clicks through from index.html to every other page. After the Vercel preview deploys, run `npm run check -- https://<preview-url> <outDir>` and attach screenshots. State which commit you tested. A data-only change (a new `state` value, a new field) can crash a page, so run it after data changes too.

## Steps
1. Read `data/status.json`.
2. Add a `worklog.json` entry for the change, then update `tracks[].steps`, `tracks[].prs`, `needs_you`, `priorities`, `summary`, `updated`, `log`.
3. If a LocalCheck_Expo PR changed, refresh `data/files.json` with the real patch excerpts.
4. Validate: `python3 -c "import json;json.load(open('public/localcheck/data/status.json'))"`.
5. Commit, push, update the PR body with what changed.

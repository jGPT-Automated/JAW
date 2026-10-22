# Add a finding to the LocalCheck Findings page

Use this when you find a bug, risk or proposed change in LocalCheck_Expo (or the website) that the owner should review before any work is approved. The owner has findings reviewed externally, then green-lights the work. Findings are documented here first.

## Where things live
- Data: `public/localcheck/data/findings.json` in jGPT-Automated/JAW. The page https://www.modernweb.store/localcheck/findings.html reads it at runtime, so a JSON-only change updates the page.
- Also add one line to `public/localcheck/data/worklog.json` saying a finding was added or changed.

## One finding = one object in `findings[]`
```json
{
  "id": "F9",
  "title": "Short plain title",
  "area": "Gestures | Drawers | Typography | App Store | Website | Performance | ...",
  "severity": "high | medium | low | info",
  "status": "proposed | under-review | approved | rejected | shipped",
  "updated": "2026-10-22",
  "evidence": [
    { "kind": "file | command | screenshot | grep", "ref": "app/_layout.tsx:75", "text": "what this shows", "basis": "verified | belief", "url": "optional link or /localcheck/shots/x.png" }
  ],
  "cause": "Root cause in one or two sentences.",
  "fix": {
    "summary": "What the fix does.",
    "diff": { "file": "app/_layout.tsx", "lines": [ { "id": "a1", "type": "context | added | removed", "content": "code line" } ] }
  },
  "risk": "What could break, and how likely.",
  "verify": "Exact steps to check it on a device or in a run.",
  "pr": { "label": "LocalCheck_Expo PR #80", "url": "https://github.com/..." },
  "previews": [ { "label": "Vercel preview", "url": "https://..." } ]
}
```

## Rules
1. `basis` is `verified` only if you ran or read it yourself (command output, test run, screenshot, code you opened). Anything reported or inferred is `belief`. Say what is missing for a belief.
2. Start every finding at `proposed`. Only the owner moves it to `approved` or `rejected`. Set `shipped` only after the PR is merged.
3. Give file:line for code evidence, the exact command for runs, and a screenshot link when something is visible. Put screenshots in `public/localcheck/shots/`.
4. The proposed diff is short (about 10 lines). Link the PR for the rest.
5. Verify steps must be doable by one person on a phone or in one command.
6. Components: the page uses only beui.dev and shadcn components. Do not add hand-coded UI. You only edit JSON and markdown.
7. Open or update one PR in JAW. Do not merge it. Reply with a screenshot of the Vercel preview of the page.

## Steps
1. Read `data/findings.json` and check the id is new.
2. Append the finding, validate with `python3 -c "import json;json.load(open('public/localcheck/data/findings.json'))"`.
3. Add a worklog line, commit, push, update the PR, open the preview, screenshot desktop and phone, attach them.

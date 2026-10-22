# localcheck-ui

The LocalCheck docs UI: the status page (`/localcheck/status.html`) and the shared nav that the static `/localcheck/*.html` pages load.

**Components rule:** every component comes from [beui.dev](https://beui.dev) or [shadcn/ui](https://ui.shadcn.com). No hand-coded components. Add with `npx shadcn@latest add <name>` or `npx shadcn@latest add @beui/<name>` (the `@beui` registry is set in `components.json`).

## Data
The page reads `public/localcheck/data/status.json`, `files.json` and `decisions.json` at runtime, and `public/localcheck/agent/*.md` for the Prompts tab. Updating those files updates the page without a rebuild. See `public/localcheck/agent/UPDATE-STATUS-PROMPT.md`.

## Build
```
cd localcheck-ui
npm install
npm run build            # writes public/localcheck/status.html, ui/assets/*, ui/nav.js
npm run build:artifact   # single-file copy with data inlined (dist-artifact/)
```
The built output is committed so Vercel serves it as static files. `src/lib/shiki-shim.ts` is a build alias that keeps beUI's code view from bundling every Shiki language.

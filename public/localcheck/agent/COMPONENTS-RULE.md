# Components rule (hard rule)

All UI in this project uses components from **beui.dev** and **shadcn/ui** only. No hand-coded or free-coded components.

- beui: https://beui.dev/components/motion (install: `npx shadcn@latest add @beui/<name>`, registry `@beui` = `https://beui.dev/r/{name}.json`).
- shadcn: https://ui.shadcn.com/docs/components (install: `npx shadcn@latest add <name>`).
- Code and diffs: shadcn `code-block`, beui `file-diff`.
- Trees, timelines, sortable lists, tabs, accordions, todo lists, numbers: beui.

If you cannot find a matching component, stop and ask before writing one.
Standard for usefulness: live interactive mocks, copyable prompts, and portable markdown handoffs (see PR78-PROMPT.md).

// Build adapter: beUI's agent-code imports the full `shiki` bundle (every language and theme).
// This keeps the same createHighlighter call but loads only the grammars the docs use.
import { createHighlighterCore, type HighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

export type Highlighter = HighlighterCore

const THEMES: Record<string, () => Promise<unknown>> = {
  "github-light-high-contrast": () => import("shiki/themes/github-light-high-contrast.mjs"),
  "github-dark-high-contrast": () => import("shiki/themes/github-dark-high-contrast.mjs"),
}
const LANGS: Record<string, () => Promise<unknown>> = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
}

export function createHighlighter({
  themes,
  langs,
}: {
  themes: string[]
  langs: string[]
}) {
  return createHighlighterCore({
    themes: themes.map((t) => THEMES[t]()) as never,
    langs: langs.map((l) => LANGS[l]()) as never,
    engine: createJavaScriptRegexEngine(),
  })
}

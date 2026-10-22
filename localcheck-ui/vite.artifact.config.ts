import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import { alias } from "./vite.shared.ts"

const site = resolve(import.meta.dirname, "../public/localcheck")
const read = (p: string) => readFileSync(resolve(site, p), "utf8")

// Standalone copy of the status page for the shared project artifact: same app, data inlined.
function inlineData(): Plugin {
  return {
    name: "inline-localcheck-data",
    transformIndexHtml() {
      const status = JSON.parse(read("data/status.json"))
      const prompts: Record<string, string> = {}
      for (const p of status.prompts) prompts[p.file] = read(`agent/${p.file}`)
      const bundle = {
        status,
        worklog: JSON.parse(read("data/worklog.json")),
        files: JSON.parse(read("data/files.json")),
        decisions: JSON.parse(read("data/decisions.json")),
        prompts,
      }
      const json = JSON.stringify(bundle).replace(/</g, "\\u003c")
      return [{ tag: "script", children: `window.__LC__=${json}`, injectTo: "head-prepend" }]
    },
  }
}

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), inlineData(), viteSingleFile()],
  resolve: { alias },
  build: {
    outDir: "dist-artifact",
    emptyOutDir: true,
    rollupOptions: { input: resolve(import.meta.dirname, "status.html") },
  },
})

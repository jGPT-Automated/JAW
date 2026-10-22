import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { alias } from "./vite.shared.ts"

// Builds the shared LocalCheck nav as one script the static pages load.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias },
  define: { "process.env.NODE_ENV": '"production"' },
  build: {
    outDir: "../public/localcheck/ui",
    emptyOutDir: false,
    lib: {
      entry: resolve(import.meta.dirname, "src/nav-entry.tsx"),
      formats: ["es"],
      fileName: () => "nav.js",
    },
    cssCodeSplit: false,
  },
})

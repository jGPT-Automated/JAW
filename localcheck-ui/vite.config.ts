import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { alias } from "./vite.shared.ts"

// Builds the status page into JAW's public/localcheck so Vercel serves it as static files.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias },
  build: {
    outDir: "../public/localcheck",
    emptyOutDir: false,
    assetsDir: "ui/assets",
    rollupOptions: { input: resolve(import.meta.dirname, "status.html") },
  },
})

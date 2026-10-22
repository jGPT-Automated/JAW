import { resolve } from "node:path"

const root = import.meta.dirname

export const alias = [
  { find: /^shiki$/, replacement: resolve(root, "src/lib/shiki-shim.ts") },
  { find: "@", replacement: resolve(root, "src") },
]

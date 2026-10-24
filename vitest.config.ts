import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Hour buckets follow local time; pin it so date tests are deterministic.
    env: { TZ: "UTC" },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});

import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { componentTagger } from "lovable-tagger";

/** Serves the Hono API (server/app.ts) under /api in dev, as Vercel does in production. */
function api(mode: string): Plugin {
  return {
    name: "jaw-api",
    configureServer(server) {
      Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        try {
          const [{ app }, { getRequestListener }] = await Promise.all([
            server.ssrLoadModule("/server/app.ts"),
            import("@hono/node-server"),
          ]);
          await getRequestListener(app.fetch)(req, res);
        } catch (e) {
          next(e);
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), tailwindcss(), api(mode), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

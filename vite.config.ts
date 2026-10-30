import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { execSync } from "child_process";
import { readdirSync } from "fs";
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

/**
 * `virtual:saved-meta`: the last commit for each folder under resources/ (who, when, message),
 * so the Saved page can show when an agent saved work. Empty when git history isn't available.
 */
function savedMeta(): Plugin {
  const id = "virtual:saved-meta";
  return {
    name: "jaw-saved-meta",
    resolveId: (source) => (source === id ? "\0" + id : undefined),
    load(resolved) {
      if (resolved !== "\0" + id) return;
      const meta: Record<string, { author: string; date: string; message: string; commit: string }> = {};
      let folders: string[] = [];
      try {
        folders = readdirSync(path.resolve(__dirname, "resources"), { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name);
      } catch {
        // no resources folder yet
      }
      for (const slug of folders) {
        try {
          const [commit, author, date, message] = execSync(`git log -1 --format=%h%x1f%an%x1f%aI%x1f%s -- resources/${slug}`, { cwd: __dirname })
            .toString()
            .trim()
            .split("\x1f");
          if (commit) meta[slug] = { commit, author, date, message };
        } catch {
          // shallow clone or no git: the page shows the files without commit details
        }
      }
      return `export default ${JSON.stringify(meta)};`;
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
  plugins: [react(), tailwindcss(), api(mode), savedMeta(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

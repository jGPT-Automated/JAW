// Read-only surface any agent with fetch can use: public docs and the skills directory.
// Nothing private is exposed here; docs are public only when marked public.
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { one, q } from "../db.js";
import { listComponents, listLibraries } from "../lib/catalog-store.js";
import { listResources } from "../lib/resources.js";

export const publicApi = new Hono();

publicApi.get("/context", async (c) =>
  c.json({
    docs: await q(`SELECT slug, title, tags, source_url, updated_at FROM docs WHERE public ORDER BY updated_at DESC`),
    skills: await q(`SELECT id, name, source, description, install, url, tags FROM skills ORDER BY name`),
  }),
);

publicApi.get("/docs/:slug", async (c) => {
  const doc = await one(`SELECT slug, title, body, tags, source_url, updated_at FROM docs WHERE public AND slug = $1`, [c.req.param("slug")]);
  if (!doc) throw new HTTPException(404, { message: "Not found" });
  return c.json(doc);
});

/** Every component in the catalog; filter with ?category= and ?q=. */
publicApi.get("/components", async (c) => c.json(await listComponents(c.req.query("category"), c.req.query("q"))));
publicApi.get("/component-libraries", async (c) => c.json(await listLibraries()));

/** The owner's design references and other resources, newest first. ?kind=design */
publicApi.get("/resources", async (c) => c.json(await listResources(c.req.query("kind"))));

/** Uploaded images. Immutable: a file never changes under its id. */
publicApi.get("/files/:id", async (c) => {
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new HTTPException(404, { message: "Not found" });
  const row = await one<{ content_type: string; data: string }>(
    `SELECT content_type, encode(bytes, 'base64') AS data FROM resource_files WHERE id = $1`,
    [id],
  );
  if (!row) throw new HTTPException(404, { message: "Not found" });
  return c.body(Buffer.from(row.data, "base64"), 200, {
    "Content-Type": row.content_type,
    "Cache-Control": "public, max-age=31536000, immutable",
    // SVG uploads must not run script when opened directly.
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    "X-Content-Type-Options": "nosniff",
  });
});

publicApi.get("/skills", async (c) => c.json(await q(`SELECT id, name, source, description, install, url, tags, installed_in_repo FROM skills ORDER BY name`)));

/** Plain-text index for agents, in the spirit of llms.txt. */
publicApi.get("/llms.txt", async (c) => {
  const docs = await q<{ slug: string; title: string }>(`SELECT slug, title FROM docs WHERE public ORDER BY title`);
  const skills = await q<{ id: string; description: string; install: string }>(`SELECT id, description, install FROM skills ORDER BY id`);
  const origin = new URL(c.req.url).origin;
  const lines = [
    "# JAW Hub",
    "",
    "> Shared context and skills for agents working with the JAW Hub. Read-only; private state needs an agent token.",
    "",
    "## Docs",
    ...docs.map((d) => `- [${d.title}](${origin}/api/public/docs/${d.slug})`),
    "",
    "## Skills",
    ...skills.map((s) => `- ${s.id}: ${s.description} Install: \`${s.install}\``),
    "",
    "## Agent API (Authorization: Bearer <inbound token>)",
    `- POST ${origin}/api/agent/inbound  report a reply or event`,
    `- GET  ${origin}/api/agent/memory?q=  recall shared memory`,
    `- POST ${origin}/api/agent/memory  save a memory`,
    `- POST ${origin}/api/agent/delegate  hand a task to another agent`,
    `- POST ${origin}/api/agent/resources  add a design reference {url, collection?, notes?}`,
    `- POST ${origin}/api/agent/component-libraries  add a component library {name, registry_url, namespace?}`,
    `- GET  ${origin}/api/agent/reviews?repo=  the owner's accept / reject calls on pull request files`,
    "",
    "## Read without a token",
    `- ${origin}/skills/index.json  skills, each a markdown file`,
    `- ${origin}/api/public/resources?kind=design  the owner's design references`,
    `- ${origin}/api/public/components?category=&q=  components from every library, by category`,
  ];
  return c.text(lines.join("\n"));
});

// Read-only surface any agent with fetch can use: public docs and the skills directory.
// Nothing private is exposed here; docs are public only when marked public.
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { one, q } from "../db.js";

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
  ];
  return c.text(lines.join("\n"));
});

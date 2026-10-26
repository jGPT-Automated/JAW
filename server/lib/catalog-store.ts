import { HTTPException } from "hono/http-exception";
import { one, q } from "../db.js";
import { fetchText, type Library, readLibrary } from "./components.js";

/** Re-reads one library's registry and replaces its items. Records the error if it fails. */
export async function syncLibrary(slug: string) {
  const lib = await one<Library>(`SELECT slug, name, site_url, registry_url, namespace FROM component_libraries WHERE slug = $1`, [slug]);
  if (!lib) throw new HTTPException(404, { message: "Library not found" });
  try {
    const items = await readLibrary(lib, fetchText);
    await q(`DELETE FROM components WHERE library = $1`, [slug]);
    await q(
      `INSERT INTO components (library, name, title, description, category, docs_url, install)
       SELECT $1, * FROM unnest($2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[])
       ON CONFLICT (library, name) DO NOTHING`,
      [
        slug,
        items.map((i) => i.name),
        items.map((i) => i.title),
        items.map((i) => i.description),
        items.map((i) => i.category),
        items.map((i) => i.docs_url),
        items.map((i) => i.install),
      ],
    );
    return one(
      `UPDATE component_libraries SET synced_at = now(), item_count = $2, sync_error = NULL WHERE slug = $1 RETURNING *`,
      [slug, items.length],
    );
  } catch (e) {
    await q(`UPDATE component_libraries SET sync_error = $2 WHERE slug = $1`, [slug, (e as Error).message]);
    throw new HTTPException(502, { message: `Couldn't read ${lib.name}: ${(e as Error).message}` });
  }
}

export interface NewLibrary {
  name?: string;
  registry_url?: string;
  site_url?: string;
  namespace?: string;
}

/** Adds a library from its registry index URL (e.g. https://example.com/r/registry.json), then syncs it. */
export async function addLibrary(b: NewLibrary, addedBy: string) {
  const name = b.name?.trim();
  let registry: URL;
  try {
    registry = new URL(b.registry_url ?? "");
  } catch {
    throw new HTTPException(400, { message: "registry_url must be a full URL to the registry index (…/r/registry.json)" });
  }
  if (!name || registry.protocol !== "https:") throw new HTTPException(400, { message: "name and an https registry_url are required" });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const site = b.site_url?.trim() || registry.origin;
  const namespace = b.namespace?.trim() ? `@${b.namespace.trim().replace(/^@/, "")}` : null;
  await q(
    `INSERT INTO component_libraries (slug, name, site_url, registry_url, namespace, added_by) VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET name = $2, site_url = $3, registry_url = $4, namespace = $5`,
    [slug, name, site, registry.toString(), namespace, addedBy],
  );
  return syncLibrary(slug);
}

export const listLibraries = () =>
  q(`SELECT slug, name, site_url, registry_url, namespace, added_by, synced_at, item_count, sync_error FROM component_libraries ORDER BY added_at`);

export const listComponents = (category?: string | null, search?: string | null) =>
  q(
    `SELECT c.library, l.name AS library_name, c.name, c.title, c.description, c.category, c.docs_url, c.install
     FROM components c JOIN component_libraries l ON l.slug = c.library
     WHERE ($1::text IS NULL OR c.category = $1)
       AND ($2::text IS NULL OR c.name ILIKE '%' || $2 || '%' OR c.title ILIKE '%' || $2 || '%' OR c.description ILIKE '%' || $2 || '%')
     ORDER BY c.category, c.title`,
    [category || null, search || null],
  );

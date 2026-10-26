// Design references and other resources: added by link (we read the page's preview image),
// by upload (stored in Neon, served from /api/public/files/:id), or by an agent.
import { HTTPException } from "hono/http-exception";
import { one, q } from "../db.js";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // Vercel functions accept ~4.5 MB bodies.
const IMAGE_TYPES = /^image\/(png|jpe?g|gif|webp|avif|svg\+xml)$/;

export interface NewResource {
  url?: string;
  title?: string;
  image_url?: string;
  collection?: string;
  notes?: string;
  kind?: string;
}

function publicHttpsUrl(raw: string) {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new HTTPException(400, { message: "That isn't a full link (https://…)" });
  }
  // Only public https pages: no local hosts or bare IPs.
  if (u.protocol !== "https:" || /^(localhost|\d+\.\d+\.\d+\.\d+|\[.*\])$/i.test(u.hostname) || u.hostname.endsWith(".internal")) {
    throw new HTTPException(400, { message: "Only public https links can be added" });
  }
  return u;
}

const meta = (html: string, key: string) =>
  html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1] ??
  html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`, "i"))?.[1];

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** Title and preview image of a page (Open Graph), or the link itself when it is an image. */
export async function preview(url: URL): Promise<{ title: string | null; image: string | null }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; jaw-hub/1.0)", Accept: "text/html,image/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });
  const type = res.headers.get("content-type") ?? "";
  if (type.startsWith("image/")) return { title: null, image: url.toString() };
  if (!res.ok) throw new Error(`${url.hostname} returned ${res.status}`);
  const html = (await res.text()).slice(0, 400_000);
  const image = meta(html, "og:image") ?? meta(html, "twitter:image");
  const title = meta(html, "og:title") ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? null;
  return { title: title ? decode(title.trim()) : null, image: image ? new URL(decode(image), url).toString() : null };
}

export async function addResource(b: NewResource, addedBy: string) {
  const link = b.url?.trim() ? publicHttpsUrl(b.url.trim()) : null;
  if (!link && !b.image_url) throw new HTTPException(400, { message: "A link or an image is required" });
  let title = b.title?.trim() || null;
  let image = b.image_url?.trim() || null;
  if (link && (!title || !image)) {
    const found = await preview(link).catch(() => ({ title: null, image: null }));
    title ??= found.title;
    image ??= found.image;
  }
  return one(
    `INSERT INTO resources (kind, title, url, image_url, collection, notes, added_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      b.kind?.trim() || "design",
      (title ?? link?.hostname ?? "Untitled").slice(0, 200),
      link?.toString() ?? null,
      image,
      b.collection?.trim() || "Inbox",
      b.notes?.trim() || null,
      addedBy,
    ],
  );
}

export async function storeUpload(file: File) {
  if (!IMAGE_TYPES.test(file.type)) throw new HTTPException(400, { message: "Only images can be uploaded (png, jpg, gif, webp, avif, svg)" });
  if (file.size > MAX_UPLOAD_BYTES) throw new HTTPException(413, { message: "Images up to 4 MB" });
  const bytes = Buffer.from(await file.arrayBuffer());
  const row = await one<{ id: string }>(
    `INSERT INTO resource_files (content_type, size, bytes) VALUES ($1, $2, decode($3, 'base64')) RETURNING id`,
    [file.type, file.size, bytes.toString("base64")],
  );
  return `/api/public/files/${row!.id}`;
}

export const listResources = (kind?: string | null) =>
  q(
    `SELECT id, kind, title, url, image_url, collection, notes, added_by, created_at FROM resources
     WHERE ($1::text IS NULL OR kind = $1) ORDER BY created_at DESC LIMIT 500`,
    [kind || null],
  );

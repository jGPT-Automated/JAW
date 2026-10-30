import meta from "virtual:saved-meta";

/**
 * Work agents saved to JAW: each folder under resources/ is one save. Text files are bundled
 * as-is; ZIPs are served as downloads.
 */
const text = import.meta.glob("/resources/*/**/*.{md,yaml,yml,json,txt}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const downloads = import.meta.glob("/resources/*/**/*.zip", { query: "?url", import: "default", eager: true }) as Record<
  string,
  string
>;

export interface SavedFile {
  /** Path inside the save, e.g. "templates/AGENTS.md". */
  path: string;
  kind: "markdown" | "code" | "download";
  content?: string;
  url?: string;
}

export interface SavedWork {
  slug: string;
  title: string;
  summary: string;
  files: SavedFile[];
  commit?: { author: string; date: string; message: string; commit: string };
}

const split = (full: string) => {
  const [, , slug, ...rest] = full.split("/");
  return { slug, path: rest.join("/") };
};

function build(): SavedWork[] {
  const bySlug = new Map<string, SavedFile[]>();
  const add = (slug: string, file: SavedFile) => bySlug.set(slug, [...(bySlug.get(slug) ?? []), file]);
  for (const [full, content] of Object.entries(text)) {
    const { slug, path } = split(full);
    add(slug, { path, kind: path.endsWith(".md") ? "markdown" : "code", content });
  }
  for (const [full, url] of Object.entries(downloads)) {
    const { slug, path } = split(full);
    add(slug, { path, kind: "download", url });
  }
  return [...bySlug.entries()]
    .map(([slug, files]) => {
      const readme = files.find((f) => f.path.toLowerCase() === "readme.md")?.content ?? "";
      const title = readme.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? slug;
      const summary = readme.replace(/^#.*$/m, "").trim().split(/\n\s*\n/)[0]?.replace(/\s+/g, " ") ?? "";
      return { slug, title, summary, files: files.sort((a, b) => a.path.localeCompare(b.path)), commit: meta[slug] };
    })
    .sort((a, b) => (b.commit?.date ?? "").localeCompare(a.commit?.date ?? ""));
}

export const SAVED: SavedWork[] = build();

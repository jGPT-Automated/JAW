// Component catalog: every item from each shadcn-compatible registry, sorted into one set
// of categories so similar components from different libraries sit side by side.

export const CATEGORIES = [
  "AI & agents",
  "Buttons",
  "Inputs & forms",
  "Navigation",
  "Cards",
  "Overlays & feedback",
  "Backgrounds & shaders",
  "Text & motion",
  "Charts & data",
  "Media",
  "Layout",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

// Sections a library's own docs use, mapped onto the shared categories.
const SECTION: Record<string, Category> = {
  ai: "AI & agents",
  agents: "AI & agents",
  buttons: "Buttons",
  inputs: "Inputs & forms",
  forms: "Inputs & forms",
  navigation: "Navigation",
  cards: "Cards",
  backgrounds: "Backgrounds & shaders",
  texts: "Text & motion",
  text: "Text & motion",
  charts: "Charts & data",
  media: "Media",
};

// Checked in order; the first match wins.
const RULES: [Category, RegExp][] = [
  ["AI & agents", /^(ai|agent)-|prompt|chat|message|reasoning|streaming|tool-(approval|result)|citation|thinking|voice-orb|image-generation|approval|composer|instructions/],
  ["Charts & data", /chart|table|heatmap|heat-calendar|treemap|gauge|spending-ring|status-bar|uptime|sankey|funnel|order-book|metric|terrain|returns-calendar|volume-profile|liquidity|candlestick|bracket|tally|poll|vote/],
  ["Backgrounds & shaders", /background|^bg-|shader|glass|dither|caustics|topo|halftone|texture|beam|fractal|globe|^hero-|flow-field|dot-field|circuit|grid|guides|bands|lens|illustration|fluted|edge-blur/],
  ["Text & motion", /text|heading|type-?writer|glitch|scramble|shimmer|reveal|number|ticker|digit|marquee|split-flap|word|paragraph|letter|swoosh|cradle|plucked|marker|squiggle|animate$/],
  ["Buttons", /button|-btn|hold-action|slide-to-confirm|pull-cord|attract/],
  ["Inputs & forms", /input|field|select|picker|slider|checkbox|radio|switch|otp|combobox|form|textarea|upload|dropzone|search|signature|dial|amount-pad|toggle|label|calendar|keyboard|color/],
  ["Navigation", /nav|tabs|sidebar|menu|breadcrumb|dock|pagination|command|scroll-index|toolbar|stepper|segmented|island|scroll-to|smooth-scroll/],
  ["Overlays & feedback", /dialog|modal|drawer|sheet|popover|tooltip|toast|notification|alert|sonner|hover-card|dropdown|progress|loader|skeleton|spinner|not-found|feedback|empty|panel/],
  ["Cards", /card|bento|pass|receipt|tile|wallet/],
  ["Media", /image|video|player|carousel|lightbox|gallery|photo|masonry|avatar|clip|contact-sheet|page-flip|file-icons|mac-screen|iphone|watch|display|browser-window/],
  ["Layout", /badge|eyebrow|kbd|^item$|code-block|bubble|attachment|accordion|collapsible|separator|resizable|aspect-ratio|scroll-area|sortable|kanban|list|timeline|expandable|disclosure|stack|folder|tree|layout|section|onboarding|wizard|parallax/],
];

export function categorize(name: string, docsUrl: string | null): Category {
  if (docsUrl) {
    for (const segment of new URL(docsUrl).pathname.split("/").slice(0, -1)) {
      if (SECTION[segment]) return SECTION[segment];
    }
  }
  return RULES.find(([, re]) => re.test(name))?.[0] ?? "Other";
}

/** Last path segment → docs URL, preferring pages under /docs or /components. */
export function docsIndex(sitemapXml: string): Map<string, string> {
  const map = new Map<string, string>();
  const score = (u: string) => (/\/(docs|components|charts)\//.test(u) ? 2 : 0) + (/\/radix\//.test(u) ? 1 : 0);
  for (const m of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = m[1].trim();
    const name = url.replace(/\/$/, "").split("/").pop();
    if (!name) continue;
    const prev = map.get(name);
    if (!prev || score(url) > score(prev)) map.set(name, url);
  }
  return map;
}

export interface Library {
  slug: string;
  name: string;
  site_url: string;
  registry_url: string;
  namespace: string | null;
}

export interface CatalogItem {
  name: string;
  title: string;
  description: string | null;
  category: Category;
  docs_url: string | null;
  install: string;
}

const KEEP = new Set(["registry:ui", "registry:component", "registry:block"]);

function installCommand(lib: Library, name: string) {
  if (new URL(lib.registry_url).host === "ui.shadcn.com") return `npx shadcn@latest add ${name}`;
  if (lib.namespace) return `npx shadcn@latest add ${lib.namespace}/${name}`;
  return `npx shadcn@latest add ${lib.registry_url.replace(/[^/]+\.json$/, `${name}.json`)}`;
}

const titleCase = (name: string) => name.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** Reads a registry index (and the site's sitemap for docs links) into catalog items. */
export async function readLibrary(lib: Library, get: (url: string) => Promise<string>): Promise<CatalogItem[]> {
  const index = JSON.parse(await get(lib.registry_url)) as
    | { items: { name: string; type: string; title?: string; description?: string }[] }
    | { name: string; type: string; title?: string; description?: string }[];
  const items = Array.isArray(index) ? index : index.items;
  const docs = await get(new URL("/sitemap.xml", lib.site_url).toString())
    .then(docsIndex)
    .catch(() => new Map<string, string>());
  return items
    .filter((i) => KEEP.has(i.type) && !/-demo$|^use-|^utils$/.test(i.name))
    .map((i) => {
      const docsUrl = docs.get(i.name) ?? null;
      return {
        name: i.name,
        title: i.title || titleCase(i.name),
        description: i.description || null,
        category: categorize(i.name, docsUrl),
        docs_url: docsUrl,
        install: installCommand(lib, i.name),
      };
    });
}

export async function fetchText(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": "jaw-hub" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.text();
}

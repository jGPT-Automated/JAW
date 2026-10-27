// GitHub account snapshots: profile, repos, recent public events, the contribution
// calendar and open pull requests. Everything here is public data; GITHUB_TOKEN (optional)
// only raises the rate limit.

export interface RepoSummary {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export interface EventSummary {
  id: string;
  type: string;
  repo: string;
  text: string;
  url: string;
  created_at: string;
}

export interface PullSummary {
  repo: string;
  number: number;
  title: string;
  url: string;
  draft: boolean;
  updated_at: string;
}

export interface GitHubSnapshot {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  repos: RepoSummary[];
  languages: { name: string; repos: number }[];
  events: EventSummary[];
  /** Contributions per day, oldest first, ending on `calendar_end`. */
  calendar: number[];
  calendar_end: string | null;
  contributions_last_year: number;
  open_prs: PullSummary[];
}

export type FetchText = (url: string) => Promise<string>;

const API = "https://api.github.com";

/** Direct fetch with GitHub's headers; throws with GitHub's message on failure. */
async function directFetch(url: string) {
  const headers: Record<string, string> = { "User-Agent": "jaw-hub", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN && url.startsWith(API)) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
  const text = await res.text();
  if (!res.ok) {
    let message = `${res.status}`;
    try {
      message = JSON.parse(text).message ?? message;
    } catch {
      // Not JSON (the calendar is HTML).
    }
    throw new Error(`GitHub ${new URL(url).pathname}: ${message}`);
  }
  return text;
}

/** The same public URL fetched through Firecrawl, raw. Retries once when Firecrawl is busy. */
export async function firecrawlFetch(url: string, key: string, attempt = 0): Promise<string> {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, formats: ["rawHtml"], onlyMainContent: false, maxAge: 0 }),
    signal: AbortSignal.timeout(30_000),
  });
  if (res.status === 429 && attempt === 0) {
    await new Promise((r) => setTimeout(r, 2500));
    return firecrawlFetch(url, key, 1);
  }
  const body = (await res.json().catch(() => ({}))) as { data?: { rawHtml?: string; metadata?: { statusCode?: number } }; error?: string };
  const status = body.data?.metadata?.statusCode;
  if (!res.ok || !body.data?.rawHtml || (status && status >= 400)) {
    throw new Error(`Firecrawl ${new URL(url).pathname}: ${body.error ?? status ?? res.status}`);
  }
  return body.data.rawHtml;
}

/**
 * GitHub first; if GitHub refuses (rate limit, block, outage) and FIRECRAWL_API_KEY is set,
 * the same public URL through Firecrawl.
 */
export const githubFetch: FetchText = async (url) => {
  try {
    return await directFetch(url);
  } catch (e) {
    const key = process.env.FIRECRAWL_API_KEY || process.env.FIRECRAWL_KEY;
    if (!key) throw e;
    try {
      return await firecrawlFetch(url, key);
    } catch (fallback) {
      throw new Error(`${(e as Error).message}; ${(fallback as Error).message}`);
    }
  }
};

const MONTH_DAY = /(\d+|No) contributions? on/;

/** Reads the public contribution calendar HTML: each day cell plus its tooltip count. */
export function parseCalendar(html: string): { counts: number[]; end: string | null; total: number } {
  const dates = new Map<string, string>();
  for (const m of html.matchAll(/<td[^>]*?data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="([^"]+)"/g)) dates.set(m[2], m[1]);
  for (const m of html.matchAll(/<td[^>]*?id="([^"]+)"[^>]*?data-date="(\d{4}-\d{2}-\d{2})"/g)) dates.set(m[1], m[2]);
  const byDate = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*?for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const date = dates.get(m[1]);
    const n = m[2].match(MONTH_DAY);
    if (date && n) byDate.set(date, n[1] === "No" ? 0 : Number(n[1]));
  }
  for (const date of dates.values()) if (!byDate.has(date)) byDate.set(date, 0);
  const days = [...byDate.keys()].sort();
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
  const counts = days.map((d) => byDate.get(d) ?? 0);
  return {
    counts,
    end: days.at(-1) ?? null,
    total: totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : counts.reduce((a, b) => a + b, 0),
  };
}

type RawEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

/** One line per public event, in the owner's terms. */
export function summarizeEvent(e: RawEvent): EventSummary {
  const repo = e.repo.name;
  const p = e.payload ?? {};
  const base = `https://github.com/${repo}`;
  let text = e.type.replace(/Event$/, "");
  let url = base;
  switch (e.type) {
    case "PushEvent": {
      const n = p.size ?? p.commits?.length ?? p.distinct_size;
      const branch = String(p.ref ?? "").replace("refs/heads/", "");
      text = n ? `Pushed ${n} commit${n === 1 ? "" : "s"} to ${branch}` : `Pushed to ${branch}`;
      if (p.head) url = `${base}/commit/${p.head}`;
      break;
    }
    case "PullRequestEvent":
      text = `${p.action === "closed" && p.pull_request?.merged ? "Merged" : cap(p.action)} PR #${p.number ?? p.pull_request?.number}${p.pull_request?.title ? `: ${p.pull_request.title}` : ""}`;
      url = p.pull_request?.html_url ?? url;
      break;
    case "PullRequestReviewEvent":
      text = `Reviewed PR #${p.pull_request?.number}`;
      url = p.review?.html_url ?? p.pull_request?.html_url ?? url;
      break;
    case "IssuesEvent":
      text = `${cap(p.action)} issue #${p.issue?.number}: ${p.issue?.title ?? ""}`.trim();
      url = p.issue?.html_url ?? url;
      break;
    case "IssueCommentEvent":
      text = `Commented on #${p.issue?.number}`;
      url = p.comment?.html_url ?? url;
      break;
    case "CreateEvent":
      text = p.ref_type === "repository" ? "Created the repository" : `Created ${p.ref_type} ${p.ref}`;
      break;
    case "DeleteEvent":
      text = `Deleted ${p.ref_type} ${p.ref}`;
      break;
    case "WatchEvent":
      text = "Starred";
      break;
    case "ForkEvent":
      text = "Forked";
      url = p.forkee?.html_url ?? url;
      break;
    case "ReleaseEvent":
      text = `Released ${p.release?.tag_name ?? ""}`.trim();
      url = p.release?.html_url ?? url;
      break;
  }
  return { id: e.id, type: e.type, repo, text, url, created_at: e.created_at };
}

const cap = (s?: string) => (s ? s[0].toUpperCase() + s.slice(1) : "Updated");

export async function buildSnapshot(login: string, get: FetchText = githubFetch): Promise<GitHubSnapshot> {
  const json = async <T>(path: string) => JSON.parse(await get(`${API}${path}`)) as T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await json<any>(`/users/${login}`);
  const isOrg = user.type === "Organization";
  const [repos, events, prs, calendarHtml] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json<any[]>(isOrg ? `/orgs/${user.login}/repos?sort=pushed&per_page=100` : `/users/${user.login}/repos?sort=pushed&per_page=100&type=owner`),
    json<RawEvent[]>(isOrg ? `/orgs/${user.login}/events?per_page=100` : `/users/${user.login}/events/public?per_page=100`).catch(() => []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json<{ items: any[] }>(`/search/issues?q=${encodeURIComponent(`is:pr is:open ${isOrg ? "org" : "author"}:${user.login}`)}&sort=updated&per_page=20`).catch(() => ({ items: [] })),
    isOrg ? Promise.resolve("") : get(`https://github.com/users/${user.login}/contributions`).catch(() => ""),
  ]);

  const repoList: RepoSummary[] = repos.map((r) => ({
    name: r.name,
    full_name: r.full_name,
    description: r.description,
    html_url: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    pushed_at: r.pushed_at,
    fork: r.fork,
    archived: r.archived,
  }));
  const langs = new Map<string, number>();
  for (const r of repoList) if (r.language && !r.fork) langs.set(r.language, (langs.get(r.language) ?? 0) + 1);
  const cal = calendarHtml ? parseCalendar(calendarHtml) : { counts: [], end: null, total: 0 };

  return {
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
    html_url: user.html_url,
    bio: user.bio,
    location: user.location,
    blog: user.blog || null,
    followers: user.followers,
    following: user.following,
    public_repos: user.public_repos,
    created_at: user.created_at,
    repos: repoList,
    languages: [...langs].map(([name, n]) => ({ name, repos: n })).sort((a, b) => b.repos - a.repos),
    events: events.slice(0, 40).map(summarizeEvent),
    calendar: cal.counts,
    calendar_end: cal.end,
    contributions_last_year: cal.total,
    open_prs: prs.items.map((i) => ({
      repo: String(i.repository_url).replace(`${API}/repos/`, ""),
      number: i.number,
      title: i.title,
      url: i.html_url,
      draft: !!i.draft,
      updated_at: i.updated_at,
    })),
  };
}

export interface DiffLine {
  type: "add" | "remove" | "context";
  text: string;
}
export interface FileChange {
  path: string;
  hunks: { start: number; lines: DiffLine[] }[];
  created?: boolean;
}

const MAX_LINES_PER_FILE = 400;

/** Unified diff patch (as in GitHub's PR files API) to hunks. */
export function parsePatch(patch: string): FileChange["hunks"] {
  const hunks: FileChange["hunks"] = [];
  let count = 0;
  for (const line of patch.split("\n")) {
    const header = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (header) {
      hunks.push({ start: Number(header[1]), lines: [] });
      continue;
    }
    const hunk = hunks.at(-1);
    if (!hunk || line.startsWith("\\") || count >= MAX_LINES_PER_FILE) continue;
    const type = line[0] === "+" ? "add" : line[0] === "-" ? "remove" : "context";
    hunk.lines.push({ type, text: line.slice(1) });
    count++;
  }
  return hunks;
}

export async function pullFiles(repo: string, number: number, get: FetchText = githubFetch): Promise<FileChange[]> {
  const files = JSON.parse(await get(`${API}/repos/${repo}/pulls/${number}/files?per_page=50`)) as {
    filename: string;
    status: string;
    patch?: string;
  }[];
  return files.map((f) => ({
    path: f.filename,
    created: f.status === "added",
    hunks: f.patch ? parsePatch(f.patch) : [{ start: 1, lines: [{ type: "context", text: "(binary or too large to show)" }] }],
  }));
}

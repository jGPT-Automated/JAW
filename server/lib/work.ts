// Projects, tasks and Jesse's standing instructions for JAW. Shared by the web app, the voice
// tools (Gemini and the LiveKit agent) and phone calls, so every surface sees the same list.
import { one, q } from "../db.js";

export const TASK_STATUSES = ["todo", "doing", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Project {
  id: string;
  name: string;
  summary: string | null;
  repo: string | null;
  status: string;
  open_tasks: number;
  done_tasks: number;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string | null;
  project_name: string | null;
  title: string;
  notes: string | null;
  status: TaskStatus;
  source: string;
  created_at: string;
  updated_at: string;
  done_at: string | null;
}

const REPO_RE = /^[\w.-]+\/[\w.-]+$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** "github.com/owner/repo", a full URL or "owner/repo" → "owner/repo", or null. */
export function normalizeRepo(v: unknown): string | null {
  const s = clean(v, 200)
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/\.git$/, "")
    .replace(/\/+$/, "");
  return REPO_RE.test(s) ? s : null;
}

export async function listProjects(includeDone = false) {
  return q<Project>(
    `SELECT p.id, p.name, p.summary, p.repo, p.status, p.updated_at,
            count(t.id) FILTER (WHERE t.status <> 'done')::int AS open_tasks,
            count(t.id) FILTER (WHERE t.status = 'done')::int AS done_tasks
     FROM projects p LEFT JOIN tasks t ON t.project_id = p.id
     WHERE $1 OR p.status <> 'done'
     GROUP BY p.id ORDER BY (p.status = 'active') DESC, p.updated_at DESC`,
    [includeDone],
  );
}

export async function getProject(id: string) {
  return one<Project>(
    `SELECT p.id, p.name, p.summary, p.repo, p.status, p.updated_at,
            count(t.id) FILTER (WHERE t.status <> 'done')::int AS open_tasks,
            count(t.id) FILTER (WHERE t.status = 'done')::int AS done_tasks
     FROM projects p LEFT JOIN tasks t ON t.project_id = p.id WHERE p.id = $1 GROUP BY p.id`,
    [id],
  );
}

export async function addProject(input: { name?: unknown; summary?: unknown; repo?: unknown }) {
  const name = clean(input.name, 120);
  if (!name) throw new Error("A project needs a name.");
  return one<{ id: string; name: string }>(
    `INSERT INTO projects (name, summary, repo) VALUES ($1, $2, $3)
     ON CONFLICT (lower(name)) DO UPDATE SET summary = coalesce(EXCLUDED.summary, projects.summary),
       repo = coalesce(EXCLUDED.repo, projects.repo), status = 'active', updated_at = now()
     RETURNING id, name`,
    [name, clean(input.summary, 2000) || null, normalizeRepo(input.repo)],
  );
}

export async function updateProject(id: string, input: { name?: unknown; summary?: unknown; repo?: unknown; status?: unknown }) {
  const status = ["active", "paused", "done"].includes(String(input.status)) ? String(input.status) : null;
  return one<{ id: string }>(
    `UPDATE projects SET name = coalesce($2, name), summary = coalesce($3, summary),
       repo = CASE WHEN $4::text = '' THEN NULL ELSE coalesce($4, repo) END,
       status = coalesce($5, status), updated_at = now()
     WHERE id = $1 RETURNING id`,
    [
      id,
      clean(input.name, 120) || null,
      input.summary === undefined ? null : clean(input.summary, 2000),
      input.repo === undefined ? null : input.repo === "" ? "" : normalizeRepo(input.repo),
      status,
    ],
  );
}

/** Finds a project by id or (loosely) by name, for tools that speak in names. */
export async function findProject(ref: unknown) {
  const s = clean(ref, 120);
  if (!s) return null;
  return one<{ id: string; name: string }>(
    `SELECT id, name FROM projects
     WHERE id::text = $1 OR lower(name) = lower($1) OR lower(name) LIKE '%' || lower($1) || '%'
     ORDER BY (lower(name) = lower($1)) DESC, (status = 'active') DESC, updated_at DESC LIMIT 1`,
    [s],
  );
}

export async function listTasks(filter: { project_id?: string | null; inbox?: boolean; open?: boolean; limit?: number } = {}) {
  return q<Task>(
    `SELECT t.id, t.project_id, p.name AS project_name, t.title, t.notes, t.status, t.source,
            t.created_at, t.updated_at, t.done_at
     FROM tasks t LEFT JOIN projects p ON p.id = t.project_id
     WHERE ($1::uuid IS NULL OR t.project_id = $1) AND (NOT $2 OR t.project_id IS NULL)
       AND (NOT $3 OR t.status <> 'done')
     ORDER BY (t.status = 'done'), (t.status = 'doing') DESC, t.created_at DESC LIMIT $4`,
    [filter.project_id ?? null, !!filter.inbox, !!filter.open, filter.limit ?? 300],
  );
}

export async function addTask(input: { project_id?: string | null; title?: unknown; notes?: unknown; source?: string }) {
  const title = clean(input.title, 300);
  if (!title) throw new Error("A task needs a title.");
  const row = await one<{ id: string }>(
    `INSERT INTO tasks (project_id, title, notes, source) VALUES ($1, $2, $3, $4) RETURNING id`,
    [input.project_id ?? null, title, clean(input.notes, 4000) || null, input.source ?? "ui"],
  );
  if (input.project_id) await q(`UPDATE projects SET updated_at = now() WHERE id = $1`, [input.project_id]);
  return row!;
}

export async function updateTask(id: string, input: { title?: unknown; notes?: unknown; status?: unknown; project_id?: string | null }) {
  const status = TASK_STATUSES.includes(input.status as TaskStatus) ? String(input.status) : null;
  const row = await one<{ id: string; project_id: string | null }>(
    `UPDATE tasks SET title = coalesce($2, title), notes = coalesce($3, notes), status = coalesce($4, status),
       project_id = CASE WHEN $6 THEN $5::uuid ELSE project_id END,
       done_at = CASE WHEN coalesce($4, status) = 'done' THEN coalesce(done_at, now()) ELSE NULL END,
       updated_at = now()
     WHERE id = $1 RETURNING id, project_id`,
    [id, clean(input.title, 300) || null, input.notes === undefined ? null : clean(input.notes, 4000), status, input.project_id ?? null, input.project_id !== undefined],
  );
  if (row?.project_id) await q(`UPDATE projects SET updated_at = now() WHERE id = $1`, [row.project_id]);
  return row;
}

export async function deleteTask(id: string) {
  return one<{ id: string }>(`DELETE FROM tasks WHERE id = $1 RETURNING id`, [id]);
}

/** Finds an open task by id or by words in its title, optionally within a project. */
export async function findTask(ref: unknown, projectId?: string | null) {
  const s = clean(ref, 300);
  if (!s) return null;
  return one<{ id: string; title: string; status: string }>(
    `SELECT id, title, status FROM tasks
     WHERE ($2::uuid IS NULL OR project_id = $2)
       AND (id::text = $1 OR lower(title) = lower($1) OR lower(title) LIKE '%' || lower($1) || '%')
     ORDER BY (lower(title) = lower($1)) DESC, (status = 'done'), updated_at DESC LIMIT 1`,
    [s, projectId ?? null],
  );
}

// Jesse's standing instructions: added to every voice and phone conversation, editable on the
// Instructions page and, with his go-ahead, by JAW itself.
const INSTRUCTIONS_KEY = "jaw_instructions";

export async function getInstructions() {
  const row = await one<{ value: string; updated_at: string }>(`SELECT value, updated_at FROM settings WHERE key = $1`, [INSTRUCTIONS_KEY]);
  return { text: row?.value ?? "", updated_at: row?.updated_at ?? null };
}

export async function setInstructions(text: unknown) {
  const value = clean(text, 8000);
  await q(
    `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [INSTRUCTIONS_KEY, value],
  );
  return { text: value };
}

/** Active projects and their open tasks, compact enough to sit in a voice prompt. */
export async function briefing(maxChars = 2500) {
  const [projects, tasks] = await Promise.all([listProjects(), listTasks({ open: true, limit: 80 })]);
  if (!projects.length && !tasks.length) return "No projects or open tasks yet.";
  const lines: string[] = [];
  for (const p of projects.filter((p) => p.status === "active")) {
    lines.push(`Project: ${p.name}${p.summary ? ` (${p.summary.replace(/\s+/g, " ").slice(0, 160)})` : ""}`);
    for (const t of tasks.filter((t) => t.project_id === p.id).slice(0, 8)) lines.push(`  - [${t.status}] ${t.title}`);
  }
  const inbox = tasks.filter((t) => !t.project_id).slice(0, 8);
  if (inbox.length) {
    lines.push("Inbox (no project):");
    for (const t of inbox) lines.push(`  - [${t.status}] ${t.title}`);
  }
  const text = lines.join("\n");
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text;
}

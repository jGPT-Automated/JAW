export type StepStatus = "verified" | "belief" | "open" | "needs-you"

export interface Step {
  text: string
  status: StepStatus
  note?: string
}
export interface Pr {
  title: string
  url: string
  state: string
  evidence?: string
}
export interface Track {
  id: string
  name: string
  repo: string
  state: string
  steps: Step[]
  prs: Pr[]
}
export interface Status {
  updated: string
  summary: string
  legend: Record<string, string>
  tracks: Track[]
  needs_you: Step[]
  priorities: { id: string; title: string; detail: string; track: string }[]
  prompts: { id: string; title: string; file: string; summary: string }[]
  log: { date: string; text: string }[]
}
export interface DiffLine {
  id: string
  type?: "added" | "removed" | "context"
  content: string
}
export interface FileEntry {
  path: string
  status: string
  adds: number
  dels: number
  role: string
  lines: DiffLine[] | null
}
export interface Files {
  repo: string
  pr: number
  source: string
  files: FileEntry[]
}
export interface Decision {
  id: string
  priority: string
  area: string
  locked_request: string
  status: string
  current: string
  acceptance: string
  evidence?: string
}
export interface Decisions {
  version: string
  historical_audit_decisions: Decision[]
}
export interface Bundle {
  status: Status
  files: Files
  decisions: Decisions
  prompts: Record<string, string>
}

declare global {
  interface Window {
    __LC__?: Bundle
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export async function loadBundle(): Promise<Bundle> {
  if (window.__LC__) return window.__LC__
  const [status, files, decisions] = await Promise.all([
    getJson<Status>("data/status.json"),
    getJson<Files>("data/files.json"),
    getJson<Decisions>("data/decisions.json"),
  ])
  const prompts: Record<string, string> = {}
  await Promise.all(
    status.prompts.map(async (p) => {
      const res = await fetch(`agent/${p.file}`)
      prompts[p.file] = res.ok ? await res.text() : `Could not load agent/${p.file}`
    })
  )
  return { status, files, decisions, prompts }
}

export const REPO_URL = "https://github.com/jGPT-Automated/LocalCheck_Expo"

const SITE = "https://www.modernweb.store/localcheck/"

/** Relative on the site; absolute when the page is the standalone shared artifact. */
export function siteUrl(path: string) {
  return window.__LC__ ? SITE + path : path
}

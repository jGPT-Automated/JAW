import type { DiffLine } from "@/lc/data"

export type FindingStatus =
  | "proposed"
  | "under-review"
  | "approved"
  | "rejected"
  | "shipped"
export type Severity = "high" | "medium" | "low" | "info"

export interface Evidence {
  kind: "file" | "command" | "screenshot" | "grep"
  ref: string
  text: string
  basis: "verified" | "belief"
  url?: string
}
export interface Screenshot {
  url: string
  caption: string
  /** Mobile viewport of the Vercel preview, e.g. "393x852". */
  viewport: string
  /** true when the image has arrows, boxes or labels pointing at the problem. */
  annotated: boolean
}
export interface DocRef {
  label: string
  url: string
  /** The line of the official doc that supports the finding. */
  quote: string
}

export function missing(f: Finding): string[] {
  const out: string[] = []
  const shots = f.screenshots ?? []
  if (!shots.some((s) => s.annotated && /^\d+x\d+$/.test(s.viewport) && Number(s.viewport.split("x")[0]) <= 430))
    out.push("an annotated mobile-viewport screenshot (about 393x852) from the Vercel preview")
  if (!(f.docs ?? []).some((d) => d.url && d.quote.trim()))
    out.push("a link to official documentation with the supporting line quoted")
  return out
}

export interface Finding {
  id: string
  title: string
  area: string
  severity: Severity
  status: FindingStatus
  updated: string
  evidence: Evidence[]
  screenshots?: Screenshot[]
  docs?: DocRef[]
  cause: string
  fix: {
    summary: string
    diff: { file: string; lines: DiffLine[] } | null
  }
  risk: string
  verify: string
  pr?: { label: string; url: string }
  previews: { label: string; url: string }[]
}
export interface FindingsData {
  note: string
  updated: string
  findings: Finding[]
}

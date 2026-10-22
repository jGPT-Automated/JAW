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
export interface Finding {
  id: string
  title: string
  area: string
  severity: Severity
  status: FindingStatus
  updated: string
  evidence: Evidence[]
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

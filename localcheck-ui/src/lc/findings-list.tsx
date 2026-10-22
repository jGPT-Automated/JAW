import { useMemo, useState } from "react"
import { ExternalLink } from "lucide-react"

import { FileDiff } from "@/components/agents/file-diff"
import { BouncyAccordion } from "@/components/motion/bouncy-accordion"
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Finding, FindingStatus, Severity } from "@/lc/findings-data"

type Variant = "default" | "secondary" | "outline" | "destructive"

const STATUS: Record<FindingStatus, { label: string; variant: Variant }> = {
  proposed: { label: "Proposed", variant: "secondary" },
  "under-review": { label: "Under review", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  shipped: { label: "Shipped", variant: "default" },
}
const SEVERITY: Record<Severity, { label: string; variant: Variant }> = {
  high: { label: "High", variant: "destructive" },
  medium: { label: "Medium", variant: "secondary" },
  low: { label: "Low", variant: "outline" },
  info: { label: "Info", variant: "outline" },
}
const FILTERS = [
  "all",
  "proposed",
  "under-review",
  "approved",
  "rejected",
  "shipped",
] as const

function LinkButton({ href, children }: { href: string; children: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-auto max-w-full py-1.5 whitespace-normal"
      asChild
    >
      <a href={href} target="_blank" rel="noreferrer">
        {children}
        <ExternalLink />
      </a>
    </Button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <span className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </span>
      <span>{children}</span>
    </span>
  )
}

function Detail({ f }: { f: Finding }) {
  const links = [...(f.pr ? [f.pr] : []), ...f.previews]
  return (
    <span className="flex flex-col gap-4 py-2 text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Basis</TableHead>
            <TableHead>Evidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {f.evidence.map((e) => (
            <TableRow key={e.ref + e.text}>
              <TableCell className="align-top">
                <Badge variant={e.basis === "verified" ? "default" : "secondary"}>
                  {e.basis === "verified" ? "Verified" : "Belief"}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-normal">
                <span className="block font-mono text-xs break-all">
                  {e.kind}: {e.ref}
                </span>
                <span className="block">
                  {e.text}
                  {e.url && (
                    <>
                      {" "}
                      <a
                        className="underline underline-offset-2"
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        open
                      </a>
                    </>
                  )}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Section title="Root cause">{f.cause}</Section>
      <Section title="Proposed fix">{f.fix.summary}</Section>
      {f.fix.diff && (
        <FileDiff
          file={f.fix.diff.file}
          lines={f.fix.diff.lines.map((l, i) => ({
            ...l,
            oldLine: l.type === "added" ? undefined : i + 1,
            newLine: l.type === "removed" ? undefined : i + 1,
          }))}
          status="complete"
          collapseOnComplete={false}
          maxHeight={220}
          language="typescript"
          copyText={f.fix.diff.lines.map((l) => l.content).join("\n")}
        />
      )}
      <Section title="Risk">{f.risk}</Section>
      <Section title="How to verify on a device">{f.verify}</Section>
      {links.length > 0 && (
        <span className="flex flex-wrap gap-2">
          {links.map((l) => (
            <LinkButton key={l.url} href={l.url}>
              {l.label}
            </LinkButton>
          ))}
        </span>
      )}
    </span>
  )
}

export function FindingsList({ findings }: { findings: Finding[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all")
  const shown = useMemo(
    () => findings.filter((f) => filter === "all" || f.status === filter),
    [findings, filter]
  )
  const count = (s: (typeof FILTERS)[number]) =>
    s === "all" ? findings.length : findings.filter((f) => f.status === s).length

  const items = shown.map((f) => ({
    id: f.id,
    title: (
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{f.id}</span>
          <Badge variant="outline">{f.area}</Badge>
          <Badge variant={SEVERITY[f.severity].variant}>
            {SEVERITY[f.severity].label}
          </Badge>
          <Badge variant={STATUS[f.status].variant}>
            {STATUS[f.status].label}
          </Badge>
        </span>
        <span className="font-medium break-words">{f.title}</span>
      </span>
    ),
    description: <Detail f={f} />,
  }))

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Tabs
        variant="segment"
        className="min-w-0"
        value={filter}
        onValueChange={(v) => setFilter(v as (typeof FILTERS)[number])}
      >
        <TabsList aria-label="Filter by status" wrapperClassName="max-w-full">
          {FILTERS.map((s) => (
            <TabsTrigger key={s} value={s}>
              {s === "all" ? "All" : STATUS[s].label} {count(s)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {items.length ? (
        <BouncyAccordion
          key={filter}
          items={items}
          collapsible
          classNames={{ title: "overflow-visible text-clip whitespace-normal" }}
          defaultValue={items[0].id}
        />
      ) : (
        <p className="text-sm text-muted-foreground">Nothing in this state.</p>
      )}
    </div>
  )
}

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
import { siteUrl, type WorkEntry, type Worklog } from "@/lc/data"

const STATE: Record<
  WorkEntry["state"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  open: { label: "PR open", variant: "secondary" },
  "ci-green": { label: "CI green", variant: "default" },
  blocked: { label: "Blocker", variant: "destructive" },
  info: { label: "Update", variant: "outline" },
  "in-progress": { label: "In progress", variant: "secondary" },
  replaced: { label: "Replaced", variant: "outline" },
  done: { label: "Done", variant: "default" },
}

const stateBadge = (state: string) =>
  STATE[state as WorkEntry["state"]] ?? { label: state, variant: "outline" as const }

const FILTERS = ["All", "Expo UI", "App Store", "Docs"] as const

function when(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getUTCHours()).padStart(2, "0")
  const mm = String(d.getUTCMinutes()).padStart(2, "0")
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${hh}:${mm} UTC`
}

function LinkButton({ href, children }: { href: string; children: string }) {
  return (
    <Button variant="outline" size="sm" className="h-auto max-w-full py-1.5 whitespace-normal" asChild>
      <a href={href.startsWith("/") ? siteUrl(href) : href} target="_blank" rel="noreferrer">
        {children}
        <ExternalLink />
      </a>
    </Button>
  )
}

function Detail({ e }: { e: WorkEntry }) {
  const links = [
    ...(e.pr ? [e.pr] : []),
    ...(e.previews ?? []),
    ...(e.links ?? []),
  ]
  return (
    <span className="flex flex-col gap-4 py-2 text-sm">
      <span>{e.summary}</span>
      <span>
        <b>Why:</b> {e.why}
      </span>
      <span className="text-xs text-muted-foreground">{e.basis}</span>
      {links.length > 0 && (
        <span className="flex flex-wrap gap-2">
          {links.map((l) => (
            <LinkButton key={l.url} href={l.url}>
              {l.label}
            </LinkButton>
          ))}
        </span>
      )}
      {e.files && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead className="w-28">Change</TableHead>
              <TableHead>What changed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {e.files.map((f) => (
              <TableRow key={f.path}>
                <TableCell className="font-mono text-xs break-all whitespace-normal">
                  {f.path}
                </TableCell>
                <TableCell className="font-mono text-xs tabular-nums">
                  +{f.adds} −{f.dels}
                </TableCell>
                <TableCell className="whitespace-normal">{f.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {e.excerpt && (
        <FileDiff
          file={e.excerpt.file}
          lines={e.excerpt.lines.map((l, i) => ({
            ...l,
            oldLine: l.type === "added" ? undefined : i + 1,
            newLine: l.type === "removed" ? undefined : i + 1,
          }))}
          status="complete"
          collapseOnComplete={false}
          maxHeight={220}
          language={e.excerpt.file.endsWith(".json") ? "json" : "typescript"}
          copyText={e.excerpt.lines.map((l) => l.content).join("\n")}
        />
      )}
    </span>
  )
}

export function WorklogTab({ worklog }: { worklog: Worklog }) {
  const [filter, setFilter] = useState<string>("All")
  const entries = useMemo(
    () =>
      [...worklog.entries]
        .sort((a, b) => b.time.localeCompare(a.time))
        .filter((e) => filter === "All" || e.thread === filter),
    [worklog, filter]
  )

  const items = entries.map((e) => ({
    id: e.id,
    title: (
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {when(e.time)}
          </span>
          <Badge variant="outline">{e.thread}</Badge>
          <Badge variant={stateBadge(e.state).variant}>{stateBadge(e.state).label}</Badge>
        </span>
        <span className="font-medium break-words">{e.title}</span>
      </span>
    ),
    description: <Detail e={e} />,
  }))

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <p className="text-sm text-muted-foreground">{worklog.note}</p>
      <Tabs variant="segment" value={filter} onValueChange={setFilter}>
        <TabsList aria-label="Filter by thread" wrapperClassName="max-w-full">
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f}>
              {f}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <BouncyAccordion
        key={filter}
        items={items}
        collapsible
        classNames={{ title: "overflow-visible text-clip whitespace-normal" }}
        defaultValue={items[0]?.id ?? null}
      />
    </div>
  )
}

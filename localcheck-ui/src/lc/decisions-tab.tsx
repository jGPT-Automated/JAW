import { BouncyAccordion } from "@/components/motion/bouncy-accordion"
import { Badge } from "@/components/ui/badge"
import type { Decisions } from "@/lc/data"

export function DecisionsTab({ decisions }: { decisions: Decisions }) {
  const items = decisions.historical_audit_decisions.map((d) => ({
    id: d.id,
    title: (
      <span className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
        <span className="min-w-0 break-words">{d.area}</span>
        <Badge variant="outline">{d.priority}</Badge>
        <Badge variant="secondary">{d.status}</Badge>
      </span>
    ),
    description: (
      <span className="flex flex-col gap-2 text-sm">
        <span>
          <b>Request:</b> {d.locked_request}
        </span>
        <span>
          <b>Current:</b> {d.current}
        </span>
        <span>
          <b>Acceptance:</b> {d.acceptance}
        </span>
        {d.evidence && (
          <a
            className="break-all underline underline-offset-4"
            href={d.evidence}
            target="_blank"
            rel="noreferrer"
          >
            Evidence
          </a>
        )}
      </span>
    ),
  }))

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {items.length} historical audit decisions from the PR77 review, version{" "}
        {decisions.version}. These describe the reviewed PR77 revision, not new
        app behavior.
      </p>
      <BouncyAccordion items={items} collapsible />
    </div>
  )
}

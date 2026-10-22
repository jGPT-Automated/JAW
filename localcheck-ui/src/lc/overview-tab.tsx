import { AlertTriangle, ExternalLink } from "lucide-react"

import { AnimatedNumber } from "@/components/motion/animated-number"
import {
  SortableList,
  SortableListGroup,
  SortableListHandle,
  SortableListItem,
  SortableListItemContent,
  SortableListUndo,
} from "@/components/motion/sortable-list"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Status, StepStatus } from "@/lc/data"

const LABEL: Record<StepStatus, string> = {
  verified: "Verified",
  belief: "Belief",
  open: "Open",
  "needs-you": "Needs you",
}

function StatusBadge({ status }: { status: StepStatus }) {
  const variant =
    status === "verified"
      ? "default"
      : status === "needs-you"
        ? "destructive"
        : status === "belief"
          ? "outline"
          : "secondary"
  return <Badge variant={variant}>{LABEL[status]}</Badge>
}

export function OverviewTab({ status }: { status: Status }) {
  const all = [...status.tracks.flatMap((t) => t.steps), ...status.needs_you]
  const count = (s: StepStatus) => all.filter((x) => x.status === s).length
  const stats: { label: string; status: StepStatus }[] = [
    { label: "Verified", status: "verified" },
    { label: "Belief", status: "belief" },
    { label: "Open", status: "open" },
    { label: "Needs you", status: "needs-you" },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.status} size="sm">
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                <AnimatedNumber value={count(s.status)} startOnView={false} />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="needs-you">
        <h2 id="needs-you" className="text-xl font-semibold tracking-tight">
          Needs you
        </h2>
        {status.needs_you.map((n, i) => (
          <Alert
            key={i}
            variant={n.status === "needs-you" ? "destructive" : "default"}
          >
            <AlertTriangle />
            <AlertTitle className="flex flex-wrap items-center gap-2">
              <StatusBadge status={n.status} />
            </AlertTitle>
            <AlertDescription>
              {n.text}
              {n.note ? ` (${n.note})` : ""}
            </AlertDescription>
          </Alert>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2" aria-labelledby="next-up">
        <div className="flex min-w-0 flex-col gap-3">
          <h2 id="next-up" className="text-xl font-semibold tracking-tight">
            Next up
          </h2>
          <p className="text-sm text-muted-foreground">
            Drag to reorder. The order stays in this browser only.
          </p>
          <SortableList
            defaultItems={status.priorities}
            label="Next up priorities"
            getItemLabel={(item) => item.title}
          >
            {(items) => (
              <>
                <SortableListGroup>
                  {items.map((item) => (
                    <SortableListItem key={item.id} id={item.id}>
                      <SortableListHandle />
                      <SortableListItemContent>
                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium">
                              {item.title}
                            </span>
                            <Badge variant="outline">{item.track}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.detail}
                          </p>
                        </div>
                      </SortableListItemContent>
                    </SortableListItem>
                  ))}
                </SortableListGroup>
                <SortableListUndo />
              </>
            )}
          </SortableList>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">How to read status</h2>
          <Card size="sm">
            <CardContent className="flex flex-col gap-3">
              {(Object.keys(LABEL) as StepStatus[]).map((k) => (
                <div key={k} className="flex items-start gap-3">
                  <StatusBadge status={k} />
                  <p className="min-w-0 text-sm text-muted-foreground">
                    {status.legend[k]}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="workstreams">
        <h2 id="workstreams" className="text-xl font-semibold tracking-tight">
          Workstreams
        </h2>
        <Tabs variant="pill" defaultValue={status.tracks[0].id}>
          <TabsList aria-label="Workstreams" wrapperClassName="max-w-full">
            {status.tracks.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {status.tracks.map((t) => (
            <TabsContent key={t.id} value={t.id} className="pt-4">
              <Card className="min-w-0">
                <CardHeader>
                  <CardTitle>{t.name}</CardTitle>
                  <CardDescription>
                    {t.repo} · {t.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {t.steps.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell className="w-28 align-top">
                            <StatusBadge status={s.status} />
                          </TableCell>
                          <TableCell className="whitespace-normal">
                            <div className="break-words">{s.text}</div>
                            {s.note && (
                              <div className="mt-1 text-xs break-words text-muted-foreground">
                                {s.note}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="prs">
        <h2 id="prs" className="text-xl font-semibold tracking-tight">
          Pull requests
        </h2>
        <Card size="sm">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Track</TableHead>
                  <TableHead>PR</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Evidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status.tracks.flatMap((t) =>
                  t.prs.map((p) => (
                    <TableRow key={p.url}>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>
                        <a
                          className="inline-flex items-center gap-1 underline underline-offset-4"
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {p.title}
                          <ExternalLink className="size-3" />
                        </a>
                      </TableCell>
                      <TableCell className="whitespace-normal">{p.state}</TableCell>
                      <TableCell className="whitespace-normal">
                        {p.evidence}
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {status.tracks.every((t) => t.prs.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No pull requests reported yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="log">
        <h2 id="log" className="text-xl font-semibold tracking-tight">
          Update log
        </h2>
        <Card size="sm">
          <CardContent>
            <Table>
              <TableBody>
                {[...status.log].reverse().map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="w-32 align-top tabular-nums">
                      {l.date}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words">
                      {l.text}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs"
import { LocalCheckNav } from "@/lc/nav"
import { Button } from "@/components/ui/button"
import { loadBundle, siteUrl, type Bundle } from "@/lc/data"
import { WorklogTab } from "@/lc/worklog-tab"
import { OverviewTab } from "@/lc/overview-tab"
import { FilesTab } from "@/lc/files-tab"
import { DecisionsTab } from "@/lc/decisions-tab"
import { PromptsTab } from "@/lc/prompts-tab"

const TABS = ["worklog", "overview", "files", "decisions", "prompts"] as const

function initialTab() {
  const h = window.location.hash.replace("#", "")
  return (TABS as readonly string[]).includes(h) ? h : "worklog"
}

export function App() {
  const [bundle, setBundle] = useState<Bundle | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState(initialTab)

  useEffect(() => {
    loadBundle().then(setBundle, (e: Error) => setError(e.message))
  }, [])

  const onTab = (v: string) => {
    setTab(v)
    history.replaceState(null, "", `#${v}`)
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {window.__LC__ ? (
        <header className="flex items-center justify-between gap-4 border-b px-4 py-2">
          <span className="text-sm font-medium">LocalCheck working file</span>
          <Button variant="outline" size="sm" asChild>
            <a href={siteUrl("status.html")} target="_blank" rel="noreferrer">
              Open on JAW
            </a>
          </Button>
        </header>
      ) : (
        <header className="sticky top-0 z-20">
          <LocalCheckNav current="status.html" />
        </header>
      )}
      <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Expo UI · App Store · tracking
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            What is done. What is proven.
          </h1>
          {bundle ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="max-w-3xl text-base text-muted-foreground">
                {bundle.status.summary}
              </p>
              <Badge variant="secondary">Updated {bundle.status.updated}</Badge>
            </div>
          ) : (
            <Skeleton className="h-6 w-full max-w-xl" />
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">Could not load data: {error}</p>
        )}

        {bundle && (
          <Tabs variant="underline" value={tab} onValueChange={onTab}>
            <TabsList aria-label="Status sections" wrapperClassName="max-w-full">
              <TabsTrigger value="worklog">Work log</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files &amp; diffs</TabsTrigger>
              <TabsTrigger value="decisions">Decisions</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
            </TabsList>
            <TabsContent value="worklog" className="pt-6">
              <WorklogTab worklog={bundle.worklog} />
            </TabsContent>
            <TabsContent value="overview" className="pt-6">
              <OverviewTab status={bundle.status} />
            </TabsContent>
            <TabsContent value="files" className="pt-6">
              <FilesTab files={bundle.files} />
            </TabsContent>
            <TabsContent value="decisions" className="pt-6">
              <DecisionsTab decisions={bundle.decisions} />
            </TabsContent>
            <TabsContent value="prompts" className="pt-6">
              <PromptsTab status={bundle.status} prompts={bundle.prompts} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

export default App

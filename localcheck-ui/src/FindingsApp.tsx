import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { LocalCheckNav } from "@/lc/nav"
import { FindingsList } from "@/lc/findings-list"
import type { FindingsData } from "@/lc/findings-data"

const PROMPT_FILE = "ADD-FINDING-PROMPT.md"

async function load() {
  const [findings, prompt] = await Promise.all([
    fetch("data/findings.json").then((r) => {
      if (!r.ok) throw new Error(`data/findings.json: ${r.status}`)
      return r.json() as Promise<FindingsData>
    }),
    fetch(`agent/${PROMPT_FILE}`).then((r) => (r.ok ? r.text() : "")),
  ])
  return { findings, prompt }
}

export function FindingsApp() {
  const [data, setData] = useState<Awaited<ReturnType<typeof load>> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load().then(setData, (e: Error) => setError(e.message))
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20">
        <LocalCheckNav current="findings.html" />
      </header>
      <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Findings · review before work
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            What was found. What is proposed.
          </h1>
          {data ? (
            <p className="max-w-3xl text-base text-muted-foreground">
              {data.findings.note}
            </p>
          ) : (
            <Skeleton className="h-6 w-full max-w-xl" />
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">Could not load data: {error}</p>
        )}
        {data && (
          <>
            <FindingsList findings={data.findings.findings} />
            <section className="flex min-w-0 flex-col gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                Add a finding
              </h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Give this prompt to any agent. It adds a finding in the same
                format, starting at proposed.
              </p>
              <CodeBlock>
                <CodeBlockHeader>
                  <CodeBlockTitle>{PROMPT_FILE}</CodeBlockTitle>
                  <CodeBlockActions>
                    <CodeBlockCopyButton value={data.prompt} />
                  </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent wrap className="max-h-96 [&>code]:grid-cols-[minmax(0,1fr)] data-wrap:wrap-anywhere">
                  {data.prompt}
                </CodeBlockContent>
              </CodeBlock>
              <Button variant="outline" size="sm" className="self-start" asChild>
                <a href={`agent/${PROMPT_FILE}`} target="_blank" rel="noreferrer">
                  Open markdown
                  <ExternalLink />
                </a>
              </Button>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

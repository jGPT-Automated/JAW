import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs"

export const NAV = [
  { value: "index.html", label: "Home & Court" },
  { value: "challenge.html", label: "Challenge & OTA" },
  { value: "roadmap.html", label: "Roadmap" },
  { value: "screens.html", label: "Screens" },
  { value: "audit.html", label: "PR77 audit" },
  { value: "findings.html", label: "Findings" },
  { value: "status.html", label: "Status & docs" },
]

export function LocalCheckNav({ current }: { current: string }) {
  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-4 border-b bg-background/90 px-4 py-2 backdrop-blur">
      <a
        href="/command"
        className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
      >
        ← JAW
      </a>
      <Tabs
        variant="underline"
        className="min-w-0"
        value={current}
        onValueChange={(v) => {
          if (v !== current) window.location.href = v
        }}
      >
        <TabsList aria-label="LocalCheck pages" wrapperClassName="max-w-full">
          {NAV.map((n) => (
            <TabsTrigger key={n.value} value={n.value}>
              {n.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

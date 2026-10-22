import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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
  const go = (v: string) => {
    if (v !== current) window.location.href = v
  }
  const [open, setOpen] = useState(false)
  const label = NAV.find((n) => n.value === current)?.label ?? "Pages"
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full min-w-0 border-b bg-background/90 backdrop-blur"
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-4 px-4 py-2">
        <a
          href="/command"
          className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
        >
          ← JAW
        </a>
        {/* Phone: every page in one expandable list, nothing hidden behind scrolling. */}
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="sm:hidden">
            {label}
            <ChevronDown />
          </Button>
        </CollapsibleTrigger>
        <Tabs
          variant="underline"
          className="hidden min-w-0 sm:block"
          value={current}
          onValueChange={go}
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
      <CollapsibleContent className="sm:hidden">
        <nav
          aria-label="LocalCheck pages"
          className="flex flex-col gap-1 px-4 pb-3"
        >
          {NAV.map((n) => (
            <Button
              key={n.value}
              variant={n.value === current ? "secondary" : "ghost"}
              className="justify-start"
              asChild
            >
              <a
                href={n.value}
                aria-current={n.value === current ? "page" : undefined}
              >
                {n.label}
              </a>
            </Button>
          ))}
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}

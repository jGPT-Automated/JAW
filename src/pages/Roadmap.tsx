import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  type CardData,
  Column,
  type ColumnData,
  type ColumnStatus,
  type DragState,
  gentleSpring,
} from "@/components/ui/kanban-board";
import { LoadError } from "@/hub/components/LoadError";

// LocalCheck's tracked requests, kept in the repo next to the LocalCheck working file.
const SOURCE = "/localcheck/data/decisions.json";

interface Decision {
  id: string;
  priority: "P1" | "P2";
  area: string;
  locked_request: string;
  status: string;
  current: string;
  acceptance: string;
  evidence?: string;
}

interface DecisionsFile {
  version: string;
  historical_audit_decisions: Decision[];
}

function column(status: string): ColumnStatus {
  if (/^implemented/i.test(status)) return "done";
  if (/^(partial|preserved|source improvement|requires verification|not demonstrated)/i.test(status)) return "in-progress";
  return "todo";
}

// The card shows the request's first clause; the full request and the rest open in the sheet.
const headline = (request: string) => request.split(/(?<=[a-z0-9)])[.;:] /)[0].replace(/\.$/, "");

function toColumns(items: Decision[]): ColumnData[] {
  const cards = (status: ColumnStatus): CardData[] =>
    items
      .filter((d) => column(d.status) === status)
      .map((d) => ({
        id: d.id,
        title: headline(d.locked_request),
        // One accent for what matters most; everything else stays quiet.
        tags: d.priority === "P1" ? [{ label: "P1", variant: "bug" }] : undefined,
        date: d.area,
      }));
  return [
    { id: "todo", title: "To do", status: "todo", cards: cards("todo") },
    { id: "in-progress", title: "In progress", status: "in-progress", cards: cards("in-progress") },
    { id: "done", title: "Done in source", status: "done", cards: cards("done") },
  ];
}

export default function Roadmap() {
  const file = useQuery({
    queryKey: ["localcheck", "decisions"],
    queryFn: async () => {
      const res = await fetch(SOURCE);
      if (!res.ok) throw new Error(`${SOURCE} returned ${res.status}`);
      return (await res.json()) as DecisionsFile;
    },
    staleTime: Infinity,
  });
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [dragState, setDragState] = useState<DragState>(null);
  const [open, setOpen] = useState<Decision | null>(null);

  useEffect(() => {
    if (file.data) setColumns(toColumns(file.data.historical_audit_decisions));
  }, [file.data]);

  // Same move as cult-ui's kanban demo: take the card out of one column, put it on top of another.
  const handleDrop = (cardId: string, from: ColumnStatus, to: ColumnStatus) => {
    if (from === to) return;
    setColumns((prev) => {
      const card = prev.find((c) => c.id === from)?.cards.find((c) => c.id === cardId);
      if (!card) return prev;
      return prev.map((c) =>
        c.id === from
          ? { ...c, cards: c.cards.filter((x) => x.id !== cardId) }
          : c.id === to
            ? { ...c, cards: [card, ...c.cards] }
            : c,
      );
    });
  };

  const openCard = (card: CardData) => setOpen(file.data?.historical_audit_decisions.find((d) => d.id === card.id) ?? null);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">Roadmap</h2>
        <p className="text-caption text-muted-foreground">
          LocalCheck&apos;s locked requests{file.data ? `, audit ${file.data.version}` : ""}. Open a card for what&apos;s left
          and how it gets accepted.
        </p>
      </header>

      {file.isPending ? (
        <Spinner className="text-muted-foreground" />
      ) : file.isError ? (
        <LoadError what="the LocalCheck roadmap" error={file.error} onRetry={() => file.refetch()} />
      ) : (
        <MotionConfig transition={gentleSpring}>
          <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            <div className="grid min-w-[840px] grid-cols-3 gap-5">
              {columns.map((col) => (
                <Column
                  column={col}
                  dragState={dragState}
                  key={col.id}
                  onDrop={handleDrop}
                  setDragState={setDragState}
                  onOpenCard={openCard}
                />
              ))}
            </div>
          </div>
        </MotionConfig>
      )}

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open ? (
            <>
              <SheetHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={open.priority === "P1" ? "destructive" : "secondary"}>{open.priority}</Badge>
                  <Badge variant="outline">{open.area}</Badge>
                  <Badge variant="outline">{open.id}</Badge>
                </div>
                <SheetTitle className="text-body leading-snug">{open.locked_request}</SheetTitle>
                <SheetDescription>{open.status}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 px-4 pb-6">
                <Field label="Where it stands">{open.current}</Field>
                <Field label="Accepted when">{open.acceptance}</Field>
                {open.evidence?.startsWith("http") ? (
                  <Button variant="outline" asChild className="w-fit">
                    <a href={open.evidence} target="_blank" rel="noreferrer">
                      Evidence <ExternalLink data-icon="inline-end" />
                    </a>
                  </Button>
                ) : open.evidence ? (
                  <Field label="Evidence">{open.evidence}</Field>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-caption font-medium text-muted-foreground">{label}</h3>
      <p className="text-[15px] leading-relaxed">{children}</p>
    </section>
  );
}

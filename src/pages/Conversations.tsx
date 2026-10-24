import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { format, differenceInSeconds } from "date-fns";
import { ArrowLeft, ChevronRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import SyncedTranscript, { type TranscriptSegment } from "@/components/kokonutui/synced-transcript";
import { LoadError } from "@/hub/components/LoadError";
import { useConversation, useConversations } from "@/hub/data/queries";
import type { Conversation, ConversationListItem } from "@/hub/lib/types";
import { cn } from "@/lib/utils";

function length(start: string, end: string | null) {
  if (!end) return null;
  const s = differenceInSeconds(new Date(end), new Date(start));
  return s < 60 ? `${s}s` : `${Math.round(s / 60)} min`;
}

function meta(c: Pick<ConversationListItem, "started_at" | "ended_at">) {
  return [format(new Date(c.started_at), "EEE d MMM, HH:mm"), length(c.started_at, c.ended_at)].filter(Boolean).join(" · ");
}

/** Message timestamps become segment times; each segment ends at speaking pace or at the next turn. */
function toSegments(messages: Conversation["messages"]): TranscriptSegment[] {
  if (!messages.length) return [];
  const t0 = new Date(messages[0].created_at).getTime();
  return messages.map((m, i) => {
    const start = (new Date(m.created_at).getTime() - t0) / 1000;
    const next = messages[i + 1] ? (new Date(messages[i + 1].created_at).getTime() - t0) / 1000 : Infinity;
    const spoken = m.content.split(/\s+/).length / 2.7;
    return { speaker: m.from_label ?? (m.from_kind === "agent" ? "JAW" : "You"), start, end: Math.min(start + spoken, next - 0.3), text: m.content };
  });
}

export default function Conversations() {
  const { id } = useParams();
  const list = useConversations();

  return (
    <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
      <section className={cn("flex min-w-0 flex-col gap-3", id && "hidden lg:flex")} aria-label="Conversations">
        <h2 className="text-subheading font-semibold">Conversations</h2>
        {list.isPending ? (
          <Spinner className="mt-4 text-muted-foreground" />
        ) : list.isError ? (
          <LoadError what="conversations" error={list.error} onRetry={() => list.refetch()} />
        ) : !list.data.length ? (
          <p className="text-caption text-muted-foreground">Nothing yet. Calls land here when they end.</p>
        ) : (
          <ItemGroup className="gap-1">
            {list.data.map((c) => (
              <Item key={c.id} asChild size="sm" variant={c.id === id ? "muted" : "default"} className="rounded-xl">
                <Link to={`/conversations/${c.id}`}>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full truncate">{c.title ?? "Untitled call"}</ItemTitle>
                    <ItemDescription>{meta(c)}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </ItemActions>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        )}
      </section>

      <section className={cn("min-w-0", !id && "hidden lg:block")}>
        {id ? (
          <ConversationDetail id={id} />
        ) : (
          <Empty className="h-full border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Mic />
              </EmptyMedia>
              <EmptyTitle>Pick a call</EmptyTitle>
              <EmptyDescription>Each one opens on its summary. The full transcript is underneath.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/">Start a new one</Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </section>
    </div>
  );
}

function ConversationDetail({ id }: { id: string }) {
  const convo = useConversation(id);
  const segments = useMemo(() => toSegments(convo.data?.messages ?? []), [convo.data]);

  if (convo.isPending) return <Spinner className="text-muted-foreground" />;
  if (convo.isError) return <LoadError what="this conversation" error={convo.error} onRetry={() => convo.refetch()} />;
  const c = convo.data;

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Button variant="ghost" size="sm" className="-ml-3 w-fit lg:hidden" asChild>
          <Link to="/conversations">
            <ArrowLeft data-icon="inline-start" /> All conversations
          </Link>
        </Button>
        <p className="text-caption text-muted-foreground">{meta(c)}</p>
        <h1 className="text-heading-sm font-semibold">{c.title ?? "Untitled call"}</h1>
        {c.summary ? <p className="text-body text-muted-foreground">{c.summary}</p> : null}
      </header>

      {!c.summary ? (
        <p className="text-caption text-muted-foreground">No summary yet. JAW writes one when the call ends.</p>
      ) : (
        <div className="flex flex-col gap-6">
          <Points title="Main points" items={c.key_points} />
          <Points title="Decisions" items={c.decisions} />
          <Points title="Follow-ups" items={c.action_items} />
        </div>
      )}

      <Separator />

      {segments.length ? (
        <SyncedTranscript title={`${segments.length} turns`} segments={segments} className="max-w-none" />
      ) : (
        <p className="text-caption text-muted-foreground">No transcript was recorded for this call.</p>
      )}
    </article>
  );
}

function Points({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-caption font-medium text-muted-foreground">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[16px] leading-relaxed">
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

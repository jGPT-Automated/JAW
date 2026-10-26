import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { LoadError } from "@/hub/components/LoadError";
import { useConversations } from "@/hub/data/queries";

/** Recent calls, newest first; each opens on its summary. */
export function HistoryPanel({ limit = 12 }: { limit?: number }) {
  const list = useConversations();
  if (list.isPending) return <Spinner className="text-muted-foreground" />;
  if (list.isError) return <LoadError what="conversations" error={list.error} onRetry={() => list.refetch()} />;
  if (!list.data.length) return <p className="text-caption text-muted-foreground">Calls land here when they end.</p>;
  return (
    <ItemGroup className="gap-1">
      {list.data.slice(0, limit).map((c) => (
        <Item key={c.id} asChild size="sm" className="rounded-xl px-2">
          <Link to={`/conversations/${c.id}`}>
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full truncate">{c.title ?? "Untitled call"}</ItemTitle>
              <ItemDescription className="line-clamp-2">
                {format(new Date(c.started_at), "EEE d MMM, HH:mm")}
                {c.summary ? ` · ${c.summary}` : ""}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="size-4 text-muted-foreground" />
            </ItemActions>
          </Link>
        </Item>
      ))}
    </ItemGroup>
  );
}

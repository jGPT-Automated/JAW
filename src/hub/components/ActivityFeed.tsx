import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { eventMeta } from "@/hub/lib/meta";
import { clock } from "@/hub/lib/time";
import type { ActivityLog } from "@/hub/lib/types";

const TONE: Record<string, string> = {
  default: "text-muted-foreground",
  success: "text-success",
  danger: "text-destructive",
  warning: "text-warning",
};

export function ActivityFeed({ logs, compact = false }: { logs: ActivityLog[]; compact?: boolean }) {
  return (
    <ItemGroup className="gap-0">
      {logs.map((log) => {
        const meta = eventMeta(log.event_type);
        return (
          <Item key={log.id} size="sm" className="rounded-none border-0 border-b px-0 last:border-b-0">
            <ItemMedia variant="icon" className={cn("bg-muted/50", TONE[meta.tone])}>
              <meta.icon />
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full min-w-0">
                <span className="truncate">{log.agent_name}</span>
                <Badge variant="outline" className="font-normal text-muted-foreground">
                  {meta.label}
                </Badge>
                <time className="ml-auto shrink-0 font-mono text-[11px] font-normal text-muted-foreground" dateTime={log.created_at}>
                  {clock(log.created_at)}
                </time>
              </ItemTitle>
              <ItemDescription className={compact ? "line-clamp-1" : "line-clamp-3"}>{log.message}</ItemDescription>
            </ItemContent>
          </Item>
        );
      })}
    </ItemGroup>
  );
}

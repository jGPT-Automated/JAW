import { useMemo, useState } from "react";
import { Activity as ActivityIcon, Play } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/motion/animated-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { ActivityFeed } from "@/hub/components/ActivityFeed";
import { PageHeader } from "@/hub/components/PageHeader";
import { useActivity, useAgents, useProcessQueue, useQueue } from "@/hub/data/queries";
import { eventMeta } from "@/hub/lib/meta";
import { ago, clock } from "@/hub/lib/time";

const QUEUE_STATUS: Record<string, { label: string; badge: AnimatedBadgeStatus }> = {
  pending: { label: "Pending", badge: "neutral" },
  processing: { label: "Sending", badge: "loading" },
  rate_limited: { label: "Rate limited", badge: "warning" },
  sent: { label: "Sent", badge: "success" },
  failed: { label: "Failed", badge: "danger" },
};

export default function Activity() {
  const [tab, setTab] = useState("events");
  const { data: queue = [] } = useQueue();
  const waiting = queue.filter((q) => q.status === "pending" || q.status === "rate_limited").length;
  const processQueue = useProcessQueue();

  return (
    <>
      <PageHeader
        title="Activity"
        description="A live stream of what agents report, and every message waiting to be delivered."
        actions={
          <Button
            variant="outline"
            disabled={processQueue.isPending}
            onClick={() =>
              processQueue.mutate(undefined, {
                onSuccess: (r) => toast.success(`Processed ${r.processed} message${r.processed === 1 ? "" : "s"}`),
                onError: (e) => toast.error(e.message),
              })
            }
          >
            {processQueue.isPending ? <Spinner /> : <Play />}
            Process queue now
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={setTab} variant="underline">
        <TabsList aria-label="Activity views">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="queue">
            Queue{waiting ? <Badge variant="secondary" className="ml-1.5 tabular-nums">{waiting}</Badge> : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <Events />
        </TabsContent>
        <TabsContent value="queue">
          <Queue />
        </TabsContent>
      </Tabs>
    </>
  );
}

function Events() {
  const { data: logs = [], isLoading } = useActivity(200);
  const { data: agents = [] } = useAgents();
  const [agent, setAgent] = useState("all");
  const [type, setType] = useState("all");

  const types = useMemo(() => [...new Set(logs.map((l) => l.event_type))].sort(), [logs]);
  const visible = logs.filter((l) => (agent === "all" || l.agent_id === agent) && (type === "all" || l.event_type === type));

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={agent} onValueChange={setAgent}>
            <SelectTrigger className="sm:w-48" aria-label="Filter by agent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All agents</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="sm:w-48" aria-label="Filter by event">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {eventMeta(t).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="self-center text-xs text-muted-foreground sm:ml-auto">
            {visible.length} of {logs.length} events
          </span>
        </div>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : visible.length ? (
          <ActivityFeed logs={visible} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ActivityIcon />
              </EmptyMedia>
              <EmptyTitle>Quiet for now</EmptyTitle>
              <EmptyDescription>Events show up here the moment an agent logs them.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}

function Queue() {
  const { data: queue = [], isLoading } = useQueue();
  const { data: agents = [] } = useAgents();
  const name = (id: string) => agents.find((a) => a.id === id)?.name ?? "Unknown agent";

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Agent</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4 text-right">When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((q) => {
            const status = QUEUE_STATUS[q.status] ?? { label: q.status, badge: "neutral" as const };
            return (
              <TableRow key={q.id}>
                <TableCell className="pl-4 font-medium">{name(q.agent_id)}</TableCell>
                <TableCell className="max-w-[28ch] truncate text-muted-foreground md:max-w-[48ch]">{q.payload}</TableCell>
                <TableCell className="capitalize text-muted-foreground">{q.source}</TableCell>
                <TableCell>
                  {q.last_error ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <AnimatedBadge size="sm" status={status.badge}>
                            {status.label}
                          </AnimatedBadge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">{q.last_error}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <AnimatedBadge size="sm" status={status.badge}>
                      {status.label}
                    </AnimatedBadge>
                  )}
                </TableCell>
                <TableCell className="pr-4 text-right text-xs text-muted-foreground tabular-nums">
                  {q.status === "rate_limited" || q.status === "pending" ? `due ${clock(q.scheduled_for)}` : ago(q.updated_at)}
                </TableCell>
              </TableRow>
            );
          })}
          {!queue.length ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                Nothing queued.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Card>
  );
}

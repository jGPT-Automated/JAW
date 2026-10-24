import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Inbox, ListTodo, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { TextShimmer } from "@/components/motion/text-shimmer";
import { HeatCalendar } from "@/components/charts/heat-calendar";
import { StatusBar, type StatusBarStatus } from "@/components/charts/status-bar";
import { ActivityFeed } from "@/hub/components/ActivityFeed";
import { AgentAvatar } from "@/hub/components/AgentAvatar";
import { PageHeader } from "@/hub/components/PageHeader";
import { StatCard } from "@/hub/components/StatCard";
import { useActivity, useActivityDays, useAgents, useQueue, useRoadmap } from "@/hub/data/queries";
import { agentStatus, agentType, providerMeta } from "@/hub/lib/meta";
import { ago } from "@/hub/lib/time";
import { activityGrid, deliveryHistory } from "@/hub/lib/metrics";

const WEEKS = 12;

const DELIVERY_STATUSES: StatusBarStatus[] = [
  { id: "operational", label: "Delivered", color: "var(--success)" },
  { id: "degraded", label: "Delayed", color: "var(--warning)" },
  { id: "outage", label: "Failed", color: "var(--destructive)" },
  { id: "unknown", label: "No traffic", color: "var(--muted-foreground)" },
];

export default function Overview() {
  const agents = useAgents();
  const queue = useQueue();
  const roadmap = useRoadmap();
  const activity = useActivity(8);
  const days = useActivityDays(WEEKS);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const stats = useMemo(() => {
    const a = agents.data ?? [];
    const q = queue.data ?? [];
    return {
      agents: a.length,
      active: a.filter((x) => x.status === "active").length,
      delivered: q.filter((x) => x.status === "sent" && new Date(x.updated_at) >= todayStart).length,
      backlog: q.filter((x) => ["pending", "processing", "rate_limited"].includes(x.status)).length,
      failed: q.filter((x) => x.status === "failed").length,
      inProgress: (roadmap.data ?? []).filter((t) => t.status === "in_progress").length,
      planned: (roadmap.data ?? []).filter((t) => t.status === "planned").length,
    };
    // todayStart is recomputed every render; the day boundary only matters per data refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents.data, queue.data, roadmap.data]);

  const grid = useMemo(() => activityGrid(days.data ?? [], WEEKS), [days.data]);
  const history = useMemo(() => deliveryHistory(queue.data ?? []), [queue.data]);

  return (
    <>
      <PageHeader
        title={
          <TextShimmer as="span" duration={3}>
            Good to see you, Captain.
          </TextShimmer>
        }
        description="Everything your agents are doing, in one place: who is online, what they were asked, what they said back, and what is still in flight."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/integrations">Connect an agent</Link>
            </Button>
            <Button asChild>
              <Link to="/inbox">
                <Send /> Message the fleet
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Agents online"
          value={stats.active}
          suffix={`/${stats.agents}`}
          icon={Bot}
          loading={agents.isLoading}
          footer={stats.agents ? `${stats.agents - stats.active} idle or on standby` : "No agents registered yet"}
        />
        <StatCard
          label="Delivered today"
          value={stats.delivered}
          icon={Send}
          loading={queue.isLoading}
          footer="Messages handed to agent webhooks"
        />
        <StatCard
          label="In the queue"
          value={stats.backlog}
          icon={Inbox}
          loading={queue.isLoading}
          footer={stats.failed ? `${stats.failed} failed after retries` : "Rate limits respected"}
        />
        <StatCard
          label="Tasks in progress"
          value={stats.inProgress}
          icon={ListTodo}
          loading={roadmap.isLoading}
          footer={`${stats.planned} planned next`}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Delivery health</CardTitle>
            <CardDescription>Last 24 hours of webhook deliveries, hour by hour.</CardDescription>
          </CardHeader>
          <CardContent>
            {queue.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <StatusBar data={history} statuses={DELIVERY_STATUSES} label="Webhook delivery, last 24 hours" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet</CardTitle>
            <CardDescription>Most recent heartbeat first.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/agents">
                  All <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {agents.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <ItemGroup className="gap-1">
                {[...(agents.data ?? [])]
                  .sort((a, b) => (b.last_heartbeat ?? "").localeCompare(a.last_heartbeat ?? ""))
                  .slice(0, 5)
                  .map((agent) => {
                    const status = agentStatus(agent.status);
                    return (
                      <Item key={agent.id} size="sm" asChild className="px-2">
                        <Link to={`/agents?agent=${agent.id}`}>
                          <ItemMedia>
                            <AgentAvatar agent={agent} className="size-8" />
                          </ItemMedia>
                          <ItemContent className="min-w-0">
                            <ItemTitle className="truncate">{agent.name}</ItemTitle>
                            <ItemDescription className="truncate">
                              {agentType(agent.type).label}
                              {agent.webhook_enabled ? ` · ${providerMeta(agent.provider).label}` : ""} ·{" "}
                              {ago(agent.last_heartbeat)}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <AnimatedBadge size="sm" status={status.badge} pulse={agent.status === "active"}>
                              {status.label}
                            </AnimatedBadge>
                          </ItemActions>
                        </Link>
                      </Item>
                    );
                  })}
              </ItemGroup>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <CardTitle>Activity, last {WEEKS} weeks</CardTitle>
            <CardDescription>
              Every event the fleet logged. Busiest day: {grid.max} event{grid.max === 1 ? "" : "s"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {days.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <HeatCalendar weeks={WEEKS} values={grid.values} maxCount={grid.max} unit="events" color="var(--primary)" />
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Latest events</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/activity">
                  Stream <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {activity.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ActivityFeed logs={activity.data ?? []} compact />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

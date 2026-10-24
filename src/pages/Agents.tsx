import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bot, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { Card, CARD_TARGET_CLASS, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/motion/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { AgentAvatar } from "@/hub/components/AgentAvatar";
import { AgentSheet } from "@/hub/components/AgentSheet";
import { PageHeader } from "@/hub/components/PageHeader";
import { RegisterAgentDialog } from "@/hub/components/RegisterAgentDialog";
import { useAgents } from "@/hub/data/queries";
import { agentStatus, agentType, providerMeta } from "@/hub/lib/meta";
import { ago } from "@/hub/lib/time";
import type { Agent } from "@/hub/lib/types";

const FILTERS: Record<string, (a: Agent) => boolean> = {
  all: () => true,
  active: (a) => a.status === "active",
  connected: (a) => a.webhook_enabled || a.telegram_enabled,
  attention: (a) => a.status === "error" || (!a.webhook_enabled && !a.telegram_enabled),
};

export default function Agents() {
  const [params, setParams] = useSearchParams();
  const { data: agents = [], isLoading } = useAgents();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const selected = params.get("agent");
  const registering = params.has("new");
  const setParam = (key: string, value: string | null) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (value === null) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents
      .filter(FILTERS[filter])
      .filter((a) => !q || [a.name, a.type, a.provider, a.description ?? "", a.model ?? ""].join(" ").toLowerCase().includes(q));
  }, [agents, filter, query]);

  return (
    <>
      <PageHeader
        title="Agents"
        description="Every agent the hub can reach. Messages go through a queue that respects each agent's daily cap and pacing."
        actions={
          <Button onClick={() => setParam("new", "1")}>
            <Plus /> Register agent
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={filter} onValueChange={setFilter} variant="segment">
          <TabsList aria-label="Filter agents">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="attention">Needs setup</TabsTrigger>
          </TabsList>
        </Tabs>
        <InputGroup className="md:max-w-xs">
          <InputGroupInput
            placeholder="Search agents"
            aria-label="Search agents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : visible.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onOpen={() => setParam("agent", agent.id)} />
          ))}
        </div>
      ) : (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bot />
            </EmptyMedia>
            <EmptyTitle>{agents.length ? "No agents match" : "No agents yet"}</EmptyTitle>
            <EmptyDescription>
              {agents.length
                ? "Try another filter or search."
                : "Register a Hyperagent, Letta or custom webhook agent to start routing work through the hub."}
            </EmptyDescription>
          </EmptyHeader>
          {!agents.length ? (
            <EmptyContent>
              <Button onClick={() => setParam("new", "1")}>
                <Plus /> Register agent
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      )}

      <AgentSheet agentId={selected} onClose={() => setParam("agent", null)} />
      <RegisterAgentDialog open={registering} onOpenChange={(open) => setParam("new", open ? "1" : null)} />
    </>
  );
}

function AgentCard({ agent, onOpen }: { agent: Agent; onOpen: () => void }) {
  const status = agentStatus(agent.status);
  return (
    <Card interactive size="compact" className="bg-card">
      <CardHeader className="flex items-start gap-3">
        <AgentAvatar agent={agent} />
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate">
            <button type="button" onClick={onOpen} className={`${CARD_TARGET_CLASS} text-left outline-none`}>
              {agent.name}
            </button>
          </CardTitle>
          <CardDescription className="truncate">
            {agentType(agent.type).label}
            {agent.model ? ` · ${agent.model}` : ""}
          </CardDescription>
        </div>
        <AnimatedBadge size="sm" status={status.badge} pulse={agent.status === "active"} contentKey={agent.status}>
          {status.label}
        </AnimatedBadge>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {agent.current_task || agent.description || "No current task."}
        </p>
      </CardContent>
      <CardFooter className="flex-wrap gap-1.5 text-xs text-muted-foreground">
        {agent.webhook_enabled ? <Badge variant="secondary">{providerMeta(agent.provider).label}</Badge> : null}
        {agent.telegram_enabled ? <Badge variant="secondary">Telegram</Badge> : null}
        {!agent.webhook_enabled && !agent.telegram_enabled ? <Badge variant="outline">Not connected</Badge> : null}
        <span className="ml-auto tabular-nums">
          {agent.tasks_completed ?? 0} tasks · {ago(agent.last_heartbeat)}
        </span>
      </CardFooter>
    </Card>
  );
}

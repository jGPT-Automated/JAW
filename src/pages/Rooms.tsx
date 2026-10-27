import { Link, Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Message, MessageBubble, MessageBubbleContent, MessageContent, MessageHeader, MessageScroller } from "@/components/agents/message";
import { PromptInput } from "@/components/agents/prompt-input";
import { LoadError } from "@/hub/components/LoadError";
import { useAgents, useMessages, useSendMessage } from "@/hub/data/queries";
import type { Agent } from "@/hub/lib/types";
import { cn } from "@/lib/utils";

const PLATFORM: Record<string, string> = { hyperagent: "Hyperagent", letta: "Letta", webhook: "Webhook", internal: "JAW" };

/** Agents you can message: anything with a webhook to deliver to. */
const reachable = (a: Agent) => a.webhook_enabled && !!a.webhook_url;

export default function Rooms() {
  const { agentId } = useParams();
  const agents = useAgents();

  if (agents.isPending) return <Spinner className="text-muted-foreground" />;
  if (agents.isError) return <LoadError what="agents" error={agents.error} onRetry={() => agents.refetch()} />;
  const rooms = agents.data.filter(reachable);
  if (!agentId && rooms[0]) return <Navigate to={`/rooms/${rooms[0].id}`} replace />;
  const current = rooms.find((a) => a.id === agentId);

  return (
    <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(240px,300px)_1fr]">
      <section className={cn("flex min-w-0 flex-col gap-3", agentId && "hidden lg:flex")} aria-label="Rooms">
        <h2 className="text-subheading font-semibold">Rooms</h2>
        {rooms.length ? (
          <ItemGroup className="gap-1">
            {rooms.map((a) => (
              <Item key={a.id} asChild size="sm" variant={a.id === agentId ? "muted" : "default"} className="rounded-xl">
                <Link to={`/rooms/${a.id}`}>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full truncate">{a.name}</ItemTitle>
                    <ItemDescription>{PLATFORM[a.provider] ?? a.provider}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </ItemActions>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <p className="text-caption text-muted-foreground">No agents with a webhook yet.</p>
        )}
      </section>

      <section className={cn("flex min-h-[calc(100dvh-8rem)] min-w-0 flex-col", !agentId && "hidden lg:flex")}>
        {current ? <Thread agent={current} /> : <p className="text-caption text-muted-foreground">Pick a room.</p>}
      </section>
    </div>
  );
}

function Thread({ agent }: { agent: Agent }) {
  const messages = useMessages(agent.id);
  const send = useSendMessage();

  const submit = async (value: string) => {
    const text = value.trim();
    if (!text) return;
    try {
      const r = await send.mutateAsync({ agent_id: agent.id, payload: text });
      if (r.status === "sent") toast.success(`Delivered to ${agent.name}`);
      else if (r.status === "failed") toast.error(`Not delivered: ${r.last_error ?? "the webhook refused it"}`);
      else if (r.last_error) toast.error(`Not delivered yet, will retry: ${r.last_error}`);
      else toast(`Queued. Sends ${r.scheduled_for ? `at ${format(new Date(r.scheduled_for), "HH:mm")}` : "shortly"} (pacing).`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <header className="flex flex-col gap-1">
        <Button variant="ghost" size="sm" className="-ml-3 w-fit lg:hidden" asChild>
          <Link to="/rooms">All rooms</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-subheading font-semibold">{agent.name}</h2>
          <Badge variant="outline" className="font-normal">
            {PLATFORM[agent.provider] ?? agent.provider}
          </Badge>
        </div>
        {agent.description ? <p className="max-w-2xl text-caption text-muted-foreground">{agent.description}</p> : null}
      </header>

      <div className="min-h-0 flex-1">
        {messages.isPending ? (
          <Spinner className="text-muted-foreground" />
        ) : messages.isError ? (
          <LoadError what="messages" error={messages.error} onRetry={() => messages.refetch()} />
        ) : messages.data.length ? (
          <MessageScroller label={`Messages with ${agent.name}`} className="max-h-[calc(100dvh-20rem)]" contentClassName="gap-3 py-2">
            {messages.data.map((m) => {
              const mine = m.to_agent_id === agent.id;
              return (
                <Message key={m.id} from={mine ? "user" : "assistant"}>
                  <MessageContent className="max-w-[85%]">
                    <MessageHeader className="text-xs text-muted-foreground">
                      {mine ? "You" : (m.from_label ?? agent.name)} · {format(new Date(m.created_at), "d MMM, HH:mm")}
                    </MessageHeader>
                    <MessageBubble variant={mine ? "solid" : "soft"}>
                      <MessageBubbleContent>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </MessageBubbleContent>
                    </MessageBubble>
                  </MessageContent>
                </Message>
              );
            })}
          </MessageScroller>
        ) : (
          <p className="text-caption text-muted-foreground">
            Nothing yet. What you send lands in the room as a message its agents can answer; their replies show up here.
          </p>
        )}
      </div>

      <PromptInput
        onSubmit={submit}
        loading={send.isPending}
        placeholder={`Message ${agent.name}`}
        aria-label={`Message ${agent.name}`}
        minRows={2}
      />
    </div>
  );
}

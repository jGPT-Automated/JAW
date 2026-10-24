import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquarePlus, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "@/hub/components/AgentAvatar";
import { Composer } from "@/hub/components/Composer";
import { PageHeader } from "@/hub/components/PageHeader";
import { Transcript } from "@/hub/components/Transcript";
import { useAgents, useMessages } from "@/hub/data/queries";
import { clock } from "@/hub/lib/time";
import type { Agent, AgentMessage } from "@/hub/lib/types";

interface Thread {
  id: string;
  agent?: Agent;
  last: AgentMessage;
  messages: AgentMessage[];
}

export default function Inbox() {
  const [params, setParams] = useSearchParams();
  const { data: agents = [] } = useAgents();
  const { data: messages = [], isLoading } = useMessages();
  const [recipient, setRecipient] = useState<string | undefined>();

  const threads = useMemo<Thread[]>(() => {
    const byId = new Map<string, AgentMessage[]>();
    for (const m of messages) {
      const list = byId.get(m.conversation_id) ?? [];
      list.push(m);
      byId.set(m.conversation_id, list);
    }
    return [...byId.entries()]
      .map(([id, list]) => {
        const agentId = list.find((m) => m.to_kind === "agent")?.to_agent_id ?? list.find((m) => m.from_agent_id)?.from_agent_id;
        return { id, messages: list, last: list[list.length - 1], agent: agents.find((a) => a.id === agentId) };
      })
      .sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
  }, [messages, agents]);

  const selectedId = params.get("c");
  const thread = threads.find((t) => t.id === selectedId);
  const composing = !thread;
  const select = (id: string | null) => setParams(id ? { c: id } : {}, { replace: true });

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Every conversation with your agents, across the hub, Telegram, the orchestrator and inbound webhooks."
        actions={
          <Button variant="outline" onClick={() => select(null)}>
            <MessageSquarePlus /> New message
          </Button>
        }
      />

      <Card className="grid min-h-[70dvh] grid-cols-1 gap-0 overflow-hidden p-0 lg:grid-cols-[320px_1fr]">
        <div className={cn("border-b lg:border-r lg:border-b-0", thread && "hidden lg:block")}>
          <ScrollArea className="h-[40dvh] lg:h-[70dvh]">
            <div className="flex flex-col gap-1 p-2">
              {isLoading
                ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)
                : threads.map((t) => (
                    <Item
                      key={t.id}
                      size="sm"
                      asChild
                      variant={t.id === selectedId ? "muted" : "default"}
                      className="px-2"
                    >
                      <button type="button" onClick={() => select(t.id)} className="text-left">
                        <ItemMedia>
                          {t.agent ? (
                            <AgentAvatar agent={t.agent} className="size-8" />
                          ) : (
                            <MessagesSquare className="size-4" />
                          )}
                        </ItemMedia>
                        <ItemContent className="min-w-0">
                          <ItemTitle className="w-full">
                            <span className="truncate">{t.agent?.name ?? t.last.to_label ?? "Conversation"}</span>
                            <time className="ml-auto shrink-0 text-[11px] font-normal text-muted-foreground">
                              {clock(t.last.created_at)}
                            </time>
                          </ItemTitle>
                          <ItemDescription className="line-clamp-1">{t.last.content}</ItemDescription>
                        </ItemContent>
                      </button>
                    </Item>
                  ))}
              {!isLoading && !threads.length ? (
                <p className="p-4 text-sm text-muted-foreground">No conversations yet.</p>
              ) : null}
            </div>
          </ScrollArea>
        </div>

        <div className="flex min-h-[60dvh] min-w-0 flex-col">
          <div className="flex items-center gap-3 border-b px-4 py-3">
            {thread ? (
              <>
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => select(null)}>
                  Back
                </Button>
                {thread.agent ? <AgentAvatar agent={thread.agent} className="size-7" /> : null}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{thread.agent?.name ?? "Conversation"}</div>
                  <div className="text-xs text-muted-foreground">{thread.messages.length} messages</div>
                </div>
              </>
            ) : (
              <div className="text-sm font-medium">New message</div>
            )}
          </div>
          {thread ? (
            <Transcript messages={thread.messages} agentId={thread.agent?.id} className="min-h-0 flex-1 px-4" />
          ) : (
            <Empty className="flex-1">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquarePlus />
                </EmptyMedia>
                <EmptyTitle>Start a conversation</EmptyTitle>
                <EmptyDescription>Pick an agent in the box below and write what you need.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <div className="border-t p-3">
            <Composer
              agents={composing ? agents : thread.agent ? [thread.agent] : agents}
              agentId={composing ? recipient ?? agents[0]?.id : thread.agent?.id}
              onAgentChange={setRecipient}
              conversationId={thread?.id}
            />
          </div>
        </div>
      </Card>
    </>
  );
}

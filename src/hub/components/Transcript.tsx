import { MessagesSquare } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Message,
  MessageBubble,
  MessageBubbleCollapsible,
  MessageBubbleContent,
  MessageContent,
  MessageHeader,
  MessageMarker,
  MessageScroller,
} from "@/components/agents/message";
import { CHANNEL_ICONS } from "@/hub/lib/meta";
import { clock } from "@/hub/lib/time";
import type { AgentMessage } from "@/hub/lib/types";

/**
 * A transcript from one agent's point of view: what the agent said sits on the
 * left, everything sent to it (you, Telegram, the orchestrator, other agents) on the right.
 */
export function Transcript({
  messages,
  agentId,
  className,
}: {
  messages: AgentMessage[];
  agentId?: string;
  className?: string;
}) {
  if (!messages.length) {
    return (
      <Empty className={className}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessagesSquare />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>Send the first one below. Replies land here as soon as the agent answers.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  let lastConversation: string | null = null;

  return (
    <MessageScroller label="Conversation" className={className} contentClassName="gap-4 px-1 py-4">
      {messages.map((m) => {
        const fromAgent = agentId ? m.from_agent_id === agentId : m.from_kind === "agent";
        const ChannelIcon = CHANNEL_ICONS[m.channel] ?? CHANNEL_ICONS.system;
        const sender = m.from_label ?? (m.from_kind === "user" ? "You" : m.from_kind);
        const newThread = lastConversation !== null && lastConversation !== m.conversation_id;
        lastConversation = m.conversation_id;
        return (
          <div key={m.id} className="contents">
            {newThread ? <MessageMarker>New conversation</MessageMarker> : null}
            <Message from={fromAgent ? "assistant" : "user"}>
              <MessageContent className="max-w-[85%]">
                <MessageHeader>
                  <ChannelIcon className="size-3" aria-label={m.channel} />
                  <span>{sender}</span>
                  <time dateTime={m.created_at}>{clock(m.created_at)}</time>
                </MessageHeader>
                <MessageBubble variant={fromAgent ? "soft" : "solid"}>
                  {m.content.length > 600 ? (
                    <MessageBubbleCollapsible collapsedLines={6}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </MessageBubbleCollapsible>
                  ) : (
                    <MessageBubbleContent>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </MessageBubbleContent>
                  )}
                </MessageBubble>
              </MessageContent>
            </Message>
          </div>
        );
      })}
    </MessageScroller>
  );
}

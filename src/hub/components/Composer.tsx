import { toast } from "sonner";
import { PromptInput, type PromptModel } from "@/components/agents/prompt-input";
import { useSendMessage } from "@/hub/data/queries";
import type { Agent } from "@/hub/lib/types";
import { AgentAvatar } from "./AgentAvatar";

/**
 * Message box that enqueues through `enqueue-message`, so daily caps and the
 * minimum gap between messages still apply. Pass several agents to let the
 * sender pick a recipient.
 */
export function Composer({
  agents,
  agentId,
  onAgentChange,
  conversationId,
  className,
}: {
  agents: Agent[];
  agentId?: string;
  onAgentChange?: (id: string) => void;
  conversationId?: string;
  className?: string;
}) {
  const send = useSendMessage();
  const target = agents.find((a) => a.id === agentId) ?? (agents.length === 1 ? agents[0] : undefined);
  const models: PromptModel[] =
    agents.length > 1
      ? agents.map((a) => ({
          value: a.id,
          label: a.name,
          icon: <AgentAvatar agent={a} className="size-4 rounded-sm border-0 [&_svg]:size-3" />,
        }))
      : [];

  const submit = (text: string, picked?: string) => {
    const id = picked ?? target?.id;
    if (!id) {
      toast.error("Pick an agent first");
      return;
    }
    const name = agents.find((a) => a.id === id)?.name ?? "the agent";
    send.mutate(
      { agent_id: id, payload: text, conversation_id: conversationId },
      {
        onSuccess: (res) => {
          if (res.status === "rate_limited") toast.warning(`${name} hit today's cap. Queued for tomorrow.`);
          else toast.success(`Queued for ${name}`);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <PromptInput
      className={className}
      models={models}
      model={agents.length > 1 ? target?.id : undefined}
      onModelChange={onAgentChange}
      loading={send.isPending}
      disabled={!agents.length}
      placeholder={target ? `Message ${target.name}…` : "Register an agent to start messaging"}
      onSubmit={submit}
      minRows={1}
      maxRows={6}
    />
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { agentType } from "@/hub/lib/meta";
import type { Agent } from "@/hub/lib/types";

export function AgentAvatar({ agent, className }: { agent: Pick<Agent, "type" | "avatar_url" | "name">; className?: string }) {
  const Icon = agentType(agent.type).icon;
  return (
    <Avatar className={cn("size-9 rounded-lg border", className)}>
      {agent.avatar_url ? <AvatarImage src={agent.avatar_url} alt={agent.name} /> : null}
      <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}

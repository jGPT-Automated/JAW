import { useMemo } from "react";
import { BookmarkPlus, CircleAlert, FolderKanban, ListChecks, PanelsTopLeft, Search, Send, SlidersHorizontal, Users } from "lucide-react";
import { ThinkingOrb } from "thinking-orbs";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity";
import { Spinner } from "@/components/ui/spinner";
import { LoadError } from "@/hub/components/LoadError";
import { useToolCalls } from "@/hub/data/queries";
import type { LiveToolCall } from "@/hub/voice/useVoiceSession";

type Call = Pick<LiveToolCall, "call_id" | "name" | "args" | "status"> & { output?: string | null };

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** One activity row per tool call, in Jesse's terms rather than the tool's. */
export function toolCallItem(c: Call): AgentActivityItem {
  const failed = c.status === "error";
  const icon = failed ? <CircleAlert className="size-4 text-destructive" /> : undefined;
  switch (c.name) {
    case "remember":
      return { id: c.call_id, type: "trace", kind: "write", icon: icon ?? <BookmarkPlus className="size-4" />, label: "Remembered", detail: str(c.args.content) };
    case "recall":
      return { id: c.call_id, type: "trace", kind: "read", icon: icon ?? <Search className="size-4" />, label: `Recalled “${str(c.args.query)}”`, detail: c.output ?? undefined };
    case "list_agents":
      return { id: c.call_id, type: "trace", kind: "read", icon: icon ?? <Users className="size-4" />, label: "Checked which agents can help", detail: c.output ?? undefined };
    case "delegate":
      return { id: c.call_id, type: "trace", kind: "run", icon: icon ?? <Send className="size-4" />, label: `Delegated to ${str(c.args.to)}`, detail: c.output ?? str(c.args.task) };
    case "list_projects":
      return { id: c.call_id, type: "trace", kind: "read", icon: icon ?? <FolderKanban className="size-4" />, label: "Checked your projects", detail: c.output ?? undefined };
    case "add_project":
      return { id: c.call_id, type: "trace", kind: "write", icon: icon ?? <FolderKanban className="size-4" />, label: `Saved project ${str(c.args.name)}`, detail: str(c.args.summary) || undefined };
    case "list_tasks":
      return {
        id: c.call_id,
        type: "trace",
        kind: "read",
        icon: icon ?? <ListChecks className="size-4" />,
        label: str(c.args.project) ? `Checked tasks for ${str(c.args.project)}` : "Checked open tasks",
        detail: c.output ?? undefined,
      };
    case "add_task":
      return {
        id: c.call_id,
        type: "trace",
        kind: "write",
        icon: icon ?? <ListChecks className="size-4" />,
        label: `Added a task${str(c.args.project) ? ` to ${str(c.args.project)}` : ""}`,
        detail: str(c.args.title),
      };
    case "update_task":
      return {
        id: c.call_id,
        type: "trace",
        kind: "write",
        icon: icon ?? <ListChecks className="size-4" />,
        label: str(c.args.status) ? `Marked a task ${str(c.args.status)}` : "Updated a task",
        detail: c.output ?? str(c.args.task),
      };
    case "update_instructions":
      return { id: c.call_id, type: "trace", kind: "write", icon: icon ?? <SlidersHorizontal className="size-4" />, label: "Updated its instructions", detail: c.output ?? undefined };
    case "show_canvas":
      return {
        id: c.call_id,
        type: "trace",
        kind: "run",
        icon: icon ?? <PanelsTopLeft className="size-4" />,
        label: c.args.view === "close" ? "Closed the canvas" : `Opened ${str(c.args.view).replace("_", " ")} on screen`,
      };
    default:
      return { id: c.call_id, type: "trace", kind: "run", icon, label: c.name, detail: c.output ?? undefined };
  }
}

/** Live calls from the current conversation, then the agent's recent calls from the hub. */
export function ToolCallsPanel({ live, active }: { live: LiveToolCall[]; active: boolean }) {
  const recent = useToolCalls(30);
  const running = live.some((c) => c.status === "running");
  const liveItems = useMemo(() => live.map(toolCallItem), [live]);
  const liveIds = new Set(live.map((c) => c.call_id));
  const earlier = (recent.data ?? []).filter((c) => !liveIds.has(c.call_id));

  return (
    <div className="flex flex-col gap-6">
      {active || live.length ? (
        <section className="flex flex-col gap-2">
          <h3 className="flex items-center gap-2 text-caption font-medium text-muted-foreground">
            {running ? <ThinkingOrb state="working" size={20} aria-label="JAW is running a tool" /> : null}
            This conversation
          </h3>
          {live.length ? (
            <AgentActivity items={liveItems} status={running ? "working" : "complete"} defaultOpen activeLabel="Running a tool…" />
          ) : (
            <p className="text-caption text-muted-foreground">No tools used yet in this call.</p>
          )}
        </section>
      ) : null}

      <section className="flex flex-col gap-2">
        <h3 className="text-caption font-medium text-muted-foreground">Earlier</h3>
        {recent.isPending ? (
          <Spinner className="text-muted-foreground" />
        ) : recent.isError ? (
          <LoadError what="tool calls" error={recent.error} onRetry={() => recent.refetch()} />
        ) : earlier.length ? (
          <AgentActivity items={earlier.map(toolCallItem)} status="complete" defaultOpen summary={`${earlier.length} recent tool calls`} />
        ) : (
          <p className="text-caption text-muted-foreground">
            When JAW remembers, recalls or delegates, each step shows here as it happens and stays in the history.
          </p>
        )}
      </section>
    </div>
  );
}

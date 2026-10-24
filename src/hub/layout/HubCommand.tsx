import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Play, Sun, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { CommandPalette, type CommandItem } from "@/components/motion/command-palette";
import { useAgents, useProcessQueue } from "@/hub/data/queries";
import { agentType } from "@/hub/lib/meta";
import { ALL_NAV } from "@/hub/nav";

export function HubCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { data: agents = [] } = useAgents();
  const processQueue = useProcessQueue();
  const { resolvedTheme, setTheme } = useTheme();

  const items = useMemo<CommandItem[]>(
    () => [
      ...ALL_NAV.map((n) => ({
        id: `nav-${n.url}`,
        label: n.title,
        hint: n.description,
        group: "Go to",
        icon: n.icon,
        onSelect: () => (n.external ? window.location.assign(n.url) : navigate(n.url)),
      })),
      {
        id: "action-register",
        label: "Register an agent",
        group: "Actions",
        icon: UserPlus,
        keywords: ["add", "new", "hyperagent", "letta", "webhook"],
        onSelect: () => navigate("/agents?new=1"),
      },
      {
        id: "action-queue",
        label: "Process delivery queue now",
        group: "Actions",
        icon: Play,
        keywords: ["send", "flush", "drain"],
        onSelect: () =>
          processQueue.mutate(undefined, {
            onSuccess: (r) => toast.success(`Processed ${r.processed} queued message${r.processed === 1 ? "" : "s"}`),
            onError: (e) => toast.error(e.message),
          }),
      },
      {
        id: "action-theme",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        group: "Actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      ...agents.map((a) => ({
        id: `agent-${a.id}`,
        label: a.name,
        hint: agentType(a.type).label,
        group: "Agents",
        icon: agentType(a.type).icon,
        keywords: [a.type, a.provider, a.model ?? ""],
        onSelect: () => navigate(`/agents?agent=${a.id}`),
      })),
    ],
    [agents, navigate, processQueue, resolvedTheme, setTheme],
  );

  return (
    <CommandPalette
      items={items}
      open={open}
      onOpenChange={onOpenChange}
      placeholder="Jump to a page, agent or action…"
    />
  );
}

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { CommandPalette, type CommandItem } from "@/components/motion/command-palette";
import { ALL_NAV } from "@/hub/nav";

export function HubCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
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
        id: "action-theme",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        group: "Actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
    ],
    [navigate, resolvedTheme, setTheme],
  );

  return <CommandPalette items={items} open={open} onOpenChange={onOpenChange} placeholder="Jump to a page…" />;
}

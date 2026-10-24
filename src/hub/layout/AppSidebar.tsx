import { Link, useLocation } from "react-router-dom";
import { Radio } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { useAgents, useQueue } from "@/hub/data/queries";
import { useLiveState } from "@/hub/data/realtime";
import { NAV } from "@/hub/nav";

export function AppSidebar() {
  const { pathname } = useLocation();
  const live = useLiveState();
  const { data: agents } = useAgents();
  const { data: queue } = useQueue();

  const counts: Record<string, number | undefined> = {
    "/agents": agents?.length,
    "/activity": queue?.filter((q) => q.status === "pending" || q.status === "processing").length || undefined,
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <img src="/jaw-icon.svg" alt="" className="size-8 rounded-md" />
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">JAW Hub</span>
                  <span className="truncate text-xs text-muted-foreground">Agent command center</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={!item.external && active} tooltip={item.title}>
                        {item.external ? (
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        ) : (
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                      {counts[item.url] ? <SidebarMenuBadge>{counts[item.url]}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Radio className="size-4 shrink-0 text-muted-foreground" />
          <AnimatedBadge
            size="sm"
            status={live === "live" ? "success" : live === "offline" ? "danger" : "loading"}
            pulse={live === "live"}
            contentKey={live}
            className="group-data-[collapsible=icon]:hidden"
          >
            {live === "live" ? "Realtime on" : live === "offline" ? "Realtime off" : "Connecting"}
          </AnimatedBadge>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

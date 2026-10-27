import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LogOut, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { HubCommand } from "./HubCommand";
import { navFor } from "@/hub/nav";
import { canSignOut, ownerKey, signOut } from "@/hub/lib/auth";
import { ChangePassword } from "./ChangePassword";

export function HubLayout() {
  const { pathname } = useLocation();
  const [commandOpen, setCommandOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const current = navFor(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/80 px-3 backdrop-blur md:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-medium">{current?.title ?? "JAW Hub"}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
          >
            <Search />
            <span className="hidden sm:inline">Search</span>
            <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </Button>
          {ownerKey.get() ? <ChangePassword /> : null}
          {canSignOut() ? (
            <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => void signOut()}>
              <LogOut />
            </Button>
          ) : null}
        </header>
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
          <Suspense
            fallback={
              <div className="grid flex-1 place-items-center">
                <Spinner className="size-5 text-muted-foreground" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
      <HubCommand open={commandOpen} onOpenChange={setCommandOpen} />
    </SidebarProvider>
  );
}

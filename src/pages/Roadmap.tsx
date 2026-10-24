import { CalendarDays, CircleCheck, CircleDashed, CircleDot, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/hub/components/PageHeader";
import { useRoadmap, useUpdateTask } from "@/hub/data/queries";
import type { RoadmapTask } from "@/hub/lib/types";

const COLUMNS = [
  { status: "in_progress", label: "In progress", icon: CircleDot },
  { status: "planned", label: "Planned", icon: CircleDashed },
  { status: "completed", label: "Completed", icon: CircleCheck },
] as const;

const PRIORITY: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
};

export default function Roadmap() {
  const { data: tasks = [], isLoading } = useRoadmap();
  const update = useUpdateTask();

  const move = (task: RoadmapTask, status: string) =>
    update.mutate(
      { id: task.id, patch: { status, progress: status === "completed" ? 100 : task.progress } },
      { onSuccess: () => toast.success(`Moved “${task.title}”`), onError: (e) => toast.error(e.message) },
    );

  return (
    <>
      <PageHeader title="Roadmap" description="What the fleet is building, grouped by stage. Move a task from its menu." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.status);
          return (
            <section key={col.status} aria-label={col.label} className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <col.icon className="size-4 text-muted-foreground" />
                {col.label}
                <Badge variant="secondary" className="tabular-nums">
                  {items.length}
                </Badge>
              </h3>
              {isLoading
                ? [0, 1].map((i) => <Skeleton key={i} className="h-36 w-full rounded-xl" />)
                : items.map((task) => (
                    <Card key={task.id} className="gap-3 py-4">
                      <CardHeader className="px-4">
                        <CardTitle className="leading-snug">{task.title}</CardTitle>
                        {task.description ? (
                          <CardDescription className="line-clamp-3">{task.description}</CardDescription>
                        ) : null}
                        <CardAction>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7" aria-label={`Move ${task.title}`}>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Move to</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {COLUMNS.filter((c) => c.status !== task.status).map((c) => (
                                <DropdownMenuItem key={c.status} onSelect={() => move(task, c.status)}>
                                  <c.icon /> {c.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardAction>
                      </CardHeader>
                      {task.status !== "planned" ? (
                        <CardContent className="px-4">
                          <Progress value={task.progress ?? 0} aria-label={`${task.title} progress`} />
                        </CardContent>
                      ) : null}
                      <CardFooter className="flex-wrap gap-1.5 px-4 text-xs text-muted-foreground">
                        <Badge variant={PRIORITY[task.priority] ?? "outline"} className="capitalize">
                          {task.priority}
                        </Badge>
                        {task.assigned_agent ? <Badge variant="outline">{task.assigned_agent}</Badge> : null}
                        {task.due_date ? (
                          <span className="ml-auto flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {format(new Date(task.due_date), "MMM d")}
                          </span>
                        ) : null}
                      </CardFooter>
                    </Card>
                  ))}
              {!isLoading && !items.length ? (
                <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Nothing here.</p>
              ) : null}
            </section>
          );
        })}
      </div>
    </>
  );
}

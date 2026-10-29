import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { type TodoItem, TodoList } from "@/components/agents/todo-list";
import { LoadError } from "@/hub/components/LoadError";
import { useProjects, useTasks } from "@/hub/data/queries";
import type { Task } from "@/hub/lib/types";

const STATUS: Record<Task["status"], TodoItem["status"]> = { todo: "pending", doing: "in-progress", done: "completed" };

const toItems = (tasks: Task[]): TodoItem[] =>
  tasks.map((t) => ({ id: t.id, title: t.title, status: STATUS[t.status], detail: t.notes ?? undefined }));

/** Every lane at a glance: one beUI to-do list per active project, then the Inbox. Edit on the project page. */
export default function Tasks() {
  const projects = useProjects();
  const tasks = useTasks();

  if (projects.isPending || tasks.isPending) return <Spinner className="text-muted-foreground" />;
  if (projects.isError) return <LoadError what="projects" error={projects.error} onRetry={() => projects.refetch()} />;
  if (tasks.isError) return <LoadError what="tasks" error={tasks.error} onRetry={() => tasks.refetch()} />;

  const open = tasks.data.filter((t) => t.status !== "done").length;
  const lanes = [
    ...projects.data.filter((p) => p.status === "active").map((p) => ({ id: p.id as string | null, name: p.name })),
    { id: null, name: "Inbox" },
  ]
    .map((lane) => ({ ...lane, tasks: tasks.data.filter((t) => t.project_id === lane.id) }))
    .filter((lane) => lane.id || lane.tasks.length);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">Tasks</h2>
        <p className="text-caption text-muted-foreground">
          {open} open across your projects. Tell JAW what needs doing, by voice or on the phone, and it lands here.
        </p>
      </header>

      {lanes.map((lane) => (
        <section key={lane.id ?? "inbox"} className="flex flex-col gap-1">
          {lane.tasks.length ? (
            <TodoList items={toItems(lane.tasks)} title={lane.name} />
          ) : (
            <p className="px-1 text-caption text-muted-foreground">{lane.name}: no tasks yet.</p>
          )}
          {lane.id ? (
            <Button variant="ghost" size="sm" asChild className="w-fit">
              <Link to={`/projects/${lane.id}`}>
                Open {lane.name} <ChevronRight data-icon="inline-end" />
              </Link>
            </Button>
          ) : null}
        </section>
      ))}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { LoadError } from "@/hub/components/LoadError";
import { TaskList } from "@/hub/components/TaskList";
import { useProjects, useTasks } from "@/hub/data/queries";

/** Every lane in one list: each active project's tasks, then the Inbox. */
export default function Tasks() {
  const projects = useProjects();
  const tasks = useTasks();
  const [showDone, setShowDone] = useState(false);

  if (projects.isPending || tasks.isPending) return <Spinner className="text-muted-foreground" />;
  if (projects.isError) return <LoadError what="projects" error={projects.error} onRetry={() => projects.refetch()} />;
  if (tasks.isError) return <LoadError what="tasks" error={tasks.error} onRetry={() => tasks.refetch()} />;

  const visible = tasks.data.filter((t) => showDone || t.status !== "done");
  const open = tasks.data.filter((t) => t.status !== "done").length;
  const lanes = [
    ...projects.data.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name, href: `/projects/${p.id}` })),
    { id: null, name: "Inbox", href: null },
  ];

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-subheading font-semibold">Tasks</h2>
          <p className="text-caption text-muted-foreground">
            {open} open across your projects. Tell JAW what needs doing, by voice or on the phone, and it lands here.
          </p>
        </div>
        <Toggle variant="outline" size="sm" pressed={showDone} onPressedChange={setShowDone}>
          Show done
        </Toggle>
      </header>

      {lanes.map((lane) => {
        const items = visible.filter((t) => t.project_id === lane.id);
        return (
          <section key={lane.id ?? "inbox"} className="flex flex-col gap-1 rounded-2xl border bg-card p-4">
            <h3 className="flex items-center justify-between text-caption font-medium text-muted-foreground">
              {lane.href ? (
                <Link to={lane.href} className="flex items-center gap-1 hover:text-foreground">
                  {lane.name} <ChevronRight className="size-3.5" />
                </Link>
              ) : (
                lane.name
              )}
              <span>{items.filter((t) => t.status !== "done").length} open</span>
            </h3>
            <TaskList tasks={items} projectId={lane.id} empty={lane.id ? "No open tasks." : "Tasks without a project land here."} />
          </section>
        );
      })}
    </div>
  );
}

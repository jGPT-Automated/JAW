import { type FormEvent, useState } from "react";
import { Circle, CircleCheck, CircleDot, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddTask, useDeleteTask, useUpdateTask } from "@/hub/data/queries";
import type { Task, TaskStatus } from "@/hub/lib/types";
import { cn } from "@/lib/utils";

const NEXT: Record<TaskStatus, TaskStatus> = { todo: "doing", doing: "done", done: "todo" };
const LABEL: Record<TaskStatus, string> = { todo: "To do", doing: "In progress", done: "Done" };

function StatusIcon({ status }: { status: TaskStatus }) {
  if (status === "done") return <CircleCheck className="size-5 text-primary" />;
  if (status === "doing") return <CircleDot className="size-5 text-primary" />;
  return <Circle className="size-5 text-muted-foreground" />;
}

/** One line per task. Tap the circle to move it along: to do → in progress → done. */
export function TaskList({
  tasks,
  projectId,
  showAdd = true,
  empty = "Nothing here yet.",
}: {
  tasks: Task[];
  /** Where new tasks go: a project id, or null for the Inbox. */
  projectId?: string | null;
  showAdd?: boolean;
  empty?: string;
}) {
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const fail = (e: Error) => toast.error(e.message);

  return (
    <div className="flex flex-col">
      {tasks.length ? (
        <ul className="flex flex-col">
          {tasks.map((t) => (
            <li key={t.id} className="group flex items-start gap-2 rounded-lg py-1.5 pr-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-full"
                onClick={() => update.mutate({ id: t.id, status: NEXT[t.status] }, { onError: fail })}
                aria-label={`${LABEL[t.status]}: ${t.title}. Mark ${LABEL[NEXT[t.status]].toLowerCase()}`}
              >
                <StatusIcon status={t.status} />
              </Button>
              <div className="min-w-0 flex-1 pt-1.5">
                <p className={cn("text-sm leading-snug", t.status === "done" && "text-muted-foreground line-through")}>{t.title}</p>
                {t.notes ? <p className="mt-0.5 text-caption text-muted-foreground">{t.notes}</p> : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                onClick={() => remove.mutate(t.id, { onError: fail })}
                aria-label={`Delete ${t.title}`}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-2 text-caption text-muted-foreground">{empty}</p>
      )}
      {showAdd ? <AddTask projectId={projectId ?? null} /> : null}
    </div>
  );
}

function AddTask({ projectId }: { projectId: string | null }) {
  const [title, setTitle] = useState("");
  const add = useAddTask();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    add.mutate(
      { title: title.trim(), project_id: projectId },
      { onSuccess: () => setTitle(""), onError: (err) => toast.error((err as Error).message) },
    );
  };
  return (
    <form onSubmit={submit} className="mt-1 flex items-center gap-2">
      <Plus className="ml-2 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task"
        aria-label="New task"
        className="h-9 border-none bg-transparent px-2 shadow-none focus-visible:ring-1"
      />
    </form>
  );
}

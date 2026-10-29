import { type FormEvent, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/motion/checkbox";
import { useAddTask, useDeleteTask, useUpdateTask } from "@/hub/data/queries";
import type { Task } from "@/hub/lib/types";

/**
 * A project's tasks as beUI checkboxes: checked is done, the dash (indeterminate) is in progress,
 * notes show as the description. Ticking a box marks it done; unticking puts it back to do.
 */
export function TaskList({
  tasks,
  projectId,
  empty = "Nothing here yet.",
}: {
  tasks: Task[];
  /** Where new tasks go: a project id, or null for the Inbox. */
  projectId: string | null;
  empty?: string;
}) {
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const fail = (e: Error) => toast.error(e.message);

  return (
    <div className="flex flex-col gap-1">
      {tasks.length ? (
        <ul className="flex flex-col gap-1">
          {tasks.map((t) => (
            <li key={t.id} className="group flex items-start justify-between gap-2">
              <Checkbox
                checked={t.status === "done"}
                indeterminate={t.status === "doing"}
                onCheckedChange={(checked) => update.mutate({ id: t.id, status: checked ? "done" : "todo" }, { onError: fail })}
                label={t.title}
                description={t.notes ?? (t.status === "doing" ? "In progress" : undefined)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                onClick={() => remove.mutate(t.id, { onError: fail })}
                aria-label={`Delete ${t.title}`}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-2 text-caption text-muted-foreground">{empty}</p>
      )}
      <AddTask projectId={projectId} />
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
    <form onSubmit={submit} className="mt-2">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task and press enter" aria-label="New task" />
    </form>
  );
}

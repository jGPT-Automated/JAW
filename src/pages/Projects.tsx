import { type FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowLeft, ExternalLink, GitCommitHorizontal, GitPullRequest, Mic, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ProjectFolder } from "@/components/motion/project-folder";
import { Timeline } from "@/components/motion/timeline";
import { LoadError } from "@/hub/components/LoadError";
import { TaskList } from "@/hub/components/TaskList";
import { useAddProject, useProject, useProjectActivity, useProjects, useTasks, useUpdateProject } from "@/hub/data/queries";
import type { Project } from "@/hub/lib/types";

const ago = (at: string | null) => (at ? formatDistanceToNowStrict(new Date(at), { addSuffix: true }) : "");

export default function Projects() {
  const { id } = useParams();
  return id ? <ProjectPage id={id} /> : <ProjectList />;
}

// Paper tints for the folder previews, from the brand palette: lime, linen, graphite.
const PAPER = ["bg-[#d9f2c9] text-[#1d3a12]", "bg-[#edede8] text-[#2a2a27]", "bg-[#c9e9b3] text-[#1d3a12]", "bg-[#e2e2dc] text-[#2a2a27]", "bg-[#b8e09c] text-[#1d3a12]"];

function ProjectList() {
  const projects = useProjects();
  const tasks = useTasks();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-subheading font-semibold">Projects</h2>
          <p className="text-caption text-muted-foreground">What you&apos;re keeping top of mind. JAW adds and updates these when you talk or call.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus data-icon="inline-start" /> New project
        </Button>
      </header>

      {projects.isPending ? (
        <Spinner className="text-muted-foreground" />
      ) : projects.isError ? (
        <LoadError what="projects" error={projects.error} onRetry={() => projects.refetch()} />
      ) : projects.data.length ? (
        // beUI project folders: the fanned papers are the project's open tasks.
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-4 sm:grid-cols-2">
          {projects.data.map((p) => (
            <ProjectFolder
              key={p.id}
              title={p.name}
              description={p.status === "active" ? `Updated ${ago(p.updated_at)}` : p.status === "paused" ? "Paused" : "Done"}
              count={p.open_tasks}
              itemLabel="open task"
              previews={(tasks.data ?? [])
                .filter((t) => t.project_id === p.id && t.status !== "done")
                .slice(0, 5)
                .map((t, i) => ({
                  id: t.id,
                  content: (
                    <span className={`block h-full w-full p-2.5 text-left text-[10px] leading-snug ${PAPER[i % PAPER.length]}`}>
                      {t.title}
                    </span>
                  ),
                }))}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="mx-auto"
            />
          ))}
        </div>
      ) : (
        <p className="text-caption text-muted-foreground">
          No projects yet. Add one here, or tell JAW: &ldquo;keep JAW Hub top of mind as a project&rdquo;.
        </p>
      )}

      <ProjectDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function ProjectPage({ id }: { id: string }) {
  const project = useProject(id);
  const tasks = useTasks(id);
  const [editing, setEditing] = useState(false);

  if (project.isPending) return <Spinner className="text-muted-foreground" />;
  if (project.isError) return <LoadError what="this project" error={project.error} onRetry={() => project.refetch()} />;
  const p = project.data;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
          <Link to="/projects">
            <ArrowLeft data-icon="inline-start" /> Projects
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="flex items-center gap-2 text-subheading font-semibold">
              {p.name}
              {p.status !== "active" ? <Badge variant="outline">{p.status}</Badge> : null}
            </h2>
            {p.summary ? <p className="max-w-2xl text-body text-muted-foreground">{p.summary}</p> : null}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <Mic data-icon="inline-start" /> Talk
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setEditing(true)} aria-label="Edit project">
              <Pencil />
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="flex flex-col gap-2 rounded-2xl border bg-card p-4">
          <h3 className="text-caption font-medium text-muted-foreground">
            Tasks · {p.open_tasks} open{p.done_tasks ? `, ${p.done_tasks} done` : ""}
          </h3>
          {tasks.isPending ? (
            <Spinner className="text-muted-foreground" />
          ) : tasks.isError ? (
            <LoadError what="tasks" error={tasks.error} onRetry={() => tasks.refetch()} />
          ) : (
            <TaskList tasks={tasks.data} projectId={id} empty="No tasks yet. Add one, or tell JAW what needs doing." />
          )}
        </section>

        <RepoActivity project={p} onConnect={() => setEditing(true)} />
      </div>

      <ProjectDialog open={editing} onOpenChange={setEditing} project={p} />
    </div>
  );
}

function RepoActivity({ project, onConnect }: { project: Project; onConnect: () => void }) {
  const activity = useProjectActivity(project.id, !!project.repo);
  const [focusedId, setFocusedId] = useState<string>();

  // Open pull requests and recent commits on beUI's timeline, newest first.
  const events = activity.data
    ? [
        ...activity.data.pulls.map((pr) => ({
          id: `pr-${pr.number}`,
          url: pr.url,
          date: pr.at,
          title: pr.title,
          media: (
            <span className="flex size-full flex-col justify-between p-4 text-left">
              <GitPullRequest className="size-5 text-primary" />
              <span className="text-subheading font-semibold">#{pr.number}</span>
            </span>
          ),
          meta: `${pr.draft ? "Draft PR" : "Open PR"}${pr.author ? ` · ${pr.author}` : ""}`,
        })),
        ...activity.data.commits.map((c) => ({
          id: c.sha,
          url: c.url,
          date: c.at ?? new Date().toISOString(),
          title: c.message,
          media: (
            <span className="flex size-full flex-col justify-between p-4 text-left">
              <GitCommitHorizontal className="size-5 text-muted-foreground" />
              <span className="font-mono text-subheading">{c.sha}</span>
            </span>
          ),
          meta: c.author ?? "Commit",
        })),
      ].sort((a, b) => +new Date(b.date) - +new Date(a.date))
    : [];
  const focused = events.find((e) => e.id === focusedId) ?? events[0];

  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
      <h3 className="flex items-center justify-between gap-2 text-caption font-medium text-muted-foreground">
        Repo activity
        {project.repo ? (
          <a href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground">
            {project.repo} <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </h3>
      {!project.repo ? (
        <div className="flex flex-col items-start gap-2">
          <p className="text-caption text-muted-foreground">Connect a GitHub repo to see its latest commits and open pull requests here.</p>
          <Button variant="outline" size="sm" onClick={onConnect}>
            Connect a repo
          </Button>
        </div>
      ) : activity.isPending ? (
        <Spinner className="text-muted-foreground" />
      ) : activity.isError ? (
        <LoadError what="repo activity" error={activity.error} onRetry={() => activity.refetch()} />
      ) : events.length ? (
        <>
          <div className="-mx-4 overflow-hidden">
            <Timeline
              aria-label={`${project.repo} activity`}
              events={events}
              value={focused?.id}
              onValueChange={setFocusedId}
              height={380}
              itemWidth={240}
            />
          </div>
          {focused ? (
            <Button variant="outline" size="sm" asChild className="w-fit">
              <a href={focused.url} target="_blank" rel="noreferrer">
                Open on GitHub <ExternalLink data-icon="inline-end" />
              </a>
            </Button>
          ) : null}
        </>
      ) : (
        <p className="text-caption text-muted-foreground">No commits or open pull requests yet.</p>
      )}
    </section>
  );
}

/** New project, or edit one when `project` is given. */
function ProjectDialog({ open, onOpenChange, project }: { open: boolean; onOpenChange: (v: boolean) => void; project?: Project }) {
  const add = useAddProject();
  const update = useUpdateProject();
  const navigate = useNavigate();
  const [name, setName] = useState(project?.name ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [repo, setRepo] = useState(project?.repo ?? "");
  const [status, setStatus] = useState<Project["status"]>(project?.status ?? "active");
  const pending = add.isPending || update.isPending;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const fields = { name: name.trim(), summary: summary.trim(), repo: repo.trim() };
    const done = () => onOpenChange(false);
    const fail = (err: Error) => toast.error(err.message);
    if (project) {
      update.mutate({ id: project.id, ...fields, status }, { onSuccess: done, onError: fail });
    } else {
      add.mutate(fields, {
        onSuccess: (p) => {
          done();
          setName("");
          setSummary("");
          setRepo("");
          navigate(`/projects/${p.id}`);
        },
        onError: fail,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="contents">
          <DialogHeader>
            <DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle>
            <DialogDescription>JAW sees this in every conversation and can add tasks to it.</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="project-name">Name</FieldLabel>
            <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
          </Field>
          <Field>
            <FieldLabel htmlFor="project-summary">What it is and the goal</FieldLabel>
            <Textarea id="project-summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} maxLength={2000} />
          </Field>
          <Field>
            <FieldLabel htmlFor="project-repo">GitHub repo</FieldLabel>
            <Input id="project-repo" value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="owner/repo" />
            <FieldDescription>Optional. Shows its commits and pull requests on the project page.</FieldDescription>
          </Field>
          {project ? (
            <Field>
              <FieldLabel htmlFor="project-status">Status</FieldLabel>
              <Select value={status} onValueChange={(v) => setStatus(v as Project["status"])}>
                <SelectTrigger id="project-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          <DialogFooter>
            <Button type="submit" disabled={pending || !name.trim()}>
              {project ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

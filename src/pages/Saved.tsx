import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ArrowLeft,
  Download,
  FileArchive,
  FileCode2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/agents/code-block";
import { StreamingResponse } from "@/components/agents/streaming-response";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/motion/file-tree";
import { NotificationStack } from "@/components/motion/notification-stack";
import { SAVED, type SavedFile, type SavedWork } from "@/hub/saved";

const ago = (iso?: string) =>
  iso ? formatDistanceToNowStrict(new Date(iso), { addSuffix: true }) : "";

export default function Saved() {
  const { slug } = useParams();
  const work = SAVED.find((w) => w.slug === slug);
  if (slug && work) return <SavedPage work={work} />;
  return <SavedList />;
}

/** Recent saves from any agent, newest first (beUI notification stack, opened). */
function SavedList() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">Saved work</h2>
        <p className="text-caption text-muted-foreground">
          What agents saved to JAW. Open one to read its files.
        </p>
      </header>
      <NotificationStack
        defaultExpanded
        maxVisible={8}
        collapsedLabel="Recent saves"
        expandedLabel="Recent saves"
        emptyLabel="Nothing saved yet."
        items={SAVED.map((w) => ({
          id: w.slug,
          title: <Link to={`/saved/${w.slug}`}>{w.title}</Link>,
          description: `${w.files.length} files${w.commit ? ` · ${w.commit.message}` : ""}`,
          trailing: ago(w.commit?.date),
        }))}
      />
    </div>
  );
}

const icon = (f: SavedFile) =>
  f.kind === "download" ? (
    <FileArchive className="size-4 text-primary" />
  ) : f.kind === "markdown" ? (
    <FileText className="size-4 text-muted-foreground" />
  ) : (
    <FileCode2 className="size-4 text-muted-foreground" />
  );

interface Folder {
  folders: Map<string, Folder>;
  files: SavedFile[];
}

function toTree(files: SavedFile[]) {
  const root: Folder = { folders: new Map(), files: [] };
  for (const f of files) {
    const parts = f.path.split("/");
    let node = root;
    for (const part of parts.slice(0, -1)) {
      if (!node.folders.has(part))
        node.folders.set(part, { folders: new Map(), files: [] });
      node = node.folders.get(part)!;
    }
    node.files.push(f);
  }
  return root;
}

// FileTree reads FileTreeFolder / FileTreeFile elements directly, so the branches are built as
// elements here rather than wrapped in a component.
function branch(node: Folder, prefix: string): React.ReactNode[] {
  return [
    ...[...node.folders.entries()].map(([name, child]) => (
      <FileTreeFolder key={prefix + name} value={prefix + name} name={name}>
        {branch(child, `${prefix}${name}/`)}
      </FileTreeFolder>
    )),
    ...node.files.map((f) => (
      <FileTreeFile
        key={f.path}
        value={f.path}
        name={f.path.split("/").pop()!}
        icon={icon(f)}
      />
    )),
  ];
}

/** Resolves a relative link in a file to another file in the same save, if there is one. */
function resolveLink(from: string, href: string, files: SavedFile[]) {
  if (/^[a-z]+:|^#|^\//i.test(href)) return null;
  const parts = from.split("/").slice(0, -1);
  for (const seg of href.replace(/\/$/, "").split("/")) {
    if (seg === "..") parts.pop();
    else if (seg && seg !== ".") parts.push(seg);
  }
  const target = parts.join("/");
  return (
    files.find((f) => f.path === target)?.path ??
    files.find((f) => f.path.startsWith(`${target}/`))?.path ??
    null
  );
}

/** One save: what it is, its files in beUI's file tree, and the selected file rendered beside it. */
function SavedPage({ work }: { work: SavedWork }) {
  const first =
    work.files.find((f) => f.path.toLowerCase() === "readme.md") ??
    work.files[0];
  const [selected, setSelected] = useState(first?.path ?? "");
  const file = work.files.find((f) => f.path === selected) ?? first;
  const tree = useMemo(() => toTree(work.files), [work.files]);
  // Top-level folders start open; deeper ones open on tap, so the tree stays short on a phone.
  const folders = useMemo(() => [...tree.folders.keys()], [tree]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
          <Link to="/saved">
            <ArrowLeft data-icon="inline-start" /> Saved work
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h2 className="text-subheading font-semibold">{work.title}</h2>
          {work.commit ? (
            <p className="text-caption text-muted-foreground">
              Saved {ago(work.commit.date)} · {work.files.length} files ·{" "}
              {work.commit.message}
            </p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FileTree
          value={file?.path}
          onValueChange={setSelected}
          defaultExpandedIds={folders}
          ariaLabel={`${work.title} files`}
          className="rounded-2xl border bg-card p-2"
        >
          {branch(tree, "")}
        </FileTree>

        {file ? (
          <FileView
            key={file.path}
            file={file}
            onOpen={(href) => {
              const target = resolveLink(file.path, href, work.files);
              if (target) setSelected(target);
              return !!target;
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function FileView({
  file,
  onOpen,
}: {
  file: SavedFile;
  onOpen: (href: string) => boolean;
}) {
  if (file.kind === "download") {
    return (
      <section className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6">
        <FileArchive className="size-8 text-primary" />
        <p className="text-body font-medium">{file.path.split("/").pop()}</p>
        <Button asChild>
          <a href={file.url} download>
            <Download data-icon="inline-start" /> Download
          </a>
        </Button>
      </section>
    );
  }
  if (file.kind === "markdown") {
    // A SKILL.md starts with a front-matter block (name, description); show its description as
    // the lead line instead of raw YAML.
    const fm = file.content?.match(/^---\n([\s\S]*?)\n---\n?/);
    const lead = fm?.[1].match(/^description:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, "");
    const body = fm ? file.content!.slice(fm[0].length) : (file.content ?? "");
    return (
      <StreamingResponse
        status="complete"
        copyText={file.content}
        className="rounded-2xl border bg-card p-5"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (p) => (
              <h3
                className="mt-4 mb-2 text-body font-semibold first:mt-0"
                {...p}
              />
            ),
            h2: (p) => <h4 className="mt-4 mb-2 font-semibold" {...p} />,
            h3: (p) => <h5 className="mt-3 mb-1 font-semibold" {...p} />,
            // Links to other files in this save open them here instead of a dead relative URL.
            a: ({ href = "", ...p }) => (
              <a
                href={href}
                {...p}
                onClick={(e) => {
                  if (onOpen(href)) e.preventDefault();
                }}
              />
            ),
          }}
        >
          {lead ? `> ${lead}\n\n${body}` : body}
        </ReactMarkdown>
      </StreamingResponse>
    );
  }
  return (
    <CodeBlock
      code={file.content ?? ""}
      language={file.path.endsWith(".json") ? "json" : "text"}
      filename={file.path}
      wrap
    />
  );
}

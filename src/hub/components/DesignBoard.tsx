import { type DragEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Bot, ClipboardPaste, Link2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import LightboxGrid from "@/components/kokonutui/lightbox-grid";
import MarkingMenu, { type MarkingMenuItem } from "@/components/kokonutui/marking-menu";
import { CopyField } from "@/hub/components/CopyField";
import { LoadError } from "@/hub/components/LoadError";
import { useAddResource, useDeleteResource, useResources, useUploadResource } from "@/hub/data/queries";
import type { Resource } from "@/hub/lib/types";

const ADD_ACTIONS: MarkingMenuItem[] = [
  { id: "link", label: "Add a link", icon: Link2 },
  { id: "upload", label: "Upload image", icon: Upload },
  { id: "paste", label: "Paste", icon: ClipboardPaste },
  { id: "agent", label: "Copy agent API", icon: Bot },
];

const origin = typeof window === "undefined" ? "" : window.location.origin;
const AGENT_SNIPPET = `POST ${origin}/api/agent/resources  (Authorization: Bearer <agent token>)\n{"url": "https://…", "collection": "Inbox", "notes": "why it's here"}`;

export function DesignBoard() {
  const resources = useResources();
  const add = useAddResource();
  const upload = useUploadResource();
  const remove = useDeleteResource();
  const [link, setLink] = useState("");
  const linkRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = add.isPending || upload.isPending;

  const collections = useMemo(() => {
    const map = new Map<string, Resource[]>();
    for (const r of resources.data ?? []) {
      if (!r.image_url) continue;
      map.set(r.collection, [...(map.get(r.collection) ?? []), r]);
    }
    return [...map];
  }, [resources.data]);

  const addLink = (url: string) =>
    add.mutate(
      { url },
      {
        onSuccess: (r) => {
          toast.success(`Added “${r.title}”`);
          setLink("");
        },
        onError: (e) => toast.error(e.message),
      },
    );

  const addFiles = (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      upload.mutate({ file }, { onSuccess: (r) => toast.success(`Uploaded “${r.title}”`), onError: (e) => toast.error(e.message) });
    }
  };

  const pasteFromClipboard = async () => {
    try {
      for (const item of await navigator.clipboard.read()) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) return addFiles([new File([await item.getType(type)], "Pasted image", { type })]);
      }
      const text = (await navigator.clipboard.readText()).trim();
      if (/^https:\/\//.test(text)) return addLink(text);
      toast("Nothing to paste: copy an image or an https link first.");
    } catch {
      toast("The browser blocked clipboard access. Press ⌘V / Ctrl V on the pad instead.");
    }
  };

  const onPick = (item: MarkingMenuItem) => {
    if (item.id === "link") linkRef.current?.focus();
    if (item.id === "upload") fileRef.current?.click();
    if (item.id === "paste") void pasteFromClipboard();
    if (item.id === "agent")
      void navigator.clipboard.writeText(AGENT_SNIPPET).then(
        () => toast.success("Agent API copied"),
        () => toast(AGENT_SNIPPET),
      );
  };

  // ⌘V anywhere on the board adds what's on the clipboard (except while typing in a field).
  const onPaste = useRef<(e: ClipboardEvent) => void>(() => {});
  onPaste.current = (e) => {
    if (!e.clipboardData || (e.target as HTMLElement).closest("input, textarea, [contenteditable]")) return;
    const files = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) return addFiles(files);
    const text = e.clipboardData.getData("text").trim();
    if (/^https:\/\//.test(text)) addLink(text);
  };
  useEffect(() => {
    const handler = (e: ClipboardEvent) => onPaste.current(e);
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) return addFiles(e.dataTransfer.files);
    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text");
    if (/^https:\/\//.test(url.trim())) addLink(url.trim());
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (link.trim()) addLink(link.trim());
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,420px)]">
        <div className="flex flex-col gap-3">
          <form onSubmit={submit}>
            <InputGroup>
              <InputGroupAddon>
                <Link2 />
              </InputGroupAddon>
              <InputGroupInput
                ref={linkRef}
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste a Dribbble, Behance or any page link"
                aria-label="Link to add"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton type="submit" disabled={busy || !link.trim()}>
                  {add.isPending ? <Spinner /> : "Add"}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            <MarkingMenu items={ADD_ACTIONS} onSelect={onPick} className="h-64 border-dashed bg-transparent dark:bg-transparent">
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
                {busy ? <Spinner className="text-muted-foreground" /> : null}
                <p className="text-[15px] font-medium">Drop, paste, or hold here</p>
                <p className="max-w-xs text-caption text-muted-foreground">
                  Hold or right-click for the add menu: link, upload, paste, or the agent API.
                </p>
              </div>
            </MarkingMenu>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted-foreground">Agents read the board here, and add to it with their token.</p>
          <CopyField label="Resources URL" value={`${origin}/api/public/resources?kind=design`} />
          <Recent items={(resources.data ?? []).slice(0, 4)} onDelete={(id) => remove.mutate(id)} />
        </div>
      </div>

      {resources.isPending ? (
        <Spinner className="text-muted-foreground" />
      ) : resources.isError ? (
        <LoadError what="design references" error={resources.error} onRetry={() => resources.refetch()} />
      ) : (
        collections.map(([name, items]) => (
          <section key={name} className="flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-body font-semibold">{name}</h3>
              <span className="text-caption text-muted-foreground tabular-nums">{items.length}</span>
            </div>
            <LightboxGrid
              className="max-w-5xl"
              images={items.map((r) => ({
                src: r.image_url!,
                alt: r.title,
                width: 1200,
                height: 900,
                caption: r.notes ? `${r.title} · ${r.notes.replace(/^by /, "")}` : r.title,
              }))}
            />
          </section>
        ))
      )}
    </div>
  );
}

function Recent({ items, onDelete }: { items: Resource[]; onDelete: (id: string) => void }) {
  if (!items.length) return null;
  return (
    <ItemGroup className="mt-2 gap-1">
      {items.map((r) => (
        <Item key={r.id} size="sm" className="rounded-xl px-2">
          <ItemMedia variant="image" className="rounded-md">
            {r.image_url ? <img src={r.image_url} alt="" className="object-cover" /> : <Link2 />}
          </ItemMedia>
          <ItemContent className="min-w-0">
            <ItemTitle className="w-full truncate">
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer" className="truncate hover:underline">
                  {r.title}
                </a>
              ) : (
                r.title
              )}
            </ItemTitle>
            <ItemDescription>
              {r.collection} · {r.added_by === "owner" ? "you" : r.added_by}, {formatDistanceToNowStrict(new Date(r.created_at))} ago
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon-sm" aria-label={`Remove ${r.title}`} onClick={() => onDelete(r.id)}>
              <Trash2 />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}

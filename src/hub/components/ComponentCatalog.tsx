import { type FormEvent, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Plus, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { LoadError } from "@/hub/components/LoadError";
import { useAddLibrary, useCatalog, useComponentLibraries, useSyncLibrary } from "@/hub/data/queries";
import type { CatalogComponent } from "@/hub/lib/types";
import { cn } from "@/lib/utils";

// Same order the server uses.
const CATEGORIES = [
  "AI & agents",
  "Buttons",
  "Inputs & forms",
  "Navigation",
  "Cards",
  "Overlays & feedback",
  "Backgrounds & shaders",
  "Text & motion",
  "Charts & data",
  "Media",
  "Layout",
  "Other",
];

export function ComponentCatalog() {
  const catalog = useCatalog();
  const libraries = useComponentLibraries();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [library, setLibrary] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of catalog.data ?? []) if (!library || c.library === library) m.set(c.category, (m.get(c.category) ?? 0) + 1);
    return m;
  }, [catalog.data, library]);

  const shown = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (catalog.data ?? []).filter(
      (c) =>
        (!library || c.library === library) &&
        (needle
          ? `${c.name} ${c.title} ${c.description ?? ""}`.toLowerCase().includes(needle)
          : c.category === category),
    );
  }, [catalog.data, library, search, category]);

  if (catalog.isPending) return <Spinner className="text-muted-foreground" />;
  if (catalog.isError) return <LoadError what="the component catalog" error={catalog.error} onRetry={() => catalog.refetch()} />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-full max-w-sm">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={`Search ${catalog.data.length} components`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search components"
          />
        </InputGroup>
        <div className="flex flex-wrap items-center gap-1.5">
          <LibraryChip active={!library} onClick={() => setLibrary(null)}>
            All libraries
          </LibraryChip>
          {libraries.data?.map((l) => (
            <LibraryChip key={l.slug} active={library === l.slug} onClick={() => setLibrary(l.slug)}>
              {l.name} <span className="tabular-nums opacity-60">{l.item_count}</span>
            </LibraryChip>
          ))}
          <AddLibrary />
          {library ? <SyncLibrary slug={library} /> : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <nav aria-label="Component categories" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <ul className="flex gap-1 md:flex-col">
            {CATEGORIES.filter((c) => counts.get(c)).map((c) => (
              <li key={c}>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-current={!search && c === category ? "true" : undefined}
                  className={cn(
                    "w-full justify-between gap-3 whitespace-nowrap rounded-lg font-normal",
                    !search && c === category && "bg-accent font-medium text-accent-foreground",
                  )}
                  onClick={() => {
                    setSearch("");
                    setCategory(c);
                  }}
                >
                  {c}
                  <span className="text-xs tabular-nums text-muted-foreground">{counts.get(c)}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <section className="flex min-w-0 flex-col gap-3" aria-live="polite">
          <p className="text-caption text-muted-foreground">
            {search ? `${shown.length} matching “${search.trim()}”` : `${shown.length} in ${category}`}
          </p>
          <div className="grid gap-2 lg:grid-cols-2">
            {shown.map((c) => (
              <ComponentRow key={`${c.library}/${c.name}`} c={c} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LibraryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button variant={active ? "secondary" : "ghost"} size="sm" aria-pressed={active} onClick={onClick}>
      {children}
    </Button>
  );
}

function ComponentRow({ c }: { c: CatalogComponent }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.install);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast(c.install);
    }
  };
  return (
    <Item variant="outline" className="items-start rounded-xl">
      <ItemContent className="min-w-0">
        <ItemTitle className="w-full">
          <span className="truncate">{c.title}</span>
          <Badge variant="outline" className="ml-auto shrink-0 font-normal text-muted-foreground">
            {c.library_name}
          </Badge>
        </ItemTitle>
        <ItemDescription className="line-clamp-2">{c.description ?? c.name}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon-sm" aria-label={`Copy install command for ${c.title}`} title={c.install} onClick={copy}>
          {copied ? <Check /> : <Copy />}
        </Button>
        {c.docs_url ? (
          <Button variant="ghost" size="icon-sm" asChild>
            <a href={c.docs_url} target="_blank" rel="noreferrer" aria-label={`${c.title} docs`}>
              <ExternalLink />
            </a>
          </Button>
        ) : null}
      </ItemActions>
    </Item>
  );
}

function SyncLibrary({ slug }: { slug: string }) {
  const sync = useSyncLibrary();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={sync.isPending}
      onClick={() =>
        sync.mutate(slug, {
          onSuccess: (l) => toast.success(`${l.name}: ${l.item_count} components`),
          onError: (e) => toast.error(e.message),
        })
      }
    >
      <RefreshCw data-icon="inline-start" className={sync.isPending ? "animate-spin" : undefined} /> Re-sync
    </Button>
  );
}

function AddLibrary() {
  const add = useAddLibrary();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [registry, setRegistry] = useState("");
  const [namespace, setNamespace] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    add.mutate(
      { name, registry_url: registry, namespace: namespace || undefined },
      {
        onSuccess: (l) => {
          toast.success(`Added ${l.name}: ${l.item_count} components`);
          setOpen(false);
          setName("");
          setRegistry("");
          setNamespace("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus data-icon="inline-start" /> Add library
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="contents">
          <DialogHeader>
            <DialogTitle>Add a component library</DialogTitle>
            <DialogDescription>
              Any shadcn-compatible registry. Its components are sorted into the same categories as the rest.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="lib-name">Name</FieldLabel>
              <Input id="lib-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Magic UI" />
            </Field>
            <Field data-invalid={add.isError || undefined}>
              <FieldLabel htmlFor="lib-registry">Registry index URL</FieldLabel>
              <Input
                id="lib-registry"
                required
                type="url"
                value={registry}
                onChange={(e) => setRegistry(e.target.value)}
                placeholder="https://magicui.design/r/registry.json"
              />
              <FieldDescription>Usually the site followed by /r/registry.json.</FieldDescription>
              {add.isError ? <FieldError>{add.error.message}</FieldError> : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="lib-namespace">Namespace (optional)</FieldLabel>
              <Input id="lib-namespace" value={namespace} onChange={(e) => setNamespace(e.target.value)} placeholder="magicui" />
              <FieldDescription>Used in install commands, as in npx shadcn add @magicui/marquee.</FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={add.isPending}>
              {add.isPending ? <Spinner data-icon="inline-start" /> : null}
              {add.isPending ? "Reading registry" : "Add library"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

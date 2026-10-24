import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LightboxGrid from "@/components/kokonutui/lightbox-grid";
import { CopyField } from "@/hub/components/CopyField";
import { LoadError } from "@/hub/components/LoadError";

interface SkillEntry {
  name: string;
  description: string;
  url: string;
  source: string | null;
  bytes: number;
}

interface TasteFile {
  about: string;
  collections: {
    name: string;
    source: string;
    focus: string;
    items: { title: string; by: string | null; url: string; image: string }[];
  }[];
}

const LIBRARIES = [
  { name: "shadcn/ui", url: "https://ui.shadcn.com", use: "Shell, lists, sheets, tabs, forms, empty and error states" },
  { name: "beUI", url: "https://beui.dev", use: "Voice orb, motion primitives, chat parts" },
  { name: "cult-ui", url: "https://www.cult-ui.com", use: "Kanban board" },
  { name: "Kokonut UI", url: "https://kokonutui.com", use: "Synced transcript, lightbox grid" },
];

function useStatic<T>(path: string) {
  return useQuery({
    queryKey: ["static", path],
    queryFn: async () => {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`${path} returned ${res.status}`);
      return (await (path.endsWith(".json") ? res.json() : res.text())) as T;
    },
    staleTime: Infinity,
  });
}

const origin = typeof window === "undefined" ? "" : window.location.origin;

export default function Resources() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">Resources</h2>
        <p className="max-w-2xl text-caption text-muted-foreground">
          What agents read before they work for you. Every item here is a plain file at a fixed URL, so any agent that can
          fetch can use it.
        </p>
      </header>

      <Tabs defaultValue="skills" className="gap-6">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="taste">Taste</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="skills">
          <Skills />
        </TabsContent>
        <TabsContent value="taste">
          <Taste />
        </TabsContent>
        <TabsContent value="components">
          <ItemGroup className="max-w-3xl gap-2">
            {LIBRARIES.map((lib) => (
              <Item key={lib.name} variant="outline" asChild>
                <a href={lib.url} target="_blank" rel="noreferrer">
                  <ItemContent>
                    <ItemTitle>{lib.name}</ItemTitle>
                    <ItemDescription>{lib.use}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </ItemActions>
                </a>
              </Item>
            ))}
          </ItemGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Skills() {
  const index = useStatic<{ skills: SkillEntry[] }>("/skills/index.json");
  const [open, setOpen] = useState<SkillEntry | null>(null);

  if (index.isPending) return <Spinner className="text-muted-foreground" />;
  if (index.isError) return <LoadError what="skills" error={index.error} onRetry={() => index.refetch()} />;

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">Point an agent at the index; each entry links to the full skill.</p>
        <CopyField label="Skills index URL" value={`${origin}/skills/index.json`} />
      </div>
      <ItemGroup className="gap-1">
        {index.data.skills.map((s) => (
          <Item key={s.name} asChild size="sm" className="rounded-xl">
            <button type="button" onClick={() => setOpen(s)} className="text-left">
              <ItemContent className="min-w-0">
                <ItemTitle>{s.name}</ItemTitle>
                <ItemDescription className="line-clamp-2">{s.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <FileText className="size-4 text-muted-foreground" />
              </ItemActions>
            </button>
          </Item>
        ))}
      </ItemGroup>
      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-2xl">
          {open ? <SkillText skill={open} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SkillText({ skill }: { skill: SkillEntry }) {
  const text = useStatic<string>(skill.url);
  return (
    <>
      <SheetHeader>
        <SheetTitle>{skill.name}</SheetTitle>
        <SheetDescription>
          {(skill.bytes / 1024).toFixed(1)} KB of text
          {skill.source ? (
            <>
              {" · "}
              <a href={skill.source} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                source
              </a>
            </>
          ) : null}
        </SheetDescription>
        <CopyField label="Skill URL" value={`${origin}${skill.url}`} />
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        {text.isPending ? (
          <Spinner className="text-muted-foreground" />
        ) : text.isError ? (
          <LoadError what={skill.name} error={text.error} onRetry={() => text.refetch()} />
        ) : (
          <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">{text.data}</pre>
        )}
      </div>
    </>
  );
}

function Taste() {
  const taste = useStatic<TasteFile>("/taste.json");
  if (taste.isPending) return <Spinner className="text-muted-foreground" />;
  if (taste.isError) return <LoadError what="taste references" error={taste.error} onRetry={() => taste.refetch()} />;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex max-w-3xl flex-col gap-2">
        <p className="text-caption text-muted-foreground">{taste.data.about}</p>
        <CopyField label="Taste library URL" value={`${origin}/taste.json`} />
      </div>
      {taste.data.collections.map((c) => (
        <section key={c.name} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="text-body font-semibold">{c.name}</h3>
              <p className="text-caption text-muted-foreground">
                {c.focus} · {c.items.length} references
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={c.source} target="_blank" rel="noreferrer">
                Open collection <ExternalLink data-icon="inline-end" />
              </a>
            </Button>
          </div>
          <LightboxGrid
            className="max-w-5xl"
            images={c.items.map((i) => ({
              src: i.image,
              alt: i.title,
              width: 1200,
              height: 900,
              caption: i.by ? `${i.title} · ${i.by}` : i.title,
            }))}
          />
        </section>
      ))}
    </div>
  );
}

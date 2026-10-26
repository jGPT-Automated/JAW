import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentCatalog } from "@/hub/components/ComponentCatalog";
import { CopyField } from "@/hub/components/CopyField";
import { DesignBoard } from "@/hub/components/DesignBoard";
import { LoadError } from "@/hub/components/LoadError";

interface SkillEntry {
  name: string;
  description: string;
  url: string;
  source: string | null;
  bytes: number;
}

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
          Components from every library you use, your design references, and the skills agents read. Agents can
          fetch all of it, and add to it.
        </p>
      </header>

      <Tabs defaultValue="components" className="gap-6">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="designs">Designs</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="components">
          <ComponentCatalog />
        </TabsContent>
        <TabsContent value="designs">
          <DesignBoard />
        </TabsContent>
        <TabsContent value="skills">
          <Skills />
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


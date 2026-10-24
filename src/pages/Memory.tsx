import { useState, type FormEvent } from "react";
import { Brain, Pin, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PageHeader } from "@/hub/components/PageHeader";
import { useAgents, useDeleteMemory, useMemories, useSaveMemory } from "@/hub/data/queries";
import { ago } from "@/hub/lib/time";
import type { Memory as MemoryRow } from "@/hub/lib/types";

const KINDS: { value: MemoryRow["kind"]; label: string }[] = [
  { value: "fact", label: "Fact" },
  { value: "preference", label: "Preference" },
  { value: "decision", label: "Decision" },
  { value: "todo", label: "To do" },
  { value: "note", label: "Note" },
];

export default function Memory() {
  const [search, setSearch] = useState("");
  const [content, setContent] = useState("");
  const [kind, setKind] = useState<MemoryRow["kind"]>("fact");
  const memories = useMemories(search.trim());
  const { data: agents = [] } = useAgents();
  const save = useSaveMemory();
  const remove = useDeleteMemory();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    save.mutate(
      { content: content.trim(), kind },
      {
        onSuccess: () => {
          setContent("");
          toast.success("Remembered");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const author = (m: MemoryRow) =>
    m.source === "ui" ? "You" : agents.find((a) => a.id === m.agent_id)?.name ?? (m.source === "agent" ? "An agent" : m.source);

  return (
    <>
      <PageHeader
        title="Memory"
        description="Shared memory for JAW and every connected agent. Voice conversations recall it at the start of each call."
      />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-3">
          <InputGroup>
            <InputGroupInput
              placeholder="Search what's remembered"
              aria-label="Search memory"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          {memories.isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : memories.data?.length ? (
            <ItemGroup className="gap-2">
              {memories.data.map((m) => (
                <Item key={m.id} variant="outline" className="bg-card">
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full">
                      <Badge variant="secondary">{KINDS.find((k) => k.value === m.kind)?.label ?? m.kind}</Badge>
                      {m.pinned ? <Pin className="text-muted-foreground" aria-label="Pinned" /> : null}
                      <span className="ml-auto text-xs font-normal text-muted-foreground">
                        {author(m)}, {ago(m.created_at)}
                      </span>
                    </ItemTitle>
                    <ItemDescription className="line-clamp-none text-foreground">{m.content}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Forget this"
                      onClick={() => remove.mutate(m.id, { onError: (err) => toast.error(err.message) })}
                    >
                      <Trash2 />
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Brain />
                </EmptyMedia>
                <EmptyTitle>{search ? "Nothing matches" : "Nothing remembered yet"}</EmptyTitle>
                <EmptyDescription>
                  {search ? "Try different words." : "Tell JAW something in a voice call, or add it here."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>

        <Card className="lg:sticky lg:top-20">
          <form onSubmit={submit} className="contents">
            <CardHeader>
              <CardTitle>Add a memory</CardTitle>
              <CardDescription>Plain sentences work best: one fact per memory.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="memory-content">What should be remembered</FieldLabel>
                  <Textarea
                    id="memory-content"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="LocalCheck releases go out on Thursdays."
                  />
                </Field>
                <Field>
                  <FieldLabel>Kind</FieldLabel>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    value={kind}
                    onValueChange={(v) => v && setKind(v as MemoryRow["kind"])}
                    className="flex-wrap"
                  >
                    {KINDS.map((k) => (
                      <ToggleGroupItem key={k.value} value={k.value}>
                        {k.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
                <Button type="submit" disabled={save.isPending || !content.trim()}>
                  {save.isPending ? <Spinner data-icon="inline-start" /> : null}
                  Remember this
                </Button>
              </FieldGroup>
            </CardContent>
          </form>
        </Card>
      </div>
    </>
  );
}

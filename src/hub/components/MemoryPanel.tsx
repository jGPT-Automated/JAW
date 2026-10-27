import { type FormEvent, useDeferredValue, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { LoadError } from "@/hub/components/LoadError";
import { useDeleteMemory, useMemories, useSaveMemory } from "@/hub/data/queries";

/** What JAW remembers: the same store the voice agent recalls from. Search, add, forget. */
export function MemoryPanel() {
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search.trim());
  const memories = useMemories(query);
  const save = useSaveMemory();
  const remove = useDeleteMemory();
  const [draft, setDraft] = useState("");

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    save.mutate(
      { content: draft.trim(), kind: "note" },
      { onSuccess: () => setDraft(""), onError: (err) => toast.error(err.message) },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search memory" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search memory" />
      </InputGroup>

      {memories.isPending ? (
        <Spinner className="text-muted-foreground" />
      ) : memories.isError ? (
        <LoadError what="memory" error={memories.error} onRetry={() => memories.refetch()} />
      ) : memories.data.length ? (
        <ItemGroup className="gap-1">
          {memories.data.map((m) => (
            <Item key={m.id} size="sm" className="items-start rounded-xl px-2">
              <ItemContent className="min-w-0">
                <ItemTitle className="font-normal leading-snug">{m.content}</ItemTitle>
                <ItemDescription className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {m.kind}
                  </Badge>
                  {formatDistanceToNowStrict(new Date(m.created_at))} ago
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" aria-label="Forget this" onClick={() => remove.mutate(m.id)}>
                  <Trash2 />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <p className="text-caption text-muted-foreground">
          {query ? `Nothing matches “${query}”.` : "Nothing saved yet. Tell JAW something worth keeping, or add it here."}
        </p>
      )}

      <form onSubmit={add}>
        <InputGroup>
          <InputGroupInput placeholder="Add a memory" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="New memory" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" size="icon-xs" aria-label="Save memory" disabled={save.isPending || !draft.trim()}>
              <Plus />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}

import { useMemo, useState } from "react";
import { ExternalLink, Puzzle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CopyField } from "@/hub/components/CopyField";
import { PageHeader } from "@/hub/components/PageHeader";
import { useSkills } from "@/hub/data/queries";
import { LLMS_URL } from "@/hub/lib/endpoints";

export default function Skills() {
  const { data: skills = [], isLoading } = useSkills();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => [...new Set(skills.flatMap((s) => s.tags))].sort(), [skills]);
  const visible = skills.filter(
    (s) =>
      (tag === "all" || s.tags.includes(tag)) &&
      (!query.trim() || `${s.name} ${s.description} ${s.source}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  return (
    <>
      <PageHeader
        title="Skills"
        description="Playbooks agents load before they work: design, Neon, LiveKit, Inngest, auth. Agents read this list from the public index, so it's the one place to add new ones."
        actions={
          <Button variant="outline" asChild>
            <a href="https://skills.sh" target="_blank" rel="noreferrer">
              Browse skills.sh <ExternalLink data-icon="inline-end" />
            </a>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>For agents</CardTitle>
          <CardDescription>Any agent with fetch can read the public index. Private state needs its inbound token.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4 md:flex-row">
            <Field>
              <FieldLabel>Index for agents</FieldLabel>
              <CopyField label="llms.txt URL" value={LLMS_URL} />
              <FieldDescription>Docs marked public, these skills, and the agent API.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Install one into a repo</FieldLabel>
              <CopyField label="install command" value="npx skills add <owner/repo> -s <skill>" />
              <FieldDescription>Copied into .claude/skills and pinned in skills-lock.json.</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={tag}
          onValueChange={(v) => setTag(v || "all")}
          className="flex-wrap"
          aria-label="Filter by topic"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          {tags.map((t) => (
            <ToggleGroupItem key={t} value={t} className="capitalize">
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <InputGroup className="md:max-w-xs">
          <InputGroupInput placeholder="Search skills" aria-label="Search skills" value={query} onChange={(e) => setQuery(e.target.value)} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : visible.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((s) => (
            <Card key={s.id} className="gap-4 py-5">
              <CardHeader className="px-5">
                <CardTitle>{s.name}</CardTitle>
                <CardDescription>{s.source}</CardDescription>
                <CardAction>
                  <Badge variant={s.installed_in_repo ? "default" : "outline"}>
                    {s.installed_in_repo ? "In this repo" : "Recommended"}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="px-5 text-caption text-muted-foreground">{s.description}</CardContent>
              <CardFooter className="mt-auto flex-col items-stretch gap-3 px-5">
                <CopyField label={`install command for ${s.name}`} value={s.install} />
                <div className="flex flex-wrap items-center gap-1.5">
                  {s.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="capitalize">
                      {t}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      Details <ExternalLink data-icon="inline-end" />
                    </a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Puzzle />
            </EmptyMedia>
            <EmptyTitle>No skills match</EmptyTitle>
            <EmptyDescription>Try another topic or search.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}

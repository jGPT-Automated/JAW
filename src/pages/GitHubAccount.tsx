import { useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import { ExternalLink, GitPullRequest, MapPin, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import ActivityTerrain from "@/components/kokonutui/activity-terrain";
import AIDiffReview, { type FileDecision } from "@/components/kokonutui/ai-diff-review";
import TopoBackground from "@/components/kokonutui/topo-background";
import { LoadError } from "@/hub/components/LoadError";
import { usePullFiles, useGitHubAccount, useRefreshGitHubAccount, useReviewDecision } from "@/hub/data/queries";
import { isTrackedAccount } from "@/hub/github-accounts";
import type { PullSummary } from "@/hub/lib/types";
import NotFound from "./NotFound";

// Graphite to lime, so the terrain reads in the brand's one accent.
const TERRAIN_THEME = [
  "[--terrain-0:#e4e4de] [--terrain-1:#c4e5b6] [--terrain-2:#8fd16f] [--terrain-3:#4cc02b] [--terrain-4:#2f7d18] [--terrain-accent:#2f7d18] [--terrain-text:#6f6f6e]",
  "dark:[--terrain-0:#262625] dark:[--terrain-1:#2f4a26] dark:[--terrain-2:#3f7a2c] dark:[--terrain-3:#4cc02b] dark:[--terrain-4:#9be57f] dark:[--terrain-accent:#9be57f] dark:[--terrain-text:#8f8f8e]",
  "max-w-none border-border bg-card dark:border-border dark:bg-card",
].join(" ");

const ago = (iso: string) => `${formatDistanceToNowStrict(new Date(iso))} ago`;

export default function GitHubAccount() {
  const { login = "" } = useParams();
  if (!isTrackedAccount(login)) return <NotFound />;
  return <Account login={login} key={login} />;
}

function Account({ login }: { login: string }) {
  const account = useGitHubAccount(login);
  const refresh = useRefreshGitHubAccount(login);
  const [pull, setPull] = useState<PullSummary | null>(null);
  const [allPulls, setAllPulls] = useState(false);

  if (account.isPending) return <Spinner className="text-muted-foreground" />;
  if (account.isError) return <LoadError what={`@${login}`} error={account.error} onRetry={() => account.refetch()} />;
  const { data: a, fetched_at, stale, error } = account.data;
  const projects = a.repos.filter((r) => !r.fork && !r.archived).slice(0, 9);
  const lastPush = a.repos[0]?.pushed_at;

  return (
    <div className="flex min-w-0 flex-col gap-10">
      <TopoBackground
        speed={0.4}
        labels={false}
        seed={login.length * 7}
        className="min-h-0 items-stretch justify-start rounded-3xl border bg-card text-foreground/10 dark:bg-card dark:text-foreground/10"
      >
        <header className="relative flex w-full flex-col gap-6 p-6 text-foreground md:p-8">
          <div className="flex flex-wrap items-start gap-5">
            <Avatar className="size-20 rounded-2xl border">
              <AvatarImage src={a.avatar_url} alt="" />
              <AvatarFallback className="rounded-2xl">{a.login.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="text-heading-sm font-semibold">{a.name ?? a.login}</h2>
              <p className="text-caption text-muted-foreground">
                @{a.login}
                {a.location ? (
                  <>
                    {" · "}
                    <MapPin className="inline size-3.5 align-[-2px]" /> {a.location}
                  </>
                ) : null}
              </p>
              {a.bio ? <p className="max-w-xl text-[15px] text-muted-foreground">{a.bio}</p> : null}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={refresh.isPending}
                onClick={() => refresh.mutate(undefined, { onError: (e) => toast.error(e.message) })}
              >
                <RefreshCw data-icon="inline-start" className={refresh.isPending ? "animate-spin" : undefined} /> Refresh
              </Button>
              <Button size="sm" asChild>
                <a href={a.html_url} target="_blank" rel="noreferrer">
                  GitHub <ExternalLink data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Contributions, last year" value={a.contributions_last_year.toLocaleString()} />
            <Stat label="Public repos" value={a.public_repos} />
            <Stat label="Open pull requests" value={a.open_prs.length} />
            <Stat label="Last push" value={lastPush ? ago(lastPush) : "never"} />
          </dl>
          <p className="text-xs text-muted-foreground">
            Updated {ago(fetched_at)}
            {stale ? ` · GitHub didn't answer (${error}); showing the last good copy` : ""}
          </p>
        </header>
      </TopoBackground>

      {a.calendar.length ? (
        <ActivityTerrain
          data={a.calendar}
          endDate={a.calendar_end ?? undefined}
          title={`${a.contributions_last_year.toLocaleString()} contributions in the last year`}
          className={TERRAIN_THEME}
        />
      ) : null}

      <div className="grid gap-10 xl:grid-cols-2">
        <Section title="Open pull requests" count={a.open_prs.length}>
          {a.open_prs.length ? (
            <ItemGroup className="gap-1">
              {(allPulls ? a.open_prs : a.open_prs.slice(0, 6)).map((p) => (
                <Item key={p.url} asChild size="sm" className="rounded-xl">
                  <button type="button" className="text-left" onClick={() => setPull(p)}>
                    <ItemContent className="min-w-0">
                      <ItemTitle className="w-full truncate">{p.title}</ItemTitle>
                      <ItemDescription>
                        {p.repo} #{p.number} · updated {ago(p.updated_at)}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {p.draft ? <Badge variant="outline">Draft</Badge> : null}
                      <GitPullRequest className="size-4 text-muted-foreground" />
                    </ItemActions>
                  </button>
                </Item>
              ))}
              {a.open_prs.length > 6 && !allPulls ? (
                <Button variant="ghost" size="sm" className="w-fit" onClick={() => setAllPulls(true)}>
                  Show all {a.open_prs.length}
                </Button>
              ) : null}
            </ItemGroup>
          ) : (
            <Quiet>No open pull requests.</Quiet>
          )}
        </Section>

        <Section title="Recent activity" count={a.events.length}>
          {a.events.length ? (
            <ItemGroup className="gap-1">
              {a.events.slice(0, 12).map((e) => (
                <Item key={e.id} asChild size="sm" className="rounded-xl">
                  <a href={e.url} target="_blank" rel="noreferrer">
                    <ItemContent className="min-w-0">
                      <ItemTitle className="w-full truncate">{e.text}</ItemTitle>
                      <ItemDescription>
                        {e.repo} · {ago(e.created_at)}
                      </ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Quiet>No public activity in the last 90 days.</Quiet>
          )}
        </Section>
      </div>

      <Section title="Projects" count={projects.length} hint="Most recently pushed">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((r) => (
            <Item key={r.full_name} variant="outline" asChild className="items-start rounded-2xl">
              <a href={r.html_url} target="_blank" rel="noreferrer">
                <ItemContent className="min-w-0">
                  <ItemTitle className="w-full truncate">{r.name}</ItemTitle>
                  <ItemDescription className="line-clamp-2 min-h-10">{r.description ?? "No description"}</ItemDescription>
                  <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {r.language ? <span>{r.language}</span> : null}
                    {r.stars ? (
                      <span>
                        <Star className="inline size-3 align-[-1px]" /> {r.stars}
                      </span>
                    ) : null}
                    <span>pushed {ago(r.pushed_at)}</span>
                  </p>
                </ItemContent>
              </a>
            </Item>
          ))}
        </div>
      </Section>

      <Sheet open={!!pull} onOpenChange={(v) => !v && setPull(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">{pull ? <PullReview pull={pull} /> : null}</SheetContent>
      </Sheet>
    </div>
  );
}

function PullReview({ pull }: { pull: PullSummary }) {
  const files = usePullFiles(pull.repo, pull.number);
  const decide = useReviewDecision();
  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-body leading-snug">{pull.title}</SheetTitle>
        <SheetDescription>
          {pull.repo} #{pull.number}. Accept or reject each file; agents read your calls from the hub.
        </SheetDescription>
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <a href={pull.url} target="_blank" rel="noreferrer">
            Open on GitHub <ExternalLink data-icon="inline-end" />
          </a>
        </Button>
      </SheetHeader>
      <div className="px-4 pb-6">
        {files.isPending ? (
          <Spinner className="text-muted-foreground" />
        ) : files.isError ? (
          <LoadError what="the changes" error={files.error} onRetry={() => files.refetch()} />
        ) : (
          <AIDiffReview
            files={files.data.data}
            defaultDecisions={files.data.decisions as Record<string, FileDecision>}
            className="max-w-none"
            onDecision={(path: string, decision: FileDecision) =>
              decide.mutate(
                { repo: pull.repo, pr_number: pull.number, path, decision },
                { onError: (e) => toast.error(`Couldn't save: ${e.message}`) },
              )
            }
          />
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-subheading font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function Section({ title, count, hint, children }: { title: string; count: number; hint?: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <h3 className="text-body font-semibold">{title}</h3>
        <span className="text-caption text-muted-foreground tabular-nums">{count}</span>
        {hint ? <span className="ml-auto text-caption text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

function Quiet({ children }: { children: React.ReactNode }) {
  return <p className="text-caption text-muted-foreground">{children}</p>;
}

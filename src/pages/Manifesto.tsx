import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Timeline } from "@/components/motion/timeline";
import {
  close,
  decisions,
  frameworks,
  hero,
  layers,
  principles,
  projects,
  radarData,
  thesisPhrases,
} from "@/content/manifesto";

function Kicker({ num, children }: { num: string; children: string }) {
  return (
    <p className="text-caption text-muted-foreground">
      Part {num}: {children}
    </p>
  );
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Active: "default",
  Building: "secondary",
  Designed: "outline",
};

export default function Manifesto() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-24 py-6 md:py-12">
      <section className="space-y-6">
        <Badge variant="outline">
          {hero.archetype}
        </Badge>
        <TextReveal
          as="h2"
          text={hero.title}
          className="text-heading font-semibold md:text-display"
        />
        <ScrollReveal delay={0.4}>
          <p className="max-w-xl text-lg text-muted-foreground">{hero.lede}</p>
        </ScrollReveal>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/">
              Open the hub <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/protocol">Read the protocol</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-10">
        <Kicker num="II">The Thesis</Kicker>
        <div className="space-y-2">
          {thesisPhrases.map((p) => (
            <TextReveal
              key={p}
              as="p"
              text={p}
              whileInView
              className="text-subheading font-medium md:text-heading"
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <ScrollReveal key={p.label} delay={i * 0.08}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="leading-snug">{p.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">{p.text}</CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <Kicker num="III">The Stack</Kicker>
        <h3 className="text-subheading font-medium">Orchestration → Execution → Persistence → Verification</h3>
        <BouncyAccordion
          defaultValue={layers[0].id}
          items={layers.map((l) => ({
            id: l.id,
            icon: <span className="text-xs text-muted-foreground tabular-nums">{l.num}</span>,
            title: (
              <span>
                {l.name} <span className="text-muted-foreground">— {l.subtitle}</span>
              </span>
            ),
            description: (
              <div className="space-y-3">
                <p>{l.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {l.details.map((d) => (
                    <Badge key={d} variant="secondary">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
            ),
          }))}
        />
      </section>

      <section className="space-y-6">
        <Kicker num="IV">The Frameworks</Kicker>
        <div className="grid gap-4 md:grid-cols-2">
          {frameworks.map((f, i) => (
            <ScrollReveal key={f.id} delay={(i % 2) * 0.08}>
              <Card className="h-full">
                <CardHeader>
                  <CardDescription>{f.tagline}</CardDescription>
                  <CardTitle className="text-lg">{f.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">{f.description}</CardContent>
                <CardFooter className="flex-wrap gap-1.5">
                  {f.flow.map((step, j) => (
                    <span key={step} className="flex items-center gap-1.5">
                      <Badge variant="outline">
                        {step}
                      </Badge>
                      {j < f.flow.length - 1 ? <ArrowRight className="size-3 text-muted-foreground" /> : null}
                    </span>
                  ))}
                </CardFooter>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <Kicker num="V">The Work</Kicker>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p, i) => (
            <ScrollReveal key={p.title} delay={(i % 2) * 0.08}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{p.problem}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex-wrap gap-1.5">
                  <Badge variant={STATUS_VARIANT[p.status] ?? "outline"}>{p.status}</Badge>
                  {p.stack.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <Kicker num="VI">The Profile</Kicker>
        <Card>
          <CardHeader>
            <CardTitle>Capability distribution</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {radarData.map((d) => (
              <div key={d.subject} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{d.subject}</span>
                  <span className="text-muted-foreground tabular-nums">{d.value}</span>
                </div>
                <Progress value={d.value} aria-label={d.subject} />
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="overflow-hidden">
        <Timeline
          aria-label="Decision log"
          events={decisions.map((d, i) => ({
            id: `decision-${i}`,
            date: `${d.year}-${String(i + 1).padStart(2, "0")}-01`,
            title: d.event,
            media: <p className="p-4 text-left text-xs leading-relaxed text-muted-foreground">{d.detail}</p>,
          }))}
          formatDate={(date) => String(date.getUTCFullYear())}
        />
        </div>
      </section>

      <section className="space-y-6">
        <Separator />
        <Kicker num="VII">{close.kicker}</Kicker>
        <TextReveal as="h3" text={close.headline} whileInView className="text-heading-sm font-semibold md:text-heading-lg" />
        <div className="max-w-xl space-y-4 text-muted-foreground">
          {close.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Button variant="outline" asChild>
          <a href={close.contact}>
            <Mail /> Connect
          </a>
        </Button>
      </section>
    </div>
  );
}

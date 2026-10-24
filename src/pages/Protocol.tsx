import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { protocolSections } from "@/content/protocol";

export default function Protocol() {
  const [active, setActive] = useState(protocolSections[0].id);

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(`protocol-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Doctrine</p>
        <h3 className="mt-2 font-serif text-xl">Sentinel v2.0</h3>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">ref · 2026.04.30</p>
        <nav aria-label="Protocol sections" className="mt-5 space-y-0.5 border-l">
          {protocolSections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              aria-current={active === s.id ? "true" : undefined}
              className={cn(
                "-ml-px block w-full border-l-2 py-1.5 pl-4 text-left transition-colors",
                active === s.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="block font-mono text-[10px] tracking-widest">{s.num}</span>
              <span className="block text-xs">{s.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <article className="max-w-3xl min-w-0">
        <header className="mb-12">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge>Omni-Protocol</Badge>
            <Badge variant="outline">Sentinel v2.0</Badge>
            <Badge variant="secondary">Draft · Active doctrine</Badge>
          </div>
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            Agentic AI Platform
            <br />
            Architecture
          </h2>
        </header>
        <Separator className="mb-12" />
        <div className="space-y-20">
          {protocolSections.map((s) => (
            <section key={s.id} id={`protocol-${s.id}`} className="scroll-mt-20">
              <div className="mb-3 flex items-baseline gap-4 font-mono text-[11px] tracking-widest uppercase">
                <span className="text-primary">§ {s.num}</span>
                {s.kicker ? <span className="text-muted-foreground">{s.kicker}</span> : null}
              </div>
              <h3 className="mb-6 text-2xl font-semibold tracking-tight">{s.title}</h3>
              {s.body}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

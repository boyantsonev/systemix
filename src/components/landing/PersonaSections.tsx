import Link from "next/link";
import { TrackedLink } from "@/components/systemix/LandingEvents";
import { LiveLoopProof } from "@/components/landing/LiveLoopProof";
import { HumansMachinesToggle } from "@/components/landing/HumansMachinesToggle";
import { LoopDiagram } from "@/components/loop/LoopDiagram";
import { Eyebrow, Lead, Section, SectionHeading } from "@/components/landing/sections";
import { getLatestSnapshot, getTrend } from "@/lib/state/drift-history";
import { PERSONA_TAG, type PersonaContent } from "@/lib/landing/personas";

// ── Hero ──────────────────────────────────────────────────────────────────────

function heroEvent(href: string): string | null {
  if (!href.startsWith("mailto:")) return null;
  return href.includes("Brand%20clone") ? "brand_clone_request" : "book_a_call";
}

export function PersonaHero({ persona }: { persona: PersonaContent }) {
  const { hero } = persona;
  const event = heroEvent(hero.primaryCta.href);
  const ctaClass =
    "inline-block rounded-full bg-foreground px-6 py-3 text-[13px] font-medium text-background transition-opacity hover:opacity-90";

  return (
    <section className="relative">
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          {hero.eyebrow}
        </p>
        <h1 className="mb-7 text-[2.5rem] font-black leading-[1.08] tracking-tight sm:text-[3.25rem]">
          {hero.heading}
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          {hero.body}
        </p>
        {event ? (
          <TrackedLink
            href={hero.primaryCta.href}
            event={event}
            location={`persona-hero-${persona.key}`}
            persona={persona.key}
            className={ctaClass}
          >
            {hero.primaryCta.label}
          </TrackedLink>
        ) : (
          <a href={hero.primaryCta.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
            {hero.primaryCta.label}
          </a>
        )}
      </div>
    </section>
  );
}

// ── JTBD · "how this helps you" ───────────────────────────────────────────────

export function PersonaJtbd({ persona }: { persona: PersonaContent }) {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>What changes for you</Eyebrow>
        <SectionHeading>{persona.jtbd.heading}</SectionHeading>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {persona.jtbd.items.map((it) => (
          <div key={it.title} className="rounded-xl border border-border/40 bg-card p-6">
            <p className="mb-2 text-[15px] font-bold text-foreground">{it.title}</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Proof · one persona-specific section ──────────────────────────────────────

/** Build-time drift teaser — honest empty state when no audits have run yet. */
function DriftTeaser() {
  const latest = getLatestSnapshot();
  const trend = getTrend(10);

  if (!latest) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6">
        <p className="font-mono text-[12px] text-muted-foreground">
          No drift snapshots yet — the first audit of this site lands here when
          the drift report runs. Honest by construction: this card reads the
          same file the automation writes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6">
      <div className="flex items-baseline gap-4">
        <span className="text-3xl font-black">{latest.score}</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/50">
          drift score · {new Date(latest.runAt).toISOString().slice(0, 10)}
        </span>
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground">
        {latest.critical} critical · {latest.warnings} warnings · {latest.componentsAudited} components audited
        {trend.length > 1 ? ` · ${trend.length} audits on record` : ""}
      </p>
      {latest.topOffenders.length > 0 && (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground/60">
          top offenders: {latest.topOffenders.slice(0, 3).join(" · ")}
        </p>
      )}
    </div>
  );
}

/** A component contract record, shown as the file it actually is. */
function ContractSnippet() {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border/50 bg-background p-4 font-mono text-[12px] leading-relaxed">
      <code>
        <span className="text-muted-foreground/50">{`// contract/components/hitl-queue.mdx`}</span>{"\n"}
        {`---\ncomponent: HitlQueue\nparity: clean\npath: src/components/systemix/HitlQueue.tsx\n---\n\n## Rationale\nDecisions queue here instead of shipping silently —\nthe amber border is the "a human owes this a call" signal.\n\n## Drift\nNone recorded. Last audit: pending first /drift-report run.`}
      </code>
    </pre>
  );
}

function OutcomesCard({ persona }: { persona: PersonaContent }) {
  return (
    <div className="rounded-xl border border-foreground bg-card p-6 sm:p-7">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
        1-week sprint
      </p>
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Session one clones your brand into tokens. By end of week your experiments
        are live, your signals wired, and the automation is yours — files in your repo,
        no platform to churn from.
      </p>
      <TrackedLink
        href="mailto:boyan.works@gmail.com?subject=Systemix%20sprint"
        event="book_a_call"
        location={`persona-proof-${persona.key}`}
        persona={persona.key}
        className="mt-5 inline-block rounded-full bg-foreground px-5 py-2.5 text-[12px] font-medium text-background transition-opacity hover:opacity-90"
      >
        Book a scoping call →
      </TrackedLink>
    </div>
  );
}

export function PersonaProof({ persona }: { persona: PersonaContent }) {
  const { proof } = persona;
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>Proof, not promises</Eyebrow>
        <SectionHeading>{proof.heading}</SectionHeading>
        <Lead>{proof.body}</Lead>
      </div>
      <div className="mt-10 max-w-3xl">
        {proof.kind === "drift" && <DriftTeaser />}
        {proof.kind === "experiments" && <LiveLoopProof />}
        {proof.kind === "mcp" && <HumansMachinesToggle />}
        {proof.kind === "contract" && <ContractSnippet />}
        {proof.kind === "outcomes" && <OutcomesCard persona={persona} />}
      </div>
    </Section>
  );
}

// ── The context-engine reframe: this persona as a participant in the meta-loop ──

/** The one job this persona owns. */
export function PersonaJob({ persona }: { persona: PersonaContent }) {
  if (!persona.job) return null;
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>{persona.job.heading}</Eyebrow>
        <p className="mt-4 text-[19px] leading-relaxed text-foreground">{persona.job.body}</p>
      </div>
    </Section>
  );
}

/** Their operational loop — a compact ordered strip (not the SVG). */
export function PersonaLoop({ persona }: { persona: PersonaContent }) {
  if (!persona.loop) return null;
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{persona.loop.heading}</Eyebrow>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {persona.loop.steps.map((s, i) => (
          <div key={s.label} className="rounded-xl border border-border/40 bg-card p-6">
            <p className="mb-2 font-mono text-[11px] text-primary">{String(i + 1).padStart(2, "0")}</p>
            <p className="mb-1 text-[15px] font-bold text-foreground">{s.label}</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** How they set up: the doors/skills they reach for. */
export function PersonaSetup({ persona }: { persona: PersonaContent }) {
  if (!persona.setup) return null;
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{persona.setup.heading}</Eyebrow>
        <Lead>{persona.setup.body}</Lead>
      </div>
      <div className="mt-6 flex max-w-3xl flex-wrap gap-2">
        {persona.setup.skills.map((s) => (
          <code key={s} className="rounded-md border border-border/50 bg-background px-2.5 py-1 font-mono text-[12px] text-foreground">
            {s}
          </code>
        ))}
      </div>
    </Section>
  );
}

/** Their data-flow: what they put into the loop and read back out. */
export function PersonaSignals({ persona }: { persona: PersonaContent }) {
  if (!persona.signals) return null;
  const { signals } = persona;
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{signals.heading}</Eyebrow>
        <Lead>{signals.body}</Lead>
      </div>
      <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="rounded-xl border border-border/40 bg-card p-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">You put in →</p>
          <ul className="flex flex-col gap-1.5">
            {signals.produces.map((p) => (
              <li key={p} className="text-[13px] text-foreground">{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border/40 bg-card p-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">← You read back</p>
          <ul className="flex flex-col gap-1.5">
            {signals.consumes.map((c) => (
              <li key={c} className="text-[13px] text-foreground">{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/** Where this persona sits in the shared meta-loop — the diagram, their lane lit. */
export function PersonaMetaLane({ persona }: { persona: PersonaContent }) {
  if (!persona.feedsMeta) return null;
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>Where you sit in the automation</Eyebrow>
        <Lead>{persona.feedsMeta}</Lead>
      </div>
      <LoopDiagram variant="meta" highlightPersona={PERSONA_TAG[persona.key]} className="mt-10" />
    </Section>
  );
}

// ── Guide CTA ─────────────────────────────────────────────────────────────────

export function PersonaGuideCta({ persona }: { persona: PersonaContent }) {
  return (
    <Section>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-[15px] text-muted-foreground">
          Want the step-by-step? The {persona.label.toLowerCase()} guide walks the
          whole loop in ten minutes.
        </p>
        <Link
          href={persona.guideHref}
          className="mt-5 inline-block rounded-full border border-border/60 px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-foreground"
        >
          Read the {persona.label.toLowerCase()} guide →
        </Link>
      </div>
    </Section>
  );
}

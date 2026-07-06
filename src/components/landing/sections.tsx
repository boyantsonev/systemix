import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/systemix/ThemeToggle";
import { InstallCommand, TrackedLink } from "@/components/systemix/LandingEvents";
import { LoopOrbit } from "@/components/landing/LoopOrbit";
import { LiveLoopProof } from "@/components/landing/LiveLoopProof";
import { ThreeDoorsBento } from "@/components/landing/ThreeDoorsBento";
import { TrustBento } from "@/components/landing/TrustBento";
import {
  GITHUB_URL,
  about,
  bottomCta,
  brandClone,
  doors,
  effect,
  footer,
  gap,
  loop,
  nav,
  services,
  trust,
} from "@/lib/landing/content";

// ── Shared section primitives ─────────────────────────────────────────────────

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("border-t border-border/40 py-28 sm:py-36", className)}>
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </p>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[2rem] font-black leading-[1.12] tracking-tight sm:text-[2.25rem]">
      {children}
    </h2>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-2">
      <div className="mx-auto flex h-12 max-w-5xl items-center gap-6 rounded-full border border-border/50 bg-background/80 px-5 shadow-[var(--shadow-sm)] backdrop-blur-md">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <span className="text-xl font-black tracking-tight">systemix</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 sm:flex">
          {nav.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <TrackedLink href={nav.cta.href} event="book_a_call" location="nav">
              {nav.cta.label}
            </TrackedLink>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ── Problem ───────────────────────────────────────────────────────────────────

export function Problem() {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{gap.label}</Eyebrow>
        <SectionHeading>{gap.heading}</SectionHeading>
        <Lead>{gap.body}</Lead>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {gap.stats.map((s) => (
          <div key={s.k} className="rounded-xl border border-border/40 bg-card px-6 py-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              {s.k}
            </p>
            <p className="text-lg font-bold text-foreground">{s.v}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Effect ────────────────────────────────────────────────────────────────────

export function Effect() {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{effect.label}</Eyebrow>
        <SectionHeading>{effect.heading}</SectionHeading>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {effect.items.map((it) => (
          <div key={it.title} className="rounded-xl border border-border/40 bg-card p-6">
            <p className="mb-2 text-[15px] font-bold text-foreground">{it.title}</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Brand clone hook ─────────────────────────────────────────────────────────

export function BrandCloneHook() {
  return (
    <Section>
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-16 sm:items-center">
        <div>
          <Eyebrow>{brandClone.label}</Eyebrow>
          <SectionHeading>{brandClone.heading}</SectionHeading>
          <Lead>{brandClone.body}</Lead>
        </div>
        <div className="rounded-xl border border-border/40 bg-card p-6 sm:p-7">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            src/app/globals.css
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border/50 bg-background p-4 font-mono text-[12px] leading-relaxed">
            <code>
              <span className="text-muted-foreground/50">  :root {`{`}</span>{"\n"}
              <span className="text-red-500/80">-   --primary: oklch(0.21 0.012 70);</span>{"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">+   --primary: oklch(0.55 0.21 27);</span>{"\n"}
              <span className="text-red-500/80">-   --radius: 0.5rem;</span>{"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">+   --radius: 0.875rem;</span>{"\n"}
              <span className="text-red-500/80">-   --background: oklch(97% 0.005 90);</span>{"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">+   --background: oklch(98.5% 0.01 240);</span>{"\n"}
              <span className="text-muted-foreground/50">  {`}`}</span>
            </code>
          </pre>
          <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
            Your colors, type scale, and radius — scraped from your live site, mapped to design
            tokens. A reviewable diff, not a redesign.
          </p>
          <TrackedLink
            href={brandClone.cta.href}
            event="brand_clone_request"
            location="brand-clone"
            className="mt-5 block rounded-full bg-foreground px-5 py-3 text-center text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            {brandClone.cta.label}
          </TrackedLink>
          <p className="mt-4 text-[11px] text-muted-foreground/50">{brandClone.note}</p>
        </div>
      </div>
    </Section>
  );
}

// ── Solution · the loop ───────────────────────────────────────────────────────

export function TheLoop() {
  return (
    <section id="loop" className="border-t border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl">
          <Eyebrow>{loop.label}</Eyebrow>
          <SectionHeading>{loop.heading}</SectionHeading>
          <Lead>{loop.body}</Lead>
        </div>
      </div>

      {/* full-bleed tool constellation */}
      <LoopOrbit className="mx-auto mt-6 max-w-6xl px-6" />

      <div className="mx-auto mt-4 flex max-w-5xl items-center justify-center gap-2 px-6 font-mono text-[12px] text-muted-foreground/70">
        {loop.steps.map((s, i) => (
          <span key={s.title} className="flex items-center gap-2">
            <span>{s.title}</span>
            {i < loop.steps.length - 1 && (
              <span aria-hidden className="text-muted-foreground/30">
                →
              </span>
            )}
          </span>
        ))}
      </div>

      <LiveLoopProof className="mx-auto mt-12 max-w-3xl px-6" />
    </section>
  );
}

// ── Solution · three doors ────────────────────────────────────────────────────

export function ThreeDoors() {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{doors.label}</Eyebrow>
        <SectionHeading>{doors.heading}</SectionHeading>
        <Lead>{doors.body}</Lead>
      </div>
      <div className="mt-14">
        <ThreeDoorsBento />
      </div>
    </Section>
  );
}

// ── Trust ─────────────────────────────────────────────────────────────────────

export function Trust() {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{trust.label}</Eyebrow>
        <SectionHeading>{trust.heading}</SectionHeading>
        <Lead>{trust.body}</Lead>
      </div>
      <div className="mt-14">
        <TrustBento />
      </div>
    </Section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

export function About() {
  return (
    <Section>
      <div className="max-w-xl">
        <p className="text-[14px] leading-relaxed text-muted-foreground/70">{about.body}</p>
        <div className="mt-5 flex items-center gap-5">
          {about.links.map((l) =>
            l.href.startsWith("mailto:") ? (
              <TrackedLink
                key={l.href}
                href={l.href}
                event="book_a_call"
                location="about"
                className="text-[13px] text-muted-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {l.label}
              </TrackedLink>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] text-muted-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ),
          )}
        </div>
      </div>
    </Section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────

export function BottomCTA() {
  return (
    <Section>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-[2rem] font-black leading-[1.1] tracking-tight sm:text-[2.5rem]">
          {bottomCta.heading}
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          {bottomCta.body}
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <InstallCommand />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            or star on GitHub →
          </a>
        </div>
        <p className="mt-7 font-mono text-[12px] text-muted-foreground/40">{bottomCta.fineprint}</p>
      </div>
    </Section>
  );
}

// ── Services / pick your path ─────────────────────────────────────────────────

export function Services() {
  return (
    <Section id="services">
      <div className="max-w-3xl">
        <Eyebrow>{services.label}</Eyebrow>
        <SectionHeading>{services.heading}</SectionHeading>
        <Lead className="max-w-2xl">{services.body}</Lead>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {services.tiers.map((t) => (
          <div
            key={t.name}
            className={cn(
              "flex flex-col rounded-xl border bg-card p-6",
              t.highlight ? "border-foreground" : "border-border/40"
            )}
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              {t.price}
            </p>
            <p className="mb-3 text-[14px] font-bold text-foreground">{t.name}</p>
            <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">{t.body}</p>
            {t.cta.href.startsWith("mailto:") ? (
              <TrackedLink
                href={t.cta.href}
                event="book_a_call"
                location={`services-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "mt-5 inline-block rounded-full px-4 py-2 text-[12px] font-medium transition-opacity hover:opacity-80",
                  t.highlight
                    ? "bg-foreground text-background"
                    : "border border-border/60 text-foreground hover:border-foreground"
                )}
              >
                {t.cta.label} →
              </TrackedLink>
            ) : (
              <a
                href={t.cta.href}
                className={cn(
                  "mt-5 inline-block rounded-full px-4 py-2 text-[12px] font-medium transition-opacity hover:opacity-80",
                  t.highlight
                    ? "bg-foreground text-background"
                    : "border border-border/60 text-foreground hover:border-foreground"
                )}
              >
                {t.cta.label} →
              </a>
            )}
          </div>
        ))}
      </div>

    </Section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-muted-foreground/40">{footer.tagline}</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[12px] text-muted-foreground/40">
          {footer.links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-muted-foreground">
              {l.label}
            </Link>
          ))}
          <span className="rounded border border-border/50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            {footer.badge}
          </span>
        </div>
      </div>
    </footer>
  );
}

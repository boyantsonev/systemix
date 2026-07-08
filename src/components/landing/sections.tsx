import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import matter from "gray-matter";
import {
  SiClaude,
  SiFigma,
  SiGithub,
  SiPosthog,
  SiShadcnui,
  SiTailwindcss,
  SiVercel,
} from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/systemix/ThemeToggle";
import { InstallCommand, TrackedLink } from "@/components/systemix/LandingEvents";
import { LoopOrbit } from "@/components/landing/LoopOrbit";
import { LiveLoopProof } from "@/components/landing/LiveLoopProof";
import { PersonaNavDropdown } from "@/components/landing/PersonaNavDropdown";
import { DeepDiveMockup } from "@/components/landing/DeepDiveMockups";
import {
  GITHUB_URL,
  INIT_COMMAND,
  announcement,
  bottomCta,
  brandClone,
  buildVsBuy,
  credibility,
  deepDives,
  faq,
  footer,
  logoRows,
  loop,
  metrics,
  nav,
  pricing,
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
    <section id={id} className={cn("border-t border-border/60 py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="tva-label mb-4 text-[11px] text-muted-foreground">{children}</p>;
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[1.9rem] font-bold leading-[1.12] sm:text-[2.25rem]">{children}</h2>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  );
}

// ── Nav (announcement strip + bar) ────────────────────────────────────────────

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50">
      <a
        href={announcement.href}
        target="_blank"
        rel="noopener noreferrer"
        className="tva-label block bg-foreground py-2 text-center text-[10px] text-background transition-opacity hover:opacity-90"
      >
        {announcement.text} <span aria-hidden>→</span>
      </a>
      <div className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <span className="text-xl font-bold tracking-tight">systemix</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 sm:flex">
            <PersonaNavDropdown />
            {nav.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
      </div>
    </header>
  );
}

// ── Metrics strip — honest numbers; 4th stat derived at build time ────────────

/** Count earned bullets under `## Memory` in LEARNINGS.md (0 while none). */
function countLearnings(): number {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "experiments", "LEARNINGS.md"), "utf8");
    const memory = raw.split(/^##\s+Memory\s*$/m)[1] ?? "";
    return memory.split(/\r?\n/).filter((l) => l.trim().startsWith("- ")).length;
  } catch {
    return 0;
  }
}

/** Count experiment MDX files (the loop's caseload). */
function countExperiments(): number {
  try {
    const dir = path.join(process.cwd(), "experiments");
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => matter(fs.readFileSync(path.join(dir, f), "utf8")).data as { type?: string })
      .filter((fm) => fm.type === "experiment").length;
  } catch {
    return 0;
  }
}

export function MetricsStrip() {
  // Honest by construction: recorded decisions once LEARNINGS has entries,
  // the live caseload until then. Never a hand-written number.
  const learnings = countLearnings();
  const experiments = countExperiments();
  const liveStat =
    learnings > 0
      ? { value: String(learnings), label: "decisions recorded — live from LEARNINGS.md" }
      : { value: String(experiments), label: "experiments running the loop on this site" };

  return (
    <section className="border-t border-border/60">
      <div className="mx-auto grid max-w-5xl grid-cols-2 divide-border/60 px-6 py-10 max-sm:gap-y-8 sm:grid-cols-4 sm:divide-x">
        {[...metrics.items, liveStat].map((m) => (
          <div key={m.label} className="sm:px-6 sm:first:pl-0 sm:last:pr-0">
            <p className="text-[1.6rem] font-bold leading-none text-highlight [text-shadow:var(--glow-head)]">
              {m.value}
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Logo rows ─────────────────────────────────────────────────────────────────

const LOGO_ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  "Claude Code": SiClaude,
  GitHub: SiGithub,
  PostHog: SiPosthog,
  Vercel: SiVercel,
  shadcn: SiShadcnui,
  Tailwind: SiTailwindcss,
  "Figma (optional)": SiFigma,
};

function LogoRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="tva-label text-[10px] text-muted-foreground/80">{label}</p>
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        {items.map((name) => {
          const Icon = LOGO_ICONS[name];
          return (
            <span key={name} className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
              {Icon && <Icon size={15} aria-hidden className="opacity-80" />}
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function LogoRows() {
  return (
    <Section className="py-16 sm:py-16">
      <div className="flex flex-col gap-10">
        <LogoRow label={logoRows.tools.label} items={logoRows.tools.items} />
        <LogoRow label={logoRows.stack.label} items={logoRows.stack.items} />
      </div>
    </Section>
  );
}

// ── Feature deep-dives — alternating text / product mockup ───────────────────

function DeepDiveRow({ dive, index }: { dive: (typeof deepDives)[number]; index: number }) {
  const flip = index % 2 === 1;
  return (
    <div className="grid items-center gap-8 sm:grid-cols-2 sm:gap-14">
      <div className={cn(flip && "sm:order-2")}>
        <Eyebrow>{String(index + 1).padStart(2, "0")}</Eyebrow>
        <h3 className="text-[1.45rem] font-bold leading-[1.15] sm:text-[1.7rem]">{dive.headline}</h3>
        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground">{dive.body}</p>
      </div>
      <div className={cn(flip && "sm:order-1")}>
        <DeepDiveMockup mockup={dive.mockup} />
      </div>
    </div>
  );
}

export function FeatureDeepDives() {
  return (
    <Section id="deep-dives">
      <div className="flex flex-col gap-20 sm:gap-28">
        {deepDives.map((d, i) => (
          <DeepDiveRow key={d.key} dive={d} index={i} />
        ))}
      </div>
    </Section>
  );
}

// ── The loop (shared with /for/* pages) — orbit + live dogfood proof ─────────

export function TheLoop() {
  return (
    <section id="loop" className="border-t border-border/60 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl">
          <Eyebrow>{loop.label}</Eyebrow>
          <SectionHeading>{loop.heading}</SectionHeading>
          <Lead>{loop.body}</Lead>
        </div>
      </div>

      {/* full-bleed tool constellation */}
      <LoopOrbit className="mx-auto mt-6 max-w-6xl px-6" />

      <div className="mx-auto mt-4 flex max-w-5xl items-center justify-center gap-2 px-6 font-mono text-[12px] text-muted-foreground">
        {loop.steps.map((s, i) => (
          <span key={s.title} className="flex items-center gap-2">
            <span>{s.title}</span>
            {i < loop.steps.length - 1 && (
              <span aria-hidden className="text-muted-foreground/40">
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

// ── Three doors (persona shared section — export name kept as TwoDoors) ──────

export function TwoDoors() {
  const dive = deepDives.find((d) => d.key === "doors") ?? deepDives[2];
  return (
    <Section id="doors">
      <div className="grid items-center gap-8 sm:grid-cols-2 sm:gap-14">
        <div>
          <Eyebrow>The doors</Eyebrow>
          <SectionHeading>{dive.headline}</SectionHeading>
          <Lead>{dive.body}</Lead>
          <Link
            href="/docs"
            className="mt-6 inline-block text-[13px] font-medium text-foreground underline underline-offset-4 hover:text-highlight"
          >
            Read the docs →
          </Link>
        </div>
        <DeepDiveMockup mockup={dive.mockup} />
      </div>
    </Section>
  );
}

// ── Brand clone hook (persona shared; brand_clone_request) ───────────────────

export function BrandCloneHook() {
  return (
    <Section>
      <div className="grid gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
        <div>
          <Eyebrow>{brandClone.label}</Eyebrow>
          <SectionHeading>{brandClone.heading}</SectionHeading>
          <Lead>{brandClone.body}</Lead>
        </div>
        <div className="rounded-[var(--radius-screen)] border border-border bg-card p-6 shadow-[var(--shadow-panel)] sm:p-7">
          <p className="tva-label mb-3 text-[10px] text-muted-foreground">src/app/globals.css</p>
          <pre className="terminal overflow-x-auto p-4 font-mono text-[12px] leading-relaxed">
            <code>
              <span style={{ opacity: 0.55 }}>  :root {`{`}</span>{"\n"}
              <span style={{ color: "var(--screen-destructive)" }}>-   --primary: #A8511A;</span>{"\n"}
              <span style={{ color: "var(--screen-success)" }}>+   --primary: oklch(0.55 0.21 27);</span>{"\n"}
              <span style={{ color: "var(--screen-destructive)" }}>-   --radius: 0.3125rem;</span>{"\n"}
              <span style={{ color: "var(--screen-success)" }}>+   --radius: 0.875rem;</span>{"\n"}
              <span style={{ opacity: 0.55 }}>  {`}`}</span>
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
            className="tva-label mt-5 block rounded-md bg-primary px-5 py-3 text-center text-[12px] text-primary-foreground transition-opacity hover:opacity-90"
          >
            {brandClone.cta.label}
          </TrackedLink>
          <p className="mt-4 text-[11px] text-muted-foreground/70">{brandClone.note}</p>
        </div>
      </div>
    </Section>
  );
}

// ── Credibility (persona shared section — export name kept as Trust) ─────────

export function Trust() {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{credibility.label}</Eyebrow>
        <SectionHeading>{credibility.heading}</SectionHeading>
        <Lead>{credibility.body}</Lead>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={credibility.cta.href}
            className="text-[14px] font-medium text-highlight underline underline-offset-4 hover:opacity-80"
          >
            {credibility.cta.label}
          </Link>
          {credibility.links.map((l) =>
            l.href.startsWith("mailto:") ? (
              <TrackedLink
                key={l.href}
                href={l.href}
                event="book_a_call"
                location="credibility"
                className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {l.label}
              </TrackedLink>
            ) : (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
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

// ── Pricing ladder (persona shared section — export name kept as Services) ───

export function Services() {
  return (
    <Section id="services">
      <div className="max-w-3xl">
        <Eyebrow>{pricing.label}</Eyebrow>
        <SectionHeading>{pricing.heading}</SectionHeading>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {pricing.tiers.map((t) => (
          <div
            key={t.key}
            className={cn(
              "flex flex-col rounded-[var(--radius-screen)] border bg-card p-6 shadow-[var(--shadow-panel)]",
              t.highlight ? "border-primary" : "border-border",
            )}
          >
            <p className="tva-label mb-3 text-[10px] text-muted-foreground">{t.name}</p>
            <p className="text-[1.5rem] font-bold leading-none">
              {t.priceAnchor && (
                <s className="mr-2 text-[1rem] font-normal text-muted-foreground">{t.priceAnchor}</s>
              )}
              {t.price}
            </p>
            {t.priceNote && (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{t.priceNote}</p>
            )}
            <p className="mt-4 flex-1 text-[13px] leading-relaxed text-muted-foreground">{t.body}</p>
            {"command" in t.cta ? (
              <div className="mt-5">
                <InstallCommand cmd={t.cta.command} />
              </div>
            ) : (
              <TrackedLink
                href={t.cta.href}
                event={t.cta.event}
                location={`pricing-${t.key}`}
                className={cn(
                  "tva-label mt-5 inline-block rounded-md px-4 py-2.5 text-center text-[11px] transition-opacity hover:opacity-85",
                  t.highlight
                    ? "bg-primary text-primary-foreground shadow-[var(--glow-soft)]"
                    : "border border-border text-foreground hover:border-primary",
                )}
              >
                {t.cta.label}
              </TrackedLink>
            )}
          </div>
        ))}
      </div>

      <p className="tva-label mt-8 text-center text-[11px] text-highlight">{pricing.anchorLine}</p>
    </Section>
  );
}

// ── Build-vs-buy table — the rational close ───────────────────────────────────

export function BuildVsBuyTable() {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{buildVsBuy.label}</Eyebrow>
        <SectionHeading>{buildVsBuy.heading}</SectionHeading>
      </div>
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="tva-label py-3 pr-4 text-[10px] font-normal text-muted-foreground">
                {buildVsBuy.columns.diy}
              </th>
              <th className="tva-label py-3 pr-4 text-[10px] font-normal text-muted-foreground">
                {buildVsBuy.columns.time}
              </th>
              <th className="tva-label py-3 text-[10px] font-normal text-muted-foreground">
                {buildVsBuy.columns.kit}
              </th>
            </tr>
          </thead>
          <tbody>
            {buildVsBuy.rows.map((r) => (
              <tr
                key={r.item}
                className="border-b border-border/60 transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]"
              >
                <td className="py-3 pr-4 text-foreground">{r.item}</td>
                <td className="py-3 pr-4 font-mono text-muted-foreground">{r.time}</td>
                <td className="py-3 font-mono text-[13px] text-success">included</td>
              </tr>
            ))}
            <tr>
              <td className="py-4 pr-4 font-bold text-foreground">{buildVsBuy.total.item}</td>
              <td className="py-4 pr-4 font-mono font-bold text-highlight">{buildVsBuy.total.time}</td>
              <td className="py-4 font-mono font-bold text-highlight">{buildVsBuy.total.kit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ── FAQ (native details/summary; JSON-LD in FaqJsonLd) ───────────────────────

export function FaqSection() {
  return (
    <Section id="faq">
      <div className="max-w-3xl">
        <Eyebrow>{faq.label}</Eyebrow>
        <SectionHeading>{faq.heading}</SectionHeading>
      </div>
      <div className="mt-10 flex flex-col divide-y divide-border/60 border-y border-border/60">
        {faq.items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-foreground [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="font-mono text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** FAQPage structured data (SEO brief §4) — render once per page that shows the FAQ. */
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

// ── Bottom CTA ────────────────────────────────────────────────────────────────

export function BottomCTA() {
  return (
    <Section>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-[2rem] font-bold leading-[1.1] sm:text-[2.5rem]">{bottomCta.heading}</h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          {bottomCta.body}
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <InstallCommand cmd={INIT_COMMAND} />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            or star on GitHub →
          </a>
        </div>
        <p className="mt-7 font-mono text-[12px] text-muted-foreground/70">{bottomCta.fineprint}</p>
      </div>
    </Section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-muted-foreground/70">{footer.tagline}</span>
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-4 font-mono text-[12px] text-muted-foreground/70">
            {footer.links.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
            <span className="tva-label rounded-sm border border-border px-1.5 py-0.5 text-[9px]">
              {footer.badge}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[12px] text-muted-foreground/70">
            {footer.personaLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

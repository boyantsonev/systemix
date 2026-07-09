import type { Metadata } from "next";
import {
  PersonaValueTable,
  Eyebrow,
  FaqJsonLd,
  GridFrame,
  LandingFooter,
  LandingNav,
  Section,
  SectionHeading,
} from "@/components/landing/sections";
import { SectionTrack, TrackedLink, InstallCommand } from "@/components/systemix/LandingEvents";
import { INIT_COMMAND, KIT_CHECKOUT_URL } from "@/lib/landing/content";

// The €99 downloadable Full Kit — the whole context engine, packaged to own.
export const metadata: Metadata = {
  title: "Systemix Full Kit — the AI-native design-system context engine, €99 to download",
  description:
    "The complete AI-native design-system kit: engine, docs, app setup, skills, and workflows — downloadable, pay once, own the files. No subscription, no lock-in.",
};

const METRICS = [
  { value: "€99", label: "once — not per month" },
  { value: "Full kit", label: "engine · docs · skills · workflows" },
  { value: "Day 1", label: "running, ghost mode on" },
  { value: "Lifetime", label: "updates to the kit" },
];

const INCLUDED = [
  { t: "The context engine", b: "The full loop — hypothesis, build, measure, evaluate, learn, document — wired to run on your AI coding tool." },
  { t: "Every skill + workflow", b: "The whole skill library and the workflows that drive it, curated and ready — not a subset." },
  { t: "The app setup", b: "The dashboard, the runtime feed, and the HITL queue — the Home screen where decisions land." },
  { t: "Signals + drift", b: "PostHog wiring so headlines become evidence, plus the drift audit that catches design/code splits." },
  { t: "The docs, yours", b: "A living styleguide inside your repo that regenerates as design and code drift." },
  { t: "The files are yours", b: "Plain MDX + CSS in your repo. No platform, no seats, no lock-in." },
];

const PRICING_BULLETS = [
  "the context engine",
  "every skill",
  "every workflow",
  "app setup",
  "signals + drift",
  "lifetime updates",
];

// Refund-policy question deliberately omitted until the policy is set.
const FAQ = [
  { q: "Is this a subscription?", a: "No. Pay once, download it, keep every file." },
  { q: "What's the difference from the free skills?", a: "Every skill is free to use. The Kit is the whole thing packaged — engine, app setup, and workflows — as one download you own, set up to run on day one." },
  { q: "Do I get updates?", a: "Yes, lifetime updates to the Kit." },
  { q: "Which AI tools?", a: "Claude Code, Cursor, Codex." },
  { q: "Can I use it on client projects?", a: "Yes. The files are yours to keep or hand off." },
];

/** Product/Offer structured data. */
function KitJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Systemix Full Kit",
    description:
      "The complete AI-native design-system context engine: engine, docs, app setup, skills, and workflows — downloadable, pay once, own the files.",
    brand: { "@type": "Brand", name: "Systemix" },
    offers: {
      "@type": "Offer",
      price: "99",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: "https://getsystemix.vercel.app/kit",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function KitPage() {
  return (
    <div className="min-h-screen text-foreground">
      <KitJsonLd />
      <FaqJsonLd items={FAQ} />
      <LandingNav />
      <GridFrame>
      <main>
        <SectionTrack name="kit-hero">
          <section className="border-b border-border/60 py-24 sm:py-28">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <Eyebrow>Full Kit · download · pay once</Eyebrow>
              <h1 className="mx-auto max-w-3xl text-[2.5rem] font-bold leading-[1.1] sm:text-[3rem] [text-shadow:var(--glow-head)]">
                The whole context engine. Yours to download.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                The complete AI-native design-system kit — engine, docs, app setup, skills, and
                workflows — packaged to run on your AI coding tool on day one.
              </p>
              <div className="mt-9 flex flex-col items-center gap-4">
                <TrackedLink
                  href={KIT_CHECKOUT_URL}
                  event="kit_requested"
                  location="kit-hero"
                  className="tva-label rounded-md bg-primary px-6 py-3 text-[12px] text-primary-foreground shadow-[var(--glow-soft)] transition-opacity hover:opacity-90"
                >
                  Get the Full Kit — €99
                </TrackedLink>
                <div className="flex flex-col items-center gap-2">
                  <InstallCommand cmd={INIT_COMMAND} />
                  <p className="font-mono text-[11px] text-muted-foreground/70">
                    or start free — every skill, no download
                  </p>
                </div>
              </div>
            </div>
          </section>
        </SectionTrack>

        <SectionTrack name="kit-metrics">
          <section>
            <div className="mx-auto grid max-w-5xl grid-cols-2 divide-border/60 px-6 py-10 max-sm:gap-y-8 sm:grid-cols-4 sm:divide-x">
              {METRICS.map((m) => (
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
        </SectionTrack>

        <SectionTrack name="kit-included">
          <Section>
            <div className="max-w-3xl">
              <Eyebrow>What&apos;s in the download</Eyebrow>
              <SectionHeading>The whole context engine, ready on day one.</SectionHeading>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {INCLUDED.map((it) => (
                <div
                  key={it.t}
                  className="rounded-[var(--radius-screen)] border border-border bg-card p-6 shadow-[var(--shadow-panel)]"
                >
                  <p className="mb-2 text-[15px] font-bold text-foreground">{it.t}</p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{it.b}</p>
                </div>
              ))}
            </div>
          </Section>
        </SectionTrack>

        <SectionTrack name="kit-persona-value">
          <PersonaValueTable />
        </SectionTrack>

        <SectionTrack name="kit-pricing">
          <Section>
            <div className="mx-auto max-w-md">
              <div className="rounded-[var(--radius-screen)] border border-primary bg-card p-8 text-center shadow-[var(--shadow-panel)]">
                <p className="tva-label mb-4 text-[10px] text-muted-foreground">Full Kit</p>
                <p className="text-[2.5rem] font-bold leading-none">€99</p>
                <p className="tva-label mt-2 text-[10px] text-highlight">download · pay once</p>
                <p className="mt-4 text-[14px] font-medium text-foreground">
                  Pay once. Download it. Every file is yours.
                </p>
                <ul className="mx-auto mt-5 flex max-w-xs flex-wrap justify-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
                  {PRICING_BULLETS.map((b) => (
                    <li key={b}>· {b}</li>
                  ))}
                </ul>
                <TrackedLink
                  href={KIT_CHECKOUT_URL}
                  event="kit_requested"
                  location="kit-pricing"
                  className="tva-label mt-7 block rounded-md bg-primary px-6 py-3 text-[12px] text-primary-foreground shadow-[var(--glow-soft)] transition-opacity hover:opacity-90"
                >
                  Get the Full Kit
                </TrackedLink>
                <p className="mt-4 text-[12px] text-muted-foreground">
                  Not sure yet? Start free with{" "}
                  <code className="font-mono text-[11px]">{INIT_COMMAND}</code>.
                </p>
              </div>
            </div>
          </Section>
        </SectionTrack>

        <SectionTrack name="kit-faq">
          <Section>
            <div className="max-w-3xl">
              <Eyebrow>FAQ</Eyebrow>
              <SectionHeading>The honest answers.</SectionHeading>
            </div>
            <div className="mt-10 flex flex-col divide-y divide-border/60 border-y border-border/60">
              {FAQ.map((f) => (
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
                  <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-[13px] text-muted-foreground">
              Want a scored diagnosis first?{" "}
              <TrackedLink
                href="/audit"
                event="cross_promo_click"
                location="kit-to-audit"
                className="text-foreground underline underline-offset-4 hover:text-highlight"
              >
                See the readiness audit →
              </TrackedLink>
            </p>
          </Section>
        </SectionTrack>
      </main>
      </GridFrame>
      <LandingFooter />
    </div>
  );
}

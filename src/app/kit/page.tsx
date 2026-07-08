import type { Metadata } from "next";
import {
  BuildVsBuyTable,
  Eyebrow,
  FaqJsonLd,
  LandingFooter,
  LandingNav,
  Section,
  SectionHeading,
} from "@/components/landing/sections";
import { SectionTrack, TrackedLink, InstallCommand } from "@/components/systemix/LandingEvents";
import { INIT_COMMAND, KIT_MAILTO } from "@/lib/landing/content";

// Copy deck: docs/feature/rebrand-hifi/copy-kit.md — pay once, own it forever;
// lead with what you skip, not what's inside.
export const metadata: Metadata = {
  title: "Systemix AI Kit — Run the loop, pay once ($249)",
  description:
    "The full design-system validation loop, pre-wired for your AI coding tool. Pay once, own the files, no subscription.",
};

const METRICS = [
  { value: "~68+ hrs", label: "you don't build yourself" },
  { value: "$249", label: "once — not per month" },
  { value: "Day 1", label: "running, ghost mode on" },
  { value: "Lifetime", label: "updates to the kit" },
];

const INCLUDED = [
  { t: "The loop, wired", b: "Experiment scaffolding, learnings ledger, and record step, ready out of the box." },
  { t: "Human-approval rail", b: "Ghost → assisted → autonomous, with a human closing every decision." },
  { t: "Signals hookup", b: "PostHog wiring so your headlines and flows become evidence." },
  { t: "Drift audit", b: "Spot where design and code split, with the diff." },
  { t: "Scheduled runner", b: "Run the loop on a cron, no reminders needed." },
  { t: "The files are yours", b: "Plain files in your repo. No lock-in, no seats." },
];

const PRICING_BULLETS = [
  "full loop",
  "human-approval rail",
  "signals",
  "drift audit",
  "scheduled runner",
  "lifetime updates",
];

// Refund-policy question deliberately omitted until the policy is set
// (copy-kit.md placeholder — plan §deferred).
const FAQ = [
  { q: "Is this a subscription?", a: "No. Pay once, own it, keep every file." },
  { q: "What's the difference from the free init?", a: "Free runs the loop in ghost mode. The Kit adds the paid pieces — signals wiring, drift audit, scheduled runner — pre-built." },
  { q: "Do I get updates?", a: "Yes, lifetime updates to the Kit." },
  { q: "Which AI tools?", a: "Claude Code, Cursor, Codex." },
  { q: "Can I use it on client projects?", a: "Yes. The files are yours to keep or hand off." },
];

/** Product/Offer structured data (seo-gtm-brief §4). */
function KitJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Systemix AI Kit",
    description:
      "The full design-system validation loop, pre-wired for your AI coding tool. Pay once, own the files, no subscription.",
    brand: { "@type": "Brand", name: "Systemix" },
    offers: {
      "@type": "Offer",
      price: "249",
      priceCurrency: "USD",
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
      <main>
        <SectionTrack name="kit-hero">
          <section className="border-b border-border/60 py-24 sm:py-28">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <Eyebrow>AI Kit · pay once</Eyebrow>
              <h1 className="mx-auto max-w-3xl text-[2.5rem] font-bold leading-[1.1] sm:text-[3rem] [text-shadow:var(--glow-head)]">
                Everything to run the loop. Yours to keep.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                Skip the weeks of wiring. The AI Kit ships the full validation loop — ready to run
                on your AI coding tool.
              </p>
              <div className="mt-9 flex flex-col items-center gap-4">
                <TrackedLink
                  href={KIT_MAILTO}
                  event="kit_requested"
                  location="kit-hero"
                  className="tva-label rounded-md bg-primary px-6 py-3 text-[12px] text-primary-foreground shadow-[var(--glow-soft)] transition-opacity hover:opacity-90"
                >
                  Get the AI Kit — <s className="opacity-60">$299</s> $249
                </TrackedLink>
                <div className="flex flex-col items-center gap-2">
                  <InstallCommand cmd={INIT_COMMAND} />
                  <p className="font-mono text-[11px] text-muted-foreground/70">
                    try the free loop first
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
              <Eyebrow>What&apos;s included</Eyebrow>
              <SectionHeading>The whole loop, wired to run on day one.</SectionHeading>
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

        <SectionTrack name="kit-build-vs-buy">
          <BuildVsBuyTable />
        </SectionTrack>

        <SectionTrack name="kit-pricing">
          <Section>
            <div className="mx-auto max-w-md">
              <div className="rounded-[var(--radius-screen)] border border-primary bg-card p-8 text-center shadow-[var(--shadow-panel)]">
                <p className="tva-label mb-4 text-[10px] text-muted-foreground">AI Kit</p>
                <p className="text-[2.5rem] font-bold leading-none">
                  <s className="mr-2 text-[1.25rem] font-normal text-muted-foreground">$299</s>
                  $249
                </p>
                <p className="tva-label mt-2 text-[10px] text-highlight">pay once</p>
                <p className="mt-4 text-[14px] font-medium text-foreground">
                  Pay once. Lifetime access. Every file is yours.
                </p>
                <ul className="mx-auto mt-5 flex max-w-xs flex-wrap justify-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
                  {PRICING_BULLETS.map((b) => (
                    <li key={b}>· {b}</li>
                  ))}
                </ul>
                <TrackedLink
                  href={KIT_MAILTO}
                  event="kit_requested"
                  location="kit-pricing"
                  className="tva-label mt-7 block rounded-md bg-primary px-6 py-3 text-[12px] text-primary-foreground shadow-[var(--glow-soft)] transition-opacity hover:opacity-90"
                >
                  Get the AI Kit
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
              Not ready to buy?{" "}
              <TrackedLink
                href="/audit"
                event="cross_promo_click"
                location="kit-to-audit"
                className="text-foreground underline underline-offset-4 hover:text-highlight"
              >
                Start with the free audit →
              </TrackedLink>
            </p>
          </Section>
        </SectionTrack>
      </main>
      <LandingFooter />
    </div>
  );
}

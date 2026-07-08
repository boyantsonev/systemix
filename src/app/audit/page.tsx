import type { Metadata } from "next";
import {
  Eyebrow,
  GridFrame,
  LandingFooter,
  LandingNav,
  Lead,
  Section,
  SectionHeading,
} from "@/components/landing/sections";
import { SectionTrack, TrackedLink } from "@/components/systemix/LandingEvents";
import { AuditRequestForm } from "@/components/landing/AuditRequestForm";

// Copy deck: docs/feature/rebrand-hifi/copy-audit.md — getdesign.md/request
// clone: a lead magnet with one job, get the 3-field form filled. Free audit
// as the hook; cross-sell the Kit.
export const metadata: Metadata = {
  title: "Free design system audit — find your drift | Systemix",
  description:
    "Send your repo. We run the automation once and show you exactly where your design system is drifting. Free, 10 minutes.",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen text-foreground">
      <LandingNav />
      <GridFrame>
      <main>
        <SectionTrack name="audit-hero">
          <section className="border-b border-border/60 py-24 sm:py-28">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <Eyebrow>Free · takes 10 minutes</Eyebrow>
              <h1 className="mx-auto max-w-3xl text-[2.5rem] font-bold leading-[1.1] sm:text-[3rem] [text-shadow:var(--glow-head)]">
                Find out where your design system is rotting.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                Send us your repo. We run the automation once and show you the drift — free.
              </p>
              <a
                href="#form"
                className="tva-label mt-9 inline-block rounded-md bg-primary px-6 py-3 text-[12px] text-primary-foreground shadow-[var(--glow-soft)] transition-opacity hover:opacity-90"
              >
                Get my free audit
              </a>
            </div>
          </section>
        </SectionTrack>

        <SectionTrack name="audit-paths">
          <Section>
            <div className="max-w-3xl">
              <Eyebrow>Choose your path</Eyebrow>
              <SectionHeading>Free report, or run it yourself.</SectionHeading>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="flex flex-col rounded-[var(--radius-screen)] border border-primary bg-card p-7 shadow-[var(--shadow-panel)]">
                <p className="tva-label mb-3 text-[10px] text-muted-foreground">Free Audit</p>
                <p className="text-[2rem] font-bold leading-none">$0</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  one pass of the automation on your repo
                </p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                  You get: a drift report + the top 3 decisions we&apos;d propose.
                </p>
                <a
                  href="#form"
                  className="tva-label mt-6 block rounded-md bg-primary px-5 py-3 text-center text-[11px] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Start free audit
                </a>
              </div>
              <div className="flex flex-col rounded-[var(--radius-screen)] border border-border bg-card p-7 shadow-[var(--shadow-panel)]">
                <p className="tva-label mb-3 text-[10px] text-muted-foreground">AI Kit</p>
                <p className="text-[2rem] font-bold leading-none">
                  <s className="mr-2 text-[1.1rem] font-normal text-muted-foreground">$299</s>
                  $249
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">pay once</p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                  Skip the wait — run the automation yourself, in your repo, files yours to keep.
                </p>
                <TrackedLink
                  href="/kit"
                  event="cross_promo_click"
                  location="audit-to-kit"
                  className="tva-label mt-6 block rounded-md border border-border px-5 py-3 text-center text-[11px] text-foreground transition-colors hover:border-primary"
                >
                  Get the Kit →
                </TrackedLink>
              </div>
            </div>
          </Section>
        </SectionTrack>

        <SectionTrack name="audit-form">
          <Section id="form">
            <div className="grid gap-10 sm:grid-cols-2 sm:items-start sm:gap-16">
              <div>
                <Eyebrow>The form</Eyebrow>
                <SectionHeading>Send it. Get the report.</SectionHeading>
                <Lead>
                  Read-only — nothing written to your repo. A human runs the automation once and replies
                  with the drift report and the top three decisions we&apos;d propose.
                </Lead>
                <p className="mt-6 font-mono text-[12px] text-muted-foreground">
                  No spam. We reply with the report, not a sales call.
                </p>
              </div>
              <AuditRequestForm />
            </div>
          </Section>
        </SectionTrack>

        <SectionTrack name="audit-founders">
          <Section>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[16px] font-bold text-foreground">Built by a two-person studio.</p>
              <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
                We run this automation on our own site every week. You&apos;ll get a human reading your
                report — not a bot.
              </p>
              {/* Proof wall placeholder (copy-audit.md §5) — one honest line until
                  real outcomes/quotes exist. */}
              <p className="tva-label mx-auto mt-8 max-w-2xl border-t border-border/60 pt-6 text-[11px] leading-relaxed text-highlight">
                &quot;Systemix&apos;s own site is the first case study — every headline here was
                proposed, measured, and kept by the automation.&quot;
              </p>
            </div>
          </Section>
        </SectionTrack>
      </main>
      </GridFrame>
      <LandingFooter />
    </div>
  );
}

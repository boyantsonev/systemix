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
import { Button } from "@/components/ui/button";

// The €249 AI-Readiness Audit — an automated, me-in-the-loop readiness report
// (the readiness-audit skill is the engine), scored 0–100 and emailed in 24–48h.
export const metadata: Metadata = {
  title: "AI-Readiness Audit — is your design system AI-ready? | Systemix",
  description:
    "Send your repo. Get back a scored AI-native readiness report — drift, slop, an opportunity ranking, and the exact setup to fix it. €249, emailed in 24–48h.",
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
              <Eyebrow>AI-Readiness Audit · €249 · emailed in 24–48h</Eyebrow>
              <h1 className="mx-auto max-w-3xl text-[2rem] font-bold leading-[1.12] sm:text-[3rem] sm:leading-[1.1] [text-shadow:var(--glow-head)]">
                Is your design system AI-ready?
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                Send us your repo. You get back a scored readiness report — the drift, the slop, an
                opportunity ranking, and the exact setup to make your agents follow a system.
              </p>
              <Button variant="secondary" size="lg" className="mt-9" asChild>
                <a href="#form">Request the audit</a>
              </Button>
            </div>
          </section>
        </SectionTrack>

        <SectionTrack name="audit-paths">
          <Section>
            <div className="max-w-3xl">
              <Eyebrow>What you get</Eyebrow>
              <SectionHeading>A scored report, not a vibe check.</SectionHeading>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="flex flex-col rounded-[var(--radius-screen)] border border-primary bg-card p-7 shadow-[var(--shadow-panel)]">
                <p className="tva-label mb-3 text-[10px] text-muted-foreground">AI-Readiness Audit</p>
                <p className="text-[2rem] font-bold leading-none">€249</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  automated · emailed in 24–48h
                </p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                  A readiness score 0–100 across six dimensions, the drift + slop map, an opportunity
                  ranking, and the exact setup to fix it.
                </p>
                <Button variant="secondary" size="sm" className="mt-6 w-full" asChild>
                  <a href="#form">Request the audit</a>
                </Button>
              </div>
              <div className="flex flex-col rounded-[var(--radius-screen)] border border-border bg-card p-7 shadow-[var(--shadow-panel)]">
                <p className="tva-label mb-3 text-[10px] text-muted-foreground">Learning Kit</p>
                <p className="text-[2rem] font-bold leading-none">€99</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">download · pay once</p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                  Want to fix it yourself? The Learning Kit is the whole context engine, downloadable —
                  files yours to keep.
                </p>
                <Button variant="outline" size="sm" className="mt-6 w-full" asChild>
                  <TrackedLink href="/kit" event="cross_promo_click" location="audit-to-kit">
                    Get the Learning Kit →
                  </TrackedLink>
                </Button>
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
                  Read-only — nothing written to your repo. We run the readiness audit with a human in
                  the loop and email your scored report within 24–48 hours.
                </Lead>
                <p className="mt-6 font-mono text-[12px] text-muted-foreground">
                  €249, one-time. A real report, reviewed by a human — not a bot dump.
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

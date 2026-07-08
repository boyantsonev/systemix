import type { Metadata } from "next";
import {
  LandingNav,
  LandingFooter,
  Section,
  Eyebrow,
  SectionHeading,
  Lead,
} from "@/components/landing/sections";
import { SectionTrack, TrackedLink } from "@/components/systemix/LandingEvents";
import { GITHUB_URL } from "@/lib/landing/content";

export const metadata: Metadata = {
  title: "The AI Kit — the loop, the design system, the skills · Systemix",
  description:
    "Everything to run the loop in your own repo: the validation loop, the code-first design substrate, portable Atlas artifacts, the JTBD/ODI methodology, and guardrails. One systemix init. Plain files you own — no platform, no lock-in.",
};

const KIT_MAILTO = "mailto:boyan.works@gmail.com?subject=Systemix%20AI%20Kit";

const INCLUDED = [
  { t: "The validation loop", b: "systemix init scaffolds experiments/ + LEARNINGS.md and the ship → measure → learn → decide skills. Your growth engine, in your repo." },
  { t: "The design substrate", b: "design/ tokens + guardrails, with /design-audit and /drift-report to keep code true to the system. Optional, but wired." },
  { t: "Portable Atlas artifacts", b: "/workflow-artifact renders any workflow as a self-contained, shareable view — no repo or dev server needed to open it." },
  { t: "JTBD / ODI methodology", b: "/jtbd-audit finds what to build next, scored by opportunity — the same method Systemix runs on itself. Feeds every experiment." },
  { t: "Guardrails + autonomy dial", b: "ghost → assisted → autonomous. Self-modification (skills + guardrails) is always human-in-the-loop. Safe by default." },
  { t: "Three doors", b: "CLI · MCP · Claude Code skills. Drive the same loop however you ship — scriptable, agent-callable, or slash-commands." },
];

const BUY_VS_BUILD = [
  { k: "Time", diy: "Weeks stitching the loop, the substrate, and the skills together", kit: "One npx systemix init" },
  { k: "Cost", diy: "Your own dev hours", kit: "$299, one-time — includes the AI-Readiness Report" },
  { k: "Upkeep", diy: "You keep it current as your stack shifts", kit: "Curated skills, updated" },
  { k: "Ownership", diy: "—", kit: "Plain MDX + CSS in your repo — yours to keep, no lock-in" },
];

const FAQ = [
  { q: "Is it really mine?", a: "Yes. Everything lands as plain files in your repo. No dashboard, no platform, no lock-in — fork it, edit it, delete it. It's yours." },
  { q: "How's this different from the open-source repo?", a: "Same engine. The Kit is the curated, set-up bundle — the loop, the design substrate, the artifact + JTBD skills, and guardrails — wired to run on day one." },
  { q: "Do I need Figma?", a: "No. It's code-first: tokens are canonical in CSS. Figma is an optional adapter, never required." },
  { q: "I already have a design system.", a: "Point /design-audit at it — the Kit adopts what you have (drift-only) instead of scaffolding fresh." },
  { q: "What runs it?", a: "Claude Code. No extra service to run, no local model to host." },
];

export default function KitPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <SectionTrack name="kit-hero">
          <section className="border-b border-border/40 py-24 sm:py-28">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <Eyebrow>The AI Kit · $299 · one-time</Eyebrow>
              <h1 className="mx-auto max-w-3xl text-[2.5rem] font-black leading-[1.1] tracking-tight sm:text-[3rem]">
                Everything to run the loop — in your repo.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
                The design system, the growth engine, and the skills your agent drives them with.
                One command, plain files you own — no platform, no lock-in. Includes the{" "}
                <a href="/audit" className="text-foreground underline underline-offset-4">
                  AI-Readiness Report
                </a>
                .
              </p>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <TrackedLink
                  href={KIT_MAILTO}
                  event="kit_requested"
                  location="kit-hero"
                  className="rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
                >
                  Get the kit →
                </TrackedLink>
                <a
                  href="/docs"
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  or read the docs →
                </a>
              </div>
            </div>
          </section>
        </SectionTrack>

        <Section>
          <div className="max-w-3xl">
            <Eyebrow>What&apos;s included</Eyebrow>
            <SectionHeading>The whole loop, wired to run on day one.</SectionHeading>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {INCLUDED.map((it) => (
              <div key={it.t} className="rounded-xl border border-border/40 bg-card p-6">
                <p className="mb-2 text-[15px] font-bold text-foreground">{it.t}</p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{it.b}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <div className="max-w-3xl">
            <Eyebrow>Build vs buy</Eyebrow>
            <SectionHeading>Wire it yourself, or run one command.</SectionHeading>
          </div>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="py-3 pr-4 font-medium text-muted-foreground/60" />
                  <th className="py-3 pr-4 font-semibold text-foreground">Wire it yourself</th>
                  <th className="py-3 font-semibold text-foreground">The AI Kit</th>
                </tr>
              </thead>
              <tbody>
                {BUY_VS_BUILD.map((r) => (
                  <tr key={r.k} className="border-b border-border/30">
                    <td className="py-3 pr-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/50">
                      {r.k}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{r.diy}</td>
                    <td className="py-3 font-medium text-foreground">{r.kit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section>
          <div className="max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <SectionHeading>The honest answers.</SectionHeading>
          </div>
          <div className="mt-12 flex flex-col divide-y divide-border/30">
            {FAQ.map((f) => (
              <div key={f.q} className="py-5">
                <p className="text-[15px] font-bold text-foreground">{f.q}</p>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>

        <SectionTrack name="kit-cta">
          <Section>
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <h2 className="text-[2rem] font-black leading-[1.1] tracking-tight sm:text-[2.25rem]">
                Get the kit. Own the loop.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                One-time, in your repo, yours to keep. Not ready?{" "}
                <a href="/audit" className="text-foreground underline underline-offset-4">
                  Start with the AI-Readiness Report
                </a>{" "}
                — the $149 rolls into the Kit.
              </p>
              <TrackedLink
                href={KIT_MAILTO}
                event="kit_requested"
                location="kit-cta"
                className="mt-8 rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
              >
                Get the kit →
              </TrackedLink>
            </div>
          </Section>
        </SectionTrack>
      </main>
      <LandingFooter />
    </div>
  );
}

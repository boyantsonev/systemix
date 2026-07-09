import type { Metadata } from "next";
import { SectionTrack } from "@/components/systemix/LandingEvents";
import {
  Audiences,
  BottomCTA,
  PersonaValueTable,
  FaqJsonLd,
  FaqSection,
  FeatureDeepDives,
  GridFrame,
  HeroRow,
  LandingFooter,
  LandingNav,
  Services,
  StackStrip,
  Statement,
  TheLoop,
  Trust,
} from "@/components/landing/sections";
import { faq } from "@/lib/landing/content";

// Title + meta per the SEO brief (docs/feature/rebrand-hifi/seo-gtm-brief.md §3):
// head term = design-system rot/drift, mechanisms below the fold.
export const metadata: Metadata = {
  title: "Systemix — Stop your design system from rotting",
  description:
    "Systemix watches what you ship, catches design-system drift, and proposes AI fixes your team approves. Open source. Free to start.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen text-foreground">
      <FaqJsonLd items={faq.items} />
      <LandingNav />
      <GridFrame>
        <main>
          <SectionTrack name="hero" experimentId="landing-rebrand-hifi-2026-07">
            <HeroRow />
          </SectionTrack>
          <SectionTrack name="stack">
            <StackStrip />
          </SectionTrack>
          <SectionTrack name="statement">
            <Statement />
          </SectionTrack>
          <SectionTrack name="deep-dives">
            <FeatureDeepDives />
          </SectionTrack>
          <SectionTrack name="audiences">
            <Audiences />
          </SectionTrack>
          <SectionTrack name="loop">
            <TheLoop />
          </SectionTrack>
          <SectionTrack name="credibility">
            <Trust />
          </SectionTrack>
          <SectionTrack name="pricing">
            <Services />
          </SectionTrack>
          <SectionTrack name="persona-value">
            <PersonaValueTable />
          </SectionTrack>
          <SectionTrack name="faq">
            <FaqSection />
          </SectionTrack>
          <SectionTrack name="bottom-cta">
            <BottomCTA />
          </SectionTrack>
        </main>
      </GridFrame>
      <LandingFooter />
    </div>
  );
}

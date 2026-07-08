import type { Metadata } from "next";
import { SectionTrack } from "@/components/systemix/LandingEvents";
import { LandingHero } from "@/components/landing/LandingHero";
import { PersonaSwitcher } from "@/components/landing/PersonaSwitcher";
import {
  BottomCTA,
  BuildVsBuyTable,
  FaqJsonLd,
  FaqSection,
  FeatureDeepDives,
  LandingFooter,
  LandingNav,
  LogoRows,
  MetricsStrip,
  Services,
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
      <main>
        <SectionTrack name="hero" experimentId="landing-rebrand-hifi-2026-07">
          <LandingHero />
        </SectionTrack>
        <PersonaSwitcher className="pb-14" />
        <SectionTrack name="metrics">
          <MetricsStrip />
        </SectionTrack>
        <SectionTrack name="logos">
          <LogoRows />
        </SectionTrack>
        <SectionTrack name="deep-dives">
          <FeatureDeepDives />
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
        <SectionTrack name="build-vs-buy">
          <BuildVsBuyTable />
        </SectionTrack>
        <SectionTrack name="faq">
          <FaqSection />
        </SectionTrack>
        <SectionTrack name="bottom-cta">
          <BottomCTA />
        </SectionTrack>
      </main>
      <LandingFooter />
    </div>
  );
}

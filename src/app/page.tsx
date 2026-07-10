import type { Metadata } from "next";
import { SectionTrack } from "@/components/systemix/LandingEvents";
import {
  Audiences,
  BottomCTA,
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
import { ScrollEffect } from "@/components/effects/ScrollEffect";
import { faq } from "@/lib/landing/content";

// Title + meta per the SEO brief (docs/feature/rebrand-hifi/seo-gtm-brief.md §3):
// head term = design-system rot/drift, mechanisms below the fold.
export const metadata: Metadata = {
  title: "Systemix — Stop your design system from rotting",
  description:
    "Systemix watches what you ship, catches design-system drift, and proposes AI fixes your team approves. Open source. Free to start.",
  alternates: { canonical: "/" },
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
          <ScrollEffect variant="crt-geo" intensity="calm" tint="primary" height={140} />
          <SectionTrack name="statement">
            <Statement />
          </SectionTrack>
          <ScrollEffect variant="ascii-wave" intensity="soft" tint="highlight" height={180} />
          <SectionTrack name="deep-dives">
            <FeatureDeepDives />
          </SectionTrack>
          <SectionTrack name="audiences">
            <Audiences />
          </SectionTrack>
          <ScrollEffect variant="dither-field" intensity="calm" tint="primary" height={160} />
          <SectionTrack name="loop">
            <TheLoop />
          </SectionTrack>
          <SectionTrack name="credibility">
            <Trust />
          </SectionTrack>
          <SectionTrack name="pricing">
            <Services />
          </SectionTrack>
          <SectionTrack name="faq">
            <FaqSection />
          </SectionTrack>
          <ScrollEffect variant="crt-geo" intensity="soft" tint="primary" height={140} />
          <SectionTrack name="bottom-cta">
            <BottomCTA />
          </SectionTrack>
        </main>
      </GridFrame>
      <LandingFooter />
    </div>
  );
}

import type { Metadata } from "next";
import { SectionTrack } from "@/components/systemix/LandingEvents";
import { LandingHero } from "@/components/landing/LandingHero";
import { PersonaSwitcher } from "@/components/landing/PersonaSwitcher";
import {
  About,
  BottomCTA,
  BrandCloneHook,
  Effect,
  LandingFooter,
  LandingNav,
  Problem,
  Services,
  SignalsWall,
  TheLoop,
  ThreeDoors,
  Trust,
  ValueProps,
} from "@/components/landing/sections";

export const metadata: Metadata = {
  title: "Systemix — the AI-native design system + growth engine that remembers why",
  description:
    "AI can generate a design system in an afternoon — Systemix keeps it from turning to slop: rationale in MDX, a learning loop for every decision, and skills that review and learn weekly from your signals. Free kit in Claude Code, or Boyan wires it to your stack.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <SectionTrack name="hero" experimentId="landing-ai-native-ds-2026-07">
          <LandingHero />
        </SectionTrack>
        <PersonaSwitcher className="pb-14" />
        <SectionTrack name="value-props">
          <ValueProps />
        </SectionTrack>
        <SectionTrack name="signals">
          <SignalsWall />
        </SectionTrack>
        <SectionTrack name="problem">
          <Problem />
        </SectionTrack>
        <SectionTrack name="effect">
          <Effect />
        </SectionTrack>
        <SectionTrack name="brand-clone">
          <BrandCloneHook />
        </SectionTrack>
        <SectionTrack name="loop">
          <TheLoop />
        </SectionTrack>
        <SectionTrack name="three-doors">
          <ThreeDoors />
        </SectionTrack>
        <SectionTrack name="services">
          <Services />
        </SectionTrack>
        <SectionTrack name="trust">
          <Trust />
        </SectionTrack>
        <SectionTrack name="about">
          <About />
        </SectionTrack>
        <SectionTrack name="bottom-cta">
          <BottomCTA />
        </SectionTrack>
      </main>
      <LandingFooter />
    </div>
  );
}

import type { Metadata } from "next";
import { SectionTrack } from "@/components/systemix/LandingEvents";
import { LandingHero } from "@/components/landing/LandingHero";
import {
  About,
  BottomCTA,
  BrandCloneHook,
  Effect,
  LandingFooter,
  LandingNav,
  Problem,
  Services,
  TheLoop,
  ThreeDoors,
  Trust,
} from "@/components/landing/sections";

export const metadata: Metadata = {
  title: "Systemix — the AI-native design system that remembers why",
  description:
    "AI can generate a design system in an afternoon — Systemix keeps it from turning to slop. Rationale in MDX, a learning loop for every decision, skills that update around your workflow. Free kit in Claude Code, or a one-week design-system build.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <SectionTrack name="hero" experimentId="landing-ai-native-ds-2026-07">
          <LandingHero />
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

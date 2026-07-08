import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTrack } from "@/components/systemix/LandingEvents";
import {
  BottomCTA,
  BrandCloneHook,
  LandingFooter,
  LandingNav,
  Services,
  TheLoop,
  Trust,
  TwoDoors,
} from "@/components/landing/sections";
import {
  PersonaGuideCta,
  PersonaHero,
  PersonaJtbd,
  PersonaProof,
} from "@/components/landing/PersonaSections";
import { PersonaSwitcher } from "@/components/landing/PersonaSwitcher";
import {
  PERSONAS,
  personaContent,
  type PersonaKey,
  type SectionKey,
} from "@/lib/landing/personas";

export const dynamicParams = false;

export function generateStaticParams() {
  return PERSONAS.map((persona) => ({ persona }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}): Promise<Metadata> {
  const { persona } = await params;
  const p = personaContent[persona as PersonaKey];
  if (!p) return {};
  return { title: p.metaTitle, description: p.metaDescription };
}

const SHARED_SECTIONS: Record<SectionKey, React.ComponentType> = {
  loop: TheLoop,
  doors: TwoDoors,
  trust: Trust,
  services: Services,
  brandClone: BrandCloneHook,
};

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const p = personaContent[persona as PersonaKey];
  if (!p) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <SectionTrack name="hero" persona={p.key}>
          <PersonaHero persona={p} />
        </SectionTrack>
        <PersonaSwitcher current={p.key} className="pb-16" />
        <SectionTrack name="jtbd" persona={p.key}>
          <PersonaJtbd persona={p} />
        </SectionTrack>
        {p.sharedSections.map((key) => {
          const Shared = SHARED_SECTIONS[key];
          return (
            <SectionTrack key={key} name={key === "brandClone" ? "brand-clone" : key} persona={p.key}>
              <Shared />
            </SectionTrack>
          );
        })}
        <SectionTrack name="proof" persona={p.key}>
          <PersonaProof persona={p} />
        </SectionTrack>
        <SectionTrack name="guide-cta" persona={p.key}>
          <PersonaGuideCta persona={p} />
        </SectionTrack>
        <SectionTrack name="bottom-cta" persona={p.key}>
          <BottomCTA />
        </SectionTrack>
      </main>
      <LandingFooter />
    </div>
  );
}

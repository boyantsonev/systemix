"use client";

import { usePostHog } from "posthog-js/react";
import { useVariant } from "@/lib/useVariant";
import { hero, GITHUB_URL, INIT_COMMAND } from "@/lib/landing/content";
import { InstallCommand } from "@/components/systemix/LandingEvents";
import { HeroGrid } from "./HeroGrid";

export function LandingHero() {
  const ph = usePostHog();
  // A/B seam: a `landing-hero` multivariate flag in PostHog splits control vs B.
  const variantKey = useVariant("landing-hero", "variant_b");
  const v = hero.variants[variantKey === "control" ? "control" : "variant_b"];

  return (
    <section className="relative overflow-hidden">
      {/* magicui FlickeringGrid — amber CRT noise behind the copy */}
      <div className="pointer-events-none absolute inset-0">
        <HeroGrid className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 46%, var(--background) 24%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 pt-28 pb-24 text-center">
        {/* SEO: "design system" stays in the H1 (seo-gtm-brief §3) */}
        <h1 className="mb-7 text-[2.6rem] font-bold leading-[1.06] sm:text-[3.5rem] [text-shadow:var(--glow-head)]">
          {v.h1}
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          {v.body}
        </p>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <InstallCommand cmd={INIT_COMMAND} />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ph.capture("hero_cta_click", { cta: "github", variant: variantKey })}
              className="tva-label rounded-md border border-border px-4 py-2.5 text-[11px] text-foreground transition-colors hover:border-primary"
            >
              View on GitHub
            </a>
          </div>
          <p className="font-mono text-[12px] text-muted-foreground/70">{hero.fineprint}</p>
        </div>
      </div>
    </section>
  );
}

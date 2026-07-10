"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect, useRef, useState } from "react";
import { useVariant } from "@/lib/useVariant";
import { AUDIT_COMMAND } from "@/lib/landing/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Install command with copy button ──────────────────────────────────────────

export function InstallCommand({
  cmd = AUDIT_COMMAND,
  location = "hero",
}: { cmd?: string; location?: string } = {}) {
  const ph = usePostHog();
  // A/B seam: create a `landing-hero` multivariate flag in PostHog to split this.
  const variant = useVariant("landing-hero");
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      ph.capture("install_command_copied", { location, variant });
      // hero-cta-click-rate is experiment landing-ai-native-ds-2026-07's metric —
      // only fire it from the actual hero, or non-hero copies (kit, pricing,
      // bottom CTA) pollute a metric that's scoped to one section.
      if (location === "hero") {
        ph.capture("hero_cta_click", { cta: "install", variant });
      }
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      onClick={copy}
      className="inline-flex items-center gap-3 font-mono text-[13px] bg-muted/60 border border-border/60 rounded-lg py-2.5 pl-4 pr-1.5 cursor-pointer hover:bg-muted transition-colors select-none"
      title="Click to copy"
    >
      <span className="text-muted-foreground/40">$</span>
      <span className="text-foreground/80">{cmd}</span>
      {/* The copy affordance itself is the filed-btn (default Button variant) —
          stopPropagation so clicking it doesn't also fire the parent div's copy. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          copy();
        }}
        className={cn(buttonVariants({ size: "xs" }), "ml-1")}
      >
        {copied ? "COPIED ✓" : "COPY"}
      </button>
    </div>
  );
}

// ── Tracked conversion link ───────────────────────────────────────────────────
// A plain anchor that fires a PostHog event on click. Used for the book-a-call /
// sprint CTAs so the `book_a_call` metric the landing experiment measures is real.

export function TrackedLink({
  href,
  event,
  location,
  persona,
  className,
  target,
  rel,
  children,
}: {
  href: string;
  event: string;
  location: string;
  /** Which /for/<persona> page fired this — a breakdown property, never a new event name. */
  persona?: string;
  className?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const ph = usePostHog();
  // Tag conversions with the hero variant so the loop runner can split counts
  // per arm once a multivariate `landing-hero` flag goes live ("control" until then).
  const variant = useVariant("landing-hero");
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => ph?.capture(event, { location, variant, ...(persona ? { persona } : {}) })}
    >
      {children}
    </a>
  );
}

// ── Section view tracker (Intersection Observer) ──────────────────────────────

export function SectionTrack({ name, experimentId, persona, children, className }: {
  name: string;
  experimentId?: string;
  /** Which /for/<persona> page this section rendered on — a breakdown property. */
  persona?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ph = usePostHog();
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          ph.capture("section_viewed", { section: name, ...(persona ? { persona } : {}) });
          if (experimentId) {
            ph.capture("experiment_social_signal", {
              experiment_id: experimentId,
              section: name,
              signal_type: "section_view",
            });
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name, experimentId, persona, ph]);

  return <div ref={ref} className={className}>{children}</div>;
}

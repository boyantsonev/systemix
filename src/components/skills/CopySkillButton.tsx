"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useCopySkill } from "@/components/skills/useCopySkill";

// The filed-btn (default Button variant) primary CTA on a skill's
// /skills/[slug] detail page.
export function CopySkillButton({ slug, className }: { slug: string; className?: string }) {
  const { state, copy } = useCopySkill(slug);

  const label =
    state === "loading" ? "COPYING…" : state === "copied" ? "COPIED ✓" : state === "error" ? "NOT FOUND" : "COPY SKILL.MD";

  return (
    <button
      type="button"
      onClick={copy}
      disabled={state === "loading"}
      className={cn(buttonVariants({ size: "lg" }), className)}
    >
      {label}
    </button>
  );
}

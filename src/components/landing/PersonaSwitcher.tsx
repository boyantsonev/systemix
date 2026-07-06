import Link from "next/link";
import { cn } from "@/lib/utils";
import { PERSONAS, personaContent, type PersonaKey } from "@/lib/landing/personas";

/**
 * Chip row linking the general landing to the /for/<persona> pages.
 * Server component — plain links, current persona highlighted.
 */
export function PersonaSwitcher({
  current,
  className,
}: {
  current?: PersonaKey;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        Who are you?
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PERSONAS.map((key) => {
          const p = personaContent[key];
          const active = key === current;
          return (
            <Link
              key={key}
              href={`/for/${key}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[13px] transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/60 text-muted-foreground hover:border-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

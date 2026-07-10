import type { Metadata } from "next";
import Link from "next/link";
import { loadInstalledSkills, loadSkillPacks } from "@/lib/skills-catalog";

export const metadata: Metadata = {
  title: "Skills & workflows · Systemix",
  description:
    "Every skill and workflow this instance can run — the CLI packs with their skill rosters, and the skills installed in this repo.",
};

// The library surface: everything the sidebar's Skills/Workflows folders point
// at. Server-rendered straight from the filesystem (packages/cli/pipelines
// manifests + .claude/skills) — the catalog can't drift from the code.
export default function SkillsPage() {
  const packs = loadSkillPacks();
  const installed = loadInstalledSkills();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b px-4">
        <span className="text-sm font-medium text-foreground">Skills & workflows</span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {packs.length} workflows · {packs.reduce((n, p) => n + p.skills.length, 0)} skills
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Workflows are the CLI packs (<code className="font-mono text-[12px]">npx systemix
            workflow add &lt;name&gt;</code>) — each installs a roster of Claude Code skills.
            Rendered live from the package manifests, so this page can&apos;t drift from the code.
          </p>

          {packs.map((pack) => (
            <section key={pack.name} id={`pack-${pack.name}`} className="scroll-mt-16">
              <div className="rounded-[var(--radius-screen)] border bg-card p-5 shadow-[var(--shadow-panel)] sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="tva-label text-[11px] text-highlight">{pack.displayName}</h2>
                  {pack.version && (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      v{pack.version} · {pack.skills.length} skills
                    </span>
                  )}
                </div>
                <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                  {pack.description}
                </p>
                {pack.startWith && (
                  <p className="mt-3 font-mono text-[12px] text-foreground">
                    start with <span className="text-highlight">{pack.startWith}</span>
                  </p>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pack.skills.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/skills/${s.slug}`}
                      id={s.slug}
                      className="scroll-mt-16 rounded-md border border-border/60 bg-background p-4 transition-colors hover:border-primary hover:bg-muted/30"
                    >
                      <p className="font-mono text-[13px] font-bold text-foreground">/{s.slug}</p>
                      {s.description && (
                        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                          {s.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {installed.length > 0 && (
            <section id="installed" className="scroll-mt-16">
              <div className="rounded-[var(--radius-screen)] border bg-card p-5 shadow-[var(--shadow-panel)] sm:p-6">
                <h2 className="tva-label text-[11px] text-highlight">Installed in this repo</h2>
                <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                  Skills already vendored into <code className="font-mono text-[12px]">.claude/skills/</code>{" "}
                  of this instance.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {installed.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/skills/${s.slug}`}
                      className="rounded-md border border-border/60 bg-background p-4 transition-colors hover:border-primary hover:bg-muted/30"
                    >
                      <p className="font-mono text-[13px] font-bold text-foreground">/{s.slug}</p>
                      {s.description && (
                        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                          {s.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

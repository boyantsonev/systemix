"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SLogo } from "./SLogo";
import { ThemeToggle } from "./ThemeToggle";

export type TokenNav = { slug: string; name: string; status: string; collection: string };
export type ComponentNav = { slug: string; name: string; parity: string; hasStorybook: boolean };

function StatusDot({ status }: { status: string }) {
  const cls: Record<string, string> = {
    clean:              "bg-green-500",
    drifted:            "bg-yellow-500",
    "missing-in-figma": "bg-blue-500",
  };
  return (
    <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${cls[status] ?? "bg-muted-foreground/30"}`} />
  );
}

export function DesignSystemSidebar({
  tokens,
  components,
}: {
  tokens: TokenNav[];
  components: ComponentNav[];
}) {
  const pathname = usePathname();

  const collections: Record<string, TokenNav[]> = {};
  for (const t of tokens) {
    (collections[t.collection] ??= []).push(t);
  }

  return (
    <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-border/50 sticky top-0 h-screen overflow-y-auto bg-background">
      <div className="h-14 flex items-center px-5 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity">
          <SLogo size={14} className="text-foreground/60" />
          <span className="text-[12px] font-black tracking-tight">systemix</span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        <div>
          <Link
            href="/contract"
            className="block px-2 py-1.5 rounded-md text-[12px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            ← Contract triage
          </Link>
        </div>

        {/* Tokens grouped by collection */}
        {Object.entries(collections).map(([collection, items]) => (
          <div key={collection}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 mb-1.5">
              {collection}
            </p>
            <div className="space-y-0.5">
              {items.map((t) => {
                const href = `/design-system/tokens/${t.slug}`;
                const active = pathname === href;
                return (
                  <Link
                    key={t.slug}
                    href={href}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                      active
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <StatusDot status={t.status} />
                    <span className="truncate">{t.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Components */}
        {components.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 mb-1.5">
              Components
            </p>
            <div className="space-y-0.5">
              {components.map((c) => {
                const href = `/design-system/components/${c.slug}`;
                const active = pathname === href;
                return (
                  <Link
                    key={c.slug}
                    href={href}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                      active
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <StatusDot status={c.parity} />
                    <span className="truncate flex-1">{c.name}</span>
                    {c.hasStorybook && (
                      <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">SB</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {tokens.length === 0 && components.length === 0 && (
          <p className="px-2 text-[12px] text-muted-foreground/40">
            No contracts yet
          </p>
        )}
      </nav>

      <div className="h-12 border-t border-border/50 flex items-center justify-between px-5">
        <span className="text-[11px] text-muted-foreground/40 font-mono">
          {tokens.length}t · {components.length}c
        </span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

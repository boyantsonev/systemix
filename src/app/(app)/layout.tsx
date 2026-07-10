import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shell/AppSidebar";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { pageTreeToElements, type SurfaceNode } from "@/lib/nav.config";
import { contractSource } from "@/lib/contract-source";
import { experimentsSource } from "@/lib/experiments-source";
import { designSource } from "@/lib/design-source";
import { loadSkillPacks } from "@/lib/skills-catalog";

// This whole surface is app UI (config, contract, design, skills), not
// marketing content — keep it out of the index. /experiments overrides this
// (it's the public dogfood proof wall) via its own layout metadata.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// The unified app shell (ADR-022): one sidebar + one header across the product
// surfaces. Every surface the instance has is visible in the sidebar tree —
// Contract, Experiments, the Design System spine, and the Skills/Workflows
// catalog. Fumadocs surfaces render inside this shell with their own chrome
// disabled (see their layouts).
export default function AppLayout({ children }: { children: ReactNode }) {
  const packs = loadSkillPacks();

  const surfaces: SurfaceNode[] = [
    { label: "Contract", href: "/contract", tree: pageTreeToElements(contractSource.pageTree) },
    {
      label: "Experiments",
      href: "/experiments",
      tree: pageTreeToElements(experimentsSource.pageTree),
    },
    { label: "Design System", href: "/design", tree: pageTreeToElements(designSource.pageTree) },
    {
      label: "Skills",
      href: "/skills",
      tree: packs.map((pack) => ({
        id: `folder:skills-${pack.name}`,
        name: pack.displayName,
        type: "folder" as const,
        children: pack.skills.map((s) => ({
          id: `/skills#${s.slug}`,
          name: `/${s.slug}`,
          type: "file" as const,
        })),
      })),
    },
    {
      label: "Workflows",
      href: "/skills",
      tree: packs.map((pack) => ({
        id: `/skills#pack-${pack.name}`,
        name: pack.displayName,
        type: "file" as const,
      })),
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar surfaces={surfaces} />
      {/* min-w-0 lets the inset shrink beside the sidebar instead of overflowing
          the viewport (flexbox min-width:auto default) — keeps the header + panels
          within bounds so Search/theme aren't pushed off-screen. */}
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

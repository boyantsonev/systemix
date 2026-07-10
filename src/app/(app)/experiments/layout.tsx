import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { experimentsSource } from "@/lib/experiments-source";

// Overrides the (app) group's noindex — this is the public dogfood proof
// wall (linked from the landing page + llms.txt), not private app UI.
export const metadata: Metadata = {
  title: "The live feed — Systemix's own experiment loop",
  description:
    "Every headline on this site was proposed, measured, and kept by Systemix's own automation. This is the live record — hypotheses, decisions, and outcomes.",
  robots: { index: true, follow: true },
};

// The Loop layer renders INSIDE the (app) shell (Option B, ADR-022): fumadocs's
// own sidebar / nav / theme-switch are disabled (the page tree lives in the shell
// sidebar); it contributes only the MDX body + TOC. Search stays scoped.
export default function ExperimentsLayout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }} search={{ options: { api: "/api/system-search" } }}>
      <FumaDocsLayout
        tree={experimentsSource.pageTree}
        sidebar={{ enabled: false }}
        nav={{ enabled: false }}
        themeSwitch={{ enabled: false }}
      >
        {children}
      </FumaDocsLayout>
    </RootProvider>
  );
}

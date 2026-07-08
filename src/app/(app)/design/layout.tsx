import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { designSource } from "@/lib/design-source";

// The Design System surface renders INSIDE the (app) shell (Option B, ADR-022):
// fumadocs sidebar / nav / theme-switch disabled; the page tree lives in the
// shell sidebar; theme defers to the app root (next-themes).
export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }} search={{ enabled: false }}>
      <FumaDocsLayout
        tree={designSource.pageTree}
        sidebar={{ enabled: false }}
        nav={{ enabled: false }}
        themeSwitch={{ enabled: false }}
      >
        {children}
      </FumaDocsLayout>
    </RootProvider>
  );
}

"use client";

import { ThemeProvider } from "next-themes";
import { PostHogProvider } from "./PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      {/* Dark is the TVA default (the amber-lit control room); light stays a
          toggle away. enableSystem off so first paint is deterministic. */}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </PostHogProvider>
  );
}

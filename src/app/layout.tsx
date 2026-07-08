import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import { Providers } from "@/components/systemix/Providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Systemix — Stop your design system from rotting",
  description:
    "Systemix watches what you ship, catches design-system drift, and proposes AI fixes your team approves. Open source. Free to start.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-radius="soft" data-crt="soft">
      <body className={`${dmSans.variable} ${spaceMono.variable} font-sans antialiased`}>
        {/* TVA CRT atmosphere — fixed overlays, tokenized via [data-crt] */}
        <div className="crt-scan" aria-hidden="true" />
        <div className="crt-veil" aria-hidden="true" />
        <div className="crt-sweep" aria-hidden="true" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

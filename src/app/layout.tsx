import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/systemix/Providers";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
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
      <body className={`${chakraPetch.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* TVA CRT atmosphere — fixed overlays, tokenized via [data-crt] */}
        <div className="crt-scan" aria-hidden="true" />
        <div className="crt-veil" aria-hidden="true" />
        <div className="crt-sweep" aria-hidden="true" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { CavosProvider } from "@/lib/cavos/provider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#402AFF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Trustless Escrow Freelance App | Cavos × Trustless Work × Stellar",
  description:
    "An open-source mock-up of a freelance escrow use case on Stellar: full Cavos onboarding and full Trustless Work milestone-escrow integration. A reference for builders — not a live product yet.",
  applicationName: "Trustless Escrow Freelance App",
  openGraph: {
    title: "Trustless Escrow Freelance App | Cavos × Trustless Work × Stellar",
    description:
      "Mock-up reference: freelance payments with Cavos onboarding and Trustless Work escrows on Stellar. Clone it, study the flow, ship your own.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <CavosProvider>{children}</CavosProvider>
      </body>
    </html>
  );
}

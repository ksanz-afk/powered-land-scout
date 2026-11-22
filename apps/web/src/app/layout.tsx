import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { DemoBanner } from "@/components/demo-banner";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Powered Land Scout", template: "%s · Powered Land Scout" },
  description:
    "Find powered land for data centers, understand what nearby communities care about, and shape projects they can support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteHeader />
        <DemoBanner />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
        <footer className="border-t">
          <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
            Powered Land Scout · prototype
          </p>
        </footer>
      </body>
    </html>
  );
}

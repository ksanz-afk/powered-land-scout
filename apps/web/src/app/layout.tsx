import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">{children}</main>
        <footer className="border-t border-black/5">
          <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted-foreground sm:px-8">
            Powered Land Scout prototype. Demo data: sites, signals and projects marked &ldquo;Sample&rdquo; are
            illustrative. Map data &copy; OpenStreetMap contributors.
          </p>
        </footer>
      </body>
    </html>
  );
}

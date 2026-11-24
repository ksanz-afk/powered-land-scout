"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabNav({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="inline-flex rounded-full bg-black/[0.04] p-1 text-sm" aria-label="County sections">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 transition ${
              active ? "bg-white font-medium text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

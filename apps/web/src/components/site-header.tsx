import Link from "next/link";

const NAV = [
  { href: "/sites", label: "Sites" },
  { href: "/counties", label: "Communities" },
  { href: "/proposals", label: "Proposals" },
  { href: "/learn", label: "Learn" },
];

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Powered Land Scout
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

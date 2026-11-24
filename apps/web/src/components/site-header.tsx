import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-tight">
          Powered Land Scout
        </Link>
        <nav className="flex items-center gap-6 text-[13px] text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Explore
          </Link>
          <Link href="/learn" className="transition-colors hover:text-foreground">
            Learn
          </Link>
          <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            Demo data
          </span>
        </nav>
      </div>
    </header>
  );
}

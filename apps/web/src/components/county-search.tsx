"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Option = { fips: string; name: string; state: string };

export function CountySearch({ counties }: { counties: Option[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return counties.filter((c) => `${c.name} ${c.state}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query, counties]);

  function go(option: Option | undefined) {
    if (option) router.push(`/explore/${option.fips}`);
  }

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-6 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, matches.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              go(matches[active]);
            }
          }}
          placeholder="Search a county, e.g. Taylor County, TX"
          aria-label="Search a county"
          role="combobox"
          aria-expanded={matches.length > 0}
          aria-controls="county-results"
          className="h-16 w-full rounded-full border border-black/10 bg-white pl-14 pr-6 text-lg shadow-[0_8px_30px_rgba(0,0,0,0.06)] outline-none transition placeholder:text-muted-foreground/70 focus:border-black/20 focus:shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
        />
        {matches.length > 0 ? (
          <ul
            id="county-results"
            role="listbox"
            className="absolute left-0 right-0 top-[4.5rem] z-10 overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            {matches.map((c, i) => (
              <li key={c.fips} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(c)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                    i === active ? "bg-black/[0.04]" : ""
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-muted-foreground">{c.state}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : query.trim() ? (
          <p className="absolute left-0 right-0 top-[4.75rem] text-center text-sm text-muted-foreground">
            No matching county in this demo yet.
          </p>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {counties.map((c) => (
          <Link
            key={c.fips}
            href={`/explore/${c.fips}`}
            className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm text-foreground/80 transition hover:border-black/20 hover:text-foreground"
          >
            {c.name}, {c.state}
          </Link>
        ))}
      </div>
    </div>
  );
}

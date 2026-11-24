import { pct } from "@/lib/format";

export function SentimentBar({ support, oppose }: { support: number; oppose: number }) {
  const neutral = Math.max(0, 1 - support - oppose);
  return (
    <div className="space-y-1.5">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="bg-emerald-500" style={{ width: pct(support) }} />
        <div className="bg-zinc-300 dark:bg-zinc-600" style={{ width: pct(neutral) }} />
        <div className="bg-rose-500" style={{ width: pct(oppose) }} />
      </div>
      <p className="text-xs text-muted-foreground">
        {pct(support)} supportive · {pct(oppose)} opposed
      </p>
    </div>
  );
}

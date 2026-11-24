import { pct } from "@/lib/format";

/** Diverging stacked bar: supportive | neutral | opposed, with 2px gaps and a text legend. */
export function SentimentBar({ support, oppose, size = "sm" }: { support: number; oppose: number; size?: "sm" | "lg" }) {
  const neutral = Math.max(0, 1 - support - oppose);
  const segments = [
    { key: "support", value: support, color: "var(--viz-support)", label: "Supportive" },
    { key: "neutral", value: neutral, color: "var(--viz-neutral)", label: "Neutral" },
    { key: "oppose", value: oppose, color: "var(--viz-oppose)", label: "Opposed" },
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-2.5">
      <div className={`flex w-full gap-[2px] ${size === "lg" ? "h-3" : "h-2"}`}>
        {segments.map((s) => (
          <div
            key={s.key}
            className="h-full rounded-full first:rounded-l-full last:rounded-r-full"
            style={{ width: pct(s.value), background: s.color }}
            title={`${s.label}: ${pct(s.value)}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {segments.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
            {s.label} {pct(s.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

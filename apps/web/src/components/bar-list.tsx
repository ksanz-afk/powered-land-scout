import { pct } from "@/lib/format";

export type BarItem = { key: string; label: string; value: number; note?: string };

/** Single-hue horizontal bars (0-1) with the value always written out. */
export function BarList({ items, empty }: { items: BarItem[]; empty?: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty ?? "Nothing to show yet."}</p>;
  }
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.key} title={`${item.label}: ${pct(item.value)}`}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4 text-[15px]">
            <span>{item.label}</span>
            <span className="text-sm text-muted-foreground">{item.note ?? pct(item.value)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--viz-bar-track)" }}>
            <div className="h-full rounded-full" style={{ width: pct(item.value), background: "var(--viz-bar)" }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export type Stat = { label: string; value: string; hint?: string };

export function StatGrid({ stats, columns = 3 }: { stats: Stat[]; columns?: 2 | 3 }) {
  return (
    <dl className={`grid gap-px overflow-hidden rounded-[28px] bg-black/5 ring-1 ring-black/5 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {stats.map((s) => (
        <div key={s.label} className="bg-white p-6">
          <dt className="text-sm text-muted-foreground">{s.label}</dt>
          <dd className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</dd>
          {s.hint ? <dd className="mt-1 text-xs text-muted-foreground">{s.hint}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

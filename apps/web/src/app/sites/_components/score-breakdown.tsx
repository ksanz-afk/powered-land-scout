import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pct } from "@/lib/format";
import type { Site } from "@/lib/types";

export function ScoreBreakdown({ site }: { site: Site }) {
  const factors = Object.entries(site.score_breakdown).sort((a, b) => b[1].weight - a[1].weight);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why this score</CardTitle>
        <CardDescription>
          {site.score} of 100 points · {pct(site.confidence)} of the score is backed by data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {factors.map(([key, f]) => {
            const max = f.weight * 100;
            return (
              <li key={key} className="space-y-1">
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className={f.known ? "" : "text-muted-foreground"}>
                    {f.label}
                    {f.known ? null : <span className="ml-1 text-xs">(no data yet)</span>}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {f.points.toFixed(1)} / {max.toFixed(0)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
                  <div
                    className={f.known ? "h-full bg-primary" : "h-full bg-muted-foreground/40"}
                    style={{ width: pct(f.normalized) }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

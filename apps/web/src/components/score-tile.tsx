import Link from "next/link";

import { scoreLabel } from "@/lib/scores";

type Tone = "energy" | "community";

const TONE: Record<Tone, { fill: string; track: string }> = {
  energy: { fill: "var(--viz-energy)", track: "var(--viz-energy-track)" },
  community: { fill: "var(--viz-community)", track: "var(--viz-community-track)" },
};

export function ScoreTile({
  title,
  score,
  tone,
  caption,
  href,
}: {
  title: string;
  score: number | null;
  tone: Tone;
  caption: string;
  href?: string;
}) {
  const colors = TONE[tone];
  const body = (
    <div className="group flex h-full flex-col justify-between rounded-[28px] bg-white p-7 shadow-[0_2px_20px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[15px] font-medium text-muted-foreground">{title}</p>
        {href ? (
          <span className="text-sm text-muted-foreground transition group-hover:text-foreground">Details →</span>
        ) : null}
      </div>
      <div className="mt-8">
        <div className="flex items-baseline gap-3">
          <span className="text-6xl font-semibold tracking-tight">{score ?? "—"}</span>
          <span className="text-lg font-medium text-foreground/70">{scoreLabel(score)}</span>
        </div>
        <div
          className="mt-5 h-2 w-full overflow-hidden rounded-full"
          style={{ background: colors.track }}
          role="meter"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score ?? undefined}
        >
          <div className="h-full rounded-full" style={{ width: `${score ?? 0}%`, background: colors.fill }} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
  return href ? <Link href={href} className="block h-full">{body}</Link> : body;
}

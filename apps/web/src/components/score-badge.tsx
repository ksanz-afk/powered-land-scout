import { SamplePill } from "@/components/sample-pill";

/** Compact score pill: the number in text ink, tier shown by a small dot. */
export function ScoreBadge({ score }: { score: number }) {
  const tier = score >= 75 ? "var(--viz-energy)" : score >= 60 ? "#8fb6e8" : "#c8c7c2";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-0.5 text-sm font-semibold tabular-nums">
      <span className="size-1.5 rounded-full" style={{ background: tier }} aria-hidden />
      {score}
    </span>
  );
}

export function SampleBadge({ show }: { show: boolean }) {
  return <SamplePill show={show} />;
}

import { Badge } from "@/components/ui/badge";

export function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 75 ? "default" : score >= 60 ? "secondary" : "outline";
  return <Badge variant={variant}>{score}</Badge>;
}

export function SampleBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
      Sample
    </Badge>
  );
}

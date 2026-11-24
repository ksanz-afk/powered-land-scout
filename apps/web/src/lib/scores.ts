// County-level scores derived from shared data. v0 definitions, labelled in
// the UI; owners refine them (Energy: Kat, Community: Dhruv).

import type { CountySentiment, Site } from "@/lib/types";

/** Energy Score: mean of the county's top three site scores (0-100). */
export function energyScore(sites: Site[]): number | null {
  if (sites.length === 0) return null;
  const top = [...sites].sort((a, b) => b.score - a.score).slice(0, 3);
  return Math.round(top.reduce((sum, s) => sum + s.score, 0) / top.length);
}

/** Community Sentiment Score: 50 = balanced, 100 = all supportive, 0 = all opposed. */
export function communityScore(sentiment: CountySentiment | undefined): number | null {
  if (!sentiment) return null;
  const raw = 50 + 50 * (sentiment.support_share - sentiment.oppose_share);
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function scoreLabel(score: number | null): string {
  if (score === null) return "Not yet scored";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Promising";
  if (score >= 45) return "Mixed";
  return "Challenging";
}

export type FactorSummary = {
  key: string;
  label: string;
  average: number; // 0-1
  known: number; // sites with real data for this factor
  weight: number;
};

/** Average each scoring factor across a county's sites. */
export function factorSummary(sites: Site[]): FactorSummary[] {
  const acc = new Map<string, FactorSummary & { sum: number; n: number }>();
  for (const site of sites) {
    for (const [key, f] of Object.entries(site.score_breakdown ?? {})) {
      const row = acc.get(key) ?? { key, label: f.label, average: 0, known: 0, weight: f.weight, sum: 0, n: 0 };
      row.sum += f.normalized;
      row.n += 1;
      if (f.known) row.known += 1;
      acc.set(key, row);
    }
  }
  return [...acc.values()]
    .map(({ sum, n, ...row }) => ({ ...row, average: n ? sum / n : 0 }))
    .sort((a, b) => b.weight - a.weight);
}

export function strengthsAndWatchOuts(summary: FactorSummary[]) {
  const withData = summary.filter((f) => f.known > 0);
  return {
    strengths: withData.filter((f) => f.average >= 0.7).sort((a, b) => b.average - a.average),
    watchOuts: withData.filter((f) => f.average < 0.5).sort((a, b) => a.average - b.average),
  };
}

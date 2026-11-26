import type { Metadata } from "next";
import Link from "next/link";

import { BarList } from "@/components/bar-list";
import { SampleBadge, ScoreBadge } from "@/components/score-badge";
import { ScoreTile } from "@/components/score-tile";
import { Panel } from "@/components/section";
import { SitesMap } from "@/components/sites-map";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCounty, getSitesByCounty } from "@/lib/data";
import { pct, titleCase } from "@/lib/format";
import { energyScore, factorSummary } from "@/lib/scores";

export async function generateMetadata(props: PageProps<"/explore/[fips]/energy">): Promise<Metadata> {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  return { title: county ? `Energy · ${county.name}` : "Energy" };
}

export default async function EnergyPage(props: PageProps<"/explore/[fips]/energy">) {
  const { fips } = await props.params;
  const sites = await getSitesByCounty(fips);
  const score = energyScore(sites);
  const factors = factorSummary(sites);
  const totalMw = sites.reduce((sum, s) => sum + s.est_available_mw, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <ScoreTile
          title="Energy Score"
          tone="energy"
          score={score}
          caption="Mean of the county's top three parcel scores. Each parcel is scored on the factors at right."
        />
        <Panel title="What drives the score" subtitle="Average across this county's parcels; weight in brackets">
          <BarList
            items={factors.map((f) => ({
              key: f.key,
              label: `${f.label} (${Math.round(f.weight * 100)}%)`,
              value: f.average,
              note: f.known === 0 ? "No data yet" : pct(f.average),
            }))}
          />
        </Panel>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { label: "Candidate parcels", value: sites.length.toString() },
          { label: "Power proxy, all parcels", value: `~${totalMw.toLocaleString()} MW` },
          {
            label: "Highest-voltage substation",
            value: `${Math.max(0, ...sites.map((s) => s.substation_kv ?? 0)) || "—"} kV`,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {sites.length > 0 ? <SitesMap sites={sites} height={420} /> : null}

      <Panel title="Parcels" subtitle="Ranked by site score. Open a parcel for its full breakdown.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parcel</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Acres</TableHead>
              <TableHead className="text-right">Substation</TableHead>
              <TableHead className="text-right">Fiber</TableHead>
              <TableHead>Water risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/sites/${site.id}`} className="font-medium hover:underline">
                      {site.name}
                    </Link>
                    <SampleBadge show={site.is_sample} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ScoreBadge score={site.score} />
                </TableCell>
                <TableCell className="text-right tabular-nums">{site.acres ?? "—"}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {site.substation_kv ?? "—"} kV · {site.nearest_substation_km ?? "?"} km
                </TableCell>
                <TableCell className="text-right tabular-nums">{site.fiber_km ?? "—"} km</TableCell>
                <TableCell>{titleCase(site.water_risk)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </div>
  );
}

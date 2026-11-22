import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SampleBadge, ScoreBadge } from "@/components/score-badge";
import { SitesMap } from "@/components/sites-map";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCounties, getSites } from "@/lib/data";
import { titleCase } from "@/lib/format";

export const metadata: Metadata = { title: "Sites" };

export default async function SitesPage() {
  const [sites, counties] = await Promise.all([getSites(), getCounties()]);
  const countyName = (fips: string) => counties.find((c) => c.fips === fips)?.name ?? fips;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate sites"
        description="Parcels ranked on power availability, size, fiber, water risk and zoning."
      />
      <SitesMap sites={sites} />
      {sites.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sites yet. Run the site pipeline to populate this list.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>County</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">MW proxy</TableHead>
              <TableHead className="text-right">Substation</TableHead>
              <TableHead className="text-right">Acres</TableHead>
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
                <TableCell>
                  <Link href={`/counties/${site.fips}`} className="hover:underline">
                    {countyName(site.fips)}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <ScoreBadge score={site.score} />
                </TableCell>
                <TableCell className="text-right tabular-nums">{site.est_available_mw}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {site.substation_kv === null ? "—" : `${site.substation_kv} kV · ${site.nearest_substation_km ?? "?"} km`}
                </TableCell>
                <TableCell className="text-right tabular-nums">{site.acres ?? "—"}</TableCell>
                <TableCell>{titleCase(site.water_risk)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BarList } from "@/components/bar-list";
import { ProjectCard } from "@/components/project-card";
import { SamplePill } from "@/components/sample-pill";
import { ScoreTile } from "@/components/score-tile";
import { Panel } from "@/components/section";
import { SitesMap } from "@/components/sites-map";
import { StatGrid } from "@/components/stat-grid";
import { getCounty, getIssues, getProposalsBySite, getSentiment, getSite, getSites } from "@/lib/data";
import { pct, titleCase } from "@/lib/format";
import { communityScore } from "@/lib/scores";

export async function generateStaticParams() {
  const sites = await getSites();
  return sites.map((s) => ({ id: s.id }));
}

export async function generateMetadata(props: PageProps<"/sites/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const site = await getSite(id);
  return { title: site?.name ?? "Parcel" };
}

const show = (value: number | null, unit: string) => (value === null ? "Unknown" : `${value.toLocaleString()} ${unit}`);

export default async function ParcelPage(props: PageProps<"/sites/[id]">) {
  const { id } = await props.params;
  const site = await getSite(id);
  if (!site) notFound();
  const [county, proposals, sentiment] = await Promise.all([
    getCounty(site.fips),
    getProposalsBySite(site.id),
    getSentiment(site.fips),
  ]);
  const issues = await getIssues(proposals.flatMap((p) => p.issue_ids));
  const factors = Object.entries(site.score_breakdown ?? {}).sort((a, b) => b[1].weight - a[1].weight);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        {county ? (
          <Link
            href={`/explore/${county.fips}/energy`}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← {county.name}, {county.state}
          </Link>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-5xl font-semibold leading-tight">{site.name}</h1>
          <SamplePill show={site.is_sample} />
        </div>
        <p className="text-xl text-muted-foreground">
          {site.acres ? `${site.acres.toLocaleString()} acres` : "Parcel"} · {site.zoning.replace(/\s*\(illustrative\)/i, "")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <ScoreTile
          title="Site Score"
          tone="energy"
          score={site.score}
          caption={`${pct(site.confidence)} of this score is backed by data. Missing factors count as neutral.`}
        />
        <StatGrid
          stats={[
            { label: "Power proxy", value: `~${site.est_available_mw} MW`, hint: "Estimated from substation voltage" },
            {
              label: "Nearest substation",
              value: site.substation_kv === null ? "Unknown" : `${site.substation_kv} kV`,
              hint: show(site.nearest_substation_km, "km away"),
            },
            { label: "Parcel size", value: show(site.acres, "acres") },
            { label: "Fiber", value: show(site.fiber_km, "km"), hint: "Distance to fiber service" },
            { label: "Water risk", value: titleCase(site.water_risk), hint: "Baseline water stress" },
            { label: "Zoning", value: site.zoning.replace(/\s*\(illustrative\)/i, "") },
          ]}
        />
      </div>

      <SitesMap sites={[site]} height={380} />

      <Panel title="Why this score" subtitle="Each factor's contribution. Bars show how well the parcel does on that factor.">
        <BarList
          items={factors.map(([key, f]) => ({
            key,
            label: f.label,
            value: f.known ? f.normalized : 0,
            note: f.known ? `${f.points.toFixed(1)} of ${Math.round(f.weight * 100)} pts` : "No data yet",
          }))}
        />
      </Panel>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Projects for this parcel</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Proposals pairing this site with what the community cares about
            </p>
          </div>
          {county ? (
            <Link
              href={`/explore/${county.fips}/community`}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Community sentiment: {communityScore(sentiment) ?? "—"} →
            </Link>
          ) : null}
        </div>
        {proposals.length === 0 ? (
          <Panel>
            <p className="text-[15px] text-muted-foreground">
              No project proposed for this parcel yet. See what {county?.name ?? "the county"} cares about on the
              community page.
            </p>
          </Panel>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {proposals.map((p) => (
              <ProjectCard
                key={p.id}
                proposal={p}
                siteName={site.name}
                issues={issues.filter((i) => p.issue_ids.includes(i.id))}
              />
            ))}
          </div>
        )}
      </section>

      {site.notes ? <p className="text-sm text-muted-foreground">{site.notes}</p> : null}
    </div>
  );
}

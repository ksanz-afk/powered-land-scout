import type { Metadata } from "next";
import Link from "next/link";

import { BarList } from "@/components/bar-list";
import { SampleBadge, ScoreBadge } from "@/components/score-badge";
import { ScoreTile } from "@/components/score-tile";
import { Panel } from "@/components/section";
import { SitesMap } from "@/components/sites-map";
import { getCounty, getIssuesByCounty, getProposalsByCounty, getSentiment, getSitesByCounty } from "@/lib/data";
import { communityScore, energyScore, factorSummary, strengthsAndWatchOuts } from "@/lib/scores";

export async function generateMetadata(props: PageProps<"/explore/[fips]">): Promise<Metadata> {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  return { title: county ? `${county.name}, ${county.state}` : "Explore" };
}

export default async function CountyOverviewPage(props: PageProps<"/explore/[fips]">) {
  const { fips } = await props.params;
  const [sites, sentiment, issues, proposals] = await Promise.all([
    getSitesByCounty(fips),
    getSentiment(fips),
    getIssuesByCounty(fips),
    getProposalsByCounty(fips),
  ]);
  const energy = energyScore(sites);
  const community = communityScore(sentiment);
  const { strengths, watchOuts } = strengthsAndWatchOuts(factorSummary(sites));
  const concerns = sentiment?.top_concerns ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <ScoreTile
          title="Energy Score"
          tone="energy"
          score={energy}
          caption="Power, land, fiber, water and zoning across the county's best parcels."
          href={`/explore/${fips}/energy`}
        />
        <ScoreTile
          title="Community Sentiment Score"
          tone="community"
          score={community}
          caption="How residents talk about data centers. 50 is balanced."
          href={`/explore/${fips}/community`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Strengths" subtitle="Where this county's parcels score well">
          <BarList
            items={strengths.map((f) => ({ key: f.key, label: f.label, value: f.average }))}
            empty="No clear strengths in the data yet."
          />
        </Panel>
        <Panel title="Watch-outs" subtitle="Weak factors and what residents worry about">
          <div className="space-y-6">
            <BarList
              items={watchOuts.map((f) => ({ key: f.key, label: f.label, value: f.average }))}
              empty="No weak technical factors in the data."
            />
            {concerns.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resident concerns</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {concerns.map((c) => (
                    <span key={c} className="rounded-full bg-black/[0.04] px-3 py-1 text-sm capitalize">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Panel>
      </div>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 className="text-2xl font-semibold">Available parcels</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {sites.length} candidate {sites.length === 1 ? "parcel" : "parcels"} that pass the site filters
            </p>
          </div>
          <Link href={`/explore/${fips}/energy`} className="text-sm text-muted-foreground hover:text-foreground">
            Energy details →
          </Link>
        </div>
        {sites.length > 0 ? <SitesMap sites={sites} height={380} /> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/sites/${site.id}`}
              className="flex items-center justify-between gap-4 rounded-3xl bg-white p-5 ring-1 ring-black/5 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{site.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {site.acres ?? "?"} acres · {site.substation_kv ?? "?"} kV substation ·{" "}
                  {site.nearest_substation_km ?? "?"} km
                </p>
                <div className="mt-2">
                  <SampleBadge show={site.is_sample} />
                </div>
              </div>
              <ScoreBadge score={site.score} />
            </Link>
          ))}
        </div>
      </section>

      <Panel
        title="Topics residents care about"
        subtitle={`${issues.length} local issues · ${proposals.length} potential ${proposals.length === 1 ? "project" : "projects"}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {issues.slice(0, 4).map((i) => (
              <span key={i.id} className="rounded-full bg-black/[0.04] px-3 py-1 text-sm">
                {i.issue.replace(/^Sample:\s*/, "")}
              </span>
            ))}
          </div>
          <Link href={`/explore/${fips}/community`} className="text-sm text-muted-foreground hover:text-foreground">
            Community details →
          </Link>
        </div>
      </Panel>
    </div>
  );
}

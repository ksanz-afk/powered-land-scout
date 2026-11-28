import type { Metadata } from "next";
import Link from "next/link";

import { BarList } from "@/components/bar-list";
import { ProjectCard } from "@/components/project-card";
import { SampleBadge } from "@/components/score-badge";
import { ScoreTile } from "@/components/score-tile";
import { Panel } from "@/components/section";
import { SentimentBar } from "@/components/sentiment-bar";
import {
  getCounty,
  getIssues,
  getIssuesByCounty,
  getProposalsByCounty,
  getSentiment,
  getSignalsByCounty,
  getSites,
} from "@/lib/data";
import { pct, titleCase } from "@/lib/format";
import { communityScore } from "@/lib/scores";

import { TaylorCommunity } from "./taylor-community";

export async function generateMetadata(props: PageProps<"/explore/[fips]/community">): Promise<Metadata> {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  return { title: county ? `Community · ${county.name}` : "Community" };
}

export default async function CommunityPage(props: PageProps<"/explore/[fips]/community">) {
  const { fips } = await props.params;
  const [sentiment, issues, signals, proposals, sites] = await Promise.all([
    getSentiment(fips),
    getIssuesByCounty(fips),
    getSignalsByCounty(fips),
    getProposalsByCounty(fips),
    getSites(),
  ]);
  const reviewedTaylor = fips === "48441" && signals.some((signal) => signal.id.startsWith("sig-48441-reviewed-"));
  const score = communityScore(sentiment);
  const issueLookup = await getIssues(proposals.flatMap((p) => p.issue_ids));
  const clean = (text: string) => text.replace(/^Sample:\s*/, "");

  return (
    <div className="space-y-8">
      {reviewedTaylor ? (
        <TaylorCommunity signals={signals} issues={issues} score={score} />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <ScoreTile
              title="Community Sentiment Score"
              tone="community"
              score={score}
              caption={
                !sentiment
                  ? "Not analyzed yet."
                  : sentiment.signal_count === 0
                    ? "Sample estimate until public signals are collected. 50 is balanced; higher is more supportive."
                    : `Based on ${sentiment.signal_count} public signals. 50 is balanced; higher is more supportive.`
              }
            />
            <Panel title="How residents talk about data centers">
              {sentiment ? (
                <div className="space-y-6">
                  <SentimentBar support={sentiment.support_share} oppose={sentiment.oppose_share} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Most-raised concerns</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sentiment.top_concerns.map((c) => (
                        <span key={c} className="rounded-full bg-black/[0.04] px-3 py-1 text-sm capitalize">
                          {c}
                        </span>
                      ))}
                      <SampleBadge show={sentiment.is_sample} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No sentiment data for this county yet.</p>
              )}
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel
              title="Recent topics of interest"
              subtitle="Local issues beyond data centers, ranked by how much residents raise them"
            >
              <BarList
                items={issues.map((i) => ({
                  key: i.id,
                  label: clean(i.issue),
                  value: i.salience,
                  note: `${titleCase(i.category)} · ${pct(i.salience)}`,
                }))}
                empty="No topics collected yet."
              />
            </Panel>
            <Panel title="What people are saying" subtitle="Short excerpts from public sources">
              {signals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No signals collected yet.</p>
              ) : (
                <ul className="space-y-4">
                  {signals.map((sig) => (
                    <li key={sig.id} className="rounded-2xl bg-black/[0.03] p-4">
                      <p className="text-[15px]">&ldquo;{sig.excerpt}&rdquo;</p>
                      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        {titleCase(sig.stance_on_dc)} · {sig.source}
                        <SampleBadge show={sig.is_sample} />
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      )}

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold">{reviewedTaylor ? "Sample proposals for Taylor County" : "Potential projects"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {reviewedTaylor ? "Compare the proposed terms for South Abilene with the local concerns above." : "Strong parcels paired with commitments on what this community cares about"}
          </p>
        </div>
        {proposals.length === 0 ? (
          <Panel>
            <p className="text-sm text-muted-foreground">No projects proposed for this county yet.</p>
          </Panel>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {[...proposals]
              .sort((a, b) => b.community_fit - a.community_fit)
              .map((p) => (
                <ProjectCard
                  key={p.id}
                  proposal={p}
                  siteName={sites.find((s) => s.id === p.site_id)?.name}
                  issues={issueLookup.filter((i) => p.issue_ids.includes(i.id))}
                />
              ))}
          </div>
        )}
      </section>

      <Link href={`/learn/${fips}`} className="inline-block text-sm text-muted-foreground hover:text-foreground">
        Resident education for this county →
      </Link>
    </div>
  );
}

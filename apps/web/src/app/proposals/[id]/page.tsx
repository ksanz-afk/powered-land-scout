import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BarList } from "@/components/bar-list";
import { SamplePill } from "@/components/sample-pill";
import { ScoreTile } from "@/components/score-tile";
import { Panel } from "@/components/section";
import { getCounty, getIssues, getProposal, getProposals, getSentiment, getSite } from "@/lib/data";
import { pct, titleCase } from "@/lib/format";
import { communityScore } from "@/lib/scores";

export async function generateStaticParams() {
  const proposals = await getProposals();
  return proposals.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/proposals/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const proposal = await getProposal(id);
  return { title: proposal?.title ?? "Project" };
}

const clean = (text: string) => text.replace(/^Sample:\s*/, "");

export default async function ProposalPage(props: PageProps<"/proposals/[id]">) {
  const { id } = await props.params;
  const proposal = await getProposal(id);
  if (!proposal) notFound();
  const [site, issues] = await Promise.all([getSite(proposal.site_id), getIssues(proposal.issue_ids)]);
  const [county, sentiment] = site
    ? await Promise.all([getCounty(site.fips), getSentiment(site.fips)])
    : [undefined, undefined];

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        {county ? (
          <Link
            href={`/explore/${county.fips}/community`}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← {county.name}, {county.state}
          </Link>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-muted-foreground">Potential project</p>
          <SamplePill show={proposal.is_sample} />
        </div>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08]">{clean(proposal.title)}</h1>
        <p className="max-w-3xl text-xl leading-relaxed text-foreground/75">{proposal.pitch}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ScoreTile
          title={site ? `Site Score · ${site.name}` : "Site Score"}
          tone="energy"
          score={site?.score ?? null}
          caption={
            site
              ? `~${site.est_available_mw} MW power proxy · ${site.acres ?? "?"} acres · ${pct(site.confidence)} data-backed`
              : "Site not found."
          }
          href={site ? `/sites/${site.id}` : undefined}
        />
        <ScoreTile
          title="Community Sentiment Score"
          tone="community"
          score={communityScore(sentiment)}
          caption="Where the county stands today. This project is designed to move it."
          href={county ? `/explore/${county.fips}/community` : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="What it addresses" subtitle="Local issues this project answers, by how much residents raise them">
          <BarList
            items={issues.map((i) => ({
              key: i.id,
              label: clean(i.issue),
              value: i.salience,
              note: `${titleCase(i.category)} · ${pct(i.salience)}`,
            }))}
            empty="No linked issues."
          />
        </Panel>
        <Panel title="Commitments" subtitle="What the developer would put in writing">
          <ul className="space-y-4">
            {proposal.commitments.map((c) => (
              <li key={c} className="flex gap-3 text-[15px] leading-relaxed">
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="mt-0.5 size-5 shrink-0"
                  fill="none"
                  stroke="var(--viz-community)"
                  strokeWidth="2"
                >
                  <circle cx="10" cy="10" r="8" strokeOpacity="0.35" />
                  <path d="m6.5 10.2 2.3 2.3 4.7-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {proposal.is_sample ? (
        <p className="text-sm text-muted-foreground">
          Illustrative sample project. Commitments show the kind of agreement the proposer will draft from real site
          and community data.
        </p>
      ) : null}
    </div>
  );
}

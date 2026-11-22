import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { SampleBadge, ScoreBadge } from "@/components/score-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCounty, getIssues, getProposal, getProposals, getSite } from "@/lib/data";
import { titleCase } from "@/lib/format";

export async function generateStaticParams() {
  const proposals = await getProposals();
  return proposals.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/proposals/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const proposal = await getProposal(id);
  return { title: proposal?.title ?? "Proposal" };
}

export default async function ProposalPage(props: PageProps<"/proposals/[id]">) {
  const { id } = await props.params;
  const proposal = await getProposal(id);
  if (!proposal) notFound();
  const [site, issues] = await Promise.all([getSite(proposal.site_id), getIssues(proposal.issue_ids)]);
  const county = site ? await getCounty(site.fips) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title={proposal.title}
        description={county ? `${county.name}, ${county.state}` : undefined}
        actions={<SampleBadge show={proposal.is_sample} />}
      />
      <p className="max-w-3xl">{proposal.pitch}</p>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Site</CardDescription>
            <CardTitle>{site ? <Link href={`/sites/${site.id}`} className="hover:underline">{site.name}</Link> : "Unknown site"}</CardTitle>
          </CardHeader>
          {site ? (
            <CardContent className="flex items-center gap-2 text-sm">
              Score <ScoreBadge score={site.score} /> · {site.est_available_mw} MW est.
            </CardContent>
          ) : null}
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Community issues addressed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {issues.map((i) => (
                <li key={i.id} className="flex justify-between gap-4">
                  <span>{i.issue}</span>
                  <span className="text-muted-foreground">{titleCase(i.category)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Commitments</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {proposal.commitments.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

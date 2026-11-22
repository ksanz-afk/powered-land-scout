import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { SampleBadge, ScoreBadge } from "@/components/score-badge";
import { SentimentBar } from "@/components/sentiment-bar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCounties,
  getCounty,
  getIssuesByCounty,
  getSentiment,
  getSignalsByCounty,
  getSitesByCounty,
} from "@/lib/data";
import { pct, titleCase } from "@/lib/format";

export async function generateStaticParams() {
  const counties = await getCounties();
  return counties.map((c) => ({ fips: c.fips }));
}

export async function generateMetadata(props: PageProps<"/counties/[fips]">): Promise<Metadata> {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  return { title: county ? `${county.name}, ${county.state}` : "Community" };
}

export default async function CountyPage(props: PageProps<"/counties/[fips]">) {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  if (!county) notFound();
  const [sentiment, issues, signals, sites] = await Promise.all([
    getSentiment(fips),
    getIssuesByCounty(fips),
    getSignalsByCounty(fips),
    getSitesByCounty(fips),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title={`${county.name}, ${county.state}`} description={county.summary} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment on data centers</CardTitle>
            <CardDescription>
              {sentiment ? `${sentiment.signal_count} signals analyzed` : "Not analyzed yet"}
            </CardDescription>
          </CardHeader>
          {sentiment ? (
            <CardContent className="space-y-4">
              <SentimentBar support={sentiment.support_share} oppose={sentiment.oppose_share} />
              <div className="flex flex-wrap gap-2">
                {sentiment.top_concerns.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
                <SampleBadge show={sentiment.is_sample} />
              </div>
            </CardContent>
          ) : null}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Candidate sites here</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No candidate sites in this county.</p>
            ) : (
              sites.map((s) => (
                <Link key={s.id} href={`/sites/${s.id}`} className="flex items-center justify-between gap-3 text-sm hover:underline">
                  <span>{s.name}</span>
                  <ScoreBadge score={s.score} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What this community cares about</h2>
        <p className="text-sm text-muted-foreground">
          Local issues beyond data centers. These are the openings for a partnership.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader>
                <CardDescription>{titleCase(issue.category)}</CardDescription>
                <CardTitle>{issue.issue}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{issue.summary}</p>
                <p>Salience {pct(issue.salience)}</p>
                <SampleBadge show={issue.is_sample} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent signals</h2>
        {signals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No signals collected yet.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {signals.map((sig) => (
              <li key={sig.id} className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span>{sig.excerpt}</span>
                <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                  {titleCase(sig.stance_on_dc)} · {sig.source}
                  <SampleBadge show={sig.is_sample} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href={`/learn/${county.fips}`} className="inline-block text-sm font-medium underline underline-offset-4">
        Community education for {county.name}
      </Link>
    </div>
  );
}

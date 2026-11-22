import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SentimentBar } from "@/components/sentiment-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllSentiment, getCounties, getProposals, getSites } from "@/lib/data";

export default async function OverviewPage() {
  const [counties, sites, proposals, sentiment] = await Promise.all([
    getCounties(),
    getSites(),
    getProposals(),
    getAllSentiment(),
  ]);
  const totalMw = sites.reduce((sum, s) => sum + s.est_available_mw, 0);

  const stats = [
    { label: "Communities", value: counties.length, href: "/counties" },
    { label: "Candidate sites", value: sites.length, href: "/sites" },
    { label: "Est. available MW", value: totalMw.toLocaleString(), href: "/sites" },
    { label: "Draft proposals", value: proposals.length, href: "/proposals" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Powered land that suits a data center, what nearby communities care about, and projects that answer both."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Communities</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {counties.map((county) => {
            const s = sentiment.find((x) => x.fips === county.fips);
            return (
              <Link key={county.fips} href={`/counties/${county.fips}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle>
                      {county.name}, {county.state}
                    </CardTitle>
                    <CardDescription>{county.summary}</CardDescription>
                  </CardHeader>
                  {s ? (
                    <CardContent>
                      <SentimentBar support={s.support_share} oppose={s.oppose_share} />
                    </CardContent>
                  ) : null}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

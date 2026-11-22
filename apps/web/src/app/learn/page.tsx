import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SampleBadge } from "@/components/score-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCounties, getGeneralEducation } from "@/lib/data";

export const metadata: Metadata = { title: "Learn" };

export default async function LearnPage() {
  const [general, counties] = await Promise.all([getGeneralEducation(), getCounties()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community education hub"
        description="Plain-language explainers on data centers and the local issues they touch."
      />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Start here</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {general.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{item.body}</p>
                <SampleBadge show={item.is_sample} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">By community</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {counties.map((c) => (
            <Link key={c.fips} href={`/learn/${c.fips}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>
                    {c.name}, {c.state}
                  </CardTitle>
                  <CardDescription>Local explainers</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

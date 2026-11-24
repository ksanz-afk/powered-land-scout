import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { SampleBadge } from "@/components/score-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCounties, getCounty, getEducation } from "@/lib/data";
import { titleCase } from "@/lib/format";

export async function generateStaticParams() {
  const counties = await getCounties();
  return counties.map((c) => ({ fips: c.fips }));
}

export async function generateMetadata(props: PageProps<"/learn/[fips]">): Promise<Metadata> {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  return { title: county ? `Learn: ${county.name}` : "Learn" };
}

export default async function LearnCountyPage(props: PageProps<"/learn/[fips]">) {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  if (!county) notFound();
  const items = await getEducation(fips);

  return (
    <div className="space-y-6">
      <PageHeader title={`Learn: ${county.name}, ${county.state}`} description="Explainers for residents and local leaders." />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardDescription>{titleCase(item.topic)}</CardDescription>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{item.body}</p>
              <SampleBadge show={item.is_sample} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

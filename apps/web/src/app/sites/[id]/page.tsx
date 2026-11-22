import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { SampleBadge, ScoreBadge } from "@/components/score-badge";
import { SitesMap } from "@/components/sites-map";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCounty, getProposalsBySite, getSite, getSites } from "@/lib/data";
import { titleCase } from "@/lib/format";

export async function generateStaticParams() {
  const sites = await getSites();
  return sites.map((s) => ({ id: s.id }));
}

export async function generateMetadata(props: PageProps<"/sites/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const site = await getSite(id);
  return { title: site?.name ?? "Site" };
}

export default async function SitePage(props: PageProps<"/sites/[id]">) {
  const { id } = await props.params;
  const site = await getSite(id);
  if (!site) notFound();
  const [county, proposals] = await Promise.all([getCounty(site.fips), getProposalsBySite(site.id)]);

  const facts = [
    { label: "Estimated available power", value: `${site.est_available_mw} MW` },
    { label: "Nearest substation", value: `${site.substation_kv} kV, ${site.nearest_substation_km} km` },
    { label: "Parcel size", value: `${site.acres} acres` },
    { label: "Fiber distance", value: `${site.fiber_km} km` },
    { label: "Water risk", value: titleCase(site.water_risk) },
    { label: "Zoning", value: site.zoning },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={site.name}
        description={county ? `${county.name}, ${county.state}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <SampleBadge show={site.is_sample} />
            <span className="text-sm text-muted-foreground">Score</span>
            <ScoreBadge score={site.score} />
          </div>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SitesMap sites={[site]} height={360} />
        <Card>
          <CardHeader>
            <CardTitle>Site facts</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="text-right font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
      {site.notes ? <p className="text-sm text-muted-foreground">{site.notes}</p> : null}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Proposals for this site</h2>
        {proposals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No proposals yet.</p>
        ) : (
          proposals.map((p) => (
            <Link key={p.id} href={`/proposals/${p.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription>{p.pitch}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
        {county ? (
          <Link href={`/counties/${county.fips}`} className="inline-block text-sm font-medium underline underline-offset-4">
            What {county.name} cares about
          </Link>
        ) : null}
      </section>
    </div>
  );
}

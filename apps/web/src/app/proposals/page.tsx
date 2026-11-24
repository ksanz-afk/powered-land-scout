import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SampleBadge } from "@/components/score-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProposals, getSites } from "@/lib/data";
import { titleCase } from "@/lib/format";

export const metadata: Metadata = { title: "Proposals" };

export default async function ProposalsPage() {
  const [proposals, sites] = await Promise.all([getProposals(), getSites()]);
  const siteName = (id: string) => sites.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project proposals"
        description="Technically strong sites paired with commitments on the issues their communities care about."
      />
      {proposals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No proposals yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {proposals.map((p) => (
            <Link key={p.id} href={`/proposals/${p.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardDescription>{siteName(p.site_id)}</CardDescription>
                  <CardTitle>{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{p.pitch}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{titleCase(p.status)}</Badge>
                    <SampleBadge show={p.is_sample} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

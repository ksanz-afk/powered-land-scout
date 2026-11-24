import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SentimentBar } from "@/components/sentiment-bar";
import { SampleBadge } from "@/components/score-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllSentiment, getCounties } from "@/lib/data";

export const metadata: Metadata = { title: "Communities" };

export default async function CountiesPage() {
  const [counties, sentiment] = await Promise.all([getCounties(), getAllSentiment()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communities"
        description="How each county talks about data centers, and the local issues a project could help with."
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>County</TableHead>
            <TableHead className="w-64">Sentiment on data centers</TableHead>
            <TableHead>Top concerns</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {counties.map((county) => {
            const s = sentiment.find((x) => x.fips === county.fips);
            return (
              <TableRow key={county.fips}>
                <TableCell>
                  <Link href={`/counties/${county.fips}`} className="font-medium hover:underline">
                    {county.name}, {county.state}
                  </Link>
                </TableCell>
                <TableCell>
                  {s ? <SentimentBar support={s.support_share} oppose={s.oppose_share} /> : "No data yet"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm">{s?.top_concerns.join(", ") ?? "—"}</span>
                    <SampleBadge show={Boolean(s?.is_sample)} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

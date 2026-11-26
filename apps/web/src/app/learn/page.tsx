import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCounties } from "@/lib/data";
import { ElectricityBrief } from "./electricity/electricity-brief";
import "./electricity/brief.css";

export const metadata: Metadata = { title: "Learn" };

export default async function LearnPage() {
  const counties = await getCounties();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Community education"
        description="Understand the local questions around data centers."
      />
      <section aria-label="Explore the topics" className="space-y-4">
        <div className="space-y-3">
          <nav aria-label="Education topics" className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b">
            <button type="button" disabled className="cursor-not-allowed py-3 text-sm text-muted-foreground">What is a data center?</button>
            <a href="#electricity" aria-current="true" className="border-b-2 border-foreground py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">Electricity bills</a>
            {["Water", "Noise"].map(topic => (
              <button key={topic} type="button" disabled className="flex cursor-not-allowed items-center gap-2 py-3 text-sm text-muted-foreground">
                {topic}
              </button>
            ))}
          </nav>
        </div>
        <div id="electricity" className="scroll-mt-6">
          <ElectricityBrief />
        </div>
      </section>
      <section className="mt-8 space-y-3 border-t pt-6">
        <h2 className="text-lg font-semibold">By community</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {counties.map((c) => (
              <Card key={c.fips}>
                <CardHeader>
                  <CardTitle>
                    {c.name}, {c.state}
                  </CardTitle>
                  <CardDescription>Local explainers</CardDescription>
                </CardHeader>
              </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { getCounties } from "@/lib/data";
import { ElectricityBrief } from "./electricity/electricity-brief";
import "./electricity/brief.css";

export const metadata: Metadata = { title: "Learn" };

export default async function LearnPage() {
  const counties = await getCounties();

  return (
    <div className="space-y-6">
      <PageHeader title="Community education" />
      <details className="max-w-prose text-sm">
        <summary className="w-fit cursor-pointer font-medium">What is a data center?</summary>
        <p className="mt-2 leading-relaxed">A data center houses computers that store and process information. Those computers need electricity to run and cooling to carry away heat.</p>
      </details>
      <div id="electricity" className="scroll-mt-6">
        <ElectricityBrief />
      </div>
      <section className="border-t pt-5">
        <h2 className="mb-3 text-lg font-semibold">Explore a county</h2>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {counties.map((county) => (
            <li key={county.fips}>
              <Link href={`/explore/${county.fips}/community`} className="flex items-center justify-between border-b py-3 text-sm hover:underline">
                {county.name}, {county.state}<span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

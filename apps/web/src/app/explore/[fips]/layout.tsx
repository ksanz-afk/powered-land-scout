import Link from "next/link";
import { notFound } from "next/navigation";

import { TabNav } from "@/components/tab-nav";
import { getCounties, getCounty } from "@/lib/data";

export async function generateStaticParams() {
  const counties = await getCounties();
  return counties.map((c) => ({ fips: c.fips }));
}

export default async function ExploreLayout(props: LayoutProps<"/explore/[fips]">) {
  const { fips } = await props.params;
  const county = await getCounty(fips);
  if (!county) notFound();

  const tabs = [
    { href: `/explore/${fips}`, label: "Overview" },
    { href: `/explore/${fips}/energy`, label: "Energy" },
    { href: `/explore/${fips}/community`, label: "Community" },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">
          ← All counties
        </Link>
        <div>
          <h1 className="text-5xl font-semibold leading-tight">{county.name}</h1>
          <p className="mt-1 text-xl text-muted-foreground">{county.state}</p>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-foreground/80">{county.summary}</p>
        </div>
        <TabNav tabs={tabs} />
      </div>
      {props.children}
    </div>
  );
}

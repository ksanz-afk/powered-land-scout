import Link from "next/link";

import { SamplePill } from "@/components/sample-pill";
import type { CommunityIssue, Proposal } from "@/lib/types";

const clean = (text: string) => text.replace(/^Sample:\s*/, "");

export function ProjectCard({
  proposal,
  siteName,
  issues,
}: {
  proposal: Proposal;
  siteName?: string;
  issues: CommunityIssue[];
}) {
  return (
    <Link
      href={`/proposals/${proposal.id}`}
      className="group flex h-full flex-col rounded-[28px] bg-white p-7 shadow-[0_2px_20px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm text-muted-foreground">{siteName ?? "Project"}</p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[var(--viz-community-track)] px-2.5 py-0.5 text-xs font-semibold">
            Fit {proposal.community_fit}
          </span>
          <SamplePill show={proposal.is_sample} />
        </div>
      </div>
      <h3 className="mt-3 text-xl font-semibold leading-snug">{clean(proposal.title)}</h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground/75">{proposal.pitch}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {issues.map((i) => (
          <span key={i.id} className="rounded-full bg-[var(--viz-community-track)] px-3 py-1 text-sm">
            {clean(i.issue)}
          </span>
        ))}
      </div>
      <span className="mt-5 text-sm font-medium text-foreground/70 transition group-hover:text-foreground">
        View project →
      </span>
    </Link>
  );
}

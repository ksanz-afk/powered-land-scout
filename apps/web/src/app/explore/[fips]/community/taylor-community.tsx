import { BarList } from "@/components/bar-list";
import { ScoreTile } from "@/components/score-tile";
import { Panel } from "@/components/section";
import { titleCase } from "@/lib/format";
import type { CommunityIssue, CommunitySignal } from "@/lib/types";

const topicLabels: Record<string, string> = { water: "Water", jobs: "Jobs", housing: "Housing", infrastructure: "Roads" };

function CommentList({ comments }: { comments: CommunitySignal[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {comments.map((comment) => (
        <li key={comment.id} className="border-l-2 border-[var(--viz-community)] pl-4">
          <p className="mb-1.5 text-sm font-semibold">{topicLabels[comment.topic] ?? titleCase(comment.topic)}</p>
          <blockquote className="text-[15px]">&ldquo;{comment.excerpt}&rdquo;</blockquote>
          <p className="mt-2 text-xs text-muted-foreground">
            {comment.source.replace("r/Abilene · public commenter", "r/Abilene").replace("r/Abilene · self-described local data-center worker", "Self-described local worker")} · {comment.published_at && <time dateTime={comment.published_at}>{new Date(comment.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time>}
            {comment.source_url && <> · <a href={comment.source_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">Original comment</a></>}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function TaylorCommunity({ signals, issues, score }: {
  signals: CommunitySignal[];
  issues: CommunityIssue[];
  score: number | null;
}) {
  return (
    <>
      <Panel title="Water and jobs in Abilene">
        <p className="max-w-3xl leading-relaxed">
          Abilene resident Stefani Wagley told Texas lawmakers that drought was already a problem. She asked what jobs would remain once construction ended.{" "}
          <a className="text-sm underline underline-offset-4" href="https://capitol.texas.gov/tlodocs/89R/handouts/C4502026040910001/f9b7e4d8-0a5a-409d-a0f7-efd9ab44c138.PDF#page=124" target="_blank" rel="noreferrer">Texas House testimony · Apr 2026, p. 124 ↗</a>
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="border-l-2 border-[var(--viz-community)] pl-4">
            <h3 className="font-semibold">Water supply</h3>
            <p className="mt-1 leading-relaxed">Lake Fort Phantom Hill and Hubbard Creek Lake together held <strong>41% of their available capacity</strong>.</p>
            <a className="mt-2 inline-block text-sm text-muted-foreground underline underline-offset-4" href="https://abilenetx.gov/saveabilenewater" target="_blank" rel="noreferrer">City lake levels · Nov 23, 2026 ↗</a>
          </div>
          <div className="border-l-2 border-[var(--viz-community)] pl-4">
            <h3 className="font-semibold">Local training</h3>
            <p className="mt-1 leading-relaxed"><strong>Twelve people from the Abilene region</strong> completed a 15-week data-center operator course.</p>
            <a className="mt-2 inline-block text-sm text-muted-foreground underline underline-offset-4" href="https://www.tstc.edu/blog/2026/06/23/first-cohort-of-data-center-operators-graduate-from-tstc/" target="_blank" rel="noreferrer">Texas State Technical College · Jun 23, 2026 ↗</a>
          </div>
        </div>
      </Panel>
      <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
        <ScoreTile
          title={`${signals.length} selected comments from one Abilene Reddit thread`}
          score={score}
          tone="community"
          caption={`${signals.filter((s) => s.stance_on_dc === "support").length} in favor · ${signals.filter((s) => s.stance_on_dc === "oppose").length} opposed`}
        />
        <Panel title="What the commenters mentioned">
          <BarList items={issues.map((issue) => ({
            key: issue.id,
            label: topicLabels[issue.category] ?? issue.issue,
            value: issue.salience,
            note: `${issue.signal_count} of ${signals.length}`,
          }))} />
        </Panel>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-sm font-medium">Read the {signals.length} comments</summary>
        <p className="my-4 max-w-prose text-sm text-muted-foreground">We selected one comment per account about local impacts or project terms. A comment can cover several topics. We could not verify where commenters live.</p>
        <CommentList comments={signals} />
      </details>
    </>
  );
}

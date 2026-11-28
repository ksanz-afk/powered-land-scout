import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { communityScore, scoreLabel } from "../../apps/web/src/lib/scores.ts";

test("Kat's v0 formula: missing input, endpoints, neutral and rounding", () => {
  assert.equal(communityScore(undefined), null);
  assert.equal(communityScore({ support_share: 1, oppose_share: 0 }), 100);
  assert.equal(communityScore({ support_share: 0, oppose_share: 1 }), 0);
  assert.equal(communityScore({ support_share: 0, oppose_share: 0 }), 50);
  assert.equal(communityScore({ support_share: 2 / 3, oppose_share: 1 / 3 }), 67);
  assert.equal(scoreLabel(null), "Not yet scored");
  assert.equal(scoreLabel(44), "Challenging");
  assert.equal(scoreLabel(45), "Mixed");
  assert.equal(scoreLabel(60), "Promising");
  assert.equal(scoreLabel(75), "Strong");
});

test("reviewed Taylor aggregate produces the displayed 50/Mixed", () => {
  const rows = JSON.parse(readFileSync(new URL("../../apps/web/src/data/fixtures/county_sentiment.json", import.meta.url)));
  const sample = rows.find((r) => r.fips === "48441");
  assert.equal(sample.signal_count, 10);
  assert.equal(communityScore(sample), 50);
  assert.equal(scoreLabel(communityScore(sample)), "Mixed");
});

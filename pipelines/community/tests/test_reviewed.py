import copy
import json
from pathlib import Path
import unittest

from reviewed import build, replace_county, DEFAULT_CASE, FIXTURES, FILES


class ReviewedCaseTests(unittest.TestCase):
    def setUp(self):
        self.case = json.loads(DEFAULT_CASE.read_text())

    def test_counts_and_overlapping_topics(self):
        signals, sentiment, issues = build(self.case)
        self.assertEqual(len(signals), 10)
        self.assertEqual(sum(s["stance_on_dc"] == "support" for s in signals), 5)
        self.assertEqual(sum(s["stance_on_dc"] == "oppose" for s in signals), 5)
        self.assertEqual(sentiment[0]["support_share"], 0.5)
        self.assertEqual(sentiment[0]["oppose_share"], 0.5)
        self.assertTrue(all(not row["is_sample"] for row in signals + sentiment + issues))
        self.assertEqual(
            {i["category"]: (i["signal_count"], i["salience"]) for i in issues},
            {"water": (6, .6), "jobs": (6, .6), "housing": (3, .3), "infrastructure": (1, .1)},
        )

    def test_empty_missing_and_duplicate_evidence_rejected(self):
        mutations = [
            lambda c: c.update(records=[]),
            lambda c: c["records"][0].update(source_url=""),
            lambda c: c["records"][0].update(excerpt=" "),
            lambda c: c["records"][0].update(published_at=""),
            lambda c: c["records"].append(copy.deepcopy(c["records"][0])),
            lambda c: c["records"][0].update(stance_on_dc="unknown"),
        ]
        for change in mutations:
            with self.subTest(change=change):
                case = copy.deepcopy(self.case)
                change(case)
                with self.assertRaises((ValueError, KeyError)):
                    build(case)

    def test_neutral_is_not_support_and_topics_count_once(self):
        self.case["records"][0]["stance_on_dc"] = "neutral"
        self.case["records"][0]["topics"].append("water")
        _, sentiment, issues = build(self.case)
        self.assertEqual(sentiment[0]["support_share"], .4)
        self.assertEqual(sentiment[0]["oppose_share"], .5)
        self.assertEqual(issues[0]["signal_count"], 6)

    def test_other_counties_preserved(self):
        before = [{"fips": "51107", "keep": 1}, {"fips": "48441"}, {"fips": "53025", "keep": 2}]
        original = copy.deepcopy(before)
        result = replace_county(before, [{"fips": "48441", "new": True}], "48441")
        self.assertEqual([r for r in result if r["fips"] != "48441"], [before[0], before[2]])
        self.assertEqual(before, original)

    def test_committed_rows_and_proposal_joins(self):
        generated = build(self.case)
        for name, expected in zip(FILES, generated):
            actual = json.loads((FIXTURES / name).read_text())
            self.assertEqual([r for r in actual if r["fips"] == "48441"], expected)
        proposals = json.loads((FIXTURES / "proposals.json").read_text())
        proposal = next(p for p in proposals if p["id"] == "prop-48441-a")
        self.assertTrue(set(proposal["issue_ids"]) <= {i["id"] for i in generated[2]})


if __name__ == "__main__":
    unittest.main()

import unittest

from proposer import community_fit, load_playbook, pick_issues, propose

COUNTY = {"fips": "00001", "name": "Test County", "state": "TX"}
ISSUES = [
    {"id": "i1", "fips": "00001", "issue": "Water supply", "category": "water", "salience": 0.9, "is_sample": False},
    {"id": "i2", "fips": "00001", "issue": "Roads", "category": "infrastructure", "salience": 0.6, "is_sample": False},
    {"id": "i3", "fips": "00001", "issue": "Schools", "category": "education", "salience": 0.3, "is_sample": False},
]


def site(id_, score, water="low"):
    return {"id": id_, "fips": "00001", "name": f"Parcel {id_}", "score": score, "substation_kv": 345,
            "nearest_substation_km": 2.0, "acres": 300, "water_risk": water, "is_sample": False}


class ProposerTests(unittest.TestCase):
    def setUp(self):
        self.playbook = load_playbook()

    def test_top_parcels_only_and_above_threshold(self):
        sites = [site("site-a", 90), site("site-b", 70), site("site-c", 65), site("site-d", 40)]
        out = propose([COUNTY], sites, ISSUES, [], self.playbook)
        self.assertEqual([p["site_id"] for p in out], ["site-a", "site-b"])

    def test_parcels_get_different_issue_pairs(self):
        out = propose([COUNTY], [site("site-a", 90), site("site-b", 80)], ISSUES, [], self.playbook)
        self.assertEqual(out[0]["issue_ids"], ["i1", "i2"])
        self.assertEqual(out[1]["issue_ids"], ["i2", "i3"])

    def test_title_combines_primary_and_secondary(self):
        out = propose([COUNTY], [site("site-a", 90)], ISSUES, [], self.playbook)
        self.assertEqual(out[0]["title"], "Water-positive campus with a county road fund")

    def test_high_water_risk_adds_cooling_commitment_and_reason(self):
        out = propose([COUNTY], [site("site-a", 90, water="high")], ISSUES[1:], [], self.playbook)  # no water issue
        rule = self.playbook["site_rules"]["high_water_risk_commitment"]
        self.assertIn(rule, out[0]["commitments"])
        self.assertTrue(any("water-stress" in r for r in out[0]["rationale"]))

    def test_concern_adds_commitment(self):
        sentiment = [{"fips": "00001", "top_concerns": ["noise"]}]
        out = propose([COUNTY], [site("site-a", 90)], ISSUES, sentiment, self.playbook)
        self.assertIn(self.playbook["concerns"]["noise"][0], out[0]["commitments"])

    def test_community_fit_is_share_of_top_issue_salience(self):
        self.assertEqual(community_fit(ISSUES[:2], ISSUES), round(100 * 1.5 / 1.8))
        self.assertEqual(pick_issues(ISSUES, 0), ISSUES[:2])


if __name__ == "__main__":
    unittest.main()

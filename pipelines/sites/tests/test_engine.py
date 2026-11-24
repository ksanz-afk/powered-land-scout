import copy
import unittest

from scoring.engine import exclusion_reasons, interpolate, load_config, run, score_candidate

BASE = {
    "id": "t1", "fips": "48441", "name": "Test", "lat": 32.4, "lng": -99.7,
    "acres": 250, "nearest_substation_km": 1, "substation_kv": 345, "county_queue_gw": 0,
    "land_cover": "developed", "fiber_km": 1, "water_stress": 0, "flood_zone": "minimal",
    "zoning_status": "industrial", "protected_land": False,
}


class EngineTests(unittest.TestCase):
    def setUp(self):
        self.config = load_config()

    def test_weights_sum_to_one(self):
        total = sum(f["weight"] for f in self.config["factors"].values())
        self.assertAlmostEqual(total, 1.0)

    def test_interpolate_clamps_and_interpolates(self):
        pts = [[0, 1.0], [10, 0.0]]
        self.assertEqual(interpolate(pts, -5), 1.0)
        self.assertEqual(interpolate(pts, 20), 0.0)
        self.assertAlmostEqual(interpolate(pts, 5), 0.5)

    def test_ideal_site_scores_100_with_full_confidence(self):
        score, _, confidence = score_candidate(BASE, self.config)
        self.assertEqual(score, 100)
        self.assertEqual(confidence, 1.0)

    def test_missing_data_lowers_confidence_not_eligibility(self):
        c = copy.deepcopy(BASE)
        c["fiber_km"] = None
        score, breakdown, confidence = score_candidate(c, self.config)
        self.assertLess(confidence, 1.0)
        self.assertFalse(breakdown["fiber"]["known"])
        self.assertLess(score, 100)

    def test_filters_exclude_small_floodplain_sites(self):
        c = copy.deepcopy(BASE)
        c.update(acres=10, flood_zone="high")
        reasons = exclusion_reasons(c, self.config["filters"])
        self.assertEqual(len(reasons), 2)
        sites, excluded = run([c], self.config)
        self.assertEqual(sites, [])
        self.assertEqual(excluded[0]["id"], "t1")

    def test_breakdown_points_sum_to_score(self):
        c = copy.deepcopy(BASE)
        c.update(nearest_substation_km=6, water_stress=3.2, acres=120)
        score, breakdown, _ = score_candidate(c, self.config)
        self.assertAlmostEqual(sum(f["points"] for f in breakdown.values()), score, delta=1)


if __name__ == "__main__":
    unittest.main()

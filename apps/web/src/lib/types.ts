// Mirrors db/migrations. Keep in sync via the schema-change skill.
// Geography columns are flattened to lat/lng for the app.

export type Fips = string;

export type County = {
  fips: Fips;
  name: string;
  state: string;
  population: number | null;
  lat: number;
  lng: number;
  summary: string;
};

export type WaterRisk = "low" | "medium" | "high";

export type ScoreFactor = {
  label: string;
  value: string | number | boolean | null;
  normalized: number;
  weight: number;
  points: number;
  known: boolean;
};

export type Site = {
  id: string;
  fips: Fips;
  name: string;
  lat: number;
  lng: number;
  acres: number | null;
  nearest_substation_km: number | null;
  substation_kv: number | null;
  est_available_mw: number;
  fiber_km: number | null;
  water_risk: WaterRisk;
  zoning: string;
  score: number;
  score_breakdown: Record<string, ScoreFactor>;
  confidence: number;
  notes: string;
  is_sample: boolean;
};

export type Stance = "support" | "oppose" | "neutral" | "unrelated";

export type CommunitySignal = {
  id: string;
  fips: Fips;
  source: string;
  source_url: string | null;
  published_at: string | null;
  stance_on_dc: Stance;
  topic: string;
  excerpt: string;
  is_sample: boolean;
};

export type CountySentiment = {
  fips: Fips;
  support_share: number;
  oppose_share: number;
  signal_count: number;
  top_concerns: string[];
  is_sample: boolean;
};

export type IssueCategory =
  | "infrastructure"
  | "education"
  | "water"
  | "energy_costs"
  | "jobs"
  | "health"
  | "environment"
  | "housing"
  | "public_safety"
  | "other";

export type CommunityIssue = {
  id: string;
  fips: Fips;
  issue: string;
  category: IssueCategory;
  salience: number;
  summary: string;
  signal_count: number;
  is_sample: boolean;
};

export type ProposalStatus = "draft" | "ready" | "archived";

export type Proposal = {
  id: string;
  site_id: string;
  issue_ids: string[];
  title: string;
  pitch: string;
  commitments: string[];
  rationale: string[];
  community_fit: number;
  status: ProposalStatus;
  is_sample: boolean;
};

export type EducationContent = {
  id: string;
  fips: Fips | null;
  topic: string;
  title: string;
  body: string;
  is_sample: boolean;
};

-- Adds explainability to site scores (schema-change skill; both owners approve).
-- score_breakdown: per-factor { label, value, normalized, weight, points, known }
-- confidence: share of factor weight backed by real data (0-1)

alter table sites
  add column score_breakdown jsonb not null default '{}',
  add column confidence numeric check (confidence between 0 and 1);

-- Explainable proposals (schema-change skill; both owners approve).
-- rationale: plain-language reasons this site and these commitments fit the county
-- community_fit: share of the county's top resident issues the project addresses (0-100)

alter table proposals
  add column rationale text[] not null default '{}',
  add column community_fit integer check (community_fit between 0 and 100);

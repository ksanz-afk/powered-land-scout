-- Powered Land Scout: initial schema (the data contract).
-- Every module joins on counties.fips. Changing this file needs both owners'
-- approval (see .github/CODEOWNERS) and must follow the schema-change skill.

create extension if not exists postgis;

-- Shared
create table counties (
  fips        text primary key,          -- 5-digit county FIPS, e.g. '51107'
  name        text not null,
  state       text not null,             -- 2-letter code
  population  integer,
  centroid    geography(point, 4326),
  summary     text
);

-- Kat: site identifier
create table sites (
  id                      text primary key,
  fips                    text not null references counties(fips),
  name                    text not null,
  location                geography(point, 4326) not null,
  acres                   numeric,
  nearest_substation_km   numeric,
  substation_kv           integer,
  est_available_mw        numeric,
  fiber_km                numeric,
  water_risk              text check (water_risk in ('low','medium','high')),
  zoning                  text,
  score                   integer check (score between 0 and 100),
  notes                   text,
  is_sample               boolean not null default false,
  updated_at              timestamptz not null default now()
);

-- Dhruv: community scrubber
create table community_signals (
  id            text primary key,
  fips          text not null references counties(fips),
  source        text not null,           -- e.g. 'reddit', 'gdelt', 'meeting_minutes'
  source_url    text,
  published_at  date,
  stance_on_dc  text check (stance_on_dc in ('support','oppose','neutral','unrelated')),
  topic         text,                    -- issue category, see community_issues.category
  excerpt       text,                    -- short excerpt only; no personal data
  is_sample     boolean not null default false
);

create table county_sentiment (
  fips            text primary key references counties(fips),
  support_share   numeric check (support_share between 0 and 1),
  oppose_share    numeric check (oppose_share between 0 and 1),
  signal_count    integer not null default 0,
  top_concerns    text[] not null default '{}',
  is_sample       boolean not null default false,
  updated_at      timestamptz not null default now()
);

create table community_issues (
  id            text primary key,
  fips          text not null references counties(fips),
  issue         text not null,           -- e.g. 'Road repair backlog'
  category      text not null check (category in
                  ('infrastructure','education','water','energy_costs','jobs',
                   'health','environment','housing','public_safety','other')),
  salience      numeric check (salience between 0 and 1),
  summary       text,
  signal_count  integer not null default 0,
  is_sample     boolean not null default false
);

-- Kat: project proposer
create table proposals (
  id            text primary key,
  site_id       text not null references sites(id),
  issue_ids     text[] not null default '{}',   -- community_issues.id
  title         text not null,
  pitch         text not null,
  commitments   text[] not null default '{}',
  status        text not null default 'draft' check (status in ('draft','ready','archived')),
  is_sample     boolean not null default false,
  updated_at    timestamptz not null default now()
);

-- Dhruv: education hub
create table education_content (
  id          text primary key,
  fips        text references counties(fips),   -- null = applies everywhere
  topic       text not null,                    -- matches community_issues.category or 'data_centers'
  title       text not null,
  body        text not null,                    -- markdown
  is_sample   boolean not null default false
);

create index on sites (fips);
create index on community_signals (fips);
create index on community_issues (fips);
create index on proposals (site_id);

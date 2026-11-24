// Data access layer. Every page reads through these functions, never from
// fixtures directly, so swapping fixtures for Postgres touches only this file.
// Today: JSON fixtures in src/data/fixtures. Later: query DATABASE_URL.

import { cacheLife } from "next/cache";

import countiesJson from "@/data/fixtures/counties.json";
import sitesJson from "@/data/fixtures/sites.json";
import signalsJson from "@/data/fixtures/community_signals.json";
import sentimentJson from "@/data/fixtures/county_sentiment.json";
import issuesJson from "@/data/fixtures/community_issues.json";
import proposalsJson from "@/data/fixtures/proposals.json";
import educationJson from "@/data/fixtures/education_content.json";

import type {
  County,
  CommunityIssue,
  CommunitySignal,
  CountySentiment,
  EducationContent,
  Proposal,
  Site,
} from "@/lib/types";

const counties = countiesJson as County[];
const sites = sitesJson as Site[];
const signals = signalsJson as CommunitySignal[];
const sentiment = sentimentJson as CountySentiment[];
const issues = issuesJson as CommunityIssue[];
const proposals = proposalsJson as Proposal[];
const education = educationJson as EducationContent[];

// Counties (shared)
export async function getCounties(): Promise<County[]> {
  "use cache";
  cacheLife("hours");
  return counties;
}

export async function getCounty(fips: string): Promise<County | undefined> {
  "use cache";
  cacheLife("hours");
  return counties.find((c) => c.fips === fips);
}

// Sites (Kat)
export async function getSites(): Promise<Site[]> {
  "use cache";
  cacheLife("hours");
  return [...sites].sort((a, b) => b.score - a.score);
}

export async function getSite(id: string): Promise<Site | undefined> {
  "use cache";
  cacheLife("hours");
  return sites.find((s) => s.id === id);
}

export async function getSitesByCounty(fips: string): Promise<Site[]> {
  "use cache";
  cacheLife("hours");
  return sites.filter((s) => s.fips === fips).sort((a, b) => b.score - a.score);
}

// Community (Dhruv)
export async function getSentiment(fips: string): Promise<CountySentiment | undefined> {
  "use cache";
  cacheLife("hours");
  return sentiment.find((s) => s.fips === fips);
}

export async function getAllSentiment(): Promise<CountySentiment[]> {
  "use cache";
  cacheLife("hours");
  return sentiment;
}

export async function getIssuesByCounty(fips: string): Promise<CommunityIssue[]> {
  "use cache";
  cacheLife("hours");
  return issues.filter((i) => i.fips === fips).sort((a, b) => b.salience - a.salience);
}

export async function getIssues(ids: string[]): Promise<CommunityIssue[]> {
  "use cache";
  cacheLife("hours");
  return issues.filter((i) => ids.includes(i.id));
}

export async function getSignalsByCounty(fips: string): Promise<CommunitySignal[]> {
  "use cache";
  cacheLife("hours");
  return signals.filter((s) => s.fips === fips);
}

// Proposals (Kat)
export async function getProposals(): Promise<Proposal[]> {
  "use cache";
  cacheLife("hours");
  return proposals;
}

export async function getProposal(id: string): Promise<Proposal | undefined> {
  "use cache";
  cacheLife("hours");
  return proposals.find((p) => p.id === id);
}

export async function getProposalsBySite(siteId: string): Promise<Proposal[]> {
  "use cache";
  cacheLife("hours");
  return proposals.filter((p) => p.site_id === siteId);
}

export async function getProposalsByCounty(fips: string): Promise<Proposal[]> {
  "use cache";
  cacheLife("hours");
  const siteIds = new Set(sites.filter((s) => s.fips === fips).map((s) => s.id));
  return proposals.filter((p) => siteIds.has(p.site_id));
}

// Education (Dhruv)
export async function getEducation(fips: string | null): Promise<EducationContent[]> {
  "use cache";
  cacheLife("hours");
  return education.filter((e) => e.fips === null || e.fips === fips);
}

export async function getGeneralEducation(): Promise<EducationContent[]> {
  "use cache";
  cacheLife("hours");
  return education.filter((e) => e.fips === null);
}

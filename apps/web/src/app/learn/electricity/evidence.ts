// Curated evidence preserved from the reviewed resident briefing.
export interface EvidenceSource {
  id: string;
  category: string;
  publisher: string;
  date: string;
  scope: string;
  question: string;
  preview: string;
  previewLabel: string;
  previewAlt: string;
  findingHighlights: string[];
  highlight: string;
  title: string;
  url: string;
  finding: string;
  excerpt: string;
  location: string;
  limitation: string;
  provenance: string;
  sourceFile: string;
  excerptPage: number;
  authors?: string;
  status?: string;
  passageNote?: string;
}

export const evidence: EvidenceSource[] = [
  {
    "id": "government",
    "category": "Government review",
    "publisher": "Virginia JLARC",
    "date": "December 9, 2024",
    "scope": "Virginia",
    "question": "Could growth raise household costs?",
    "preview": "/community-education/assets/evidence/government.jpg",
    "previewLabel": "Original report cover",
    "previewAlt": "Cover of Virginia JLARC’s Data Centers in Virginia report",
    "findingHighlights": [
      "covered their existing service costs",
      "growth could raise costs for other customers"
    ],
    "highlight": "will likely increase system costs for all customers, including non-data center customers",
    "title": "Data Centers in Virginia",
    "url": "https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp",
    "finding": "The review found that data centers covered their existing service costs, while warning that growth could raise costs for other customers.",
    "excerpt": "However, data centers’ increased energy demand will likely increase system costs for all customers, including non-data center customers, for several reasons.",
    "location": "Summary, printed page v (PDF page 9). Continued discussion on page vi; Chapter 4 examines energy costs.",
    "limitation": "This is a 2024 statewide review. Existing cost allocation and the cost of future growth are different questions. Its scenarios do not predict the bill impact of a particular project.",
    "provenance": "Passage checked against the supplied 156-page report.",
    "sourceFile": "Rpt598.pdf",
    "excerptPage": 9
  },
  {
    "id": "research",
    "category": "Scientific paper",
    "publisher": "Nature Energy",
    "date": "November 9, 2026",
    "scope": "US research",
    "question": "How can costs reach households?",
    "preview": "/community-education/assets/evidence/research.jpg",
    "previewLabel": "Original paper · title page",
    "previewAlt": "First page of the Nature Energy paper by Cheng Feng and Fengqi You",
    "findingHighlights": [
      "higher wholesale electricity prices",
      "allocation of grid infrastructure costs"
    ],
    "highlight": "a critical component of end-user electricity rates",
    "title": "Data centres asymmetrically exacerbate energy burdens through wholesale price increases and regressive grid cost shifting",
    "authors": "Cheng Feng and Fengqi You",
    "url": "https://doi.org/10.1038/s41560-026-02163-x",
    "finding": "The authors examine two routes: higher wholesale electricity prices and the allocation of grid infrastructure costs to customers.",
    "excerpt": "Wholesale electricity prices are a key indicator of regional supply–demand tightness and a critical component of end-user electricity rates.",
    "location": "PDF page 2, “Data centres raise wholesale prices”. Cost-allocation methods appear on PDF page 11.",
    "limitation": "The study combines price analysis with modeled electricity use and cost allocation. Some missing facility data are estimated. Wholesale-price changes are not the same as changes in a household’s bill. Supplementary methods were not supplied.",
    "provenance": "Publication date is visible in the rendered PDF; its extracted text layer contains a date placeholder. Main-text methods on PDF pages 10–11 were reviewed.",
    "sourceFile": "s41560-026-02163-x.pdf",
    "excerptPage": 2
  },
  {
    "id": "regulator",
    "category": "Regulatory decision",
    "publisher": "Virginia SCC",
    "date": "November 25, 2025",
    "scope": "Dominion Energy Virginia",
    "status": "Official decision announcement",
    "question": "What protections did Virginia approve?",
    "preview": "/community-education/assets/evidence/regulator.jpg",
    "previewLabel": "Official announcement · page 1 crop",
    "previewAlt": "Original Virginia SCC announcement of its large-user rate decision",
    "findingHighlights": [
      "minimum payments for certain large electricity users",
      "January 1, 2027"
    ],
    "highlight": "certain large-scale customers will be required to pay a minimum",
    "passageNote": "These percentages refer to contracted demand, not a share of total project costs.",
    "title": "In Biennial Review Ruling, SCC Creates New Class for Large-Scale Energy Users",
    "url": "https://www.scc.virginia.gov/about-the-scc/newsreleases/release/scc-issues-order-on-dev-biennial-review-2025/scc-rules-in-dev-biennial-review-case.html",
    "finding": "The SCC approved minimum payments for certain large electricity users, based on contracted power capacity even if they use less. Dominion’s new rate class starts January 1, 2027; project eligibility still needs checking.",
    "excerpt": "certain large-scale customers will be required to pay a minimum of 85% of contracted distribution and transmission demand, and 60% of generation demand, among other requirements.",
    "location": "Saved webpage, PDF page 1, opening three paragraphs. Case PUR-2025-00058.",
    "limitation": "These percentages refer to contracted demand, not a share of total project costs. This is an announcement, not the full order or tariff. The announced start date is after this demo’s review date. Project eligibility needs checking; unchanged household bills are not guaranteed.",
    "provenance": "Passage checked against the saved official announcement. The full order and tariff were not supplied.",
    "sourceFile": "Virginia SCC - SCC Issues Order on DEV Biennial Review 2025.pdf",
    "excerptPage": 1
  },
  {
    "id": "company",
    "category": "Developer statement",
    "publisher": "Microsoft",
    "date": "January 13, 2026",
    "scope": "US company policy",
    "status": "Company commitment",
    "question": "What does Microsoft promise?",
    "preview": "/community-education/assets/evidence/company.jpg",
    "previewLabel": "Company announcement · page 1 crop",
    "previewAlt": "Title and photograph from Microsoft’s Community-First AI Infrastructure announcement",
    "findingHighlights": [
      "says it will seek",
      "cover the power and infrastructure costs",
      "not a guarantee about your bill"
    ],
    "highlight": "not passed on to residential customers",
    "title": "Building Community-First AI Infrastructure",
    "authors": "Brad Smith, Vice Chair and President",
    "url": "https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/",
    "finding": "Microsoft says it will seek electricity rates that cover the power and infrastructure costs of its data centers. This is a company commitment, not a guarantee about your bill.",
    "excerpt": "Our goal is straightforward: to ensure that the electricity cost of serving our datacenters is not passed on to residential customers.",
    "location": "Saved webpage, PDF page 2. Electricity section, paragraph beginning “First, we’ll ask utilities and public commissions”.",
    "limitation": "This is Microsoft’s stated US policy, not an executed agreement for a selected Virginia site or independent evidence of unchanged bills.",
    "provenance": "Hero quotation: PDF page 1, first of five commitments. The detailed electricity passage is on PDF page 2.",
    "sourceFile": "Building Community-First AI Infrastructure - Microsoft On the Issues.pdf",
    "excerptPage": 2
  }
];

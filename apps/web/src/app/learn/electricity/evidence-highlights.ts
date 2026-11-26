// Presentation summaries checked against the supplied PDFs on November 23, 2026.
// These are historical scenarios and company-reported contracts, not live bill estimates.
export interface EvidenceHighlight {
  label: string;
  scope: string;
  value: string;
  description: string;
  bullets: { label: string; text: string }[];
  location: string;
  passages: { text: string; location: string }[];
  limitations: string[];
}

export const evidenceHighlights: Partial<Record<string, EvidenceHighlight>> = {
  government: {
    label: "2024 modeled estimate",
    scope: "Dominion Virginia",
    value: "$14–$37/month",
    description: "Additional generation and transmission charges by 2040",
    bullets: [
      { label: "By 2030", text: "$6–$23 more per month in the same scenarios." },
      { label: "Household example", text: "1,000 kWh/month, with costs expressed in 2024 dollars." },
    ],
    location: "Table 4-2, printed page 48 (PDF page 66); explanation on printed page 47 (PDF page 65).",
    passages: [{
      text: "A typical residential customer of Dominion Energy could experience generation- and transmission-related costs increasing by an estimated $14 to $37 monthly in constant (or real) dollars by 2040 (independent of inflation).",
      location: "Summary, printed page v (PDF page 9). Table 4-2 provides the scenario results.",
    }],
    limitations: [
      "JLARC’s 2024 analysis assumes typical residential use of 1,000 kWh per month. The values represent increases attributed to growing data-center demand, not the total electricity bill.",
      "The range spans unconstrained demand and half-unconstrained demand scenarios, with and without Virginia Clean Economy Act (VCEA) compliance. The report describes meeting these demand scenarios as difficult or very difficult.",
      "Figures are in constant 2024 dollars. Distribution charges, some transmission costs and generation projects not attributable to data-center demand are excluded.",
      "These historical modeled scenarios are not an updated forecast incorporating later rate decisions, a measured increase, or a prediction for a selected project or household.",
    ],
  },
  company: {
    label: "Microsoft-reported contracts",
    scope: "MISO · Midwest US",
    value: "7.9 GW",
    description: "New electricity generation contracted in MISO",
    bullets: [
      { label: "Scale", text: "Microsoft describes this as more than twice its current consumption." },
      { label: "Grid upgrades", text: "Microsoft commits to paying for required transmission and substation improvements." },
    ],
    location: "PDF page 2, electricity section, second step: utility collaboration and the MISO example.",
    passages: [
      {
        text: "For example, in the wholesale energy market that covers much of the Midwest called the Midcontinent Independent System Operator (MISO), we have contracted to add 7.9 GW of new electricity generation to the grid, which is more than double our current consumption.",
        location: "PDF page 2, electricity section, second step, paragraph beginning ‘This work will build on a spirit of partnership’.",
      },
      {
        text: "When our datacenter expansion requires improvements in transmission and substation capabilities, we will continue our existing practices by paying for these improvements.",
        location: "PDF page 2, electricity section, second step, paragraph beginning ‘We’re committed to collaborating with local utilities’.",
      },
    ],
    limitations: [
      "The 7.9 GW figure is reported by Microsoft in its January 13, 2026 statement. It describes contracted generation in MISO, not a Virginia-specific investment or independently verified operating generation.",
      "GW measures power capacity, not electricity generated over a year. The statement does not establish commissioning dates, delivered energy, or an individual household’s bill savings.",
      "Microsoft’s commitment to pay for required transmission and substation improvements is a company statement, not an executed agreement for a selected site.",
    ],
  },
};

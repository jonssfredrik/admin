export interface StagingFlow {
  siteId: string;
  source: string;
  target: string;
  lastClone: string;
  lastPromote: string;
  diffSummary: string[];
}

export const stagingFlows: StagingFlow[] = [
  {
    siteId: "site-4",
    source: "production",
    target: "staging",
    lastClone: "2026-04-19 09:10",
    lastPromote: "2026-04-15 16:42",
    diffSummary: ["12 filer skiljer sig", "3 databas-tabeller har nytt innehåll", "PHP-version staging=8.2 prod=8.2"],
  },
  {
    siteId: "site-1",
    source: "production",
    target: "staging",
    lastClone: "2026-04-18 22:00",
    lastPromote: "2026-04-12 13:05",
    diffSummary: ["Nytt plugin-konfigcache", "4 uppladdade mediafiler", "2 nya redirect-regler"],
  },
];

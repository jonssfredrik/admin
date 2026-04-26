import type { RawFeedSource, RawReport } from "@/modules/snaptld/types";

export const internetstiftelsenFeeds = [
  {
    id: "iis-se",
    label: "Internetstiftelsen .se",
    name: "Internetstiftelsen (.se)",
    url: "https://data.internetstiftelsen.se/bardate_domains.json",
    tld: ".se",
  },
  {
    id: "iis-nu",
    label: "Internetstiftelsen .nu",
    name: "Internetstiftelsen (.nu)",
    url: "https://data.internetstiftelsen.se/bardate_domains_nu.json",
    tld: ".nu",
  },
] as const;

export const feedSources: RawFeedSource[] = [
  {
    id: internetstiftelsenFeeds[0].id,
    name: internetstiftelsenFeeds[0].name,
    url: internetstiftelsenFeeds[0].url,
    type: "json",
    tld: internetstiftelsenFeeds[0].tld,
    status: "active",
    lastFetched: "2026-04-19 08:14",
    domainsLastRun: 1248,
    cadence: "Dagligen 08:00",
  },
  {
    id: internetstiftelsenFeeds[1].id,
    name: internetstiftelsenFeeds[1].name,
    url: internetstiftelsenFeeds[1].url,
    type: "json",
    tld: internetstiftelsenFeeds[1].tld,
    status: "active",
    lastFetched: "2026-04-19 08:14",
    domainsLastRun: 186,
    cadence: "Dagligen 08:00",
  },
];

export const reports: RawReport[] = [
  {
    id: "r-2026-04-19",
    title: "Dagsrapport 19 april",
    generatedAt: "2026-04-19 09:10",
    domains: 1442,
    highlight: "4 utmärkta kandidater",
    format: "pdf",
  },
  {
    id: "r-2026-04-18",
    title: "Dagsrapport 18 april",
    generatedAt: "2026-04-18 09:04",
    domains: 1211,
    highlight: "2 utmärkta kandidater",
    format: "pdf",
  },
  {
    id: "r-week-16",
    title: "Veckorapport v.16",
    generatedAt: "2026-04-14 18:00",
    domains: 8742,
    highlight: "Topp 20 genomgång",
    format: "csv",
  },
  {
    id: "r-nisch-tech",
    title: "Nischrapport: tech/SaaS",
    generatedAt: "2026-04-12 14:30",
    domains: 412,
    highlight: "18 uppföljning",
    format: "json",
  },
];

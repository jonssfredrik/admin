import type { RawFeedSource } from "@/modules/snaptld/types";

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
    lastFetched: "",
    domainsLastRun: 0,
    cadence: "Dagligen 08:00",
  },
  {
    id: internetstiftelsenFeeds[1].id,
    name: internetstiftelsenFeeds[1].name,
    url: internetstiftelsenFeeds[1].url,
    type: "json",
    tld: internetstiftelsenFeeds[1].tld,
    status: "active",
    lastFetched: "",
    domainsLastRun: 0,
    cadence: "Dagligen 08:00",
  },
];

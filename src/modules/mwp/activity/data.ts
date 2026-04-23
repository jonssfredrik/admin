export type EventLevel = "info" | "success" | "warning" | "error";
export type EventCategory = "security" | "update" | "ssl" | "performance" | "deploy" | "user";

export interface ActivityEvent {
  id: string;
  time: string;
  level: EventLevel;
  category: EventCategory;
  siteId: string;
  siteName: string;
  siteDomain: string;
  title: string;
  description?: string;
  actor?: string;
}

export const events: ActivityEvent[] = [
  { id: "e-1", time: "14:32:08", level: "error", category: "performance", siteId: "site-5", siteName: "Arctic Outdoor Co.", siteDomain: "arcticoutdoor.com", title: "Sajt svarar inte", description: "HTTP 502 från origin i 4 minuter", actor: "system" },
  { id: "e-2", time: "14:28:41", level: "warning", category: "ssl", siteId: "site-2", siteName: "Lagom Interiör", siteDomain: "lagominterior.se", title: "SSL går ut om 12 dagar", description: "Automatisk förnyelse schemalagd till 2026-04-26", actor: "system" },
  { id: "e-3", time: "13:47:19", level: "warning", category: "security", siteId: "site-2", siteName: "Lagom Interiör", siteDomain: "lagominterior.se", title: "3 misslyckade inloggningsförsök", description: "Från 185.22.14.91 · rate limited", actor: "WAF" },
  { id: "e-4", time: "13:12:03", level: "info", category: "performance", siteId: "site-1", siteName: "Nordisk Kaffebryggeri", siteDomain: "nordiskkaffe.se", title: "Cache rensad", actor: "Fredrik Jonsson" },
  { id: "e-5", time: "12:41:55", level: "error", category: "performance", siteId: "site-2", siteName: "Lagom Interiör", siteDomain: "lagominterior.se", title: "Långsam databasfråga", description: "SELECT * FROM wp_postmeta WHERE meta_key LIKE '%cache%' (3.4s)", actor: "system" },
  { id: "e-6", time: "12:00:00", level: "success", category: "update", siteId: "site-3", siteName: "Svensk Cykelklubb", siteDomain: "svenskcykel.se", title: "WordPress uppdaterad", description: "6.5.2 -> 6.5.3", actor: "Fredrik Jonsson" },
  { id: "e-7", time: "11:34:08", level: "info", category: "user", siteId: "site-1", siteName: "Nordisk Kaffebryggeri", siteDomain: "nordiskkaffe.se", title: "Ny WP-användare skapad", description: "editor · erik@nordiskkaffe.se", actor: "Astrid Lindgren" },
  { id: "e-8", time: "10:58:22", level: "success", category: "deploy", siteId: "site-4", siteName: "Fjällkliniken", siteDomain: "fjallkliniken.se", title: "Staging-miljö skapad", description: "Klonad från production · 2.8 GB", actor: "Olof Palme" },
  { id: "e-9", time: "10:22:41", level: "success", category: "update", siteId: "site-1", siteName: "Nordisk Kaffebryggeri", siteDomain: "nordiskkaffe.se", title: "Plugin uppdaterat", description: "Elementor 3.20.4 -> 3.21.0", actor: "system" },
  { id: "e-10", time: "09:47:08", level: "info", category: "user", siteId: "site-3", siteName: "Svensk Cykelklubb", siteDomain: "svenskcykel.se", title: "Inloggning", description: "Från Stockholm, Sverige (Chrome)", actor: "Greta Thunberg" },
  { id: "e-11", time: "09:15:33", level: "warning", category: "security", siteId: "site-5", siteName: "Arctic Outdoor Co.", siteDomain: "arcticoutdoor.com", title: "Brute-force blockerad", description: "47 försök från 203.0.113.42 · IP blockerad 24h", actor: "WAF" },
  { id: "e-12", time: "07:42:18", level: "info", category: "deploy", siteId: "site-5", siteName: "Arctic Outdoor Co.", siteDomain: "arcticoutdoor.com", title: "PHP-version ändrad", description: "8.2 -> 8.3", actor: "Selma Lagerlöf" },
];

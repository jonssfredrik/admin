import type { AnalysisCategory, CategoryResult, DomainAnalysis, Signal, Tone, Verdict } from "@/modules/snaptld/types";
export type { AnalysisCategory, CategoryResult, DomainAnalysis, Signal, Tone, Verdict } from "@/modules/snaptld/types";

export const categoryMeta: Record<AnalysisCategory, { label: string; description: string }> = {
  structure: {
    label: "Struktur",
    description: "Längd, tecken, stavning och läsbarhet",
  },
  lexical: {
    label: "Lexikal",
    description: "Svenska ord, vokaler, böjelser, begriplighet",
  },
  brand: {
    label: "Varumärke",
    description: "Minnesvärdhet, byggbar brand, SaaS-känsla",
  },
  market: {
    label: "Marknad",
    description: "Målgrupp, bransch, kommersiell intent",
  },
  risk: {
    label: "Risk",
    description: "Varumärkeskrockar, juridik, associationer",
  },
  salability: {
    label: "Säljbarhet",
    description: "Flip-barhet, realistiska köpare, prisnivå",
  },
  seo: {
    label: "SEO",
    description: "Domain Authority, backlinks, spam-signaler",
  },
  history: {
    label: "Historik",
    description: "Wayback Machine, tidigare innehåll, flaggor",
  },
};

export const verdictMeta: Record<Verdict, { label: string; tone: Tone; description: string }> = {
  excellent: { label: "Utmärkt", tone: "success", description: "Topp-kandidat, återregistrera direkt" },
  good: { label: "Bra", tone: "success", description: "Starkt val med tydlig potential" },
  mediocre: { label: "Medel", tone: "warning", description: "Fungerar för specifik nisch" },
  skip: { label: "Hoppa över", tone: "danger", description: "Svag kandidat, skippa" },
};

export function toneForScore(score: number): Tone {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  if (score >= 40) return "neutral";
  return "danger";
}

export function verdictForScore(score: number): Verdict {
  if (score >= 82) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "mediocre";
  return "skip";
}

const mk = (
  score: number,
  weight: number,
  signals: Signal[],
  verdict?: string,
): CategoryResult => ({ score, weight, signals, verdict });

export const domainAnalyses: DomainAnalysis[] = [
  {
    slug: "nordbyte",
    domain: "nordbyte.se",
    tld: ".se",
    source: "internetstiftelsen",
    fetchedAt: "2026-04-19 08:14",
    expiresAt: "2026-04-22",
    totalScore: 88,
    verdict: "excellent",
    status: "analyzed",
    estimatedValue: "12 000 – 24 000 kr",
    aiSummary:
      "Nordiskt, teknologi-klingande namn med stark SaaS-potential. Två tydliga stavelser, lätt att uttala, ingen TM-krock i svenska eller nordiska databaser. Ideal för byrå, plattform eller molntjänst.",
    categories: {
      structure: mk(92, 12, [
        { label: "Längd", value: "8 tecken", tone: "success" },
        { label: "Siffror", value: "Inga", tone: "success" },
        { label: "Bindestreck", value: "Inga", tone: "success" },
        { label: "Stavning", value: "Korrekt", tone: "success" },
      ]),
      lexical: mk(86, 12, [
        { label: "Svenska ord", value: "Nord + byte", tone: "success" },
        { label: "Vokaler", value: "3 av 8", tone: "success" },
        { label: "Begriplighet", value: "Hög", tone: "success" },
      ]),
      brand: mk(90, 16, [
        { label: "Minnesvärdhet", value: "Mycket hög", tone: "success" },
        { label: "Brand-bar", value: "Ja", tone: "success" },
        { label: "SaaS-funk", value: "Mycket bra", tone: "success" },
      ], "Låter som en etablerad teknikplattform. Starkt varumärke möjligt."),
      market: mk(84, 14, [
        { label: "Målgrupp", value: "B2B teknik", tone: "success" },
        { label: "Bransch", value: "IT / Cloud", tone: "success" },
        { label: "Kommersiell intent", value: "Hög", tone: "success" },
      ], "Tydlig dragning mot B2B-kunder i tech-sektorn."),
      risk: mk(88, 10, [
        { label: "TM-träffar", value: "0", tone: "success" },
        { label: "Juridisk risk", value: "Låg", tone: "success" },
        { label: "Negativa assoc.", value: "Inga", tone: "success" },
      ]),
      salability: mk(82, 14, [
        { label: "Flip-bar", value: "Ja", tone: "success" },
        { label: "Realistiska köpare", value: "Byråer, SaaS", tone: "success" },
        { label: "Prisnivå", value: "12–24k", tone: "success" },
      ], "Starka slutkundssignaler, säljbar inom 30–60 dagar."),
      seo: mk(78, 12, [
        { label: "DA", value: "22", tone: "success" },
        { label: "Backlinks", value: "148", tone: "success" },
        { label: "Spam score", value: "1 %", tone: "success" },
      ]),
      history: mk(94, 10, [
        { label: "Snapshots", value: "42", tone: "success" },
        { label: "Första sett", value: "2011", tone: "success" },
        { label: "Flaggor", value: "Inga", tone: "success" },
      ]),
    },
    seo: { domainAuthority: 22, pageAuthority: 28, backlinks: 148, referringDomains: 41, spamScore: 1 },
    wayback: { snapshots: 42, firstSeen: "2011-05-03", lastSeen: "2025-11-18", flags: [] },
  },
  {
    slug: "klimatdata",
    domain: "klimatdata.se",
    tld: ".se",
    source: "internetstiftelsen",
    fetchedAt: "2026-04-19 08:14",
    expiresAt: "2026-04-25",
    totalScore: 79,
    verdict: "good",
    status: "analyzed",
    estimatedValue: "8 000 – 16 000 kr",
    aiSummary:
      "Beskrivande, aktuellt och kopplat till en växande bransch. Lite generisk men funkar starkt som SEO-domän och som plattform för ESG-tjänster.",
    categories: {
      structure: mk(84, 12, [
        { label: "Längd", value: "11 tecken", tone: "success" },
        { label: "Stavning", value: "Korrekt", tone: "success" },
        { label: "Sammansatt", value: "Ja", tone: "neutral" },
      ]),
      lexical: mk(90, 12, [
        { label: "Svenska ord", value: "Klimat + data", tone: "success" },
        { label: "Begriplighet", value: "Mycket hög", tone: "success" },
      ]),
      brand: mk(68, 16, [
        { label: "Minnesvärdhet", value: "Hög", tone: "success" },
        { label: "Brand-bar", value: "Ja, men generisk", tone: "warning" },
      ], "Starkt för generisk produkt men svårare att sticka ut i nischen."),
      market: mk(88, 14, [
        { label: "Målgrupp", value: "ESG / myndighet", tone: "success" },
        { label: "Bransch", value: "Klimat / data", tone: "success" },
        { label: "Kommersiell intent", value: "Hög", tone: "success" },
      ]),
      risk: mk(72, 10, [
        { label: "TM-träffar", value: "0", tone: "success" },
        { label: "Generisk", value: "Medium risk", tone: "warning" },
      ]),
      salability: mk(74, 14, [
        { label: "Realistiska köpare", value: "ESG-bolag, byråer", tone: "success" },
        { label: "Prisnivå", value: "8–16k", tone: "success" },
      ]),
      seo: mk(82, 12, [
        { label: "DA", value: "28", tone: "success" },
        { label: "Backlinks", value: "312", tone: "success" },
        { label: "Sökvolym", value: "1 900/mån", tone: "success" },
      ]),
      history: mk(70, 10, [
        { label: "Snapshots", value: "18", tone: "success" },
        { label: "Flaggor", value: "Redirect 2019", tone: "warning" },
      ]),
    },
    seo: { domainAuthority: 28, pageAuthority: 32, backlinks: 312, referringDomains: 86, spamScore: 3 },
    wayback: { snapshots: 18, firstSeen: "2014-02-10", lastSeen: "2025-09-22", flags: ["Redirect 2019"] },
  },
  {
    slug: "snapflow",
    domain: "snapflow.io",
    tld: ".io",
    source: "manual",
    fetchedAt: "2026-04-19 09:02",
    expiresAt: "2026-04-21",
    totalScore: 91,
    verdict: "excellent",
    status: "analyzed",
    estimatedValue: "35 000 – 80 000 kr",
    aiSummary:
      "Premium .io-domän med stark SaaS-prägel. 'Snap' + 'flow' bygger moderna associationer till snabbhet och automation. Mycket begärlig i startup-sammanhang.",
    categories: {
      structure: mk(96, 12, [
        { label: "Längd", value: "8 tecken", tone: "success" },
        { label: "Stavning", value: "Korrekt", tone: "success" },
      ]),
      lexical: mk(82, 12, [
        { label: "Ord", value: "Snap + flow", tone: "success" },
        { label: "Uttal", value: "Globalt", tone: "success" },
      ]),
      brand: mk(96, 16, [
        { label: "Minnesvärdhet", value: "Mycket hög", tone: "success" },
        { label: "SaaS-funk", value: "Utmärkt", tone: "success" },
      ], "Klassisk SaaS-naming — känns direkt som en produkt."),
      market: mk(92, 14, [
        { label: "Målgrupp", value: "Global B2B SaaS", tone: "success" },
        { label: "Kommersiell intent", value: "Mycket hög", tone: "success" },
      ]),
      risk: mk(78, 10, [
        { label: "TM-träffar", value: "1 liten", tone: "warning" },
        { label: "Juridisk risk", value: "Låg", tone: "success" },
      ], "Mindre TM-registrering i annan bransch — behöver kontrolleras."),
      salability: mk(94, 14, [
        { label: "Flip-bar", value: "Ja", tone: "success" },
        { label: "Prisnivå", value: "35–80k", tone: "success" },
      ]),
      seo: mk(70, 12, [
        { label: "DA", value: "14", tone: "neutral" },
        { label: "Backlinks", value: "62", tone: "success" },
      ]),
      history: mk(88, 10, [
        { label: "Snapshots", value: "29", tone: "success" },
        { label: "Flaggor", value: "Inga", tone: "success" },
      ]),
    },
    seo: { domainAuthority: 14, pageAuthority: 18, backlinks: 62, referringDomains: 22, spamScore: 2 },
    wayback: { snapshots: 29, firstSeen: "2017-08-14", lastSeen: "2026-01-04", flags: [] },
  },
  {
    slug: "bilforum",
    domain: "bilforum.se",
    tld: ".se",
    source: "internetstiftelsen",
    fetchedAt: "2026-04-19 07:55",
    expiresAt: "2026-04-20",
    totalScore: 63,
    verdict: "good",
    status: "analyzed",
    estimatedValue: "4 000 – 9 000 kr",
    aiSummary:
      "Stark SEO-historik men generiskt begrepp. Funkar bra för community-sida eller affiliate, svag som brand-domän.",
    categories: {
      structure: mk(82, 12, [
        { label: "Längd", value: "10 tecken", tone: "success" },
      ]),
      lexical: mk(88, 12, [
        { label: "Ord", value: "Bil + forum", tone: "success" },
      ]),
      brand: mk(46, 16, [
        { label: "Generisk", value: "Mycket", tone: "danger" },
      ], "Svårt att bygga starkt eget varumärke kring."),
      market: mk(64, 14, [
        { label: "Målgrupp", value: "Konsument", tone: "success" },
        { label: "Intent", value: "Medium", tone: "warning" },
      ]),
      risk: mk(60, 10, [
        { label: "TM-träffar", value: "0", tone: "success" },
        { label: "Generisk", value: "Hög risk", tone: "warning" },
      ]),
      salability: mk(56, 14, [
        { label: "Köpare", value: "Affiliate", tone: "warning" },
      ]),
      seo: mk(88, 12, [
        { label: "DA", value: "41", tone: "success" },
        { label: "Backlinks", value: "8 412", tone: "success" },
      ]),
      history: mk(52, 10, [
        { label: "Snapshots", value: "312", tone: "success" },
        { label: "Flaggor", value: "Spam 2020–21", tone: "warning" },
      ]),
    },
    seo: { domainAuthority: 41, pageAuthority: 46, backlinks: 8412, referringDomains: 641, spamScore: 12 },
    wayback: { snapshots: 312, firstSeen: "2002-11-21", lastSeen: "2025-12-30", flags: ["Spam 2020", "Spam 2021"] },
  },
  {
    slug: "kasino-vinst",
    domain: "kasino-vinst.se",
    tld: ".se",
    source: "internetstiftelsen",
    fetchedAt: "2026-04-19 07:55",
    expiresAt: "2026-04-20",
    totalScore: 28,
    verdict: "skip",
    status: "analyzed",
    estimatedValue: "0 – 2 000 kr",
    aiSummary:
      "Bindestreck, regulerad bransch och spam-historik. Hög juridisk risk och svårt att ranka. Rekommendation: skippa.",
    categories: {
      structure: mk(42, 12, [
        { label: "Bindestreck", value: "Ja", tone: "danger" },
        { label: "Längd", value: "14 tecken", tone: "warning" },
      ]),
      lexical: mk(54, 12, []),
      brand: mk(22, 16, [
        { label: "Brand-bar", value: "Nej", tone: "danger" },
      ], "Generisk och associeras med låg kvalitet."),
      market: mk(40, 14, [
        { label: "Reglerad", value: "Ja", tone: "danger" },
      ]),
      risk: mk(10, 10, [
        { label: "Juridik", value: "Hög", tone: "danger" },
        { label: "Spelinspektionen", value: "Tillstånd krävs", tone: "danger" },
      ], "Spellicenslagen gör drift utan tillstånd olaglig."),
      salability: mk(30, 14, [
        { label: "Köpare", value: "Mycket få", tone: "danger" },
      ]),
      seo: mk(36, 12, [
        { label: "Spam score", value: "48 %", tone: "danger" },
      ]),
      history: mk(18, 10, [
        { label: "Flaggor", value: "Adult 2018, Spam 2022", tone: "danger" },
      ]),
    },
    seo: { domainAuthority: 8, pageAuthority: 12, backlinks: 244, referringDomains: 18, spamScore: 48 },
    wayback: { snapshots: 61, firstSeen: "2013-06-02", lastSeen: "2024-08-11", flags: ["Adult 2018", "Spam 2022"] },
  },
  {
    slug: "fikabruket",
    domain: "fikabruket.se",
    tld: ".se",
    source: "manual",
    fetchedAt: "2026-04-19 09:20",
    expiresAt: "2026-04-26",
    totalScore: 74,
    verdict: "good",
    status: "analyzed",
    estimatedValue: "6 000 – 14 000 kr",
    aiSummary:
      "Varm, svensk och berättande domän. Passar kaffe-, café- eller livsstilsvarumärke. Stark i DTC-segmentet.",
    categories: {
      structure: mk(88, 12, [{ label: "Längd", value: "12 tecken", tone: "success" }]),
      lexical: mk(94, 12, [{ label: "Ord", value: "Fika + bruket", tone: "success" }]),
      brand: mk(86, 16, [{ label: "Brand-bar", value: "Stark", tone: "success" }], "Kulturellt laddat och känslosamt namn."),
      market: mk(72, 14, [{ label: "Målgrupp", value: "Konsument, livsstil", tone: "success" }]),
      risk: mk(64, 10, [{ label: "TM-träffar", value: "2 i mat", tone: "warning" }]),
      salability: mk(70, 14, [{ label: "Köpare", value: "DTC-brand", tone: "success" }]),
      seo: mk(42, 12, [{ label: "DA", value: "9", tone: "warning" }]),
      history: mk(68, 10, [{ label: "Snapshots", value: "14", tone: "success" }]),
    },
    seo: { domainAuthority: 9, pageAuthority: 14, backlinks: 38, referringDomains: 12, spamScore: 2 },
    wayback: { snapshots: 14, firstSeen: "2016-04-18", lastSeen: "2024-11-02", flags: [] },
  },
  {
    slug: "devportal",
    domain: "devportal.se",
    tld: ".se",
    source: "csv",
    fetchedAt: "2026-04-19 09:34",
    expiresAt: "2026-04-28",
    totalScore: 67,
    verdict: "good",
    status: "running",
    estimatedValue: "5 000 – 12 000 kr",
    aiSummary: "Analys pågår — preliminär poäng.",
    categories: {
      structure: mk(82, 12, []),
      lexical: mk(64, 12, []),
      brand: mk(70, 16, []),
      market: mk(76, 14, []),
      risk: mk(70, 10, []),
      salability: mk(62, 14, []),
      seo: mk(58, 12, []),
      history: mk(62, 10, []),
    },
    seo: { domainAuthority: 12, pageAuthority: 16, backlinks: 92, referringDomains: 24, spamScore: 4 },
    wayback: { snapshots: 8, firstSeen: "2019-07-11", lastSeen: "2024-05-02", flags: [] },
  },
  {
    slug: "pay-easy",
    domain: "pay-easy.se",
    tld: ".se",
    source: "internetstiftelsen",
    fetchedAt: "2026-04-19 08:14",
    expiresAt: "2026-04-23",
    totalScore: 52,
    verdict: "mediocre",
    status: "analyzed",
    estimatedValue: "2 000 – 5 000 kr",
    aiSummary:
      "Bindestreck drar ner brand-värdet. Fungerar som landningsdomän eller sekundärdomän men inte som primärt varumärke.",
    categories: {
      structure: mk(48, 12, [{ label: "Bindestreck", value: "Ja", tone: "danger" }]),
      lexical: mk(62, 12, [{ label: "Engelsk", value: "Ja", tone: "neutral" }]),
      brand: mk(44, 16, [{ label: "Brand-bar", value: "Svag", tone: "warning" }]),
      market: mk(74, 14, [{ label: "Bransch", value: "Fintech", tone: "success" }]),
      risk: mk(52, 10, [{ label: "TM-träffar", value: "3 fintech", tone: "warning" }]),
      salability: mk(46, 14, [{ label: "Köpare", value: "Få", tone: "warning" }]),
      seo: mk(58, 12, [{ label: "DA", value: "17", tone: "success" }]),
      history: mk(50, 10, [{ label: "Snapshots", value: "11", tone: "success" }]),
    },
    seo: { domainAuthority: 17, pageAuthority: 22, backlinks: 74, referringDomains: 19, spamScore: 6 },
    wayback: { snapshots: 11, firstSeen: "2015-03-19", lastSeen: "2023-11-28", flags: [] },
  },
  {
    slug: "aiverktyg",
    domain: "aiverktyg.se",
    tld: ".se",
    source: "internetstiftelsen",
    fetchedAt: "2026-04-20 21:58",
    expiresAt: "2026-04-30",
    totalScore: 92,
    verdict: "excellent",
    status: "analyzed",
    estimatedValue: "25 000 – 45 000 kr",
    aiSummary: "Extremt relevant och sökordsoptimerad domän. AI är den snabbast växande sektorn och 'verktyg' är det primära sökordet för användare som letar efter lösningar.",
    categories: {
      structure: mk(95, 12, [ { "label": "Längd", "value": "9 tecken", "tone": "success" }, { "label": "Stavning", "value": "Korrekt", "tone": "success" } ] ),
      lexical: mk(98, 12, [ { "label": "Svenska ord", "value": "AI + verktyg", "tone": "success" }, { "label": "Begriplighet", "value": "Total", "tone": "success" } ] ),
      brand: mk(85, 16, [ { "label": "Minnesvärdhet", "value": "Mycket hög", "tone": "success" } ] ),
      market: mk(96, 15, [ { "label": "Målgrupp", "value": "B2B/B2C Tech", "tone": "success" }, { "label": "Kommersiell intent", "value": "Extremt hög", "tone": "success" } ] ),
      risk: mk(90, 10, [ { "label": "TM-träffar", "value": "0", "tone": "success" } ] ),
      salability: mk(94, 14, [ { "label": "Realistiska köpare", "value": "SaaS-bolag, affiliate", "tone": "success" } ] ),
      seo: mk(90, 12, [ { "label": "Sökvolym", "value": "12 000/mån", "tone": "success" } ] ),
      history: mk(80, 10, [ { "label": "Status", "value": "Clean", "tone": "success" } ] )
    },
    seo: { domainAuthority: 15, pageAuthority: 20, backlinks: 45, referringDomains: 12, spamScore: 1 },
    wayback: { snapshots: 4, firstSeen: "2023-01-15", lastSeen: "2025-12-01", flags: [] }
  },
  {
    slug: "planta",
    domain: "planta.se",
    tld: ".se",
    source: "internetstiftelsen",
    fetchedAt: "2026-04-20 22:14",
    expiresAt: "2026-05-12",
    totalScore: 91,
    verdict: "excellent",
    status: "analyzed",
    estimatedValue: "45 000 – 85 000 kr",
    aiSummary: "Ett absolut toppdomän-namn. Kort, enkelt att stava och extremt varumärkesbart. Perfekt för allt från e-handel med växter till en community-app för trädgårdsintresserade. Ett 'premium ett-ords-domän' med mycket hög prestige.",
    categories: {
      structure: mk(98, 12, [ { label: "Längd", value: "6 tecken", tone: "success" }, { label: "Stavning", value: "Korrekt", tone: "success" }, { label: "Sammansatt", value: "Nej", tone: "success" }, ]),
      lexical: mk(96, 12, [ { label: "Svenska ord", value: "Planta", tone: "success" }, { label: "Begriplighet", value: "Universal", tone: "success" }, ]),
      brand: mk(95, 16, [ { label: "Minnesvärdhet", value: "Extremt hög", tone: "success" }, { label: "Brand-bar", value: "Ja, premium", tone: "success" }, ], "Sällsynt möjlighet att äga ett kort och konkret substantiv."),
      market: mk(89, 14, [ { label: "Målgrupp", value: "B2C / Hem & Trädgård", tone: "success" }, { label: "Bransch", value: "E-handel / Miljö", tone: "success" }, { label: "Kommersiell intent", value: "Hög", tone: "success" }, ]),
      risk: mk(92, 10, [
      { label: "TM-träffar", value: "0", tone: "success" },
      { label: "Generisk", value: "Låg risk (substantiv)", tone: "success" },
      ]),
      salability: mk(94, 14, [
      { label: "Realistiska köpare", value: "Plantagen, startups, e-handlare", tone: "success" },
      { label: "Prisnivå", value: "45k+", tone: "success" },
      ]),
      seo: mk(85, 12, [
      { label: "DA", value: "32", tone: "success" },
      { label: "Backlinks", value: "840", tone: "success" },
      { label: "Sökvolym", value: "22 000/mån", tone: "success" },
      ]),
      history: mk(88, 10, [
      { label: "Snapshots", value: "142", tone: "success" },
      { label: "Flaggor", value: "Inga", tone: "success" },
      ]),
    },
    seo: { domainAuthority: 32, pageAuthority: 38, backlinks: 840, referringDomains: 112, spamScore: 1 },
    wayback: { snapshots: 142, firstSeen: "2001-04-05", lastSeen: "2026-01-10", flags: [] },
    },
  {
  "slug": "solcellskollen",
  "domain": "solcellskollen.nu",
  "tld": ".nu",
  "source": "internetstiftelsen",
  "fetchedAt": "2026-04-20 21:58",
  "expiresAt": "2026-05-02",
  "totalScore": 84,
  "verdict": "good",
  "status": "analyzed",
  "estimatedValue": "12 000 – 20 000 kr",
  "aiSummary": "Perfekt för en jämförelsetjänst inom grön energi. 'Kollen' är ett etablerat begrepp för konsumenttjänster i Sverige.",
  "categories": {
  "structure": mk(82, 12, [ { "label": "Längd", "value": "14 tecken", "tone": "neutral" } ] ),
  "lexical": mk(92, 12, [ { "label": "Svenska ord", "value": "Solceller + kollen", "tone": "success" } ] ),
  "brand": mk(88, 16, [ { "label": "Brand-bar", "value": "Ja, hög potential", "tone": "success" } ] ),
  "market": mk(90, 14, [ { "label": "Målgrupp", "value": "Villaägare", "tone": "success" } ] ),
  "risk": mk(85, 10, [ { "label": "Generisk", "value": "Låg risk", "tone": "success" } ] ),
  "salability": mk(80, 14, [ { "label": "Realistiska köpare", "value": "Energibolag, leads-sajter", "tone": "success" } ] ),
  "seo": mk(75, 12, [ { "label": "Sökvolym", "value": "4 500/mån", "tone": "success" } ] ),
  "history": mk(70, 10, [ { "label": "Snapshots", "value": "2", "tone": "neutral" } ] )
  },
  "seo": { "domainAuthority": 8, "pageAuthority": 12, "backlinks": 120, "referringDomains": 15, "spamScore": 0 },
  "wayback": { "snapshots": 2, "firstSeen": "2021-05-10", "lastSeen": "2024-11-15", "flags": [] }
  },
  {
  "slug": "hybridbil",
  "domain": "hybridbil.se",
  "tld": ".se",
  "source": "internetstiftelsen",
  "fetchedAt": "2026-04-20 21:58",
  "expiresAt": "2026-04-28",
  "totalScore": 87,
  "verdict": "good",
  "status": "analyzed",
  "estimatedValue": "15 000 – 25 000 kr",
  "aiSummary": "Kort, deskriptivt och med högt kommersiellt värde. Fordonsindustrins skifte gör detta till ett starkt sökord för bilhandlare.",
  "categories": {
  "structure": mk(90, 12, [ { "label": "Längd", "value": "9 tecken", "tone": "success" } ] ),
  "lexical": mk(95, 12, [ { "label": "Begriplighet", "value": "Global/Lokal", "tone": "success" } ] ),
  "brand": mk(70, 16, [ { "label": "Brand-bar", "value": "Beskrivande", "tone": "warning" } ] ),
  "market": mk(92, 14, [ { "label": "Bransch", "value": "Automotive", "tone": "success" } ] ),
  "risk": mk(88, 10, [ { "label": "TM-träffar", "value": "0", "tone": "success" } ] ),
  "salability": mk(85, 13, [ { "label": "Köpare", "value": "Bilhandlare, portaler", "tone": "success" } ] ),
  "seo": mk(88, 12, [ { "label": "Sökvolym", "value": "8 200/mån", "tone": "success" } ] ),
  "history": mk(75, 10, [ { "label": "Flaggor", "value": "Inga", "tone": "success" } ] )
  },
  "seo": { "domainAuthority": 12, "pageAuthority": 18, "backlinks": 800, "referringDomains": 40, "spamScore": 2 },
  "wayback": { "snapshots": 25, "firstSeen": "2008-11-20", "lastSeen": "2025-10-05", "flags": [] }
  },
  {
slug: "fredagsmys",
domain: "fredagsmys.se",
tld: ".se",
source: "internetstiftelsen",
fetchedAt: "2026-04-20 22:16",
expiresAt: "2026-05-18",
totalScore: 94,
verdict: "excellent",
status: "analyzed",
estimatedValue: "60 000 – 120 000 kr",
aiSummary:
"En kulturell ikon i domänform. Begreppet 'Fredagsmys' är djupt rotat i den svenska folksjälen och ägs mentalt av hela dagligvaruhandeln. Extremt hög igenkänningsfaktor med enorm potential för allt från receptportaler till streamingtjänster eller snacks-varumärken.",
categories: {
structure: mk(95, 12, [
{ label: "Längd", value: "10 tecken", tone: "success" },
{ label: "Stavning", value: "Korrekt", tone: "success" },
{ label: "Sammansatt", value: "Ja", tone: "success" },
]),
lexical: mk(100, 12, [
{ label: "Svenska ord", value: "Fredags + mys", tone: "success" },
{ label: "Begriplighet", value: "Total", tone: "success" },
]),
brand: mk(98, 16, [
{ label: "Minnesvärdhet", value: "Exceptionell", tone: "success" },
{ label: "Brand-bar", value: "Ja, kulturellt fenomen", tone: "success" },
], "Ett av de starkaste varumärkesorden som finns på den svenska marknaden."),
market: mk(96, 14, [
{ label: "Målgrupp", value: "Hela Sverige (B2C)", tone: "success" },
{ label: "Bransch", value: "FMCG / Media / Mat", tone: "success" },
{ label: "Kommersiell intent", value: "Mycket hög", tone: "success" },
]),
risk: mk(85, 10, [
{ label: "TM-träffar", value: "Vissa (generiskt bruk)", tone: "warning" },
{ label: "Beskrivande", value: "Hög, men etablerat", tone: "success" },
]),
salability: mk(96, 14, [
{ label: "Realistiska köpare", value: "OLW, Estrella, ICA, Coop", tone: "success" },
{ label: "Prisnivå", value: "60k+", tone: "success" },
]),
seo: mk(92, 12, [
{ label: "DA", value: "41", tone: "success" },
{ label: "Backlinks", value: "1 250", tone: "success" },
{ label: "Sökvolym", value: "35 000/mån", tone: "success" },
]),
history: mk(90, 10, [
{ label: "Snapshots", value: "210", tone: "success" },
{ label: "Flaggor", value: "Inga", tone: "success" },
]),
},
seo: { domainAuthority: 41, pageAuthority: 45, backlinks: 1250, referringDomains: 184, spamScore: 1 },
wayback: { snapshots: 210, firstSeen: "2002-11-20", lastSeen: "2026-02-15", flags: [] },
}
];

export const scoreTrend = [
  { label: "12 apr", value: 58 },
  { label: "13 apr", value: 61 },
  { label: "14 apr", value: 63 },
  { label: "15 apr", value: 67 },
  { label: "16 apr", value: 64 },
  { label: "17 apr", value: 71 },
  { label: "18 apr", value: 69 },
  { label: "19 apr", value: 74 },
];

export const volumePerDay = [
  { label: "Mån", value: 184 },
  { label: "Tis", value: 212 },
  { label: "Ons", value: 198 },
  { label: "Tor", value: 241 },
  { label: "Fre", value: 176 },
  { label: "Lör", value: 92 },
  { label: "Sön", value: 71 },
];

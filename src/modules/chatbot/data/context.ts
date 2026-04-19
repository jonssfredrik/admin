export interface ModuleContext {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export const moduleContexts: ModuleContext[] = [
  {
    id: "jetwp",
    name: "JetWP",
    description: "Managed WordPress-kontrollpanel",
    keywords: [
      "wordpress", "wp", "sajt", "sajter", "site", "sites",
      "plugin", "plugins", "backup", "backups", "hosting",
      "server", "jetwp", "drift", "prestanda",
    ],
  },
  {
    id: "snaptld",
    name: "SnapTLD",
    description: "Domänanalys och scoring",
    keywords: [
      "domän", "domäner", "domain", "domains", "tld", "snaptld",
      "scoring", "score", "analys", "watchlist", "bevakningslista",
      "utgångna", "kandidat", "kandidater",
    ],
  },
  {
    id: "billing",
    name: "Fakturering",
    description: "Fakturering och betalningar",
    keywords: [
      "faktura", "fakturor", "billing", "betalning", "betalningar",
      "invoice", "invoices", "fakturering", "ekonomi", "pengar", "kund",
    ],
  },
  {
    id: "file-converter",
    name: "Filkonverterare",
    description: "Konvertera filer mellan format",
    keywords: [
      "fil", "filer", "konvertera", "konvertering", "file", "convert",
      "converter", "format", "pdf", "csv", "json", "xml", "export", "import",
    ],
  },
];

const moduleResponses: Record<string, string[]> = {
  jetwp: [
    "JetWP är din Managed WordPress-kontrollpanel. Härifrån hanterar du sajter, plugin-uppdateringar, backups, SSH-åtkomst och prestandaövervakning.",
    "I JetWP finns 18+ vyer — från en övergripande sajt-lista till detaljerade prestanda- och säkerhetsrapporter per installation. Navigera via sidomenyn.",
    "JetWP:s backup-funktion låter dig schemalägga automatiska säkerhetskopior och återställa sajter med ett klick. Hittas under Sajter → [sajt] → Backups.",
    "Plugin-hanteringen i JetWP visar alla installerade tillägg, tillgängliga uppdateringar och eventuella konflikter — direkt i ett och samma gränssnitt.",
  ],
  snaptld: [
    "SnapTLD analyserar utgångna domäner och poängsätter dem baserat på åtta dimensioner: ålder, backlinks, trafik, DA, TLD, stavning, nischvärde och historia.",
    "Du kan importera domänkandidater till SnapTLD via JSON, CSV, URL-feed eller fritext. Analyserna köas och processas asynkront med förloppsindikator.",
    "I SnapTLD:s watchlist sparar du favoritkandidater och kan exportera dem eller skapa rapporter. Bevakningslistan synkroniseras lokalt i webbläsaren.",
    "Analysköns kandidater sorteras efter totalpoäng. Klicka på en domän för ett detaljerat analyskort med per-dimension-breakdown.",
  ],
  billing: [
    "Faktureringmodulen ger en översikt av dina fakturor med status (betald, obetald, förfallen) och totalt utestående belopp.",
    "I Fakturering skapar du manuella fakturor, lägger till rader, sätter förfallodatum och kan generera PDF för utskick till kund.",
    "Faktureringsöversikten visar din senaste aktivitet — nyligen skapade fakturor, kommande förfallodatum och eventuella förseningar.",
  ],
  "file-converter": [
    "Filkonverteraren stödjer konvertering mellan populära format — CSV↔JSON, XML↔JSON, PDF-export och mer. Dra och släpp filer direkt i gränssnittet.",
    "Med Filkonverteraren transformerar du datafiler utan att lämna admin-panelen. Resultaten laddas ner eller kopieras till urklipp.",
  ],
};

const fallbackResponses = [
  "Jag är Admin AI och har kontext för modulerna i systemet. Fråga mig om JetWP, SnapTLD, Fakturering eller Filkonverteraren.",
  "Kan du vara lite mer specifik? Jag kan hjälpa dig med WordPress-sajter, domänanalys, fakturor eller filkonvertering.",
  "Jag hittar ingen tydlig koppling till en aktiv modul. Prova att fråga om JetWP, SnapTLD, Fakturering eller Filkonverteraren.",
];

export function generateResponse(message: string, activeModules: string[]): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("hjälp") ||
    lower.includes("vad kan du") ||
    lower.includes("vad vet du") ||
    lower.includes("vem är du") ||
    lower.includes("vad gör du")
  ) {
    const activeNames = moduleContexts
      .filter((m) => activeModules.includes(m.id))
      .map((m) => m.name)
      .join(", ");
    return `Jag är Admin AI — din assistent för admin-panelen. Jag har kontext för: ${activeNames || "inga moduler (aktivera under Inställningar)"}. Ställ mig en fråga om något av dessa system.`;
  }

  if (lower.includes("inställning") || lower.includes("konfigurera") || lower.includes("ändra kontext")) {
    return "Mina inställningar hittar du under Admin AI → Inställningar i sidomenyn. Där styr du vilka moduler jag har kontext för och kan rensa konversationshistoriken.";
  }

  if (lower.includes("navigera") || lower.includes("gå till") || lower.includes("hitta")) {
    return "Navigera via sidomenyn till vänster. Kommandon och sökfunktion öppnas med ⌘K (Ctrl+K på Windows).";
  }

  for (const ctx of moduleContexts) {
    if (!activeModules.includes(ctx.id)) continue;
    if (ctx.keywords.some((kw) => lower.includes(kw))) {
      const responses = moduleResponses[ctx.id];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

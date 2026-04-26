import type {
  DecisionCard,
  OrchestratorMessage,
  ProjectTemplate,
  QaCheck,
  RiskLevel,
  SitePreview,
  TimelineStep,
  WpAction,
  WpAgent,
  WpOrchestratorSettings,
  WpOrchestratorWorkspace,
  WpPlanStep,
} from "@/modules/wp-orchestrator/types";

export const wpAgents: WpAgent[] = [
  {
    id: "architect",
    name: "Architect",
    role: "Sitemap och krav",
    summary: "Bryter ner briefen till sidor, målgrupper och funktioner.",
  },
  {
    id: "designer",
    name: "Designer",
    role: "Tema och block",
    summary: "Väljer tema, layoutprinciper och Gutenberg-struktur.",
  },
  {
    id: "content",
    name: "Content",
    role: "Text och media",
    summary: "Tar fram sidtexter, CTA:er och bildprompts.",
  },
  {
    id: "tech",
    name: "Plugin/Tech",
    role: "Plugins och konfiguration",
    summary: "Mappar behov till plugins och säkra standardinställningar.",
  },
  {
    id: "builder",
    name: "Builder",
    role: "WP-CLI och REST",
    summary: "Översätter planen till deterministiska actions.",
  },
  {
    id: "qa",
    name: "QA",
    role: "Verifiering",
    summary: "Kontrollerar sidor, plugins, startsida och menyer.",
  },
];

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "hair-salon",
    name: "Frisör",
    industry: "Frisörsalong",
    targetAudience: "Privatkunder som vill boka klippning snabbt",
    siteGoal: "Få fler bokningar och visa behandlingar tydligt",
    brief:
      "Skapa en modern WordPress-sajt för en frisörsalong i Stockholm. Sajten ska visa behandlingar, priser, stylister och göra det enkelt att boka tid.",
    pages: ["Hem", "Behandlingar", "Priser", "Team", "Boka"],
    plugins: [
      { slug: "contact-form-7", name: "Contact Form 7", purpose: "Kontakt och bokningsförfrågningar" },
      { slug: "wordpress-seo", name: "Yoast SEO", purpose: "Grundläggande lokal SEO" },
      { slug: "simply-schedule-appointments", name: "Simply Schedule Appointments", purpose: "Bokningsflöde som tillval" },
    ],
    cta: "Boka tid",
    tone: "Varm, stilren och trygg",
  },
  {
    id: "construction",
    name: "Byggfirma",
    industry: "Byggfirma",
    targetAudience: "Villaägare och BRF:er som behöver offert",
    siteGoal: "Driva offertförfrågningar och visa referensprojekt",
    brief:
      "Skapa en WordPress-sajt för en byggfirma med tjänster, referensprojekt, offertformulär och förtroendeskapande innehåll.",
    pages: ["Hem", "Tjänster", "Referenser", "Om oss", "Offert"],
    plugins: [
      { slug: "contact-form-7", name: "Contact Form 7", purpose: "Offertformulär" },
      { slug: "wordpress-seo", name: "Yoast SEO", purpose: "Sökbar tjänstestruktur" },
      { slug: "wp-super-cache", name: "WP Super Cache", purpose: "Prestanda för bildtunga referenser" },
    ],
    cta: "Begär offert",
    tone: "Saklig, robust och förtroendeingivande",
  },
  {
    id: "restaurant",
    name: "Restaurang",
    industry: "Restaurang",
    targetAudience: "Gäster som vill se meny och boka bord",
    siteGoal: "Öka bordsbokningar och presentera meny",
    brief:
      "Skapa en WordPress-sajt för en restaurang med meny, öppettider, bokning, bilder och lokal SEO.",
    pages: ["Hem", "Meny", "Boka bord", "Om restaurangen", "Kontakt"],
    plugins: [
      { slug: "contact-form-7", name: "Contact Form 7", purpose: "Bokningsförfrågningar" },
      { slug: "wordpress-seo", name: "Yoast SEO", purpose: "Lokal SEO" },
      { slug: "easy-facebook-likebox", name: "Social Feed", purpose: "Social proof som optional" },
    ],
    cta: "Boka bord",
    tone: "Levande, aptitlig och enkel",
  },
  {
    id: "consultant",
    name: "Konsult",
    industry: "Konsultverksamhet",
    targetAudience: "B2B-kunder som söker expertstöd",
    siteGoal: "Generera kvalificerade leads",
    brief:
      "Skapa en tydlig WordPress-sajt för en konsult med erbjudanden, case, expertprofil och kontaktflöde.",
    pages: ["Hem", "Erbjudanden", "Case", "Om", "Kontakt"],
    plugins: [
      { slug: "contact-form-7", name: "Contact Form 7", purpose: "Leadformulär" },
      { slug: "wordpress-seo", name: "Yoast SEO", purpose: "Sökbar expertpositionering" },
      { slug: "mailchimp-for-wp", name: "Mailchimp for WP", purpose: "Nyhetsbrev som tillval" },
    ],
    cta: "Boka rådgivning",
    tone: "Skärpt, professionell och konkret",
  },
  {
    id: "commerce-light",
    name: "E-handel light",
    industry: "Liten webbutik",
    targetAudience: "Kunder som vill köpa få utvalda produkter",
    siteGoal: "Lansera en enkel produktkatalog med köpintresse",
    brief:
      "Skapa en WordPress-sajt för en liten webbutik med startsida, produktkategorier, utvalda produkter och kontakt.",
    pages: ["Hem", "Produkter", "Kategorier", "Om butiken", "Kontakt"],
    plugins: [
      { slug: "woocommerce", name: "WooCommerce", purpose: "Produktkatalog och framtida köpflöde" },
      { slug: "wordpress-seo", name: "Yoast SEO", purpose: "Produktsök och metadata" },
      { slug: "contact-form-7", name: "Contact Form 7", purpose: "Kundfrågor" },
    ],
    cta: "Se produkter",
    tone: "Tydlig, säljande och lättnavigerad",
  },
];

export const defaultSettings: WpOrchestratorSettings = {
  localUrl: "http://localhost/wordpress",
  wpCliPath: "C:\\xampp\\htdocs\\wordpress",
  preferredTheme: "astra",
  pluginPolicy: "balanced",
  confirmationMode: "risky",
};

export const defaultQaChecks: QaCheck[] = [
  { id: "pages", label: "Sidor", status: "pending", detail: "Väntar på byggkörning." },
  { id: "plugins", label: "Plugins", status: "pending", detail: "Väntar på installation." },
  { id: "homepage", label: "Startsida", status: "pending", detail: "Väntar på wp option update." },
  { id: "menu", label: "Meny", status: "pending", detail: "Väntar på REST-konfiguration." },
];

export const defaultMessages: OrchestratorMessage[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    createdAt: new Date(2026, 3, 25, 9, 0).toISOString(),
    content:
      "Börja med en brief. När du klickar Skapa plan bygger jag upp sitemap, design, innehåll, plugins, actions och QA steg för steg.",
  },
];

export function buildDefaultTimeline(): TimelineStep[] {
  return [
    { id: "brief", label: "Brief", status: "running" },
    { id: "plan", label: "Plan", status: "waiting", agentId: "architect" },
    { id: "design", label: "Design", status: "waiting", agentId: "designer" },
    { id: "content", label: "Content", status: "waiting", agentId: "content" },
    { id: "plugins", label: "Plugins", status: "waiting", agentId: "tech" },
    { id: "build", label: "Build", status: "waiting", agentId: "builder" },
    { id: "qa", label: "QA", status: "waiting", agentId: "qa" },
    { id: "result", label: "Resultat", status: "waiting" },
  ];
}

export function buildTemplateSteps(template: ProjectTemplate): WpPlanStep[] {
  return [
    {
      id: "structure",
      title: "Struktur",
      agentId: "architect",
      status: "approved",
      summary: `Skapa en sitemap för ${template.industry.toLowerCase()} med ${template.cta.toLowerCase()} som primär CTA.`,
      output: template.pages,
    },
    {
      id: "design",
      title: "Design",
      agentId: "designer",
      status: "needs-confirmation",
      summary: `Använd Astra, Gutenberg-block och en ${template.tone.toLowerCase()} visuell riktning.`,
      output: ["Astra theme", "Hero + bevisföring", "CTA-sektion på viktiga sidor"],
    },
    {
      id: "content",
      title: "Innehåll",
      agentId: "content",
      status: "draft",
      summary: "Generera sidtexter, rubriker, FAQ och bildprompts från briefen.",
      output: ["Startsiderubrik", "Sidtexter", "3 FAQ-frågor", "Bildprompts"],
    },
    {
      id: "plugins",
      title: "Plugins",
      agentId: "tech",
      status: "needs-confirmation",
      summary: "Installera minsta rimliga pluginset för demo och markera extra funktioner som optional.",
      output: template.plugins.map((plugin) => plugin.slug),
    },
    {
      id: "build",
      title: "Byggkörning",
      agentId: "builder",
      status: "draft",
      summary: "Kör simulerade WP-CLI- och REST-actions i en spårbar ordning.",
      output: ["Installera tema", "Skapa sidor", "Sätt startsida", "Aktivera plugins"],
    },
    {
      id: "qa",
      title: "QA",
      agentId: "qa",
      status: "draft",
      summary: "Verifiera att allt finns på plats och flagga demo-risker innan överlämning.",
      output: ["Sidor skapade", "Plugins aktiva", "Startsida satt", "Meny skapad"],
    },
  ];
}

function action(
  input: Omit<WpAction, "status" | "createdAt" | "logs"> & { riskLevel: RiskLevel },
  now: string,
): WpAction {
  return {
    ...input,
    status: "queued",
    createdAt: now,
    logs: [`Planerad av ${input.agentId}`, `Risk: ${input.riskLevel}`, input.requiresConfirmation ? "Kräver bekräftelse" : "Kan köras automatiskt"],
  };
}

export function buildTemplateActions(template: ProjectTemplate, now = new Date().toISOString()): WpAction[] {
  const pluginActions = template.plugins.map((plugin, index) =>
    action(
      {
        id: `act-plugin-${plugin.slug}`,
        stepId: "plugins",
        agentId: "builder",
        type: "wp_cli",
        target: plugin.slug,
        command: `wp plugin install ${plugin.slug} --activate`,
        durationMs: 1900 + index * 350,
        result: `${plugin.name} installerat för ${plugin.purpose.toLowerCase()}.`,
        payload: { plugin: plugin.slug, activate: true },
        requiresConfirmation: true,
        riskLevel: plugin.slug === "woocommerce" ? "high" : "medium",
        rollbackHint: `wp plugin deactivate ${plugin.slug}`,
      },
      now,
    ),
  );

  return [
    action(
      {
        id: "act-theme",
        stepId: "design",
        agentId: "builder",
        type: "wp_cli",
        target: "astra",
        command: "wp theme install astra --activate",
        durationMs: 1800,
        result: "Tema installerat och aktiverat.",
        payload: { theme: "astra", activate: true },
        requiresConfirmation: true,
        riskLevel: "medium",
        rollbackHint: "wp theme activate twentytwentyfour",
      },
      now,
    ),
    ...pluginActions,
    action(
      {
        id: "act-pages",
        stepId: "build",
        agentId: "builder",
        type: "rest_create",
        target: "/wp-json/wp/v2/pages",
        command: `POST /wp-json/wp/v2/pages x ${template.pages.length}`,
        durationMs: 3200,
        result: `${template.pages.length} sidor skapade från planens sitemap.`,
        payload: { pages: template.pages },
        requiresConfirmation: false,
        riskLevel: "low",
        rollbackHint: "Flytta skapade sidor till trash via REST.",
      },
      now,
    ),
    action(
      {
        id: "act-homepage",
        stepId: "build",
        agentId: "builder",
        type: "wp_cli",
        target: "show_on_front",
        command: "wp option update show_on_front page && wp option update page_on_front 42",
        durationMs: 1400,
        result: `${template.pages[0]} satt som statisk startsida.`,
        payload: { show_on_front: "page", page_on_front: template.pages[0] },
        requiresConfirmation: true,
        riskLevel: "high",
        rollbackHint: "wp option update show_on_front posts",
      },
      now,
    ),
    action(
      {
        id: "act-menu",
        stepId: "build",
        agentId: "builder",
        type: "rest_update",
        target: "primary-menu",
        command: "POST /wp-json/admin-hub/v1/menu primary",
        durationMs: 1200,
        result: "Primärmeny skapad som demo-action.",
        payload: { menu: "primary", items: template.pages },
        requiresConfirmation: false,
        riskLevel: "low",
        rollbackHint: "Ta bort den skapade menyn via REST.",
      },
      now,
    ),
    action(
      {
        id: "act-qa",
        stepId: "qa",
        agentId: "qa",
        type: "qa_check",
        target: "local-wordpress",
        command: "qa.verifySite({ pages, plugins, homepage, menu })",
        durationMs: 1700,
        result: "QA klar med en varning: menyn är simulerad.",
        payload: { checks: ["pages", "plugins", "homepage", "menu"] },
        requiresConfirmation: false,
        riskLevel: "low",
        rollbackHint: "Ingen rollback, QA är read-only.",
      },
      now,
    ),
  ];
}

export function buildTemplatePreview(template: ProjectTemplate): SitePreview {
  return {
    theme: "Astra",
    homepage: template.pages[0] ?? "Hem",
    navigation: template.pages,
    pages: template.pages.map((page, index) => ({
      id: `page-${page.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: page,
      slug: page.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      status: index === 0 ? "created" : "planned",
      sections:
        index === 0
          ? ["Hero", "Tjänsteöversikt", "Förtroendesignaler", "CTA"]
          : ["Sidintro", "Innehållsblock", "Kontakt-CTA"],
      cta: template.cta,
    })),
    plugins: template.plugins.map((plugin, index) => ({
      ...plugin,
      status: index === template.plugins.length - 1 && template.plugins.length > 2 ? "optional" : "planned",
    })),
    nextBackendContract: [
      "Kör WP-CLI-actions med explicit working directory.",
      "Skapa sidor via WordPress REST API.",
      "Spara action-resultat och rollback metadata.",
      "Kör QA som read-only verifiering efter build.",
    ],
  };
}

export function buildEmptyPreview(): SitePreview {
  return {
    theme: "Inte valt",
    homepage: "Inte satt",
    navigation: [],
    pages: [],
    plugins: [],
    nextBackendContract: [
      "Plan-runner skapar först sitemap och beslut.",
      "Action queue skapas efter godkänd plan.",
      "Build-runner uppdaterar preview stegvis.",
      "QA-runner verifierar slutresultatet sist.",
    ],
  };
}

export function buildDefaultDecisionCards(now = new Date().toISOString()): DecisionCard[] {
  return [
    {
      id: "decision-design",
      title: "Godkänn designriktning",
      description: "Lås tema, blockstruktur och CTA-princip innan byggkörningen.",
      action: "accept",
      status: "open",
      targetStepId: "design",
      createdAt: now,
    },
    {
      id: "decision-plugin-cache",
      title: "Markera extra plugin som optional",
      description: "Håll första körningen lättare och låt cache/bokning vara tillval i demon.",
      action: "mark_optional",
      status: "open",
      targetStepId: "plugins",
      pluginSlug: "wp-super-cache",
      createdAt: now,
    },
  ];
}

export function buildWorkspaceFromTemplate(templateId = "hair-salon"): WpOrchestratorWorkspace {
  const template = projectTemplates.find((entry) => entry.id === templateId) ?? projectTemplates[0];
  return {
    flowState: "review",
    projectTemplateId: template.id,
    projectName: `Demo: ${template.name}`,
    brief: template.brief,
    industry: template.industry,
    targetAudience: template.targetAudience,
    siteGoal: template.siteGoal,
    progress: 0,
    runState: "ready",
    timeline: buildDefaultTimeline().map((step) => ({
      ...step,
      status:
        step.id === "brief" || step.id === "plan"
          ? "completed"
          : step.id === "design" || step.id === "plugins"
            ? "needs_confirmation"
            : "waiting",
    })),
    steps: buildTemplateSteps(template),
    actions: buildTemplateActions(template),
    qaChecks: defaultQaChecks,
    messages: defaultMessages,
    decisionCards: buildDefaultDecisionCards(),
    sitePreview: buildTemplatePreview(template),
    settings: defaultSettings,
  };
}

export function buildBlankWorkspace(): WpOrchestratorWorkspace {
  return {
    flowState: "empty",
    projectTemplateId: "",
    projectName: "",
    brief: "",
    industry: "",
    targetAudience: "",
    siteGoal: "",
    progress: 0,
    runState: "idle",
    timeline: buildDefaultTimeline(),
    steps: [],
    actions: [],
    qaChecks: [],
    messages: defaultMessages,
    decisionCards: [],
    sitePreview: buildEmptyPreview(),
    settings: defaultSettings,
  };
}

export const defaultWorkspace: WpOrchestratorWorkspace = buildBlankWorkspace();

export const quickPrompts = [
  "Granska planen",
  "Lägg till bokningsfunktion",
  "Förenkla pluginval",
  "Visa nästa backend-kontrakt",
];

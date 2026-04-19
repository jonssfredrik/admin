import {
  Bell,
  Clock,
  EyeOff,
  FormInput,
  GitBranch,
  Globe,
  Mail,
  Plug,
  RotateCw,
  Shield,
  Sparkles,
  Split,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type NodeKind = "trigger" | "agent" | "logic" | "tool" | "guardrail" | "output";
export type WFStatus = "active" | "draft" | "paused";

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  config?: { label: string; value: string }[];
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  status: WFStatus;
  trigger: string;
  owner: string;
  version: string;
  lastSaved: string;
  updatedAt: string;
  lastRun: string;
  runs30d: number;
  successRate: number;
  accent: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

const onboarding: WorkflowTemplate = {
  id: "onboarding",
  name: "Onboarding av ny sajt",
  description: "Installera baspaket, kör SEO-analys och skicka välkomstmail",
  status: "active",
  trigger: "Webhook · site.created",
  owner: "Fredrik",
  version: "v1.4",
  lastSaved: "3 min sedan",
  updatedAt: "3 min sedan",
  lastRun: "12 min sedan",
  runs30d: 28,
  successRate: 96.4,
  accent: "from-blue-500/20 via-violet-500/20 to-emerald-500/20",
  nodes: [
    {
      id: "n1",
      kind: "trigger",
      icon: Zap,
      title: "Ny sajt skapad",
      subtitle: "JetWP · webhook-event",
      x: 40,
      y: 220,
      config: [{ label: "Event", value: "site.created" }, { label: "Filter", value: "plan ≥ Business" }],
    },
    {
      id: "n2",
      kind: "tool",
      icon: Plug,
      title: "Installera baspaket",
      subtitle: "Yoast, WP Rocket, Wordfence",
      x: 340,
      y: 90,
      config: [{ label: "Plugins", value: "3 st" }, { label: "Tema", value: "Kadence" }],
    },
    {
      id: "n3",
      kind: "agent",
      icon: Sparkles,
      title: "SEO-analys",
      subtitle: "GPT-4o genererar metabeskrivningar",
      x: 340,
      y: 350,
      config: [{ label: "Modell", value: "gpt-4o" }, { label: "Max tokens", value: "1024" }],
    },
    {
      id: "n4",
      kind: "logic",
      icon: GitBranch,
      title: "Uppdateringar tillgängliga?",
      subtitle: "If / else",
      x: 660,
      y: 220,
      config: [{ label: "Uttryck", value: "site.updatesAvailable > 0" }],
    },
    {
      id: "n5",
      kind: "guardrail",
      icon: Shield,
      title: "Kräv färsk backup",
      subtitle: "Max 24h gammal",
      x: 980,
      y: 90,
      config: [{ label: "Max ålder", value: "24h" }],
    },
    {
      id: "n6",
      kind: "tool",
      icon: RotateCw,
      title: "Kör uppdateringar",
      subtitle: "wp-cli unattended",
      x: 1280,
      y: 90,
      config: [{ label: "Timeout", value: "5 min" }],
    },
    {
      id: "n7",
      kind: "output",
      icon: Bell,
      title: "Välkomstmail + Slack",
      subtitle: "Notifiera ägare och ops-team",
      x: 1280,
      y: 350,
      config: [{ label: "Kanal", value: "#jetwp-ops" }],
    },
  ],
  edges: [
    { id: "e1", from: "n1", to: "n2" },
    { id: "e2", from: "n1", to: "n3" },
    { id: "e3", from: "n2", to: "n4" },
    { id: "e4", from: "n3", to: "n4" },
    { id: "e5", from: "n4", to: "n5", label: "Ja" },
    { id: "e6", from: "n4", to: "n7", label: "Nej" },
    { id: "e7", from: "n5", to: "n6" },
    { id: "e8", from: "n6", to: "n7" },
  ],
};

const securityScan: WorkflowTemplate = {
  id: "security-scan",
  name: "Säkerhetsskanning varje natt",
  description: "Wordfence-scan över alla sajter, larmar vid kritiska fynd",
  status: "active",
  trigger: "Cron · 0 2 * * *",
  owner: "Fredrik",
  version: "v2.0",
  lastSaved: "igår",
  updatedAt: "igår",
  lastRun: "8 tim sedan",
  runs30d: 30,
  successRate: 100,
  accent: "from-rose-500/20 via-amber-500/20 to-emerald-500/20",
  nodes: [
    {
      id: "n1",
      kind: "trigger",
      icon: Clock,
      title: "Varje natt 02:00",
      subtitle: "Cron · 0 2 * * *",
      x: 40,
      y: 220,
      config: [{ label: "Tidzon", value: "Europe/Stockholm" }],
    },
    {
      id: "n2",
      kind: "tool",
      icon: Shield,
      title: "Wordfence-scan",
      subtitle: "Alla sajter · full scan",
      x: 340,
      y: 220,
      config: [{ label: "Omfattning", value: "filer + db" }, { label: "Timeout", value: "30 min" }],
    },
    {
      id: "n3",
      kind: "agent",
      icon: Sparkles,
      title: "Klassificera fynd",
      subtitle: "GPT-4o · severity + åtgärd",
      x: 660,
      y: 220,
      config: [{ label: "Modell", value: "gpt-4o" }],
    },
    {
      id: "n4",
      kind: "logic",
      icon: GitBranch,
      title: "Kritisk nivå?",
      subtitle: "If severity ≥ hög",
      x: 980,
      y: 220,
      config: [{ label: "Uttryck", value: "severity in [hög, kritisk]" }],
    },
    {
      id: "n5",
      kind: "output",
      icon: Bell,
      title: "Slack-larm + e-post",
      subtitle: "#security-alerts + ägare",
      x: 1280,
      y: 220,
      config: [{ label: "Mottagare", value: "ops + siteowner" }],
    },
  ],
  edges: [
    { id: "e1", from: "n1", to: "n2" },
    { id: "e2", from: "n2", to: "n3" },
    { id: "e3", from: "n3", to: "n4" },
    { id: "e4", from: "n4", to: "n5", label: "Ja" },
  ],
};

const pluginUpdates: WorkflowTemplate = {
  id: "plugin-updates",
  name: "Auto-uppdatering av plugins",
  description: "Backup → uppdatera → smoke test → rollback vid fel",
  status: "active",
  trigger: "Cron · söndagar 03:00",
  owner: "Astrid L.",
  version: "v3.1",
  lastSaved: "förra veckan",
  updatedAt: "förra veckan",
  lastRun: "2 tim sedan",
  runs30d: 42,
  successRate: 92.8,
  accent: "from-emerald-500/20 via-blue-500/20 to-violet-500/20",
  nodes: [
    {
      id: "n1",
      kind: "trigger",
      icon: Clock,
      title: "Söndagar 03:00",
      subtitle: "Cron · 0 3 * * 0",
      x: 40,
      y: 220,
      config: [{ label: "Schema", value: "veckovis" }],
    },
    { id: "n2", kind: "tool", icon: Plug, title: "Hämta plugins m. update", subtitle: "wp-cli plugin list --update=available", x: 340, y: 220 },
    {
      id: "n3",
      kind: "guardrail",
      icon: Shield,
      title: "Skapa backup",
      subtitle: "Full snapshot innan ändring",
      x: 640,
      y: 220,
      config: [{ label: "Typ", value: "full" }, { label: "Retention", value: "7 dagar" }],
    },
    { id: "n4", kind: "tool", icon: RotateCw, title: "Kör uppdateringar", subtitle: "wp-cli plugin update --all", x: 940, y: 220 },
    {
      id: "n5",
      kind: "tool",
      icon: Globe,
      title: "Smoke test",
      subtitle: "HTTP 200 på hemsida + admin",
      x: 1240,
      y: 220,
      config: [{ label: "Endpoints", value: "/, /wp-admin" }],
    },
    { id: "n6", kind: "logic", icon: GitBranch, title: "Allt OK?", subtitle: "If status === 200", x: 1540, y: 220 },
    {
      id: "n7",
      kind: "tool",
      icon: RotateCw,
      title: "Rollback",
      subtitle: "Återställ från backup",
      x: 1840,
      y: 90,
      config: [{ label: "Källa", value: "senaste snapshot" }],
    },
    { id: "n8", kind: "output", icon: Bell, title: "Larmrapport", subtitle: "Slack · #jetwp-ops", x: 1840, y: 350 },
    { id: "n9", kind: "output", icon: Bell, title: "OK-rapport", subtitle: "Slack · #jetwp-ops", x: 2140, y: 220 },
  ],
  edges: [
    { id: "e1", from: "n1", to: "n2" },
    { id: "e2", from: "n2", to: "n3" },
    { id: "e3", from: "n3", to: "n4" },
    { id: "e4", from: "n4", to: "n5" },
    { id: "e5", from: "n5", to: "n6" },
    { id: "e6", from: "n6", to: "n9", label: "Ja" },
    { id: "e7", from: "n6", to: "n7", label: "Nej" },
    { id: "e8", from: "n7", to: "n8" },
  ],
};

const contentTriage: WorkflowTemplate = {
  id: "content-triage",
  name: "Content-triage med AI",
  description: "Klassificera inkommande formulärinlägg och dirigera till rätt team",
  status: "active",
  trigger: "Formulär · Kontakt",
  owner: "Olof P.",
  version: "v1.2",
  lastSaved: "för 2 dagar sedan",
  updatedAt: "för 2 dagar sedan",
  lastRun: "3 min sedan",
  runs30d: 184,
  successRate: 99.5,
  accent: "from-violet-500/20 via-blue-500/20 to-rose-500/20",
  nodes: [
    { id: "n1", kind: "trigger", icon: FormInput, title: "Formulär skickat", subtitle: "Contact Form 7 · kontakt", x: 40, y: 220 },
    {
      id: "n2",
      kind: "guardrail",
      icon: EyeOff,
      title: "Maskera PII",
      subtitle: "Dölj e-post + telefon i loggar",
      x: 340,
      y: 220,
      config: [{ label: "Fält", value: "email, phone" }],
    },
    {
      id: "n3",
      kind: "agent",
      icon: Sparkles,
      title: "Klassificera inlägg",
      subtitle: "GPT-4o · sälj / support / spam",
      x: 640,
      y: 220,
      config: [{ label: "Kategorier", value: "3" }, { label: "Tröskel", value: "0.8" }],
    },
    { id: "n4", kind: "logic", icon: Split, title: "Switch på kategori", subtitle: "Flera grenar", x: 940, y: 220 },
    {
      id: "n5",
      kind: "tool",
      icon: Globe,
      title: "Dirigera till rätt system",
      subtitle: "CRM (sälj) · Helpdesk (support)",
      x: 1240,
      y: 220,
      config: [{ label: "Mål", value: "dynamiskt" }],
    },
    { id: "n6", kind: "output", icon: Bell, title: "Notifiera team", subtitle: "Slack · #sales / #support", x: 1540, y: 220 },
  ],
  edges: [
    { id: "e1", from: "n1", to: "n2" },
    { id: "e2", from: "n2", to: "n3" },
    { id: "e3", from: "n3", to: "n4" },
    { id: "e4", from: "n4", to: "n5" },
    { id: "e5", from: "n5", to: "n6" },
  ],
};

const sslRenewal: WorkflowTemplate = {
  id: "ssl-renewal",
  name: "SSL-förnyelse påminnelse",
  description: "Notifiera ägare 14 dagar innan cert går ut",
  status: "paused",
  trigger: "Cron · dagligen 08:00",
  owner: "Fredrik",
  version: "v1.0",
  lastSaved: "för 3 veckor sedan",
  updatedAt: "för 3 veckor sedan",
  lastRun: "för 12 dagar sedan",
  runs30d: 0,
  successRate: 100,
  accent: "from-amber-500/20 via-rose-500/20 to-blue-500/20",
  nodes: [
    { id: "n1", kind: "trigger", icon: Clock, title: "Dagligen 08:00", subtitle: "Cron · 0 8 * * *", x: 40, y: 220 },
    {
      id: "n2",
      kind: "tool",
      icon: Globe,
      title: "Hämta SSL-status",
      subtitle: "För alla sajter i JetWP",
      x: 340,
      y: 220,
      config: [{ label: "Källa", value: "certbot + api" }],
    },
    { id: "n3", kind: "logic", icon: GitBranch, title: "< 14 dagar kvar?", subtitle: "If sslDays < 14", x: 640, y: 220 },
    {
      id: "n4",
      kind: "output",
      icon: Mail,
      title: "Skicka påminnelse",
      subtitle: "E-post till sajtägare",
      x: 940,
      y: 220,
      config: [{ label: "Mall", value: "ssl-renewal-reminder" }],
    },
  ],
  edges: [
    { id: "e1", from: "n1", to: "n2" },
    { id: "e2", from: "n2", to: "n3" },
    { id: "e3", from: "n3", to: "n4", label: "Ja" },
  ],
};

const uptimeAlert: WorkflowTemplate = {
  id: "uptime-alert",
  name: "Uptime-larm till Slack",
  description: "Pingar varje sajt var 60:e sekund och larmar vid fel",
  status: "draft",
  trigger: "Cron · var 60:e sek",
  owner: "Greta T.",
  version: "v0.3",
  lastSaved: "idag",
  updatedAt: "idag",
  lastRun: "aldrig körts",
  runs30d: 0,
  successRate: 0,
  accent: "from-emerald-500/20 via-amber-500/20 to-rose-500/20",
  nodes: [
    { id: "n1", kind: "trigger", icon: Clock, title: "Var 60:e sekund", subtitle: "Cron · */1 * * * *", x: 40, y: 220 },
    {
      id: "n2",
      kind: "tool",
      icon: Globe,
      title: "Pinga alla sajter",
      subtitle: "HTTP HEAD · timeout 5s",
      x: 340,
      y: 220,
      config: [{ label: "Timeout", value: "5s" }, { label: "Parallellt", value: "ja" }],
    },
    { id: "n3", kind: "logic", icon: GitBranch, title: "Status ≠ 200?", subtitle: "Fel upptäckt", x: 640, y: 220 },
    {
      id: "n4",
      kind: "guardrail",
      icon: Shield,
      title: "Dedupe larm",
      subtitle: "Max 1 larm/sajt per 5 min",
      x: 940,
      y: 220,
      config: [{ label: "Fönster", value: "5 min" }],
    },
    { id: "n5", kind: "output", icon: Bell, title: "Slack-larm", subtitle: "#jetwp-ops · @oncall", x: 1240, y: 220 },
  ],
  edges: [
    { id: "e1", from: "n1", to: "n2" },
    { id: "e2", from: "n2", to: "n3" },
    { id: "e3", from: "n3", to: "n4", label: "Ja" },
    { id: "e4", from: "n4", to: "n5" },
  ],
};

export const templates: Record<string, WorkflowTemplate> = {
  onboarding,
  "security-scan": securityScan,
  "plugin-updates": pluginUpdates,
  "content-triage": contentTriage,
  "ssl-renewal": sslRenewal,
  "uptime-alert": uptimeAlert,
};

export const templateList: WorkflowTemplate[] = [
  onboarding,
  securityScan,
  pluginUpdates,
  contentTriage,
  sslRenewal,
  uptimeAlert,
];

export function thumbnailIcons(t: WorkflowTemplate): LucideIcon[] {
  const seen = new Set<LucideIcon>();
  const out: LucideIcon[] = [];
  for (const n of t.nodes) {
    if (!seen.has(n.icon)) {
      seen.add(n.icon);
      out.push(n.icon);
    }
  }
  return out.slice(0, 5);
}

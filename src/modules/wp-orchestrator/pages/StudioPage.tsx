"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Layers3,
  Loader2,
  MessageSquare,
  PanelRight,
  PanelRightClose,
  Play,
  RefreshCcw,
  Send,
  Sparkles,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Table";
import {
  buildDefaultDecisionCards,
  buildDefaultTimeline,
  buildEmptyPreview,
  buildTemplateActions,
  buildTemplatePreview,
  buildTemplateSteps,
  projectTemplates,
  quickPrompts,
  wpAgents,
} from "@/modules/wp-orchestrator/data";
import { useWpOrchestratorWorkspace } from "@/modules/wp-orchestrator/lib/useWpOrchestratorWorkspace";
import type {
  ActionStatus,
  DecisionAction,
  DecisionCard,
  OrchestratorMessage,
  ProjectTemplate,
  RiskLevel,
  StepStatus,
  WpAction,
} from "@/modules/wp-orchestrator/types";

const stepTone: Record<StepStatus, "neutral" | "success" | "warning" | "danger"> = {
  draft: "neutral",
  "needs-confirmation": "warning",
  approved: "success",
  running: "warning",
  completed: "success",
  blocked: "danger",
};

const stepLabel: Record<StepStatus, string> = {
  draft: "Utkast",
  "needs-confirmation": "Bekräfta",
  approved: "Godkänd",
  running: "Körs",
  completed: "Klar",
  blocked: "Blockerad",
};

const actionTone: Record<ActionStatus, "neutral" | "success" | "warning" | "danger"> = {
  queued: "neutral",
  running: "warning",
  completed: "success",
  failed: "danger",
};

const riskTone: Record<RiskLevel, "neutral" | "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const decisionLabel: Record<DecisionAction, string> = {
  accept: "Acceptera",
  revise: "Ändra",
  add_step: "Lägg till steg",
  remove_plugin: "Ta bort plugin",
  add_plugin: "Lägg till plugin",
  mark_optional: "Markera optional",
};

function nowMessage(role: OrchestratorMessage["role"], content: string): OrchestratorMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function nowDecision(input: Omit<DecisionCard, "id" | "status" | "createdAt">): DecisionCard {
  return {
    ...input,
    id: `decision-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "open",
    createdAt: new Date().toISOString(),
  };
}

function replyForPrompt(input: string) {
  const text = input.toLowerCase();
  if (text.includes("bokning")) {
    return {
      content:
        "Jag föreslår att bokning läggs in som ett styrbart tillval. I en riktig backend skulle det bli ett pluginval + config-action, men i demo låser vi det som beslut först.",
      decision: nowDecision({
        title: "Lägg till bokningsfunktion",
        description: "Lägg till bokning i pluginsteget och previewn utan att göra riktig installation.",
        action: "add_plugin",
        targetStepId: "plugins",
        pluginSlug: "simply-schedule-appointments",
      }),
    };
  }
  if (text.includes("plugin")) {
    return {
      content:
        "Pluginplanen kan göras lättare. Jag föreslår att extra plugin markeras optional och att första körningen fokuserar på kontakt + SEO.",
      decision: nowDecision({
        title: "Förenkla pluginval",
        description: "Markera det sista pluginet som optional och minska risk i första byggkörningen.",
        action: "mark_optional",
        targetStepId: "plugins",
        pluginSlug: "optional-last",
      }),
    };
  }
  if (text.includes("backend")) {
    return {
      content:
        "Nästa backend-kontrakt är tydligt: kör WP-CLI i explicit working directory, skapa sidor via REST, spara action-resultat och kör QA read-only efteråt.",
    };
  }
  if (text.includes("plan")) {
    return {
      content:
        "Planen är korrekt ordnad: struktur före design, design före innehåll, plugins före byggkörning och QA sist. Jag föreslår att du låser designsteget innan simulering.",
      decision: nowDecision({
        title: "Lås planens designsteg",
        description: "Godkänn designriktningen så byggkörningen får stabil input.",
        action: "accept",
        targetStepId: "design",
      }),
    };
  }
  return {
    content:
      "Jag har noterat styrningen. Jag håller det som ett beslut i arbetsytan först, sedan blir det en deterministisk action i loggen.",
  };
}

function setTimelineStatus(
  timeline: ReturnType<typeof buildDefaultTimeline>,
  updates: Partial<Record<ReturnType<typeof buildDefaultTimeline>[number]["id"], ReturnType<typeof buildDefaultTimeline>[number]["status"]>>,
) {
  return timeline.map((step) => ({
    ...step,
    status: updates[step.id] ?? step.status,
  }));
}

export function StudioPage() {
  const { workspace, update, reset, hydrated } = useWpOrchestratorWorkspace();
  const toast = useToast();
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [orchestratorCollapsed, setOrchestratorCollapsed] = useState(false);
  const runTimer = useRef<number | null>(null);

  const completedActions = workspace.actions.filter((action) => action.status === "completed").length;
  const activeAction = workspace.actions.find((action) => action.status === "running");
  const confirmationCount = workspace.steps.filter((step) => step.status === "needs-confirmation").length;
  const passedQa = workspace.qaChecks.filter((check) => check.status === "passed").length;
  const openDecisions = workspace.decisionCards.filter((card) => card.status === "open");
  const activeTemplate = projectTemplates.find((template) => template.id === workspace.projectTemplateId) ?? projectTemplates[0];

  const agentsById = useMemo(() => new Map(wpAgents.map((agent) => [agent.id, agent])), []);

  useEffect(() => {
    return () => {
      if (runTimer.current) window.clearInterval(runTimer.current);
    };
  }, []);

  function patchBrief(key: "projectName" | "brief" | "industry" | "targetAudience" | "siteGoal", value: string) {
    update((current) => ({ ...current, flowState: current.flowState === "empty" ? "briefing" : current.flowState, [key]: value }));
  }

  function switchTemplate(templateId: string) {
    const template = projectTemplates.find((entry) => entry.id === templateId);
    if (!template) return;
    update((current) => ({
      ...current,
      projectTemplateId: template.id,
      projectName: `Demo: ${template.name}`,
      brief: template.brief,
      industry: template.industry,
      targetAudience: template.targetAudience,
      siteGoal: template.siteGoal,
      flowState: "briefing",
      progress: 0,
      runState: "idle",
      timeline: buildDefaultTimeline().map((step) => (step.id === "brief" ? { ...step, status: "running" } : step)),
      steps: [],
      actions: [],
      qaChecks: [],
      decisionCards: [],
      sitePreview: buildEmptyPreview(),
      messages: [
        ...current.messages,
        nowMessage("assistant", `Jag fyllde briefen från mallen ${template.name}. Klicka Skapa plan så bygger jag upp planen steg för steg.`),
      ],
    }));
    toast.success("Brief preset laddad", template.name);
  }

  function approveStep(stepId: string) {
    update((current) => ({
      ...current,
      runState: current.runState === "idle" ? "ready" : current.runState,
      steps: current.steps.map((step) => (step.id === stepId ? { ...step, status: "approved" } : step)),
    }));
    toast.success("Steg godkänt", "Orkestratorn kan använda steget i byggplanen.");
  }

  function resetDemo() {
    if (runTimer.current) window.clearInterval(runTimer.current);
    reset();
    toast.info("Demo återställd", "Workspace, chat och actions är tillbaka på startläget.");
  }

  function applyDecision(card: DecisionCard) {
    update((current) => {
      const lastPlugin = current.sitePreview.plugins[current.sitePreview.plugins.length - 1]?.slug;
      const pluginSlug = card.pluginSlug === "optional-last" ? lastPlugin : card.pluginSlug;
      const nextMessages = [
        ...current.messages,
        nowMessage("assistant", `Beslut accepterat: ${card.title}. Jag uppdaterade plan, preview och action-kontrakt i frontend-state.`),
      ];

      return {
        ...current,
        messages: nextMessages,
        decisionCards: current.decisionCards.map((item) => (item.id === card.id ? { ...item, status: "accepted" } : item)),
        steps: current.steps.map((step) => {
          if (card.action === "accept" && step.id === card.targetStepId) return { ...step, status: "approved" };
          if (card.action === "add_plugin" && step.id === "plugins" && pluginSlug) {
            return { ...step, status: "approved", output: Array.from(new Set([...step.output, pluginSlug])) };
          }
          if (card.action === "mark_optional" && step.id === "plugins") return { ...step, status: "approved" };
          if (card.action === "add_step" && step.id === "build") return { ...step, output: Array.from(new Set([...step.output, "Extra verifieringssteg"])) };
          return step;
        }),
        sitePreview: {
          ...current.sitePreview,
          plugins:
            card.action === "add_plugin" && pluginSlug && !current.sitePreview.plugins.some((plugin) => plugin.slug === pluginSlug)
              ? [
                  ...current.sitePreview.plugins,
                  {
                    slug: pluginSlug,
                    name: "Bokningsplugin",
                    purpose: "Interaktiv bokning som demo-tillägg",
                    status: "planned",
                  },
                ]
              : current.sitePreview.plugins.map((plugin) =>
                  card.action === "mark_optional" && (!pluginSlug || plugin.slug === pluginSlug)
                    ? { ...plugin, status: "optional" as const }
                    : plugin,
                ),
        },
        actions: current.actions.map((action) =>
          card.action === "mark_optional" && pluginSlug && action.target === pluginSlug
            ? {
                ...action,
                requiresConfirmation: false,
                riskLevel: "low",
                logs: [...action.logs, "Markerad optional via orkestratorbeslut."],
              }
            : action,
        ),
      };
    });
    toast.success("Beslut accepterat", card.title);
  }

  function dismissDecision(card: DecisionCard) {
    update((current) => ({
      ...current,
      decisionCards: current.decisionCards.map((item) => (item.id === card.id ? { ...item, status: "dismissed" } : item)),
    }));
  }

  function sendChat(text = chatInput) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setChatInput("");
    setIsTyping(true);
    update((current) => ({
      ...current,
      messages: [...current.messages, nowMessage("user", trimmed)],
    }));

    window.setTimeout(() => {
      const response = replyForPrompt(trimmed);
      update((current) => ({
        ...current,
        messages: [...current.messages, nowMessage("assistant", response.content)],
        decisionCards: response.decision ? [response.decision, ...current.decisionCards] : current.decisionCards,
      }));
      setIsTyping(false);
    }, 700);
  }

  function startPlanning() {
    const template =
      projectTemplates.find((entry) => entry.id === workspace.projectTemplateId) ?? {
        id: "custom-brief",
        name: "Egen brief",
        industry: workspace.industry || "Lokalt företag",
        targetAudience: workspace.targetAudience || "Besökare som behöver tydlig information",
        siteGoal: workspace.siteGoal || "Skapa fler kontaktförfrågningar",
        brief: workspace.brief,
        pages: ["Hem", "Tjänster", "Om oss", "Kontakt"],
        plugins: [
          { slug: "contact-form-7", name: "Contact Form 7", purpose: "Kontaktförfrågningar" },
          { slug: "wordpress-seo", name: "Yoast SEO", purpose: "Grundläggande SEO" },
        ],
        cta: "Kontakta oss",
        tone: "Tydlig, professionell och snabb",
      };
    if (!workspace.brief.trim() || workspace.flowState === "planning") return;

    if (runTimer.current) window.clearInterval(runTimer.current);
    update((current) => ({
      ...current,
      flowState: "planning",
      runState: "planning",
      progress: 5,
      timeline: setTimelineStatus(buildDefaultTimeline(), { brief: "completed", plan: "running" }),
      steps: [],
      actions: [],
      qaChecks: [],
      decisionCards: [],
      sitePreview: buildEmptyPreview(),
      messages: [...current.messages, nowMessage("assistant", "Jag börjar med briefen och bygger upp plan, design, innehåll, plugins, actions och QA i ordning.")],
    }));

    const planSteps = buildTemplateSteps(template);
    const actions = buildTemplateActions(template);
    const preview = buildTemplatePreview(template);
    let index = 0;
    const phases = [
      {
        progress: 18,
        message: "Architect-agenten har skapat målbild och sitemap.",
        timeline: { plan: "completed", design: "running" } as const,
        apply: (current: typeof workspace) => ({
          ...current,
          steps: [planSteps[0]],
          sitePreview: { ...current.sitePreview, navigation: preview.navigation, pages: preview.pages.map((page) => ({ ...page, status: "planned" as const })) },
        }),
      },
      {
        progress: 32,
        message: "Designer-agenten föreslår tema, blockstruktur och CTA-princip. Jag pausar för beslut.",
        timeline: { design: "needs_confirmation" } as const,
        apply: (current: typeof workspace) => ({
          ...current,
          steps: [...current.steps, planSteps[1]],
          decisionCards: [buildDefaultDecisionCards()[0]],
          sitePreview: { ...current.sitePreview, theme: preview.theme, homepage: preview.homepage },
        }),
      },
      {
        progress: 46,
        message: "Content-agenten har lagt upp sidsektioner, CTA och innehållsstruktur.",
        timeline: { design: "needs_confirmation", content: "completed", plugins: "running" } as const,
        apply: (current: typeof workspace) => ({
          ...current,
          steps: [...current.steps, planSteps[2]],
          sitePreview: { ...current.sitePreview, pages: preview.pages },
        }),
      },
      {
        progress: 60,
        message: "Plugin/Tech-agenten har skapat pluginförslag med risknivåer och bekräftelsekrav.",
        timeline: { plugins: "needs_confirmation" } as const,
        apply: (current: typeof workspace) => ({
          ...current,
          steps: [...current.steps, planSteps[3]],
          decisionCards: [buildDefaultDecisionCards()[1], ...current.decisionCards],
          sitePreview: { ...current.sitePreview, plugins: preview.plugins },
        }),
      },
      {
        progress: 78,
        message: "Builder-agenten har översatt planen till backend-nära actions.",
        timeline: { build: "completed", qa: "running" } as const,
        apply: (current: typeof workspace) => ({
          ...current,
          steps: [...current.steps, planSteps[4]],
          actions,
        }),
      },
      {
        progress: 100,
        message: "QA-agenten har förberett checks. Planen är redo för simulerad byggkörning.",
        timeline: { qa: "completed", result: "waiting" } as const,
        apply: (current: typeof workspace) => ({
          ...current,
          flowState: "review" as const,
          runState: "ready" as const,
          steps: [...current.steps, planSteps[5]],
          qaChecks: [
            { id: "pages", label: "Sidor", status: "pending" as const, detail: "Väntar på byggkörning." },
            { id: "plugins", label: "Plugins", status: "pending" as const, detail: "Väntar på installation." },
            { id: "homepage", label: "Startsida", status: "pending" as const, detail: "Väntar på wp option update." },
            { id: "menu", label: "Meny", status: "pending" as const, detail: "Väntar på REST-konfiguration." },
          ],
        }),
      },
    ];

    runTimer.current = window.setInterval(() => {
      const phase = phases[index];
      if (!phase) {
        if (runTimer.current) window.clearInterval(runTimer.current);
        return;
      }
      update((current) => {
        const patched = phase.apply(current);
        return {
          ...patched,
          progress: phase.progress,
          timeline: setTimelineStatus(patched.timeline, phase.timeline),
          messages: [...patched.messages, nowMessage("assistant", phase.message)],
        };
      });
      index += 1;
    }, 850);
  }

  function startPipeline() {
    if (workspace.runState === "running" || workspace.actions.length === 0) return;
    const now = new Date().toISOString();
    update((current) => ({
      ...current,
      flowState: "building",
      runState: "running",
      progress: 0,
      timeline: setTimelineStatus(current.timeline, { build: "running", result: "waiting" }),
      actions: current.actions.map((action) => ({ ...action, status: "queued", createdAt: now, logs: [...action.logs, "Köad för simulerad körning."] })),
      steps: current.steps.map((step) =>
        step.status === "needs-confirmation" ? { ...step, status: "approved" } : step.status === "completed" ? { ...step, status: "approved" } : step,
      ),
      qaChecks: current.qaChecks.map((check) => ({ ...check, status: "pending", detail: "Väntar på simulerad körning." })),
      messages: [
        ...current.messages,
        nowMessage("assistant", "Jag startar den simulerade byggkörningen. Inga externa kommandon körs; action-loggen visar exakt vad en backend senare skulle kunna göra."),
      ],
    }));

    let index = -1;
    if (runTimer.current) window.clearInterval(runTimer.current);
    runTimer.current = window.setInterval(() => {
      update((current) => {
        const previous = index >= 0 ? current.actions[index] : null;
        index += 1;
        if (index >= current.actions.length) {
          if (runTimer.current) window.clearInterval(runTimer.current);
          return {
            ...current,
            flowState: "completed",
            runState: "completed",
            progress: 100,
            timeline: setTimelineStatus(current.timeline, { build: "completed", qa: "completed", result: "completed" }),
            steps: current.steps.map((step) => ({ ...step, status: "completed" as const })),
            actions: current.actions.map((action) => ({
              ...action,
              status: "completed" as const,
              logs: action.logs.includes("Slutförd i mock-runner.") ? action.logs : [...action.logs, "Slutförd i mock-runner."],
            })),
            sitePreview: {
              ...current.sitePreview,
              pages: current.sitePreview.pages.map((page) => ({ ...page, status: "verified" })),
              plugins: current.sitePreview.plugins.map((plugin) => (plugin.status === "optional" ? plugin : { ...plugin, status: "active" })),
            },
            qaChecks: [
              { id: "pages", label: "Sidor", status: "passed", detail: `${current.sitePreview.pages.length} sidor finns i previewn och är verifierade.` },
              { id: "plugins", label: "Plugins", status: "passed", detail: "Planerade plugins är aktiva eller markerade optional." },
              { id: "homepage", label: "Startsida", status: "passed", detail: `${current.sitePreview.homepage} är satt som statisk startsida.` },
              { id: "menu", label: "Meny", status: "warning", detail: "Meny skapad som demo-action; riktig WP-meny kräver backend senare." },
            ],
            messages: [...current.messages, nowMessage("assistant", "Byggkörningen är klar. Resultatvyn visar skapade sidor, plugins, tema och QA-status.")],
          };
        }

        const nextActions = current.actions.map((action, actionIndex) => {
          if (previous && action.id === previous.id) {
            return { ...action, status: "completed" as const, logs: [...action.logs, "Slutförd i mock-runner."] };
          }
          if (actionIndex === index) {
            return { ...action, status: "running" as const, logs: [...action.logs, `Startade ${new Date().toLocaleTimeString("sv-SE")}.`] };
          }
          return action;
        });
        const runningAction = nextActions[index];
        return {
          ...current,
          progress: Math.round(((index + 1) / current.actions.length) * 92),
          flowState: runningAction.stepId === "qa" ? "qa" : "building",
          timeline: setTimelineStatus(current.timeline, {
            build: runningAction.stepId === "qa" ? "completed" : "running",
            qa: runningAction.stepId === "qa" ? "running" : current.timeline.find((step) => step.id === "qa")?.status ?? "waiting",
          }),
          actions: nextActions,
          steps: current.steps.map((step) =>
            step.id === runningAction.stepId ? { ...step, status: "running" } : step.status === "running" ? { ...step, status: "completed" } : step,
          ),
        };
      });
    }, 950);
  }

  function retryAction(action: WpAction) {
    update((current) => ({
      ...current,
      actions: current.actions.map((item) =>
        item.id === action.id
          ? { ...item, status: "completed", createdAt: new Date().toISOString(), logs: [...item.logs, "Omsimulerad från Studio."] }
          : item,
      ),
      messages: [...current.messages, nowMessage("assistant", `Jag simulerade om action: ${action.command}`)],
    }));
    toast.success("Action simulerad igen", action.target);
  }

  return (
    <div className="-mx-8 -my-6 flex min-h-[calc(100vh-56px)] flex-col xl:flex-row">
      <div className="min-w-0 flex-1 space-y-8 px-8 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="WP Orchestrator"
          subtitle="Interaktiv frontend-demo för AI-styrd lokal WordPress-utveckling med agents, actionlista och QA."
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={resetDemo}>
            <RefreshCcw size={14} className="mr-1.5" />
            Återställ demo
          </Button>
          <Button onClick={startPlanning} disabled={!hydrated || !workspace.brief.trim() || workspace.flowState === "planning" || workspace.runState === "running"}>
            {workspace.flowState === "planning" ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Sparkles size={14} className="mr-1.5" />}
            Skapa plan
          </Button>
          <Button onClick={startPipeline} disabled={!hydrated || workspace.actions.length === 0 || workspace.runState === "running"}>
            {workspace.runState === "running" ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Play size={14} className="mr-1.5" />}
            Starta simulering
          </Button>
        </div>
      </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projektstatus" value={workspace.flowState === "empty" ? "Blankt" : workspace.runState === "completed" ? "Klar" : workspace.runState === "running" || workspace.flowState === "planning" ? "Körs" : "Redo"} hint={`${workspace.progress}% pipeline-progress`} />
        <StatCard label="Plansteg" value={`${workspace.steps.filter((step) => step.status === "approved" || step.status === "completed").length}/${workspace.steps.length}`} hint={confirmationCount > 0 ? `${confirmationCount} steg väntar på bekräftelse` : "Alla kritiska steg kan köras"} />
        <StatCard label="Beslut" value={String(openDecisions.length)} hint="Öppna orkestratorförslag" />
        <StatCard label="QA" value={`${passedQa}/${workspace.qaChecks.length}`} hint="Endast frontend-demo, ingen riktig WP-kontroll" />
      </div>

        <TimelineStrip timeline={workspace.timeline} />

        <div className="space-y-4">
          <Card className="!p-0">
            <div className="border-b p-5">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Workflow size={16} />
                Brief och mall
              </div>
              <p className="mt-1 text-sm text-muted">Byt mall för att regenerera plan, actions och resultatpreview.</p>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div>
                <Label>Projektmall</Label>
                <select
                  value={workspace.projectTemplateId}
                  onChange={(event) => switchTemplate(event.target.value)}
                  className="h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                >
                  <option value="">Välj brief preset...</option>
                  {projectTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Projektnamn</Label>
                <Input value={workspace.projectName} onChange={(event) => patchBrief("projectName", event.target.value)} />
              </div>
              <div>
                <Label>Bransch</Label>
                <Input value={workspace.industry} onChange={(event) => patchBrief("industry", event.target.value)} />
              </div>
              <div>
                <Label>Mål</Label>
                <Input value={workspace.siteGoal} onChange={(event) => patchBrief("siteGoal", event.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label>Brief</Label>
                <textarea
                  value={workspace.brief}
                  onChange={(event) => patchBrief("brief", event.target.value)}
                  className="min-h-[92px] w-full rounded-lg border bg-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
                />
              </div>
              <div className="md:col-span-2 rounded-xl border bg-bg/40 p-3 text-sm text-muted">
                {workspace.projectTemplateId ? (
                  <>
                    Aktiv preset: <span className="font-medium text-fg">{activeTemplate.name}</span> · {activeTemplate.tone}
                  </>
                ) : (
                  "Ingen preset vald. Skriv en egen brief eller välj en preset ovan."
                )}
              </div>
            </div>
          </Card>

          <Card className="!p-0">
            <div className="border-b p-5">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <ClipboardCheck size={16} />
                Nedbrytning av steg
              </div>
              <p className="mt-1 text-sm text-muted">Stegen motsvarar vad en backend senare skulle köra genom WP-CLI och REST.</p>
            </div>
            <div className="divide-y">
              {workspace.steps.length === 0 && (
                <div className="p-5 text-sm text-muted">
                  Planen är tom. Skriv eller välj en brief och klicka Skapa plan för att låta orkestratorn bygga upp stegen.
                </div>
              )}
              {workspace.steps.map((step) => {
                const agent = agentsById.get(step.agentId);
                return (
                  <div key={step.id} className="p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-semibold">{step.title}</div>
                          <Badge tone={stepTone[step.status]}>{stepLabel[step.status]}</Badge>
                          {agent && <span className="text-xs text-muted">{agent.name}</span>}
                        </div>
                        <p className="mt-2 text-sm text-muted">{step.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {step.output.map((item) => (
                            <span key={item} className="rounded-full border bg-bg/40 px-2.5 py-1 text-xs font-medium">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      {step.status === "needs-confirmation" && (
                        <Button variant="secondary" onClick={() => approveStep(step.id)} className="shrink-0">
                          <CheckCircle2 size={14} className="mr-1.5" />
                          Godkänn
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="!p-0">
            <div className="border-b p-5">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <TerminalSquare size={16} />
                Aktiv körning
              </div>
              <p className="mt-1 text-sm text-muted">Loggen visar fake-kommandon, risknivå och rollback-hints. Ingenting skickas till WordPress.</p>
            </div>
            <div className="p-5">
              <div className="h-2 overflow-hidden rounded-full bg-bg">
                <div className="h-full rounded-full bg-fg transition-all" style={{ width: `${workspace.progress}%` }} />
              </div>
              <div className="mt-4 space-y-2">
                {workspace.actions.length === 0 && (
                  <div className="rounded-xl border bg-bg/30 p-4 text-sm text-muted">
                    Inga backend-actions ännu. Action-kontraktet skapas efter planeringsfasen.
                  </div>
                )}
                {workspace.actions.slice(0, 5).map((action) => (
                  <div key={action.id} className="flex items-center justify-between gap-3 rounded-xl border bg-bg/30 p-3">
                    <div className="min-w-0">
                      <div className="truncate font-mono text-xs">{action.command}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                        <span>{action.result}</span>
                        <Badge tone={riskTone[action.riskLevel]}>{action.riskLevel}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={actionTone[action.status]}>{action.status}</Badge>
                      {action.status === "completed" && (
                        <button onClick={() => retryAction(action)} className="rounded-md p-1.5 text-muted hover:bg-surface hover:text-fg" aria-label="Kör om action">
                          <RefreshCcw size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <ResultPreview workspace={workspace} />
        </div>
      </div>

        <aside
          className={clsx(
            "w-full shrink-0 space-y-3 border-t bg-surface p-3 xl:sticky xl:top-[-1.5rem] xl:h-[calc(100vh-56px)] xl:overflow-y-auto xl:border-l xl:border-t-0",
            orchestratorCollapsed ? "xl:w-[68px]" : "xl:w-[400px]",
          )}
        >
          {orchestratorCollapsed ? (
            <div className="rounded-2xl border bg-surface p-3 shadow-soft">
              <div className="flex items-center justify-between gap-3 xl:flex-col xl:justify-start">
                <button
                  onClick={() => setOrchestratorCollapsed(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-fg text-bg transition-opacity hover:opacity-90"
                  aria-label="Expandera orkestrator"
                  title="Expandera orkestrator"
                >
                  <PanelRight size={16} />
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-2 xl:flex-col">
                  <CollapsedSignal icon={Bot} label="Orkestrator" value={isTyping ? "..." : workspace.runState === "running" ? "Kör" : "Redo"} />
                  <CollapsedSignal icon={Sparkles} label="Beslut" value={String(openDecisions.length)} tone={openDecisions.length > 0 ? "warning" : "neutral"} />
                  <CollapsedSignal icon={MessageSquare} label="Meddelanden" value={String(workspace.messages.length)} />
                </div>
              </div>
            </div>
          ) : (
            <>
          <section className="overflow-hidden rounded-2xl border bg-surface shadow-soft">
            <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                  <MessageSquare size={16} />
                  Orkestrator
                </div>
                <p className="mt-1 text-sm text-muted">Chatten kan skapa beslutskort som styr plan och preview.</p>
              </div>
              <button
                onClick={() => setOrchestratorCollapsed(true)}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-fg"
                aria-label="Minimera orkestrator"
                title="Minimera orkestrator"
              >
                <PanelRightClose size={16} />
              </button>
            </div>
            <div className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-3">
              {workspace.messages.map((message) => (
                <div key={message.id} className={clsx("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={clsx("max-w-[88%] rounded-2xl px-3 py-2 text-sm", message.role === "user" ? "bg-fg text-bg" : "border bg-bg/50")}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 size={14} className="animate-spin" />
                  Orkestratorn tänker...
                </div>
              )}
            </div>
            <div className="border-t px-4 py-3">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendChat(prompt)}
                    className="rounded-full border bg-bg/40 px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-fg"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendChat();
                }}
              >
                <Input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Styr planen eller fråga orkestratorn..." />
                <Button disabled={!chatInput.trim() || isTyping} aria-label="Skicka">
                  <Send size={14} />
                </Button>
              </form>
            </div>
          </section>

          <section className="rounded-2xl border bg-surface px-4 py-3 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Sparkles size={16} />
              Beslutskort
            </div>
            <div className="mt-4 space-y-3">
              {openDecisions.length === 0 && (
                <div className="rounded-xl border bg-bg/30 p-3 text-sm text-muted">
                  Inga öppna beslut. Använd chatten för att be orkestratorn ändra planen.
                </div>
              )}
              {openDecisions.map((card) => (
                <div key={card.id} className="rounded-xl border bg-bg/30 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{card.title}</div>
                      <div className="mt-1 text-xs text-muted">{card.description}</div>
                    </div>
                    <Badge tone="warning">{decisionLabel[card.action]}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="secondary" onClick={() => applyDecision(card)} className="h-8 px-3 text-xs">
                      Acceptera
                    </Button>
                    <Button variant="ghost" onClick={() => dismissDecision(card)} className="h-8 px-3 text-xs">
                      Avvisa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-surface px-4 py-3 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Bot size={16} />
              Agents
            </div>
            <div className="mt-4 space-y-3">
              {wpAgents.map((agent) => {
                const hasRunningAction = workspace.actions.some((action) => action.agentId === agent.id && action.status === "running");
                const ownsCompletedStep = workspace.steps.some((step) => step.agentId === agent.id && step.status === "completed");
                return (
                  <div key={agent.id} className="rounded-xl border bg-bg/30 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{agent.name}</div>
                        <div className="mt-0.5 text-xs text-muted">{agent.role}</div>
                      </div>
                      <Badge tone={hasRunningAction ? "warning" : ownsCompletedStep ? "success" : "neutral"}>
                        {hasRunningAction ? "aktiv" : ownsCompletedStep ? "klar" : "väntar"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted">{agent.summary}</div>
                  </div>
                );
              })}
            </div>
          </section>
            </>
          )}
        </aside>
    </div>
  );
}

function TimelineStrip({ timeline }: { timeline: ReturnType<typeof useWpOrchestratorWorkspace>["workspace"]["timeline"] }) {
  const tone = {
    waiting: "border-border bg-surface text-muted",
    running: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    needs_confirmation: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  } as const;
  const label = {
    waiting: "väntar",
    running: "körs",
    needs_confirmation: "beslut",
    completed: "klar",
  } as const;

  return (
    <div className="rounded-2xl border bg-surface p-3 shadow-soft">
      <div className="flex gap-2 overflow-x-auto">
        {timeline.map((step) => (
          <div key={step.id} className={clsx("min-w-[132px] rounded-xl border px-3 py-2", tone[step.status])}>
            <div className="text-xs font-semibold">{step.label}</div>
            <div className="mt-1 text-[11px]">{label[step.status]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollapsedSignal({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: typeof Bot;
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <div
      className={clsx(
        "flex h-10 min-w-0 items-center gap-2 rounded-xl border bg-bg/40 px-3 xl:h-auto xl:w-10 xl:flex-col xl:gap-1 xl:px-0 xl:py-2",
        tone === "warning" && "border-amber-500/20 bg-amber-500/10",
      )}
      title={`${label}: ${value}`}
    >
      <Icon size={15} className={tone === "warning" ? "text-amber-600 dark:text-amber-400" : "text-muted"} />
      <span className="truncate text-xs font-medium xl:text-[11px]">{value}</span>
    </div>
  );
}

function ResultPreview({ workspace }: { workspace: ReturnType<typeof useWpOrchestratorWorkspace>["workspace"] }) {
  return (
    <Card className="!p-0">
      <div className="border-b p-5">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Eye size={16} />
          Resultatpreview
        </div>
        <p className="mt-1 text-sm text-muted">En backend-nära översikt över vad demon har byggt eller planerat.</p>
      </div>
      <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <div className="rounded-xl border bg-bg/30 p-3">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Tema och navigation</div>
            <div className="mt-2 text-sm font-medium">{workspace.sitePreview.theme}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {workspace.sitePreview.navigation.map((item) => (
                <span key={item} className="rounded-full border bg-surface px-2.5 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {workspace.sitePreview.pages.map((page) => (
              <div key={page.id} className="rounded-xl border bg-bg/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{page.title}</div>
                    <div className="mt-1 text-xs text-muted">/{page.slug}</div>
                  </div>
                  <Badge tone={page.status === "verified" ? "success" : page.status === "created" ? "warning" : "neutral"}>
                    {page.status}
                  </Badge>
                </div>
                <div className="mt-3 text-xs text-muted">{page.sections.join(" · ")}</div>
                <div className="mt-2 text-xs font-medium">{page.cta}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border bg-bg/30 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers3 size={14} />
              Plugins
            </div>
            <div className="mt-3 space-y-2">
              {workspace.sitePreview.plugins.map((plugin) => (
                <div key={plugin.slug} className="flex items-start justify-between gap-3 rounded-lg border bg-surface p-2.5">
                  <div>
                    <div className="text-sm font-medium">{plugin.name}</div>
                    <div className="mt-1 text-xs text-muted">{plugin.purpose}</div>
                  </div>
                  <Badge tone={plugin.status === "active" ? "success" : plugin.status === "optional" ? "warning" : "neutral"}>
                    {plugin.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-bg/30 p-3">
            <div className="text-sm font-semibold">Nästa backend-kontrakt</div>
            <div className="mt-3 space-y-2">
              {workspace.sitePreview.nextBackendContract.map((item) => (
                <div key={item} className="flex gap-2 text-sm text-muted">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { buildEmptyPreview, buildTemplatePreview, defaultWorkspace, projectTemplates } from "@/modules/wp-orchestrator/data";
import type {
  DecisionCard,
  OrchestratorMessage,
  QaCheck,
  SitePreview,
  TimelineStep,
  WpAction,
  WpOrchestratorSettings,
  WpOrchestratorWorkspace,
  WpPlanStep,
} from "@/modules/wp-orchestrator/types";

const KEY = "wp-orchestrator.workspace";
const listeners = new Set<() => void>();

function cloneDefault(): WpOrchestratorWorkspace {
  return {
    ...defaultWorkspace,
    projectTemplateId: defaultWorkspace.projectTemplateId,
    timeline: defaultWorkspace.timeline.map((step) => ({ ...step })),
    steps: defaultWorkspace.steps.map((step) => ({ ...step, output: [...step.output] })),
    actions: defaultWorkspace.actions.map((action) => ({ ...action, logs: [...action.logs], payload: { ...action.payload } })),
    qaChecks: defaultWorkspace.qaChecks.map((check) => ({ ...check })),
    messages: defaultWorkspace.messages.map((message) => ({ ...message })),
    decisionCards: defaultWorkspace.decisionCards.map((card) => ({ ...card })),
    sitePreview: {
      ...defaultWorkspace.sitePreview,
      navigation: [...defaultWorkspace.sitePreview.navigation],
      pages: defaultWorkspace.sitePreview.pages.map((page) => ({ ...page, sections: [...page.sections] })),
      plugins: defaultWorkspace.sitePreview.plugins.map((plugin) => ({ ...plugin })),
      nextBackendContract: [...defaultWorkspace.sitePreview.nextBackendContract],
    },
    settings: { ...defaultWorkspace.settings },
  };
}

function normalize(value: Partial<WpOrchestratorWorkspace> | null): WpOrchestratorWorkspace {
  const fallback = cloneDefault();
  if (!value || typeof value !== "object") return fallback;
  return {
    ...fallback,
    ...value,
    flowState: value.flowState ?? fallback.flowState,
    projectTemplateId: typeof value.projectTemplateId === "string" ? value.projectTemplateId : fallback.projectTemplateId,
    timeline: Array.isArray(value.timeline) ? (value.timeline as TimelineStep[]) : fallback.timeline,
    steps: Array.isArray(value.steps) ? (value.steps as WpPlanStep[]) : fallback.steps,
    actions: Array.isArray(value.actions)
      ? (value.actions as WpAction[]).map((action) => ({
          ...fallback.actions.find((fallbackAction) => fallbackAction.id === action.id),
          ...action,
          payload: action.payload ?? {},
          requiresConfirmation: action.requiresConfirmation ?? false,
          riskLevel: action.riskLevel ?? "low",
          rollbackHint: action.rollbackHint ?? "Ingen rollback definierad.",
          logs: Array.isArray(action.logs) ? action.logs : ["Importerad från äldre demo-state."],
        }))
      : fallback.actions,
    qaChecks: Array.isArray(value.qaChecks) ? (value.qaChecks as QaCheck[]) : fallback.qaChecks,
    messages: Array.isArray(value.messages) ? (value.messages as OrchestratorMessage[]) : fallback.messages,
    decisionCards: Array.isArray(value.decisionCards) ? (value.decisionCards as DecisionCard[]) : fallback.decisionCards,
    sitePreview: value.sitePreview
      ? (value.sitePreview as SitePreview)
      : value.projectTemplateId
        ? buildTemplatePreview(projectTemplates.find((template) => template.id === value.projectTemplateId) ?? projectTemplates[0])
        : buildEmptyPreview(),
    settings: { ...fallback.settings, ...(value.settings as Partial<WpOrchestratorSettings> | undefined) },
  };
}

function read(): WpOrchestratorWorkspace {
  if (typeof window === "undefined") return cloneDefault();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return cloneDefault();
    return normalize(JSON.parse(raw) as Partial<WpOrchestratorWorkspace>);
  } catch {
    return cloneDefault();
  }
}

function write(next: WpOrchestratorWorkspace) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function useWpOrchestratorWorkspace() {
  const [workspace, setWorkspace] = useState<WpOrchestratorWorkspace>(() => cloneDefault());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWorkspace(read());
    setHydrated(true);
    const update = () => setWorkspace(read());
    listeners.add(update);
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function update(next: WpOrchestratorWorkspace | ((current: WpOrchestratorWorkspace) => WpOrchestratorWorkspace)) {
    const current = read();
    const resolved = typeof next === "function" ? next(current) : next;
    write(resolved);
  }

  return {
    hydrated,
    workspace,
    update,
    reset: () => write(cloneDefault()),
  };
}

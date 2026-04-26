"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Code2, Filter, RefreshCcw, Search, ShieldAlert, TerminalSquare } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, Table, Td, Th } from "@/components/ui/Table";
import { wpAgents } from "@/modules/wp-orchestrator/data";
import { useWpOrchestratorWorkspace } from "@/modules/wp-orchestrator/lib/useWpOrchestratorWorkspace";
import type { ActionStatus, ActionType, RiskLevel, WpAction } from "@/modules/wp-orchestrator/types";

const statusTone: Record<ActionStatus, "neutral" | "success" | "warning" | "danger"> = {
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

const typeLabel: Record<ActionType, string> = {
  wp_cli: "WP-CLI",
  rest_create: "REST create",
  rest_update: "REST update",
  theme_config: "Tema",
  plugin_config: "Plugin",
  qa_check: "QA",
};

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function payloadSummary(payload: WpAction["payload"]) {
  const entries = Object.entries(payload);
  if (entries.length === 0) return "Ingen payload";
  return entries
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join(" · ");
}

export function ActionsPage() {
  const { workspace, update } = useWpOrchestratorWorkspace();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ActionStatus | "all">("all");
  const [type, setType] = useState<ActionType | "all">("all");
  const [risk, setRisk] = useState<RiskLevel | "all">("all");

  const agents = useMemo(() => new Map(wpAgents.map((agent) => [agent.id, agent])), []);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return workspace.actions.filter((action) => {
      if (status !== "all" && action.status !== status) return false;
      if (type !== "all" && action.type !== type) return false;
      if (risk !== "all" && action.riskLevel !== risk) return false;
      if (!normalized) return true;
      return [
        action.command,
        action.target,
        action.result,
        action.rollbackHint,
        payloadSummary(action.payload),
        agents.get(action.agentId)?.name ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [agents, query, risk, status, type, workspace.actions]);

  const completed = workspace.actions.filter((action) => action.status === "completed").length;
  const running = workspace.actions.filter((action) => action.status === "running").length;
  const wpCliCount = workspace.actions.filter((action) => action.type === "wp_cli").length;
  const riskyCount = workspace.actions.filter((action) => action.riskLevel === "high" || action.requiresConfirmation).length;

  function rerun(action: WpAction) {
    update((current) => ({
      ...current,
      actions: current.actions.map((item) =>
        item.id === action.id
          ? {
              ...item,
              status: "completed",
              createdAt: new Date().toISOString(),
              result: `${item.result} Omsimulerad från action-loggen.`,
              logs: [...item.logs, "Omsimulerad från action-loggen."],
            }
          : item,
      ),
    }));
    toast.success("Action omsimulerad", action.command);
  }

  function completeAll() {
    update((current) => ({
      ...current,
      progress: 100,
      runState: "completed",
      actions: current.actions.map((action) => ({
        ...action,
        status: "completed",
        logs: action.logs.includes("Markerad klar från Action-loggen.") ? action.logs : [...action.logs, "Markerad klar från Action-loggen."],
      })),
      steps: current.steps.map((step) => ({ ...step, status: "completed" })),
      sitePreview: {
        ...current.sitePreview,
        pages: current.sitePreview.pages.map((page) => ({ ...page, status: "verified" })),
        plugins: current.sitePreview.plugins.map((plugin) => (plugin.status === "optional" ? plugin : { ...plugin, status: "active" })),
      },
      qaChecks: current.qaChecks.map((check) => ({
        ...check,
        status: check.id === "menu" ? "warning" : "passed",
        detail: check.id === "menu" ? "Meny är simulerad i frontend-demon." : "Verifierad i simulerad action-logg.",
      })),
    }));
    toast.success("Alla actions markerade klara", "Det här ändrar bara frontend-state.");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Action-logg"
          subtitle="Spårbar frontend-demo av vad en framtida backend skulle kunna köra mot lokal WordPress."
        />
        <Button onClick={completeAll}>
          <CheckCircle2 size={14} className="mr-1.5" />
          Markera allt klart
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Actions" value={String(workspace.actions.length)} hint="Deterministiska objekt, inte AI direkt mot WP." />
        <StatCard label="Klara" value={`${completed}/${workspace.actions.length}`} hint="Simulerad körstatus." />
        <StatCard label="WP-CLI" value={String(wpCliCount)} hint="Installera tema, plugins och options." />
        <StatCard label="Risk/confirm" value={String(riskyCount)} hint={running > 0 ? `${running} körs just nu` : "Granskning innan riktig backend."} />
      </div>

      <Card className="p-0">
        <div className="border-b p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <TerminalSquare size={16} />
                Simulerade kommandon
              </div>
              <p className="mt-1 text-sm text-muted">Alla rader är mockade och körs aldrig externt.</p>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              <div className="relative min-w-[240px]">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sök kommando, payload eller mål..." className="pl-9" />
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as ActionStatus | "all")}
                className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="all">Alla statusar</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as ActionType | "all")}
                className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="all">Alla typer</option>
                {Object.entries(typeLabel).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={risk}
                onChange={(event) => setRisk(event.target.value as RiskLevel | "all")}
                className="h-9 rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
              >
                <option value="all">Alla risker</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        <Table className="rounded-none border-0 shadow-none">
          <thead>
            <tr>
              <Th>Action</Th>
              <Th>Kontrakt</Th>
              <Th>Risk</Th>
              <Th>Status</Th>
              <Th>Loggar</Th>
              <Th className="text-right">Åtgärd</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={6} className="py-12 text-center text-sm text-muted">
                  Ingen action matchar filtren.
                </Td>
              </tr>
            )}
            {filtered.map((action) => (
              <tr key={action.id} className={clsx("transition-colors hover:bg-bg/50", action.status === "running" && "bg-amber-500/[0.04]")}>
                <Td>
                  <div className="font-medium">{action.target}</div>
                  <div className="mt-1 max-w-[360px] truncate font-mono text-xs text-muted">{action.command}</div>
                  <div className="mt-1 text-xs text-muted">{action.result}</div>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full border bg-bg/40 px-2 py-1 text-xs font-medium">{typeLabel[action.type]}</span>
                    <span className="rounded-full border bg-bg/40 px-2 py-1 text-xs font-medium">{agents.get(action.agentId)?.name ?? action.agentId}</span>
                  </div>
                  <div className="mt-2 max-w-[280px] truncate text-xs text-muted">{payloadSummary(action.payload)}</div>
                  <div className="mt-1 max-w-[280px] truncate text-xs text-muted">Rollback: {action.rollbackHint}</div>
                </Td>
                <Td>
                  <div className="flex flex-col items-start gap-1.5">
                    <Badge tone={riskTone[action.riskLevel]}>{action.riskLevel}</Badge>
                    {action.requiresConfirmation && <Badge tone="warning">confirm</Badge>}
                  </div>
                </Td>
                <Td>
                  <Badge tone={statusTone[action.status]}>{action.status}</Badge>
                  <div className="mt-2 text-xs text-muted">{formatDuration(action.durationMs)}</div>
                </Td>
                <Td>
                  <div className="max-w-[260px] space-y-1">
                    {action.logs.slice(-3).map((log, index) => (
                      <div key={`${action.id}-${index}-${log}`} className="truncate text-xs text-muted">
                        {log}
                      </div>
                    ))}
                  </div>
                </Td>
                <Td className="text-right">
                  <button
                    onClick={() => rerun(action)}
                    className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-bg hover:text-fg"
                  >
                    <RefreshCcw size={12} className="mr-1.5" />
                    Kör om
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <ShieldAlert size={16} />
            Backend-nära kontrakt
          </div>
          <p className="mt-2 text-sm text-muted">
            Varje rad har typ, agent, payload, confirmation-krav, risknivå, rollback hint och loggar. En riktig implementation kan byta mock-runnern mot WP-CLI/REST utan att ändra huvudflödet i UI:t.
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Code2 size={16} />
            Resultat från samma state
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-bg/30 p-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Tema</div>
              <div className="mt-2 text-sm font-medium">{workspace.sitePreview.theme}</div>
            </div>
            <div className="rounded-xl border bg-bg/30 p-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Sidor</div>
              <div className="mt-2 text-sm font-medium">{workspace.sitePreview.pages.length}</div>
            </div>
            <div className="rounded-xl border bg-bg/30 p-3">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">Plugins</div>
              <div className="mt-2 text-sm font-medium">{workspace.sitePreview.plugins.length}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {workspace.sitePreview.pages.map((page) => (
              <span key={page.id} className="rounded-full border bg-bg/40 px-2.5 py-1 text-xs">
                {page.title} · {page.status}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

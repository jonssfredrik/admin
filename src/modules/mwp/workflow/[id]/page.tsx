"use client";

import { use, useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Save,
  Rocket,
  Webhook,
  Clock,
  FormInput,
  Sparkles,
  Bot,
  GitBranch,
  Split,
  RotateCw,
  Timer,
  Database,
  Mail,
  Globe,
  Shield,
  EyeOff,
  Bell,
  Plug,
  MessageSquare,
  FileOutput,
  Search,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { templates, type NodeKind, type WorkflowEdge as Edge, type WorkflowNode as WNode } from "../templates";

const kindStyles: Record<NodeKind, { ring: string; chip: string; dot: string; label: string }> = {
  trigger: { ring: "border-blue-500/40", chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400", dot: "bg-blue-500", label: "Utlösare" },
  agent: { ring: "border-violet-500/40", chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400", dot: "bg-violet-500", label: "Agent" },
  logic: { ring: "border-amber-500/40", chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400", dot: "bg-amber-500", label: "Logik" },
  tool: { ring: "border-emerald-500/40", chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", label: "Verktyg" },
  guardrail: { ring: "border-rose-500/40", chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400", dot: "bg-rose-500", label: "Skyddsräcke" },
  output: { ring: "border-slate-500/40", chip: "bg-slate-500/10 text-slate-600 dark:text-slate-400", dot: "bg-slate-500", label: "Utdata" },
};

const NODE_W = 240;
const NODE_H = 84;
const PORT_Y = 42;


interface PaletteItem {
  kind: NodeKind;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const palette: { group: string; items: PaletteItem[] }[] = [
  {
    group: "Utlösare",
    items: [
      { kind: "trigger", icon: Webhook, title: "Webhook", subtitle: "HTTP-event" },
      { kind: "trigger", icon: Clock, title: "Schemalagd", subtitle: "Cron-uttryck" },
      { kind: "trigger", icon: FormInput, title: "Formulär", subtitle: "Contact Form 7" },
    ],
  },
  {
    group: "Agenter",
    items: [
      { kind: "agent", icon: Sparkles, title: "GPT-4o", subtitle: "OpenAI" },
      { kind: "agent", icon: Bot, title: "Claude", subtitle: "Anthropic" },
      { kind: "agent", icon: MessageSquare, title: "Egen prompt", subtitle: "Instruktion" },
    ],
  },
  {
    group: "Logik",
    items: [
      { kind: "logic", icon: GitBranch, title: "Villkor", subtitle: "If / else" },
      { kind: "logic", icon: Split, title: "Switch", subtitle: "Flera grenar" },
      { kind: "logic", icon: RotateCw, title: "Loop", subtitle: "Iterera listor" },
      { kind: "logic", icon: Timer, title: "Fördröjning", subtitle: "Wait N sek" },
    ],
  },
  {
    group: "Verktyg",
    items: [
      { kind: "tool", icon: Globe, title: "HTTP-anrop", subtitle: "REST / GraphQL" },
      { kind: "tool", icon: Database, title: "Databas", subtitle: "MariaDB query" },
      { kind: "tool", icon: Mail, title: "Skicka e-post", subtitle: "SMTP" },
      { kind: "tool", icon: Plug, title: "MCP-server", subtitle: "Anslut verktyg" },
    ],
  },
  {
    group: "Skyddsräcken",
    items: [
      { kind: "guardrail", icon: Shield, title: "Innehållsfilter", subtitle: "Toxicity / policy" },
      { kind: "guardrail", icon: EyeOff, title: "PII-maskering", subtitle: "Dölj känsligt" },
    ],
  },
  {
    group: "Utdata",
    items: [
      { kind: "output", icon: Bell, title: "Notis", subtitle: "Slack / e-post" },
      { kind: "output", icon: FileOutput, title: "Svar", subtitle: "Returnera JSON" },
    ],
  },
];

export default function WorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const template = templates[id];
  if (!template) notFound();
  const [nodes, setNodes] = useState<WNode[]>(() => template.nodes.map((n) => ({ ...n })));
  const [edges, setEdges] = useState<Edge[]>(() => template.edges.map((e) => ({ ...e })));
  const [selected, setSelected] = useState<string | null>(template.nodes[0]?.id ?? null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ id: string; offX: number; offY: number } | null>(null);
  const panState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const toast = useToast();

  const selectedNode = nodes.find((n) => n.id === selected) || null;

  const onNodeMouseDown = useCallback(
    (e: React.MouseEvent, node: WNode) => {
      e.stopPropagation();
      setSelected(node.id);
      const rect = canvasRef.current!.getBoundingClientRect();
      dragState.current = {
        id: node.id,
        offX: (e.clientX - rect.left - pan.x) / zoom - node.x,
        offY: (e.clientY - rect.top - pan.y) / zoom - node.y,
      };
    },
    [pan, zoom],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragState.current && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - pan.x) / zoom - dragState.current.offX;
        const y = (e.clientY - rect.top - pan.y) / zoom - dragState.current.offY;
        const id = dragState.current.id;
        setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, x, y } : n)));
      } else if (panState.current) {
        setPan({
          x: panState.current.origX + (e.clientX - panState.current.startX),
          y: panState.current.origY + (e.clientY - panState.current.startY),
        });
      }
    },
    [pan, zoom],
  );

  const onMouseUp = useCallback(() => {
    dragState.current = null;
    panState.current = null;
  }, []);

  const onCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvasBg === "1") {
        setSelected(null);
        panState.current = {
          startX: e.clientX,
          startY: e.clientY,
          origX: pan.x,
          origY: pan.y,
        };
      }
    },
    [pan],
  );

  const deleteSelected = () => {
    if (!selected) return;
    setNodes((ns) => ns.filter((n) => n.id !== selected));
    setEdges((es) => es.filter((e) => e.from !== selected && e.to !== selected));
    setSelected(null);
    toast.success("Nod borttagen");
  };

  const updateSelected = (patch: Partial<WNode>) => {
    if (!selected) return;
    setNodes((ns) => ns.map((n) => (n.id === selected ? { ...n, ...patch } : n)));
  };

  const edgePath = (from: WNode, to: WNode) => {
    const x1 = from.x + NODE_W;
    const y1 = from.y + PORT_Y;
    const x2 = to.x;
    const y2 = to.y + PORT_Y;
    const dx = Math.max(60, Math.abs(x2 - x1) / 2);
    return `M ${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
  };

  const filteredPalette = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return palette;
    return palette
      .map((g) => ({ ...g, items: g.items.filter((i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const addFromPalette = (p: PaletteItem) => {
    const id = `n${Date.now()}`;
    const centerX = (-pan.x + (canvasRef.current?.clientWidth ?? 600) / 2) / zoom - NODE_W / 2;
    const centerY = (-pan.y + (canvasRef.current?.clientHeight ?? 400) / 2) / zoom - NODE_H / 2;
    setNodes((ns) => [
      ...ns,
      { id, kind: p.kind, icon: p.icon, title: p.title, subtitle: p.subtitle, x: centerX, y: centerY, config: [] },
    ]);
    setSelected(id);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-[600px] flex-col -m-6 sm:-m-8">
      <div className="flex items-center justify-between gap-4 border-b bg-surface px-5 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/mwp/workflow" className="flex h-7 w-7 items-center justify-center rounded-md border bg-surface text-muted hover:text-fg">
            <ArrowLeft size={14} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold tracking-tight">{template.name}</h1>
              <span className="rounded bg-fg/5 px-1.5 py-0.5 font-mono text-[10px] text-muted">{template.version} · {template.status}</span>
            </div>
            <div className="text-[11px] text-muted">Senast sparad {template.lastSaved} · av {template.owner}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => toast.info("Kör förhandsvisning", "Simulerar från trigger")}>
            <Play size={14} strokeWidth={2} className="mr-1.5" />
            Förhandsvisa
          </Button>
          <Button variant="secondary" onClick={() => toast.success("Sparad")}>
            <Save size={14} strokeWidth={2} className="mr-1.5" />
            Spara
          </Button>
          <Button onClick={() => toast.success("Publicerad", "Workflow är nu aktivt")}>
            <Rocket size={14} strokeWidth={2} className="mr-1.5" />
            Publicera
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-64 shrink-0 flex-col border-r bg-surface">
          <div className="border-b p-3">
            <div className="relative">
              <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <Input className="h-8 pl-7 text-xs" placeholder="Sök nodtyp…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredPalette.map((g) => (
              <div key={g.group} className="mb-3 last:mb-0">
                <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{g.group}</div>
                <div className="space-y-1">
                  {g.items.map((it) => {
                    const k = kindStyles[it.kind];
                    const Icon = it.icon;
                    return (
                      <button
                        key={it.title}
                        onClick={() => addFromPalette(it)}
                        className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-bg"
                      >
                        <span className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", k.chip)}>
                          <Icon size={14} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium">{it.title}</div>
                          <div className="truncate text-[10px] text-muted">{it.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="relative flex-1 overflow-hidden bg-bg">
          <div
            ref={canvasRef}
            data-canvas-bg="1"
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{
              backgroundImage:
                "radial-gradient(rgb(var(--border)) 1px, transparent 1px)",
              backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
          >
            <div
              data-canvas-bg="1"
              className="absolute origin-top-left"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            >
              <svg
                data-canvas-bg="1"
                className="pointer-events-none absolute"
                style={{ left: 0, top: 0, width: 2400, height: 1400, overflow: "visible" }}
              >
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="rgb(var(--muted))" />
                  </marker>
                </defs>
                {edges.map((e) => {
                  const from = nodes.find((n) => n.id === e.from);
                  const to = nodes.find((n) => n.id === e.to);
                  if (!from || !to) return null;
                  const d = edgePath(from, to);
                  const midX = (from.x + NODE_W + to.x) / 2;
                  const midY = (from.y + to.y) / 2 + PORT_Y;
                  return (
                    <g key={e.id}>
                      <path d={d} fill="none" stroke="rgb(var(--muted))" strokeWidth={1.5} markerEnd="url(#arrow)" />
                      {e.label && (
                        <g>
                          <rect x={midX - 14} y={midY - 9} width={28} height={18} rx={4} fill="rgb(var(--surface))" stroke="rgb(var(--border))" />
                          <text x={midX} y={midY + 3} textAnchor="middle" fontSize="10" fontWeight="500" fill="rgb(var(--fg))">
                            {e.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {nodes.map((n) => {
                const k = kindStyles[n.kind];
                const Icon = n.icon;
                const isSelected = selected === n.id;
                return (
                  <div
                    key={n.id}
                    onMouseDown={(e) => onNodeMouseDown(e, n)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(n.id);
                    }}
                    className={clsx(
                      "absolute select-none rounded-xl border-2 bg-surface shadow-soft transition-shadow",
                      isSelected ? "border-fg shadow-pop" : clsx(k.ring, "hover:shadow-pop"),
                    )}
                    style={{ left: n.x, top: n.y, width: NODE_W, cursor: dragState.current?.id === n.id ? "grabbing" : "grab" }}
                  >
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                      <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", k.chip)}>
                        <Icon size={13} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold tracking-tight">{n.title}</div>
                      </div>
                      <span className={clsx("rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider", k.chip)}>
                        {k.label}
                      </span>
                    </div>
                    <div className="px-3 py-2 text-[11px] text-muted">{n.subtitle}</div>

                    {n.kind !== "trigger" && (
                      <span
                        className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-surface bg-fg/60"
                        style={{ top: PORT_Y - 6 }}
                      />
                    )}
                    {n.kind !== "output" && (
                      <span
                        className="absolute -right-1.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-surface bg-fg/60"
                        style={{ top: PORT_Y - 6 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="pointer-events-auto flex items-center gap-1 rounded-lg border bg-surface p-1 shadow-soft">
              <button
                onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-fg"
              >
                <ZoomOut size={14} />
              </button>
              <span className="min-w-[44px] text-center font-mono text-[11px] tabular-nums text-muted">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-fg"
              >
                <ZoomIn size={14} />
              </button>
              <span className="mx-1 h-4 w-px bg-border" />
              <button
                onClick={resetView}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-fg"
              >
                <Maximize2 size={13} />
              </button>
            </div>
            <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-surface px-3 py-1.5 text-[11px] text-muted shadow-soft">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {nodes.length} noder
              </span>
              <span>·</span>
              <span>{edges.length} kopplingar</span>
            </div>
          </div>
        </div>

        <aside className="flex w-80 shrink-0 flex-col border-l bg-surface">
          {selectedNode ? (
            <>
              <div className="border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={clsx("flex h-7 w-7 items-center justify-center rounded-md", kindStyles[selectedNode.kind].chip)}>
                    <selectedNode.icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold tracking-tight">{selectedNode.title}</div>
                    <div className="text-[11px] text-muted">{kindStyles[selectedNode.kind].label}</div>
                  </div>
                  <button
                    onClick={deleteSelected}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <Field label="Namn">
                    <Input value={selectedNode.title} onChange={(e) => updateSelected({ title: e.target.value })} />
                  </Field>
                  <Field label="Beskrivning">
                    <Input value={selectedNode.subtitle} onChange={(e) => updateSelected({ subtitle: e.target.value })} />
                  </Field>
                  {selectedNode.config && selectedNode.config.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                        <Settings size={11} />
                        Konfiguration
                      </div>
                      <div className="space-y-2 rounded-lg border bg-bg p-3">
                        {selectedNode.config.map((c, i) => (
                          <div key={i} className="flex items-baseline justify-between gap-3 text-xs">
                            <span className="text-muted">{c.label}</span>
                            <span className="truncate font-mono text-[11px] font-medium">{c.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Kopplingar</div>
                    <div className="space-y-1.5 text-xs">
                      <EdgeSummary title="Inkommande" count={edges.filter((e) => e.to === selectedNode.id).length} />
                      <EdgeSummary title="Utgående" count={edges.filter((e) => e.from === selectedNode.id).length} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fg/5">
                <Settings size={16} className="text-muted" />
              </div>
              <div className="mt-3 text-sm font-medium">Ingen nod vald</div>
              <div className="mt-1 text-xs text-muted">Klicka på en nod i canvasen för att redigera dess inställningar, eller dra en ny nod från paletten till vänster.</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</label>
      {children}
    </div>
  );
}

function EdgeSummary({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-bg px-2.5 py-1.5">
      <span className="text-muted">{title}</span>
      <span className="font-mono tabular-nums">{count}</span>
    </div>
  );
}

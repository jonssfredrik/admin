"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Server, Key, Terminal, Activity, Shield, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";

interface PairingToken {
  token: string;
  label: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  siteId?: string;
}

const initialTokens: PairingToken[] = [
  { token: "jwp_pair_7f3a9c2e", label: "Lagom Interiör (ny server)", createdAt: "2026-04-19 09:12", expiresAt: "om 23 tim", used: false },
  { token: "jwp_pair_b21e4d88", label: "Arctic Outdoor prod", createdAt: "2026-04-18 14:30", expiresAt: "gått ut", used: true, siteId: "site-5" },
  { token: "jwp_pair_5ae90c11", label: "Testmiljö staging", createdAt: "2026-04-17 11:05", expiresAt: "gått ut", used: true, siteId: "site-4" },
];

const authEvents = [
  { time: "14:22:08", event: "agent.auth.success", server: "sto-web-01", siteId: "site-1", ip: "10.12.4.18" },
  { time: "14:20:01", event: "agent.auth.success", server: "sto-web-02", siteId: "site-2", ip: "10.12.4.19" },
  { time: "13:38:14", event: "agent.auth.failure", server: "fra-web-01", siteId: "site-5", ip: "10.40.2.7", reason: "timeout" },
  { time: "12:00:04", event: "agent.pair.complete", server: "got-web-01", siteId: "site-3", ip: "10.20.1.5" },
  { time: "11:48:22", event: "agent.auth.success", server: "sto-web-02", siteId: "site-2", ip: "10.12.4.19" },
];

export default function OnboardingPage() {
  const toast = useToast();
  const [tokens, setTokens] = useState<PairingToken[]>(initialTokens);
  const [server, setServer] = useState("");
  const [label, setLabel] = useState("");
  const [path, setPath] = useState("/public_html");

  const copy = (s: string) => {
    navigator.clipboard?.writeText(s);
    toast.success("Kopierad", s.slice(0, 32));
  };

  const generate = () => {
    if (!label) { toast.error("Saknar etikett", "Ange en beskrivande etikett"); return; }
    const token = `jwp_pair_${Math.random().toString(16).slice(2, 10)}`;
    setTokens((p) => [{ token, label, createdAt: new Date().toISOString().slice(0, 16).replace("T", " "), expiresAt: "om 24 tim", used: false }, ...p]);
    setLabel("");
    toast.success("Token skapad", token);
  };

  const install = `curl -sSL https://jetwp.io/install.sh | sudo bash -s -- \\
  --token <TOKEN> \\
  --server ${server || "<server-id>"} \\
  --path ${path}`;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/jetwp" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
          <ArrowLeft size={12} />
          JetWP
        </Link>
        <div className="mt-3">
          <PageHeader title="Onboarding" subtitle="Parkoppla nya servrar och WordPress-installationer med JetWP" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg/5">
              <Server size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold">1. Registrera server</div>
              <div className="text-[11px] text-muted">Lägg till värdmaskinen i kontrollplanet</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted">Server-id</label>
              <Input className="mt-1" placeholder="t.ex. sto-web-03" value={server} onChange={(e) => setServer(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted">WordPress-sökväg</label>
              <Input className="mt-1" placeholder="/public_html" value={path} onChange={(e) => setPath(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg/5">
              <Key size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold">2. Skapa pairing-token</div>
              <div className="text-[11px] text-muted">Engångstoken giltig i 24 timmar</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted">Etikett</label>
              <Input className="mt-1" placeholder="t.ex. Ny kundsajt" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <Button className="w-full" onClick={generate}>Generera token</Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg/5">
              <Shield size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold">3. Vänta på heartbeat</div>
              <div className="text-[11px] text-muted">Agenten rapporterar in vid anslutning</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border bg-bg/40 p-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Lyssnar på nya agenter…
            </div>
            <div className="mt-2 text-[11px] text-muted">Sajten dyker upp i flottan automatiskt när agenten rapporterar.</div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-muted" />
            <div className="text-sm font-semibold">Install-kommando</div>
          </div>
          <Button variant="secondary" onClick={() => copy(install)}>
            <Copy size={12} className="mr-1.5" />Kopiera
          </Button>
        </div>
        <pre className="overflow-x-auto bg-bg p-5 font-mono text-[12px] leading-relaxed text-fg/80">{install}</pre>
        <div className="border-t px-5 py-3 text-[11px] text-muted">
          Kör som root på målservern. Agenten verifierar token mot kontrollplanet och registrerar automatiskt siten vid första heartbeat.
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="text-sm font-semibold tracking-tight">Aktiva pairing-tokens</div>
            <span className="text-[11px] text-muted">{tokens.filter((t) => !t.used).length} aktiva</span>
          </div>
          <div className="divide-y divide-border/60">
            {tokens.map((t) => (
              <div key={t.token} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{t.label}</span>
                    {t.used ? <Badge tone="neutral">använd</Badge> : <Badge tone="success">aktiv</Badge>}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted">
                    <span className="truncate">{t.token}</span>
                    <span>·</span>
                    <span>skapad {t.createdAt}</span>
                    <span>·</span>
                    <span className={clsx(t.expiresAt === "gått ut" && "text-red-500")}>{t.expiresAt}</span>
                  </div>
                </div>
                {!t.used && (
                  <Button variant="secondary" onClick={() => copy(t.token)}>
                    <Copy size={12} className="mr-1.5" />Kopiera
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-muted" />
              <div className="text-sm font-semibold tracking-tight">Auth events</div>
            </div>
            <Button variant="secondary" onClick={() => toast.info("Uppdaterad", "Event-logg hämtad")}>
              <RefreshCw size={12} className="mr-1.5" />Uppdatera
            </Button>
          </div>
          <div className="divide-y divide-border/60">
            {authEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <span className={clsx(
                  "h-1.5 w-1.5 rounded-full",
                  e.event.includes("success") || e.event.includes("complete") ? "bg-emerald-500" : "bg-red-500",
                )} />
                <span className="font-mono text-[11px] tabular-nums text-muted">{e.time}</span>
                <span className="font-mono text-[11px]">{e.event}</span>
                <Link href={`/jetwp/${e.siteId}`} className="flex-1 truncate text-[12px] hover:text-fg">{e.server}</Link>
                <span className="font-mono text-[11px] text-muted">{e.ip}</span>
                {e.reason && <Badge tone="danger">{e.reason}</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Check size={14} className="text-emerald-500" />
          <div className="text-sm font-semibold">Checklista efter parkoppling</div>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-muted">
          <li>• Verifiera att heartbeat kommer in (max 30 sek).</li>
          <li>• Kör <span className="font-mono text-[12px]">integrity.check</span> för att scanna kärnfiler.</li>
          <li>• Skapa en första baseline-backup.</li>
          <li>• Aktivera relevanta workflows (säkerhetsskanning, auto-updates).</li>
          <li>• Lägg till sajten i minst en notifieringsgrupp.</li>
        </ul>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Copy, Key, Terminal, Activity, RefreshCw, Globe, Box } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { JetWPPageIntro } from "@/modules/jetwp/components/JetWPPageIntro";

interface PairingToken {
  token: string;
  label: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  siteId?: string;
}

const initialTokens: PairingToken[] = [
  { token: "jwp_pair_7f3a9c2e", label: "Lagom Interiör", createdAt: "2026-04-19 09:12", expiresAt: "om 23 tim", used: false },
  { token: "jwp_pair_b21e4d88", label: "Arctic Outdoor prod", createdAt: "2026-04-18 14:30", expiresAt: "gått ut", used: true, siteId: "site-5" },
  { token: "jwp_pair_5ae90c11", label: "Fjällkliniken staging", createdAt: "2026-04-17 11:05", expiresAt: "gått ut", used: true, siteId: "site-4" },
];

const authEvents = [
  { time: "14:22:08", event: "agent.auth.success", siteId: "site-1", target: "nordiskkaffe.se", source: "ssh install", ip: "10.12.4.18" },
  { time: "14:20:01", event: "agent.auth.success", siteId: "site-2", target: "lagominterior.se", source: "ssh install", ip: "10.12.4.19" },
  { time: "13:38:14", event: "agent.auth.failure", siteId: "site-5", target: "arcticoutdoor.com", source: "ssh install", ip: "10.40.2.7", reason: "timeout" },
  { time: "12:00:04", event: "agent.pair.complete", siteId: "site-3", target: "svenskcykel.se", source: "directadmin install", ip: "10.20.1.5" },
  { time: "11:48:22", event: "agent.auth.success", siteId: "site-2", target: "lagominterior.se", source: "installatron prep", ip: "10.12.4.19" },
];

export default function OnboardingPage() {
  const toast = useToast();
  const [tokens, setTokens] = useState<PairingToken[]>(initialTokens);
  const [domain, setDomain] = useState("");
  const [installPath, setInstallPath] = useState("/home/user/domains/example.se/public_html");
  const [label, setLabel] = useState("");

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
    toast.success("Kopierad", value.slice(0, 40));
  };

  const generate = () => {
    if (!label) {
      toast.error("Saknar etikett", "Ange en beskrivande etikett");
      return;
    }
    const token = `jwp_pair_${Math.random().toString(16).slice(2, 10)}`;
    setTokens((current) => [{ token, label, createdAt: new Date().toISOString().slice(0, 16).replace("T", " "), expiresAt: "om 24 tim", used: false }, ...current]);
    setLabel("");
    toast.success("Token skapad", token);
  };

  const install = `curl -sSL https://jetwp.io/install.sh | sudo bash -s -- \\
  --token <TOKEN> \\
  --domain ${domain || "<domain>"} \\
  --path ${installPath}`;

  const revoke = (token: string) => {
    setTokens((current) => current.map((entry) => entry.token === token ? { ...entry, used: true, expiresAt: "återkallad" } : entry));
    toast.info("Token återkallad", token);
  };

  const extend = (token: string) => {
    setTokens((current) => current.map((entry) => entry.token === token ? { ...entry, expiresAt: "om 48 tim" } : entry));
    toast.success("Giltighet förlängd", token);
  };

  return (
    <div className="space-y-6">
      <JetWPPageIntro title="Onboarding" subtitle="Koppla in WordPress-installationer från DirectAdmin, Installatron eller SSH till JetWP" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg/5">
              <Globe size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold">1. Välj installation</div>
              <div className="text-[11px] text-muted">Utgå från befintlig WordPress-installation hos hostingbolaget</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted">Domän</label>
              <Input className="mt-1" placeholder="t.ex. example.se" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted">Installationssökväg</label>
              <Input className="mt-1" placeholder="/home/user/domains/example.se/public_html" value={installPath} onChange={(e) => setInstallPath(e.target.value)} />
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
              <Box size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold">3. Anslut JetWP-agenten</div>
              <div className="text-[11px] text-muted">Via SSH eller i anslutning till befintligt Installatron-flöde</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border bg-bg/40 p-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Lyssnar på nya JetWP-agenter...
            </div>
            <div className="mt-2 text-[11px] text-muted">Sajten dyker upp i JetWP när agenten rapporterar in första gången.</div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-muted" />
            <div className="text-sm font-semibold">Installationskommando</div>
          </div>
          <Button variant="secondary" onClick={() => copy(install)}>
            <Copy size={12} className="mr-1.5" />Kopiera
          </Button>
        </div>
        <pre className="overflow-x-auto bg-bg p-5 font-mono text-[12px] leading-relaxed text-fg/80">{install}</pre>
        <div className="border-t px-5 py-3 text-[11px] text-muted">
          Kör via SSH på målservern eller i ett internt onboardingflöde. Återställningspunkter hanteras separat via Installatron.
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="text-sm font-semibold tracking-tight">Aktiva pairing-tokens</div>
            <span className="text-[11px] text-muted">{tokens.filter((token) => !token.used).length} aktiva</span>
          </div>
          <div className="divide-y divide-border/60">
            {tokens.map((token) => (
              <div key={token.token} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{token.label}</span>
                    {token.used ? <Badge tone="neutral">använd</Badge> : <Badge tone="success">aktiv</Badge>}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted">
                    <span className="truncate">{token.token}</span>
                    <span>·</span>
                    <span>skapad {token.createdAt}</span>
                    <span>·</span>
                    <span className={clsx(token.expiresAt === "gått ut" && "text-red-500")}>{token.expiresAt}</span>
                  </div>
                </div>
                {!token.used && (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => copy(token.token)}>
                      <Copy size={12} className="mr-1.5" />Kopiera
                    </Button>
                    <Button variant="secondary" onClick={() => extend(token.token)}>Förläng</Button>
                    <Button variant="secondary" onClick={() => revoke(token.token)}>Återkalla</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-muted" />
              <div className="text-sm font-semibold tracking-tight">Autentiseringshändelser</div>
            </div>
            <Button variant="secondary" onClick={() => toast.info("Uppdaterad", "Händelseloggen hämtad")}>
              <RefreshCw size={12} className="mr-1.5" />Uppdatera
            </Button>
          </div>
          <div className="divide-y divide-border/60">
            {authEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <span className={clsx(
                  "h-1.5 w-1.5 rounded-full",
                  event.event.includes("success") || event.event.includes("complete") ? "bg-emerald-500" : "bg-red-500",
                )} />
                <span className="font-mono text-[11px] tabular-nums text-muted">{event.time}</span>
                <span className="font-mono text-[11px]">{event.event}</span>
                <span className="flex-1 truncate text-[12px]">{event.target}</span>
                <span className="text-[11px] text-muted">{event.source}</span>
                <span className="font-mono text-[11px] text-muted">{event.ip}</span>
                {event.reason && <Badge tone="danger">{event.reason}</Badge>}
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
          <li>• Verifiera att incheckningar kommer in inom 30 sekunder.</li>
          <li>• Kör <span className="font-mono text-[12px]">integrity.check</span> för att skanna kärnfiler.</li>
          <li>• Säkerställ att rätt arbetsflöden är aktiva för sajten.</li>
          <li>• Lägg till sajten i relevanta larm- och rapportflöden i JetWP.</li>
          <li>• Kontrollera eventuella återställningspunkter separat via Installatron.</li>
        </ul>
      </Card>
    </div>
  );
}

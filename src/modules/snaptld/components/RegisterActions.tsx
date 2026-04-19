"use client";

import { ExternalLink, Gavel, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Table";
import type { DomainAnalysis } from "@/modules/snaptld/data/core";
import { ExpiryBadge } from "./ExpiryBadge";

interface Registrar {
  id: string;
  name: string;
  country: "se" | "global";
  url: (domain: string) => string;
  estimate: string;
}

const registrars: Registrar[] = [
  {
    id: "loopia",
    name: "Loopia",
    country: "se",
    url: (d) => `https://www.loopia.se/domain/?domain=${encodeURIComponent(d)}`,
    estimate: "från 99 kr/år",
  },
  {
    id: "binero",
    name: "Binero",
    country: "se",
    url: (d) => `https://www.binero.se/domannamn/registrera/?domain=${encodeURIComponent(d)}`,
    estimate: "från 89 kr/år",
  },
  {
    id: "one",
    name: "One.com",
    country: "global",
    url: (d) => `https://www.one.com/en/domain?domain=${encodeURIComponent(d)}`,
    estimate: "från 95 kr/år",
  },
  {
    id: "namecheap",
    name: "Namecheap",
    country: "global",
    url: (d) => `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(d)}`,
    estimate: "från $8.88/år",
  },
];

export function RegisterActions({ domain }: { domain: DomainAnalysis }) {
  const preferred = domain.tld === ".se" || domain.tld === ".nu"
    ? registrars.filter((r) => r.country === "se")
    : registrars.filter((r) => r.country === "global");
  const rest = registrars.filter((r) => !preferred.includes(r));

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag size={14} className="text-fg/70" />
            <h2 className="text-sm font-semibold tracking-tight">Registrera domänen</h2>
            <Badge tone="success">Tillgänglig</Badge>
          </div>
          <p className="mt-1 text-xs text-muted">
            Länkar till registrarer. Öppnas i ny flik — priset och tillgänglighet verifieras där.
          </p>
        </div>
        <ExpiryBadge expiresAt={domain.expiresAt} variant="long" />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {preferred.map((r) => (
          <RegistrarLink key={r.id} r={r} domain={domain.domain} primary />
        ))}
        {rest.map((r) => (
          <RegistrarLink key={r.id} r={r} domain={domain.domain} />
        ))}
      </div>
    </Card>
  );
}

function RegistrarLink({ r, domain, primary }: { r: Registrar; domain: string; primary?: boolean }) {
  return (
    <a
      href={r.url(domain)}
      target="_blank"
      rel="noreferrer"
      className={clsx(
        "group flex items-center gap-3 rounded-xl border p-3 transition-colors",
        primary ? "bg-fg/5 hover:bg-fg/10" : "bg-surface hover:bg-bg/60",
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold">
        {r.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold">{r.name}</span>
          {primary && <Badge tone="neutral">Rekommenderad</Badge>}
        </div>
        <div className="text-xs text-muted">{r.estimate}</div>
      </div>
      <ExternalLink size={14} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export function AuctionNotice({ domain }: { domain: DomainAnalysis }) {
  if (domain.source !== "manual" || !domain.domain.endsWith(".io")) return null;

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Gavel size={16} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">På auktion just nu</h3>
          <p className="mt-1 text-xs text-muted">
            Domänen är listad på SnapNames. Nuvarande bud: <span className="font-semibold tabular-nums text-fg">$240</span> · Slutar
            <span className="font-mono tabular-nums text-fg"> 2026-04-21 18:00</span>.
          </p>
          <a
            href={`https://www.snapnames.com/search?q=${encodeURIComponent(domain.domain)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
          >
            Lägg bud på SnapNames
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </Card>
  );
}

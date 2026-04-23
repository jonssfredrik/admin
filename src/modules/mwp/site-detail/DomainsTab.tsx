"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { domainInventory, type DomainEntry } from "@/modules/mwp/extended-data";

interface DomainsTabProps {
  siteId: string;
  domain: string;
  sslDays: number;
}

const kindLabels = {
  primary: "primär",
  alias: "alias",
  redirect: "redirect",
} as const;

const dnsLabels = {
  verified: "verifierad",
  pending: "väntar",
  error: "fel",
} as const;

const sslLabels = {
  active: "aktiv",
  renewing: "förnyas",
  expiring: "går ut",
} as const;

const recordStatusLabels = {
  ok: "ok",
  pending: "väntar",
  mismatch: "matchar inte",
} as const;

export function DomainsTab({ siteId, domain, sslDays }: DomainsTabProps) {
  const toast = useToast();
  const [domains, setDomains] = useState<DomainEntry[]>(domainInventory[siteId] ?? [{
    id: `${siteId}-default`,
    host: domain,
    kind: "primary",
    dnsStatus: "verified",
    sslStatus: sslDays < 30 ? "expiring" : "active",
    wwwMode: "root",
    records: [
      { type: "A", name: "@", value: "203.0.113.55", status: "ok" },
      { type: "CNAME", name: "www", value: domain, status: "ok" },
    ],
  }]);
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id ?? "");
  const [newDomain, setNewDomain] = useState("");

  const selected = domains.find((entry) => entry.id === selectedDomainId) ?? domains[0];

  const addDomain = () => {
    if (!newDomain.trim()) return;
    const item: DomainEntry = {
      id: `domain-${Date.now()}`,
      host: newDomain.trim(),
      kind: "alias",
      dnsStatus: "pending",
      sslStatus: "renewing",
      wwwMode: "both",
      records: [{ type: "CNAME", name: newDomain.split(".")[0], value: "edge.mwp.io", status: "pending" }],
    };
    setDomains((current) => [...current, item]);
    setSelectedDomainId(item.id);
    setNewDomain("");
    toast.success("Domän tillagd", item.host);
  };

  const removeDomain = (id: string) => {
    setDomains((current) => current.filter((entry) => entry.id !== id));
    setSelectedDomainId((current) => current === id ? domains[0]?.id ?? "" : current);
    toast.info("Domän borttagen", id);
  };

  const updateWww = (mode: "root" | "www" | "both") => {
    setDomains((current) => current.map((entry) => entry.id === selected.id ? { ...entry, wwwMode: mode } : entry));
    toast.success("www-läge uppdaterat", mode);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold tracking-tight">Ytterligare domäner</div>
            <div className="mt-1 text-xs text-muted">Hantera alias, redirects, DNS och SSL-status.</div>
          </div>
          <div className="flex min-w-[320px] gap-2">
            <Input placeholder="kund.example.se" value={newDomain} onChange={(event) => setNewDomain(event.target.value)} />
            <Button onClick={addDomain}>
              <Plus size={14} className="mr-1.5" />
              Lägg till
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-3 text-sm font-semibold tracking-tight">Domänöversikt</div>
          <div className="divide-y divide-border/60">
            {domains.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedDomainId(entry.id)}
                className={clsx("flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-bg/50", selected?.id === entry.id && "bg-bg/60")}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{entry.host}</span>
                    <Badge tone={entry.kind === "primary" ? "success" : entry.kind === "redirect" ? "warning" : "neutral"}>{kindLabels[entry.kind]}</Badge>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                    <span>DNS {dnsLabels[entry.dnsStatus]}</span>
                    <span>·</span>
                    <span>SSL {sslLabels[entry.sslStatus]}</span>
                    {entry.redirectTo && (
                      <>
                        <span>·</span>
                        <span>{entry.redirectTo}</span>
                      </>
                    )}
                  </div>
                </div>
                {entry.kind !== "primary" && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removeDomain(entry.id);
                    }}
                    className="rounded-md p-1.5 text-muted hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </button>
            ))}
          </div>
        </Card>

        {selected && (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">{selected.host}</div>
                <div className="text-xs text-muted">DNS- och redirectinställningar</div>
              </div>
              <Badge tone={selected.dnsStatus === "verified" ? "success" : selected.dnsStatus === "pending" ? "warning" : "danger"}>
                {dnsLabels[selected.dnsStatus]}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">www-läge</div>
              <div className="mt-2 flex gap-2">
                {(["root", "www", "both"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateWww(mode)}
                    className={clsx("rounded-md border px-3 py-1.5 text-xs font-medium", selected.wwwMode === mode ? "bg-bg text-fg" : "text-muted")}
                  >
                    {mode === "root" ? "rot" : mode === "www" ? "www" : "båda"}
                  </button>
                ))}
              </div>
            </div>

            {selected.redirectTo && (
              <div className="mt-4 rounded-lg border bg-bg/40 p-3 text-sm">
                <div className="font-medium">Redirectmål</div>
                <div className="mt-1 text-muted">{selected.redirectTo}</div>
              </div>
            )}

            <div className="mt-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">DNS-poster</div>
              <div className="space-y-2">
                {selected.records.map((record, index) => (
                  <div key={`${record.name}-${index}`} className="flex items-center gap-3 rounded-lg border bg-bg/40 px-3 py-2 text-sm">
                    <span className="w-14 font-mono text-xs text-muted">{record.type}</span>
                    <span className="w-20 font-mono text-xs">{record.name}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{record.value}</span>
                    <Badge tone={record.status === "ok" ? "success" : record.status === "pending" ? "warning" : "danger"}>
                      {recordStatusLabels[record.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

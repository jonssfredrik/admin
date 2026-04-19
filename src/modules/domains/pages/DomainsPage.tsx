"use client";

import { useMemo, useState } from "react";
import { Globe, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Table, Th, Td, Badge } from "@/components/ui/Table";
import { domainRecords } from "@/modules/domains/data";

const usageTone = {
  active: "success",
  "for-sale": "warning",
  parked: "neutral",
} as const;

const statusTone = {
  healthy: "success",
  expiring: "warning",
  attention: "danger",
} as const;

export function DomainsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return domainRecords;
    return domainRecords.filter((domain) =>
      [domain.name, domain.registrar, domain.notes].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query]);

  const active = domainRecords.filter((domain) => domain.usage === "active").length;
  const expiring = domainRecords.filter((domain) => domain.status === "expiring").length;
  const salePool = domainRecords.filter((domain) => domain.usage === "for-sale").length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Domains"
          subtitle="Överblick över domäner, användning, förnyelser och försäljningsvärde."
        />
        <div className="flex items-center gap-2 rounded-xl border bg-surface px-3 py-2 text-sm text-muted">
          <Globe size={15} />
          Domänportfölj
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Aktiva domäner" value={String(active)} hint="Driver produkter eller innehåll" />
        <StatCard label="Utgår snart" value={String(expiring)} hint="Behöver beslut inom 60 dagar" />
        <StatCard label="Till salu" value={String(salePool)} hint="Kan rankas och prioriteras" />
      </div>

      <section className="space-y-3">
        <div className="relative max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök domän, registrar eller anteckning…"
          />
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Domän</Th>
              <Th>Användning</Th>
              <Th>Status</Th>
              <Th>Registrar</Th>
              <Th>Förnyas</Th>
              <Th className="text-right">Värde</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((domain) => (
              <tr key={domain.id} className="transition-colors hover:bg-bg/50">
                <Td>
                  <div>
                    <div className="font-medium">{domain.name}</div>
                    <div className="text-xs text-muted">{domain.notes}</div>
                  </div>
                </Td>
                <Td>
                  <Badge tone={usageTone[domain.usage]}>
                    {domain.usage === "active"
                      ? "Aktiv"
                      : domain.usage === "for-sale"
                        ? "Till salu"
                        : "Parkerad"}
                  </Badge>
                </Td>
                <Td>
                  <Badge tone={statusTone[domain.status]}>
                    {domain.status === "healthy"
                      ? "Stabil"
                      : domain.status === "expiring"
                        ? "Utgår snart"
                        : "Kräver åtgärd"}
                  </Badge>
                </Td>
                <Td>{domain.registrar}</Td>
                <Td className="font-mono text-xs tabular-nums text-muted">{domain.expiresAt}</Td>
                <Td className="text-right font-medium">{domain.monthlyValue}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  );
}

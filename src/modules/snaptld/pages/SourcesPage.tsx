"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FeedCard } from "@/modules/snaptld/components/FeedCard";
import { ImportDialog } from "@/modules/snaptld/components/ImportDialog";
import type { FeedSource } from "@/modules/snaptld/types";

export function SourcesPage({ feeds }: { feeds: FeedSource[] }) {
  const [importOpen, setImportOpen] = useState(false);

  const total = feeds.reduce((sum, feed) => sum + feed.domainsLastRun, 0);
  const active = feeds.filter((feed) => feed.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Källor"
          subtitle="Feeds och manuell import. SnapTLD hämtar automatiskt utgångna domäner enligt schemat."
        />
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-1.5" onClick={() => setImportOpen(true)}>
            <Upload size={14} />
            Manuell import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Aktiva feeds</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">{active}/{feeds.length}</div>
          <div className="mt-1 text-xs text-muted">Körs automatiskt enligt schemat</div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Senaste 24h</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">{total.toLocaleString("sv-SE")}</div>
          <div className="mt-1 text-xs text-muted">Hämtade domäner över alla källor</div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Parallellitet</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">8 steg</div>
          <div className="mt-1 text-xs text-muted">Tillgängliga analyssteg per domän</div>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">Konfigurerade feeds</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {feeds.map((feed) => (
            <FeedCard key={feed.id} feed={feed} />
          ))}
        </div>
      </section>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

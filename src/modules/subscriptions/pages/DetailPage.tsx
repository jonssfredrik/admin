"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
  Pencil,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AreaChart } from "@/components/charts/AreaChart";
import { useToast } from "@/components/toast/ToastProvider";
import { SubscriptionDialog } from "@/modules/subscriptions/components/SubscriptionDialog";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";
import {
  categoryMeta,
  cycleLabel,
  cycleShortLabel,
  formatSEK,
  ownerMeta,
  paymentMethodMeta,
  statusMeta,
  toMonthly,
  type Subscription,
} from "@/modules/subscriptions/data/core";

function daysFromNow(dateStr: string) {
  return Math.floor((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function totalPaidSince(sub: Subscription): number {
  const months = Math.max(
    0,
    Math.floor((Date.now() - new Date(sub.startedAt).getTime()) / (86400000 * 30.4375)),
  );
  return Math.round(toMonthly(sub.amountSEK, sub.billingCycle) * months);
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { hydrated, items, update, remove, duplicate, markPaid, setArchived } = useSubscriptions();
  const { success, error, info } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const sub = useMemo(() => items.find((s) => s.id === id), [items, id]);

  if (hydrated && !sub) notFound();
  if (!sub) return null;

  const cat = categoryMeta[sub.category];
  const st = statusMeta[sub.status];
  const own = ownerMeta[sub.owner ?? "private"];
  const monthly = toMonthly(sub.amountSEK, sub.billingCycle);
  const days = daysFromNow(sub.nextRenewal);

  const priceData = useMemo(() => {
    const hist = sub.priceHistory ?? [{ date: sub.startedAt, amountSEK: sub.amountSEK }];
    const points = [...hist];
    const last = points[points.length - 1];
    if (!last || last.amountSEK !== sub.amountSEK) {
      points.push({ date: new Date().toISOString().slice(0, 10), amountSEK: sub.amountSEK });
    }
    return points.map((p) => ({
      label: new Date(p.date).toLocaleDateString("sv-SE", { month: "short", year: "2-digit" }),
      value: p.amountSEK,
    }));
  }, [sub]);

  const handleSave = (data: Omit<Subscription, "id">) => {
    update(sub.id, data);
    success("Abonnemang uppdaterat", sub.name);
  };

  const handleMarkPaid = () => {
    markPaid(sub.id);
    success("Markerad som betald", "Nästa förnyelse framflyttad");
  };

  const handleDuplicate = () => {
    duplicate(sub.id);
    info("Abonnemang duplicerat", `${sub.name} (kopia)`);
  };

  const handleArchive = () => {
    const next = !sub.archived;
    setArchived(sub.id, next);
    success(next ? "Arkiverat" : "Återställt", sub.name);
  };

  const handleCancel = () => {
    update(sub.id, { status: "cancelled", cancelledAt: new Date().toISOString().slice(0, 10) });
    success("Prenumeration avslutad", sub.name);
    setCancelOpen(false);
  };

  const handleDelete = () => {
    remove(sub.id);
    error("Abonnemang borttaget", sub.name);
    router.push("/subscriptions");
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/subscriptions"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
      >
        <ArrowLeft size={13} />
        Tillbaka till översikt
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="mt-2 h-3 w-3 shrink-0 rounded-full"
            style={{ background: cat.color }}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{sub.name}</h1>
              <Badge tone={st.tone}>{st.label}</Badge>
              {sub.archived && <Badge tone="neutral">Arkiverad</Badge>}
              {sub.businessExpense && <Badge tone="success">Avdragsgill</Badge>}
            </div>
            {sub.description && <p className="mt-1 text-sm text-muted">{sub.description}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span>{cat.label}</span>
              <span>·</span>
              <span>{cycleLabel[sub.billingCycle]}</span>
              <span>·</span>
              <span>{own.label}</span>
              {sub.website && (
                <>
                  <span>·</span>
                  <a
                    href={sub.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-fg"
                  >
                    {sub.website.replace(/^https?:\/\//, "")}
                    <ExternalLink size={10} />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setDialogOpen(true)} className="gap-1.5">
            <Pencil size={13} /> Redigera
          </Button>
          {sub.status !== "cancelled" && (
            <Button variant="primary" onClick={handleMarkPaid} className="gap-1.5">
              <CheckCircle size={13} /> Markera betald
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Pris</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {formatSEK(sub.amountSEK)}
            <span className="text-base font-normal text-muted">{cycleShortLabel(sub.billingCycle)}</span>
          </div>
          {sub.billingCycle !== "monthly" && (
            <div className="mt-0.5 text-xs text-muted tabular-nums">
              ≈ {formatSEK(Math.round(monthly))}/mån
            </div>
          )}
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Årskostnad</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {formatSEK(Math.round(monthly * 12))}
          </div>
          <div className="mt-0.5 text-xs text-muted">Prognos helår</div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Nästa förnyelse</div>
          <div
            className={clsx(
              "mt-1 text-2xl font-semibold tabular-nums",
              days < 0 ? "text-red-600 dark:text-red-400"
                : days < 14 ? "text-amber-600 dark:text-amber-400"
                : "",
            )}
          >
            {days < 0 ? "Förfallen" : days === 0 ? "Idag" : `${days} d`}
          </div>
          <div className="mt-0.5 text-xs text-muted">{formatDate(sub.nextRenewal)}</div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase tracking-wider text-muted">Totalt betalt</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {formatSEK(totalPaidSince(sub))}
          </div>
          <div className="mt-0.5 text-xs text-muted">Sedan {formatDate(sub.startedAt)}</div>
        </Card>
      </div>

      {/* Price history + info */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <h2 className="text-sm font-semibold tracking-tight">Prisutveckling</h2>
          <p className="text-xs text-muted">
            {priceData.length >= 2
              ? "Ändringar över tid baserat på loggad historik."
              : "Endast ett pris loggat — prisändringar loggas automatiskt när du redigerar beloppet."}
          </p>
          <div className="mt-4">
            {priceData.length >= 2 ? (
              <AreaChart data={priceData} height={190} formatValue={(v) => formatSEK(v)} />
            ) : (
              <div className="flex h-[190px] items-center justify-center text-sm text-muted">
                Ingen prishistorik ännu.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b px-5 py-4">
            <h2 className="text-sm font-semibold tracking-tight">Detaljer</h2>
          </div>
          <div className="divide-y px-5">
            <InfoRow label="Startdatum" value={formatDate(sub.startedAt)} />
            <InfoRow label="Fakturacykel" value={cycleLabel[sub.billingCycle]} />
            <InfoRow label="Betalmetod" value={paymentMethodMeta[sub.paymentMethod ?? "card"].label} />
            <InfoRow label="Typ" value={<Badge tone={own.tone}>{own.label}</Badge>} />
            <InfoRow label="Företagsutgift" value={sub.businessExpense ? "Ja" : "Nej"} />
            <InfoRow label="Påminn" value={sub.reminderDaysBefore != null ? `${sub.reminderDaysBefore} dagar innan` : "—"} />
            {sub.cancelledAt && (
              <InfoRow label="Avslutad" value={formatDate(sub.cancelledAt)} />
            )}
          </div>
        </Card>
      </div>

      {/* Notes */}
      {sub.notes && (
        <Card>
          <h2 className="mb-2 text-sm font-semibold tracking-tight">Anteckningar</h2>
          <p className="whitespace-pre-wrap text-sm text-muted">{sub.notes}</p>
        </Card>
      )}

      {/* Price history list */}
      {sub.priceHistory && sub.priceHistory.length > 1 && (
        <Card className="p-0">
          <div className="border-b px-5 py-4">
            <h2 className="text-sm font-semibold tracking-tight">Loggade prisändringar</h2>
          </div>
          <div className="divide-y">
            {[...sub.priceHistory].reverse().map((p, i, arr) => {
              const prev = arr[i + 1];
              const diff = prev ? p.amountSEK - prev.amountSEK : 0;
              return (
                <div key={`${p.date}-${i}`} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <span className="text-muted">{formatDate(p.date)}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium tabular-nums">{formatSEK(p.amountSEK)}</span>
                    {diff !== 0 && (
                      <Badge tone={diff > 0 ? "danger" : "success"}>
                        {diff > 0 ? "+" : ""}{formatSEK(diff)}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Secondary actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={handleDuplicate} className="gap-1.5">
          <Copy size={13} /> Duplicera
        </Button>
        {sub.status !== "cancelled" && (
          <Button
            variant="secondary"
            onClick={() => {
              const next = sub.status === "paused" ? "active" : "paused";
              update(sub.id, { status: next });
              success(next === "active" ? "Återaktiverat" : "Pausat", sub.name);
            }}
            className="gap-1.5"
          >
            <RefreshCw size={13} /> {sub.status === "paused" ? "Aktivera" : "Pausa"}
          </Button>
        )}
        <Button variant="secondary" onClick={handleArchive} className="gap-1.5">
          {sub.archived ? <><ArchiveRestore size={13} /> Återställ</> : <><Archive size={13} /> Arkivera</>}
        </Button>
        {sub.status !== "cancelled" && (
          <Button variant="secondary" onClick={() => setCancelOpen(true)} className="gap-1.5">
            <XCircle size={13} /> Avsluta
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => setDeleteOpen(true)}
          className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/5 dark:text-red-400"
        >
          <Trash2 size={13} /> Ta bort
        </Button>
      </div>

      <SubscriptionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initial={sub}
      />

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Avsluta prenumeration"
        description={`"${sub.name}" markeras som avslutad.`}
        confirmLabel="Avsluta"
        tone="danger"
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Ta bort abonnemang"
        description={`"${sub.name}" tas bort permanent.`}
        confirmLabel="Ta bort"
        tone="danger"
      />
    </div>
  );
}

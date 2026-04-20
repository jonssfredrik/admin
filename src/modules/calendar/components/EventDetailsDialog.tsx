"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  CalendarClock,
  CircleDollarSign,
  ExternalLink,
  FileText,
  Globe,
  Pencil,
  Radar,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { invoiceDrafts } from "@/modules/billing/data";
import {
  categoryMeta,
  daysUntil,
  formatDateLong,
  formatTimeLabel,
  getEventTone,
  recurrenceLabel,
  sourceMeta,
  type ResolvedCalendarEvent,
} from "@/modules/calendar/data/core";
import { domainAnalyses, verdictMeta } from "@/modules/snaptld/data/core";
import {
  cycleLabel,
  formatSEK,
  ownerMeta,
  paymentMethodMeta,
  statusMeta,
} from "@/modules/subscriptions/data/core";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";

interface Props {
  open: boolean;
  event: ResolvedCalendarEvent | null;
  onClose: () => void;
  onEditManual?: (event: ResolvedCalendarEvent) => void;
}

function SectionTitle({ icon: Icon, title }: { icon: typeof CalendarClock; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
      <Icon size={15} />
      {title}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border bg-bg/30 p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{item.label}</div>
          <div className="mt-1 text-sm font-medium">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-surface px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

export function EventDetailsDialog({ open, event, onClose, onEditManual }: Props) {
  const { items: subscriptions } = useSubscriptions();

  if (!open || !event) return null;

  const tone = getEventTone(event);
  const category = categoryMeta[event.category];
  const source = sourceMeta[event.source];
  const subscription = event.source === "subscriptions" ? subscriptions.find((item) => item.id === event.sourceRef) : null;
  const invoice = event.source === "billing" ? invoiceDrafts.find((item) => item.id === event.sourceRef) : null;
  const domain = event.source === "snaptld" ? domainAnalyses.find((item) => item.slug === event.sourceRef) : null;
  const dayOffset = daysUntil(event.date);

  const relativeLabel =
    dayOffset === 0 ? "Idag" : dayOffset === 1 ? "Imorgon" : dayOffset < 0 ? `${Math.abs(dayOffset)} dagar sedan` : `Om ${dayOffset} dagar`;

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Stäng
      </Button>
      {event.source === "manual" ? (
        <Button onClick={() => onEditManual?.(event)} className="gap-1.5">
          <Pencil size={14} />
          Redigera händelse
        </Button>
      ) : event.href ? (
        <Link
          href={event.href}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-fg px-3.5 text-sm font-medium text-bg transition-colors hover:opacity-90"
        >
          {event.actionLabel ?? `Öppna i ${source.label}`}
          <ExternalLink size={14} className="ml-1.5" />
        </Link>
      ) : null}
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={event.title}
      description={event.description ?? "Detaljerad informationsvy för vald kalenderhändelse."}
      size="xl"
      footer={footer}
    >
      <div className="space-y-6">
        <div className={clsx("rounded-2xl border p-5", tone.chipClass, tone.borderClass)}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={clsx("inline-flex rounded-md px-2 py-1 text-[11px] font-medium", tone.chipClass)}>
                  {source.label}
                </span>
                <span className={clsx("inline-flex rounded-md px-2 py-1 text-[11px] font-medium", category.badgeClass)}>
                  {category.label}
                </span>
                {event.recurrence && event.recurrence !== "none" ? (
                  <span className="inline-flex rounded-md bg-fg/10 px-2 py-1 text-[11px] font-medium text-fg">
                    {recurrenceLabel(event.recurrence)}
                  </span>
                ) : null}
              </div>

              <div>
                <div className="text-2xl font-semibold tracking-tight">{event.title}</div>
                <div className="mt-1 text-sm text-muted">{event.description ?? "Ingen extra beskrivning angiven."}</div>
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[420px]">
              <StatPill label="Datum" value={formatDateLong(event.date)} />
              <StatPill label="Tid" value={formatTimeLabel(event.time, event.endTime)} />
              <StatPill label="Status" value={event.statusLabel ?? "Planerad"} />
              <StatPill label="När" value={relativeLabel} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="space-y-3">
              <SectionTitle icon={CalendarClock} title="Översikt" />
              <InfoGrid
                items={[
                  { label: "Källa", value: source.label },
                  { label: "Kategori", value: category.label },
                  { label: "Kontext", value: event.sourceDetail ?? "Ingen extra kontext" },
                  { label: "Återkommer", value: recurrenceLabel(event.recurrence) ?? "Nej" },
                ]}
              />
            </div>

            {event.source === "manual" ? (
              <div className="space-y-3">
                <SectionTitle icon={FileText} title="Egen händelse" />
                <InfoGrid
                  items={[
                    { label: "Typ", value: "Manuell kalenderhändelse" },
                    { label: "Redigering", value: "Kan ändras direkt i kalendern" },
                    { label: "Beskrivning", value: event.description ?? "Ingen beskrivning angiven" },
                    { label: "Status", value: "Lokal sparad i webbläsaren" },
                  ]}
                />
              </div>
            ) : null}

            {subscription ? (
              <div className="space-y-3">
                <SectionTitle icon={CircleDollarSign} title="Abonnemangsdetaljer" />
                <InfoGrid
                  items={[
                    { label: "Pris", value: formatSEK(subscription.amountSEK) },
                    { label: "Cykel", value: cycleLabel[subscription.billingCycle] },
                    { label: "Status", value: statusMeta[subscription.status].label },
                    { label: "Nästa förnyelse", value: subscription.nextRenewal },
                    { label: "Betalmetod", value: paymentMethodMeta[subscription.paymentMethod ?? "card"].label },
                    { label: "Ägare", value: ownerMeta[subscription.owner ?? "private"].label },
                  ]}
                />
                {subscription.notes ? (
                  <div className="rounded-xl border bg-bg/30 p-4 text-sm text-muted">{subscription.notes}</div>
                ) : null}
              </div>
            ) : null}

            {invoice ? (
              <div className="space-y-3">
                <SectionTitle icon={ReceiptText} title="Fakturadetaljer" />
                <InfoGrid
                  items={[
                    { label: "Faktura", value: invoice.id },
                    { label: "Bolag", value: invoice.company },
                    { label: "Kund", value: invoice.customer },
                    { label: "Belopp", value: invoice.amount },
                    { label: "Status", value: invoice.status === "draft" ? "Utkast" : "Skickad" },
                    { label: "Kategori", value: invoice.category },
                  ]}
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            {domain ? (
              <div className="space-y-3">
                <SectionTitle icon={Radar} title="SnapTLD-detaljer" />
                <InfoGrid
                  items={[
                    { label: "Domän", value: domain.domain },
                    { label: "Score", value: `${domain.totalScore}/100` },
                    { label: "Verdict", value: verdictMeta[domain.verdict].label },
                    { label: "Utgångsdatum", value: domain.expiresAt },
                    { label: "Estimerat värde", value: domain.estimatedValue },
                    { label: "Källa", value: domain.source },
                  ]}
                />
                <div className="rounded-2xl border bg-bg/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-tight">
                    <Sparkles size={15} />
                    AI-sammanfattning
                  </div>
                  <div className="text-sm text-muted">{domain.aiSummary}</div>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <SectionTitle icon={Globe} title="Nästa steg" />
              <div className="rounded-2xl border bg-bg/30 p-4 text-sm text-muted">
                {event.source === "manual"
                  ? "Den här händelsen kan redigeras direkt från kalendern. Använd knappen nedan för att ändra titel, tid, återkomst eller beskrivning."
                  : `Det här eventet kommer från ${source.label}. Öppna källmodulen för fullständig detaljvy och vidare åtgärder.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

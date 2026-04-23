"use client";

import { useMemo } from "react";
import { formatInvoiceAmount, invoiceStatusLabel } from "@/modules/billing/lib/format";
import { listInvoices } from "@/modules/billing/lib/invoices";
import { domainAnalyses } from "@/modules/snaptld/data";
import { useSubscriptions } from "@/modules/subscriptions/lib/useSubscriptions";
import {
  daysUntil,
  expandManualEvents,
  inRange,
  sortEvents,
  type EventSource,
  type ResolvedCalendarEvent,
} from "@/modules/calendar/data/core";
import { useEvents } from "@/modules/calendar/lib/useEvents";

interface Range {
  start: string;
  end: string;
}

const verdictLabel = {
  excellent: "Utmärkt",
  good: "Bra",
  mediocre: "Medel",
  skip: "Svag",
} as const;

export function useCalendarFeed(range: Range, enabledSources: EventSource[]) {
  const eventStore = useEvents();
  const subscriptions = useSubscriptions();
  const billingInvoices = listInvoices();

  const externalEvents = useMemo<ResolvedCalendarEvent[]>(() => {
    const subscriptionEvents = subscriptions.items
      .filter((subscription) => !subscription.archived && subscription.status === "active")
      .map((subscription) => ({
        id: subscription.id,
        instanceId: `subscriptions:${subscription.id}:${subscription.nextRenewal}`,
        entityId: subscription.id,
        title: subscription.name,
        description: `Nästa förnyelse ${subscription.nextRenewal}`,
        date: subscription.nextRenewal,
        category: "deadline" as const,
        source: "subscriptions" as const,
        sourceRef: subscription.id,
        href: `/subscriptions/${subscription.id}`,
        isAggregated: true,
        statusLabel: daysUntil(subscription.nextRenewal) <= 0 ? "Förfaller nu" : "Kommande förnyelse",
        sourceDetail: "Abonnemang",
        actionLabel: "Öppna abonnemang",
      }));

    const billingEvents = billingInvoices
      .filter((invoice) => invoice.status !== "paid")
      .map((invoice) => ({
        id: invoice.id,
        instanceId: `billing:${invoice.id}:${invoice.dueDate}`,
        entityId: invoice.id,
        title: `Faktura ${invoice.id}`,
        description: `${invoice.customerName} · ${formatInvoiceAmount(invoice.amountOre, invoice.currency)}`,
        date: invoice.dueDate,
        category: "deadline" as const,
        source: "billing" as const,
        sourceRef: invoice.id,
        href: `/billing/${invoice.id}`,
        isAggregated: true,
        statusLabel: invoiceStatusLabel[invoice.status],
        sourceDetail: invoice.companyName,
        actionLabel: "Öppna faktura",
      }));

    const snaptldEvents = domainAnalyses.map((domain) => ({
      id: domain.slug,
      instanceId: `snaptld:${domain.slug}:${domain.expiresAt}`,
      entityId: domain.slug,
      title: domain.domain,
      description: `Utgångsdatum · ${verdictLabel[domain.verdict]}`,
      date: domain.expiresAt,
      category: "reminder" as const,
      source: "snaptld" as const,
      sourceRef: domain.slug,
      href: `/snaptld/${domain.slug}`,
      isAggregated: true,
      statusLabel: domain.status === "running" ? "Analys pågår" : verdictLabel[domain.verdict],
      sourceDetail: "Domänbevakning",
      actionLabel: "Öppna domän",
    }));

    return [...subscriptionEvents, ...billingEvents, ...snaptldEvents];
  }, [billingInvoices, subscriptions.items]);

  const events = useMemo(() => {
    const sourceSet = new Set(enabledSources);
    const manualEvents = expandManualEvents(eventStore.events, range.start, range.end);
    const aggregatedEvents = externalEvents.filter((event) => inRange(event.date, range.start, range.end));

    return [...manualEvents, ...aggregatedEvents]
      .filter((event) => sourceSet.has(event.source))
      .sort(sortEvents);
  }, [enabledSources, eventStore.events, externalEvents, range.end, range.start]);

  return {
    hydrated: eventStore.hydrated && subscriptions.hydrated,
    events,
    manualEvents: eventStore.events,
    addEvent: eventStore.add,
    updateEvent: eventStore.update,
    removeEvent: eventStore.remove,
    getManualEvent: (id: string) => eventStore.events.find((event) => event.id === id),
  };
}

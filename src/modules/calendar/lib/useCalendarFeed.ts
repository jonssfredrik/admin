"use client";

import { useMemo } from "react";
import { formatInvoiceAmount, invoiceDisplayNumber, invoiceDisplayStatus } from "@/modules/billing/lib/format";
import { invoiceTotals } from "@/modules/billing/lib/totals";
import { useCompanies } from "@/modules/billing/lib/useCompanies";
import { useInvoices } from "@/modules/billing/lib/useInvoices";
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


export function useCalendarFeed(range: Range, enabledSources: EventSource[]) {
  const eventStore = useEvents();
  const subscriptions = useSubscriptions();
  const { items: billingInvoices } = useInvoices();
  const { items: companies } = useCompanies();

  const externalEvents = useMemo<ResolvedCalendarEvent[]>(() => {
    const companyName = new Map(companies.map((c) => [c.id, c.name]));

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
        title: `Faktura ${invoiceDisplayNumber(invoice)}`,
        description: `${invoice.customer.name} · ${formatInvoiceAmount(invoiceTotals(invoice).totalOre, invoice.currency)}`,
        date: invoice.dueDate,
        category: "deadline" as const,
        source: "billing" as const,
        sourceRef: invoice.id,
        href: `/billing/${invoice.id}`,
        isAggregated: true,
        statusLabel: invoiceDisplayStatus(invoice).label,
        sourceDetail: companyName.get(invoice.companyId) ?? "Okänt företag",
        actionLabel: "Öppna faktura",
      }));

    return [...subscriptionEvents, ...billingEvents];
  }, [billingInvoices, companies, subscriptions.items]);

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

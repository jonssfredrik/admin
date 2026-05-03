import type {
  Subscription as PrismaSubscription,
  SubscriptionPricePoint as PrismaSubscriptionPricePoint,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
  advanceRenewal,
  type BillingCycle,
  type Subscription,
  type SubscriptionCategory,
  type SubscriptionStatus,
} from "@/modules/subscriptions/data/core";

type SubscriptionWithHistory = PrismaSubscription & {
  priceHistory: PrismaSubscriptionPricePoint[];
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function toSubscription(row: SubscriptionWithHistory): Subscription {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category as SubscriptionCategory,
    status: row.status as SubscriptionStatus,
    amountSEK: row.amountSEK,
    billingCycle: row.billingCycle as BillingCycle,
    startedAt: row.startedAt,
    nextRenewal: row.nextRenewal,
    cancelledAt: row.cancelledAt ?? undefined,
    website: row.website ?? undefined,
    notes: row.notes ?? undefined,
    owner: (row.owner as Subscription["owner"]) ?? undefined,
    businessExpense: row.businessExpense || undefined,
    reminderDaysBefore: row.reminderDaysBefore ?? undefined,
    archived: row.archived || undefined,
    priceHistory: row.priceHistory
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((point) => ({ date: point.date, amountSEK: point.amountSEK })),
  };
}

function toData(input: Partial<Omit<Subscription, "id" | "priceHistory">>) {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.category !== undefined) data.category = input.category;
  if (input.status !== undefined) data.status = input.status;
  if (input.amountSEK !== undefined) data.amountSEK = Math.round(input.amountSEK);
  if (input.billingCycle !== undefined) data.billingCycle = input.billingCycle;
  if (input.startedAt !== undefined) data.startedAt = input.startedAt;
  if (input.nextRenewal !== undefined) data.nextRenewal = input.nextRenewal;
  if (input.cancelledAt !== undefined) data.cancelledAt = input.cancelledAt ?? null;
  if (input.website !== undefined) data.website = input.website || null;
  if (input.notes !== undefined) data.notes = input.notes || null;
  if (input.owner !== undefined) data.owner = input.owner ?? null;
  if (input.businessExpense !== undefined) data.businessExpense = !!input.businessExpense;
  if (input.reminderDaysBefore !== undefined) data.reminderDaysBefore = input.reminderDaysBefore ?? null;
  if (input.archived !== undefined) data.archived = !!input.archived;
  return data;
}

async function refresh(id: string): Promise<Subscription> {
  const row = await prisma.subscription.findUniqueOrThrow({
    where: { id },
    include: { priceHistory: true },
  });
  return toSubscription(row);
}

async function upsertPricePoint(subscriptionId: string, date: string, amountSEK: number): Promise<void> {
  await prisma.subscriptionPricePoint.upsert({
    where: { subscriptionId_date: { subscriptionId, date } },
    update: { amountSEK },
    create: {
      id: newId("sub-price"),
      subscriptionId,
      date,
      amountSEK,
    },
  });
}

export async function listSubscriptions(): Promise<Subscription[]> {
  const rows = await prisma.subscription.findMany({
    include: { priceHistory: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSubscription);
}

export async function getSubscription(id: string): Promise<Subscription | null> {
  const row = await prisma.subscription.findUnique({
    where: { id },
    include: { priceHistory: true },
  });
  return row ? toSubscription(row) : null;
}

export async function createSubscription(input: Omit<Subscription, "id">): Promise<Subscription> {
  const id = newId("sub");
  const amountSEK = Math.round(input.amountSEK);
  await prisma.subscription.create({
    data: {
      id,
      name: input.name,
      description: input.description,
      category: input.category,
      status: input.status,
      amountSEK,
      billingCycle: input.billingCycle,
      startedAt: input.startedAt,
      nextRenewal: input.nextRenewal,
      cancelledAt: input.cancelledAt ?? null,
      website: input.website || null,
      notes: input.notes || null,
      owner: input.owner ?? null,
      businessExpense: !!input.businessExpense,
      reminderDaysBefore: input.reminderDaysBefore ?? null,
      archived: !!input.archived,
      priceHistory: {
        create: {
          id: newId("sub-price"),
          date: input.startedAt || todayIso(),
          amountSEK,
        },
      },
    },
  });
  return refresh(id);
}

export async function updateSubscription(
  id: string,
  input: Partial<Omit<Subscription, "id">>,
): Promise<Subscription> {
  const current = await prisma.subscription.findUniqueOrThrow({ where: { id } });
  const data = toData(input);
  await prisma.subscription.update({ where: { id }, data });
  if (input.amountSEK !== undefined && Math.round(input.amountSEK) !== current.amountSEK) {
    await upsertPricePoint(id, todayIso(), Math.round(input.amountSEK));
  }
  return refresh(id);
}

export async function deleteSubscription(id: string): Promise<void> {
  await prisma.subscription.delete({ where: { id } });
}

export async function duplicateSubscription(id: string): Promise<Subscription | null> {
  const src = await getSubscription(id);
  if (!src) return null;
  const { id: _id, priceHistory: _priceHistory, ...input } = src;
  return createSubscription({
    ...input,
    name: `${src.name} (kopia)`,
  });
}

export async function markSubscriptionPaid(id: string): Promise<Subscription> {
  const current = await prisma.subscription.findUniqueOrThrow({ where: { id } });
  await prisma.subscription.update({
    where: { id },
    data: {
      nextRenewal: advanceRenewal(current.nextRenewal, current.billingCycle as BillingCycle),
    },
  });
  return refresh(id);
}

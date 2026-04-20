"use client";

import { useEffect, useState } from "react";
import { advanceRenewal, defaultSubscriptions, type PricePoint, type Subscription } from "@/modules/subscriptions/data/core";

const KEY = "subscriptions.items";
const listeners = new Set<() => void>();

function read(): Subscription[] {
  if (typeof window === "undefined") return defaultSubscriptions;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultSubscriptions;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultSubscriptions;
  } catch {
    return defaultSubscriptions;
  }
}

function write(items: Subscription[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

function withPriceChange(sub: Subscription, newAmount: number): Subscription {
  if (sub.amountSEK === newAmount) return sub;
  const today = new Date().toISOString().slice(0, 10);
  const history: PricePoint[] = sub.priceHistory ?? [{ date: sub.startedAt, amountSEK: sub.amountSEK }];
  const last = history[history.length - 1];
  const next = last && last.date === today
    ? [...history.slice(0, -1), { date: today, amountSEK: newAmount }]
    : [...history, { date: today, amountSEK: newAmount }];
  return { ...sub, amountSEK: newAmount, priceHistory: next };
}

export function useSubscriptions() {
  const [items, setItems] = useState<Subscription[]>(defaultSubscriptions);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);
    const update = () => setItems(read());
    listeners.add(update);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    hydrated,
    items,
    add(sub: Omit<Subscription, "id">) {
      const next = [{ ...sub, id: `sub-${Date.now()}` }, ...read()];
      write(next);
    },
    update(id: string, updates: Partial<Omit<Subscription, "id">>) {
      const next = read().map((s) => {
        if (s.id !== id) return s;
        const merged = { ...s, ...updates };
        if (updates.amountSEK !== undefined && updates.amountSEK !== s.amountSEK) {
          return withPriceChange(merged, updates.amountSEK);
        }
        return merged;
      });
      write(next);
    },
    remove(id: string) {
      write(read().filter((s) => s.id !== id));
    },
    duplicate(id: string) {
      const src = read().find((s) => s.id === id);
      if (!src) return;
      const copy: Subscription = {
        ...src,
        id: `sub-${Date.now()}`,
        name: `${src.name} (kopia)`,
      };
      write([copy, ...read()]);
    },
    markPaid(id: string) {
      const next = read().map((s) => {
        if (s.id !== id) return s;
        return { ...s, nextRenewal: advanceRenewal(s.nextRenewal, s.billingCycle) };
      });
      write(next);
    },
    setArchived(id: string, archived: boolean) {
      const next = read().map((s) => (s.id === id ? { ...s, archived } : s));
      write(next);
    },
    replaceAll(newItems: Subscription[]) {
      write(newItems);
    },
    reset() {
      write(defaultSubscriptions);
    },
  };
}

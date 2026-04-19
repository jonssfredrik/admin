"use client";

import { useEffect, useState } from "react";
import { defaultSubscriptions, type Subscription } from "@/modules/abonnemang/data/core";

const KEY = "abonnemang.subscriptions";
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
      const next = read().map((s) => (s.id === id ? { ...s, ...updates } : s));
      write(next);
    },
    remove(id: string) {
      write(read().filter((s) => s.id !== id));
    },
    reset() {
      write(defaultSubscriptions);
    },
  };
}

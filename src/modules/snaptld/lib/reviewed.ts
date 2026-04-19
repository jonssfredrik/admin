"use client";

import { useEffect, useState } from "react";

const HIDDEN_KEY = "snaptld.hidden";
const REVIEWED_KEY = "snaptld.reviewed";
const listeners = new Set<() => void>();

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, values: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(values));
  listeners.forEach((l) => l());
}

function useList(key: string) {
  const [values, setValues] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValues(read(key));
    setHydrated(true);
    const update = () => setValues(read(key));
    listeners.add(update);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  return {
    hydrated,
    values,
    has: (slug: string) => values.includes(slug),
    count: values.length,
    toggle: (slug: string) => {
      const next = values.includes(slug) ? values.filter((s) => s !== slug) : [...values, slug];
      write(key, next);
    },
    addMany: (slugsToAdd: string[]) => {
      const set = new Set(values);
      slugsToAdd.forEach((s) => set.add(s));
      write(key, [...set]);
    },
    remove: (slug: string) => write(key, values.filter((s) => s !== slug)),
    clear: () => write(key, []),
  };
}

export function useHidden() {
  return useList(HIDDEN_KEY);
}

export function useReviewed() {
  return useList(REVIEWED_KEY);
}

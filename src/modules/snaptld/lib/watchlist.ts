"use client";

import { useEffect, useState } from "react";

const KEY = "snaptld.watchlist";
const listeners = new Set<() => void>();

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function write(values: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(values));
  listeners.forEach((l) => l());
}

export function useWatchlist() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSlugs(read());
    setHydrated(true);
    const update = () => setSlugs(read());
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
    slugs,
    has: (slug: string) => slugs.includes(slug),
    count: slugs.length,
    toggle: (slug: string) => {
      const next = slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug];
      write(next);
    },
    add: (slug: string) => {
      if (!slugs.includes(slug)) write([...slugs, slug]);
    },
    remove: (slug: string) => {
      write(slugs.filter((s) => s !== slug));
    },
  };
}

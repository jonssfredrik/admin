"use client";

import { useEffect, useState } from "react";

const KEY = "snaptld.lastVisit";
const listeners = new Set<() => void>();

function read(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

function write(iso: string | null) {
  if (typeof window === "undefined") return;
  if (iso === null) window.localStorage.removeItem(KEY);
  else window.localStorage.setItem(KEY, iso);
  listeners.forEach((l) => l());
}

export function useLastVisit() {
  const [value, setValue] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read());
    setHydrated(true);
    const update = () => setValue(read());
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return {
    hydrated,
    value,
    mark: () => write(new Date().toISOString()),
    clear: () => write(null),
  };
}

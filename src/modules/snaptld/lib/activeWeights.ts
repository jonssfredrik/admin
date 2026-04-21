"use client";

import { useEffect, useState } from "react";
import { defaultWeightsYaml } from "@/modules/snaptld/data/weights";

const KEY = "snaptld.weights.active";
const listeners = new Set<() => void>();

function read() {
  if (typeof window === "undefined") return defaultWeightsYaml;
  try {
    return window.localStorage.getItem(KEY) || defaultWeightsYaml;
  } catch {
    return defaultWeightsYaml;
  }
}

function write(value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, value);
  listeners.forEach((listener) => listener());
}

export function useActiveWeights() {
  const [value, setValue] = useState(defaultWeightsYaml);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setValue(read());
    sync();
    setHydrated(true);
    listeners.add(sync);
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    hydrated,
    value,
    reset: () => write(defaultWeightsYaml),
    save: (next: string) => write(next),
  };
}

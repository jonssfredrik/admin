"use client";

import { useEffect, useState } from "react";
import { conversionPresets } from "@/modules/file-converter/data";
import type { ConversionPreset } from "@/modules/file-converter/types";

const KEY = "file-converter.presets";
const listeners = new Set<() => void>();

function read(): ConversionPreset[] {
  if (typeof window === "undefined") return conversionPresets;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return conversionPresets;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ConversionPreset[]) : conversionPresets;
  } catch {
    return conversionPresets;
  }
}

function write(values: ConversionPreset[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(values));
  listeners.forEach((listener) => listener());
}

export function useConversionPresets() {
  const [presets, setPresets] = useState<ConversionPreset[]>(conversionPresets);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPresets(read());
    setHydrated(true);
    const update = () => setPresets(read());
    listeners.add(update);
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    hydrated,
    presets,
    replacePresets: (next: ConversionPreset[] | ((current: ConversionPreset[]) => ConversionPreset[])) => {
      const current = read();
      write(typeof next === "function" ? next(current) : next);
    },
  };
}

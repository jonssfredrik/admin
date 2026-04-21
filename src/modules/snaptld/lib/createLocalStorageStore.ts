"use client";

import { useEffect, useState } from "react";

type Listener = () => void;

function createRegistry() {
  const listeners = new Set<Listener>();
  return {
    notify() {
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function readJson<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T, registry: ReturnType<typeof createRegistry>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  registry.notify();
}

export function createLocalStorageListStore(key: string) {
  const registry = createRegistry();
  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

  function useStore() {
    const [values, setValues] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      const sync = () => setValues(readJson(key, [], isStringArray));
      sync();
      setHydrated(true);

      const unsubscribe = registry.subscribe(sync);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) sync();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        unsubscribe();
        window.removeEventListener("storage", onStorage);
      };
    }, []);

    return {
      hydrated,
      values,
      has: (slug: string) => values.includes(slug),
      count: values.length,
      toggle: (slug: string) => {
        const next = values.includes(slug) ? values.filter((item) => item !== slug) : [...values, slug];
        writeJson(key, next, registry);
      },
      addMany: (slugs: string[]) => {
        const next = new Set(values);
        slugs.forEach((slug) => next.add(slug));
        writeJson(key, [...next], registry);
      },
      add: (slug: string) => {
        if (!values.includes(slug)) writeJson(key, [...values, slug], registry);
      },
      remove: (slug: string) => {
        writeJson(key, values.filter((item) => item !== slug), registry);
      },
      clear: () => writeJson(key, [], registry),
    };
  }

  return { useStore };
}

export function createLocalStorageMapStore<T>(key: string, validate: (value: unknown) => value is Record<string, T>) {
  const registry = createRegistry();

  function useStore() {
    const [map, setMap] = useState<Record<string, T>>({});
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      const sync = () => setMap(readJson(key, {}, validate));
      sync();
      setHydrated(true);

      const unsubscribe = registry.subscribe(sync);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) sync();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        unsubscribe();
        window.removeEventListener("storage", onStorage);
      };
    }, []);

    return {
      hydrated,
      map,
      setMap: (next: Record<string, T>) => writeJson(key, next, registry),
    };
  }

  return { useStore };
}

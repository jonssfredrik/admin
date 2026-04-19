"use client";

import { useEffect, useState } from "react";

const NOTES_KEY = "snaptld.notes";
const listeners = new Set<() => void>();

export interface DomainNote {
  text: string;
  tags: string[];
  updatedAt: string;
}

type NoteMap = Record<string, DomainNote>;

function read(): NoteMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as NoteMap) : {};
  } catch {
    return {};
  }
}

function write(map: NoteMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(map));
  listeners.forEach((l) => l());
}

export function useDomainNotes() {
  const [map, setMap] = useState<NoteMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMap(read());
    setHydrated(true);
    const update = () => setMap(read());
    listeners.add(update);
    const onStorage = (e: StorageEvent) => {
      if (e.key === NOTES_KEY) update();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    hydrated,
    map,
    get: (slug: string): DomainNote | undefined => map[slug],
    set: (slug: string, text: string, tags: string[]) => {
      const next = { ...map };
      if (!text.trim() && tags.length === 0) {
        delete next[slug];
      } else {
        next[slug] = { text, tags, updatedAt: new Date().toISOString() };
      }
      write(next);
    },
    clear: (slug: string) => {
      const next = { ...map };
      delete next[slug];
      write(next);
    },
    allTags: (): string[] => {
      const set = new Set<string>();
      Object.values(map).forEach((n) => n.tags.forEach((t) => set.add(t)));
      return [...set].sort();
    },
  };
}

"use client";

import { createLocalStorageMapStore } from "@/modules/snaptld/lib/createLocalStorageStore";

const NOTES_KEY = "snaptld.notes";

export interface DomainNote {
  text: string;
  tags: string[];
  updatedAt: string;
}

type NoteMap = Record<string, DomainNote>;

const notesStore = createLocalStorageMapStore<DomainNote>(
  NOTES_KEY,
  (value): value is NoteMap =>
    !!value &&
    typeof value === "object" &&
    Object.values(value as Record<string, unknown>).every(
      (entry) =>
        !!entry &&
        typeof entry === "object" &&
        typeof (entry as DomainNote).text === "string" &&
        Array.isArray((entry as DomainNote).tags) &&
        typeof (entry as DomainNote).updatedAt === "string",
    ),
);

export function useDomainNotes() {
  const { map, hydrated, setMap } = notesStore.useStore();

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
      setMap(next);
    },
    clear: (slug: string) => {
      const next = { ...map };
      delete next[slug];
      setMap(next);
    },
    allTags: (): string[] => {
      const set = new Set<string>();
      Object.values(map).forEach((n) => n.tags.forEach((t) => set.add(t)));
      return [...set].sort();
    },
  };
}

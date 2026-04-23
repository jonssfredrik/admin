"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  addHiddenManyAction,
  addReviewedManyAction,
  addWatchManyAction,
  saveNoteAction,
  toggleHiddenAction,
  toggleReviewedAction,
  toggleWatchAction,
} from "@/modules/snaptld/actions";
import type { DomainNote, SnapTldUserState } from "@/modules/snaptld/types";

interface Ctx {
  state: SnapTldUserState;
  hasWatch: (slug: string) => boolean;
  hasReviewed: (slug: string) => boolean;
  hasHidden: (slug: string) => boolean;
  toggleWatch: (slug: string) => Promise<void>;
  addWatchMany: (slugs: string[]) => Promise<void>;
  toggleReviewed: (slug: string) => Promise<void>;
  addReviewedMany: (slugs: string[]) => Promise<void>;
  toggleHidden: (slug: string) => Promise<void>;
  addHiddenMany: (slugs: string[]) => Promise<void>;
  saveNote: (slug: string, note: DomainNote | null) => Promise<void>;
}

const SnapTldUserStateContext = createContext<Ctx | null>(null);

export function SnapTldUserStateProvider({
  initialState,
  children,
}: {
  initialState: SnapTldUserState;
  children: React.ReactNode;
}) {
  const [state, setState] = useState(initialState);

  const value = useMemo<Ctx>(() => ({
    state,
    hasWatch: (slug) => state.watchlist.includes(slug),
    hasReviewed: (slug) => state.reviewed.includes(slug),
    hasHidden: (slug) => state.hidden.includes(slug),
    toggleWatch: async (slug) => {
      const watchlist = await toggleWatchAction(slug);
      setState((current) => ({ ...current, watchlist }));
    },
    addWatchMany: async (slugs) => {
      const watchlist = await addWatchManyAction(slugs);
      setState((current) => ({ ...current, watchlist }));
    },
    toggleReviewed: async (slug) => {
      const reviewed = await toggleReviewedAction(slug);
      setState((current) => ({ ...current, reviewed }));
    },
    addReviewedMany: async (slugs) => {
      const reviewed = await addReviewedManyAction(slugs);
      setState((current) => ({ ...current, reviewed }));
    },
    toggleHidden: async (slug) => {
      const hidden = await toggleHiddenAction(slug);
      setState((current) => ({ ...current, hidden }));
    },
    addHiddenMany: async (slugs) => {
      const hidden = await addHiddenManyAction(slugs);
      setState((current) => ({ ...current, hidden }));
    },
    saveNote: async (slug, note) => {
      const notes = await saveNoteAction(slug, note);
      setState((current) => ({ ...current, notes }));
    },
  }), [state]);

  return (
    <SnapTldUserStateContext.Provider value={value}>
      {children}
    </SnapTldUserStateContext.Provider>
  );
}

export function useSnapTldUserState() {
  const context = useContext(SnapTldUserStateContext);
  if (!context) throw new Error("useSnapTldUserState must be used within SnapTldUserStateProvider");
  return context;
}

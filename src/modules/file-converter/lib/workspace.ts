"use client";

import { useEffect, useState } from "react";
import type { StagedFile } from "@/modules/file-converter/types";

const KEY = "file-converter.workspace";
const listeners = new Set<() => void>();

interface FileConverterWorkspaceState {
  stagedFiles: StagedFile[];
  parallelism: number;
}

const fallbackState: FileConverterWorkspaceState = {
  stagedFiles: [],
  parallelism: 4,
};

function read(): FileConverterWorkspaceState {
  if (typeof window === "undefined") return fallbackState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallbackState;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return fallbackState;
    return {
      stagedFiles: Array.isArray(parsed.stagedFiles) ? (parsed.stagedFiles as StagedFile[]) : [],
      parallelism: typeof parsed.parallelism === "number" ? parsed.parallelism : 4,
    };
  } catch {
    return fallbackState;
  }
}

function write(values: FileConverterWorkspaceState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(values));
  listeners.forEach((listener) => listener());
}

export function useFileConverterWorkspace() {
  const [state, setState] = useState<FileConverterWorkspaceState>(fallbackState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const update = () => setState(read());
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
    stagedFiles: state.stagedFiles,
    parallelism: state.parallelism,
    setStagedFiles: (next: StagedFile[] | ((current: StagedFile[]) => StagedFile[])) => {
      const current = read();
      const stagedFiles = typeof next === "function" ? next(current.stagedFiles) : next;
      write({ ...current, stagedFiles });
    },
    setParallelism: (parallelism: number) => {
      const current = read();
      write({ ...current, parallelism });
    },
    resetWorkspace: () => write(fallbackState),
  };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { QueueItem } from "@/modules/file-converter/types";

const KEY = "file-converter.queue";
const listeners = new Set<() => void>();

function read(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueueItem[]) : [];
  } catch {
    return [];
  }
}

function write(values: QueueItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(values));
  listeners.forEach((listener) => listener());
}

export function useConversionActivity() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setQueueItems(read());
    setHydrated(true);
    const update = () => setQueueItems(read());
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
    queueItems,
    replaceQueueItems: (next: QueueItem[] | ((current: QueueItem[]) => QueueItem[])) => {
      const current = read();
      write(typeof next === "function" ? next(current) : next);
    },
    clearQueue: () => write([]),
  };
}

export function useConversionQueueEngine(defaultConcurrency = 4) {
  const activity = useConversionActivity();
  const queueItems = activity.queueItems;

  const queueKey = useMemo(
    () =>
      queueItems
        .map((item) => `${item.id}:${item.status}:${item.progress}:${item.batchConcurrency ?? defaultConcurrency}`)
        .join("|"),
    [defaultConcurrency, queueItems],
  );

  useEffect(() => {
    const grouped = new Map<string, QueueItem[]>();
    queueItems.forEach((item) => {
      const current = grouped.get(item.batchId) ?? [];
      current.push(item);
      grouped.set(item.batchId, current);
    });

    const startableBatchIds = Array.from(grouped.entries()).filter(([, items]) => {
      const runningCount = items.filter((item) => item.status === "running").length;
      const queuedCount = items.filter((item) => item.status === "queued").length;
      const concurrency = items[0]?.batchConcurrency ?? defaultConcurrency;
      return queuedCount > 0 && runningCount < concurrency;
    });

    if (startableBatchIds.length === 0) return;

    activity.replaceQueueItems((current) => {
      const batchState = new Map<string, { running: number; concurrency: number }>();
      current.forEach((item) => {
        const existing = batchState.get(item.batchId) ?? {
          running: 0,
          concurrency: item.batchConcurrency ?? defaultConcurrency,
        };
        if (item.status === "running") existing.running += 1;
        batchState.set(item.batchId, existing);
      });

      let changed = false;
      const next = current.map((item) => {
        if (item.status !== "queued") return item;
        const state = batchState.get(item.batchId) ?? {
          running: 0,
          concurrency: item.batchConcurrency ?? defaultConcurrency,
        };
        if (state.running >= state.concurrency) return item;
        changed = true;
        state.running += 1;
        batchState.set(item.batchId, state);
        const startedItem: QueueItem = {
          ...item,
          status: "running",
          startedAt: Date.now(),
          progress: Math.max(item.progress, 4),
        };
        return startedItem;
      });

      return changed ? next : current;
    });
  }, [activity, defaultConcurrency, queueKey, queueItems]);

  useEffect(() => {
    if (!queueItems.some((item) => item.status === "running")) return;

    const timer = window.setInterval(() => {
      activity.replaceQueueItems((current) =>
        current.map((item) => {
          if (item.status !== "running") return item;
          const increment = Math.max(6, Math.round(1000 / item.durationMs) * 12) + Math.floor(Math.random() * 12);
          const nextProgress = Math.min(item.progress + increment, 100);
          if (nextProgress >= 100) {
            return {
              ...item,
              status: "completed",
              progress: 100,
              completedAt: Date.now(),
            };
          }
          return {
            ...item,
            progress: nextProgress,
          };
        }),
      );
    }, 220);

    return () => window.clearInterval(timer);
  }, [activity, queueKey, queueItems]);

  return activity;
}

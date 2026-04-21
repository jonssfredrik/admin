"use client";

import { createLocalStorageListStore } from "@/modules/snaptld/lib/createLocalStorageStore";

const hiddenStore = createLocalStorageListStore("snaptld.hidden");
const reviewedStore = createLocalStorageListStore("snaptld.reviewed");

export function useHidden() {
  return hiddenStore.useStore();
}

export function useReviewed() {
  return reviewedStore.useStore();
}

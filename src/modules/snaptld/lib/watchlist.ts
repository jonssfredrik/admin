"use client";

import { createLocalStorageListStore } from "@/modules/snaptld/lib/createLocalStorageStore";

const watchlistStore = createLocalStorageListStore("snaptld.watchlist");

export const useWatchlist = watchlistStore.useStore;

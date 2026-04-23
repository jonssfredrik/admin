import type { InventoryItem } from "@/modules/mwp/data";

export type InventoryTab = "core" | "plugins" | "themes";
export type InventoryFilter = "all" | "updates";

export function getInventoryRows(items: InventoryItem[], query: string, filter: InventoryFilter) {
  const normalized = query.trim().toLowerCase();
  return items.filter((item) => {
    if (filter === "updates" && item.sitesWithUpdate === 0) return false;
    if (!normalized) return true;
    return item.name.toLowerCase().includes(normalized) || item.slug.includes(normalized);
  });
}

export function getInventoryStats(
  coreInventory: InventoryItem[],
  pluginInventory: InventoryItem[],
  themeInventory: InventoryItem[],
) {
  return {
    coreUpdates: coreInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0),
    pluginUpdates: pluginInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0),
    themeUpdates: themeInventory.reduce((sum, item) => sum + item.sitesWithUpdate, 0),
    installations:
      pluginInventory.reduce((sum, item) => sum + item.installed.length, 0) +
      themeInventory.reduce((sum, item) => sum + item.installed.length, 0),
  };
}

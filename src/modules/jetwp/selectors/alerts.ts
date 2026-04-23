import type { Alert, AlertSeverity, AlertStatus } from "@/modules/jetwp/data";

export interface AlertComment {
  id: string;
  body: string;
  author: string;
  createdAt: string;
  kind: "resolution";
}

export type AlertItem = Alert & {
  comments: AlertComment[];
};

export function createAlertItems(items: Alert[]): AlertItem[] {
  return items.map((alert) => ({ ...alert, comments: [] }));
}

export function getFilteredAlerts(
  items: AlertItem[],
  query: string,
  severity: "all" | AlertSeverity,
  status: "all" | AlertStatus,
  siteNameForId: (siteId: string) => string,
) {
  const normalized = query.trim().toLowerCase();
  return items.filter((alert) => {
    if (severity !== "all" && alert.severity !== severity) return false;
    if (status !== "all" && alert.status !== status) return false;
    if (!normalized) return true;
    return (
      alert.title.toLowerCase().includes(normalized) ||
      alert.description.toLowerCase().includes(normalized) ||
      alert.comments.some((comment) => comment.body.toLowerCase().includes(normalized)) ||
      (alert.siteId && siteNameForId(alert.siteId).toLowerCase().includes(normalized))
    );
  });
}

export function getAlertCounts(items: AlertItem[]) {
  return {
    open: items.filter((alert) => alert.status === "open").length,
    critical: items.filter((alert) => alert.severity === "critical" && alert.status === "open").length,
    warning: items.filter((alert) => alert.severity === "warning" && alert.status === "open").length,
    resolved: items.filter((alert) => alert.status === "resolved").length,
  };
}

export function getHealthOverviewStats<T extends { status: string }>(incidents: T[]) {
  return {
    activeIncidents: incidents.filter((incident) => incident.status !== "resolved").length,
  };
}

export function getNodeTotals<T extends { sites: number }>(nodes: T[]) {
  return {
    nodeCount: nodes.length,
    totalSites: nodes.reduce((sum, node) => sum + node.sites, 0),
  };
}

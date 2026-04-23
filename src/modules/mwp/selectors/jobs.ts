import type { Job, JobStatus, JobType } from "@/modules/mwp/fleet/core";
import type { Site } from "@/modules/mwp/data/core";

export interface JobFilters {
  query: string;
  status: "all" | JobStatus;
  type: "all" | JobType;
  site: "all" | string;
}

export function getFilteredJobs(items: Job[], filters: JobFilters, sites: Site[]) {
  const normalized = filters.query.trim().toLowerCase();
  const siteNames = new Map(sites.map((site) => [site.id, site.name.toLowerCase()]));

  return items.filter((job) => {
    if (filters.status !== "all" && job.status !== filters.status) return false;
    if (filters.type !== "all" && job.type !== filters.type) return false;
    if (filters.site !== "all" && job.siteId !== filters.site) return false;
    if (!normalized) return true;
    return (
      job.id.includes(normalized) ||
      job.type.includes(normalized) ||
      (siteNames.get(job.siteId) ?? "").includes(normalized) ||
      job.createdBy.toLowerCase().includes(normalized)
    );
  });
}

export function getJobStatusCounts(items: Job[]) {
  return items.reduce<Record<JobStatus, number>>(
    (counts, job) => {
      counts[job.status] += 1;
      return counts;
    },
    {
      pending: 0,
      claimed: 0,
      running: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
    },
  );
}

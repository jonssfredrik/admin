import { prisma } from "@/lib/prisma";

export interface SqliteTableSnapshot {
  name: string;
  description: string;
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

export interface SqliteSnapshot {
  tables: SqliteTableSnapshot[];
  databaseUrl: string;
  totalRows: number;
  previewLimit: number;
}

const PREVIEW_LIMIT = 100;

function serializeRow<T extends Record<string, unknown>>(row: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value instanceof Date) {
      out[key] = value.toISOString();
    } else {
      out[key] = value;
    }
  }
  return out;
}

export async function getSqliteSnapshot(): Promise<SqliteSnapshot> {
  const [
    stateRows,
    stateTotal,
    feedOverrideRows,
    feedOverrideTotal,
    reportRows,
    reportTotal,
    importedRows,
    importedTotal,
    analysisRows,
    analysisTotal,
  ] = await Promise.all([
    prisma.snapTldState.findMany({ take: PREVIEW_LIMIT, orderBy: { updatedAt: "desc" } }),
    prisma.snapTldState.count(),
    prisma.snapTldFeedOverride.findMany({ take: PREVIEW_LIMIT, orderBy: { updatedAt: "desc" } }),
    prisma.snapTldFeedOverride.count(),
    prisma.snapTldReport.findMany({ take: PREVIEW_LIMIT, orderBy: { generatedAt: "desc" } }),
    prisma.snapTldReport.count(),
    prisma.snapTldImportedDomain.findMany({ take: PREVIEW_LIMIT, orderBy: { importedAt: "desc" } }),
    prisma.snapTldImportedDomain.count(),
    prisma.snapTldDomainAnalysis.findMany({ take: PREVIEW_LIMIT, orderBy: { fetchedAt: "desc" } }),
    prisma.snapTldDomainAnalysis.count(),
  ]);

  const tables: SqliteTableSnapshot[] = [
    {
      name: "SnapTldState",
      description: "Användartillstånd: watchlist, granskade, dolda, anteckningar, vikter och inställningar.",
      columns: ["id", "watchlistJson", "reviewedJson", "hiddenJson", "notesJson", "activeWeightsYaml", "settingsJson", "createdAt", "updatedAt"],
      rows: stateRows.map(serializeRow),
      total: stateTotal,
    },
    {
      name: "SnapTldFeedOverride",
      description: "Override-värden för feeds (status och schema) ovanpå mock-feeds.",
      columns: ["feedId", "status", "scheduleJson", "createdAt", "updatedAt"],
      rows: feedOverrideRows.map(serializeRow),
      total: feedOverrideTotal,
    },
    {
      name: "SnapTldReport",
      description: "Genererade rapporter (manuella eller schemalagda).",
      columns: ["id", "title", "generatedAt", "domains", "highlight", "format", "createdAt", "updatedAt"],
      rows: reportRows.map(serializeRow),
      total: reportTotal,
    },
    {
      name: "SnapTldImportedDomain",
      description: "Importerade domäner (käll- och batch-spårning, status och uppskattat värde).",
      columns: [
        "slug",
        "domain",
        "tld",
        "source",
        "sourceLabel",
        "importedAt",
        "importedBy",
        "batchId",
        "status",
        "expiresAt",
        "totalScore",
        "verdict",
        "estimatedValueMin",
        "estimatedValueMax",
        "estimatedValueCurrency",
        "createdAt",
        "updatedAt",
      ],
      rows: importedRows.map(serializeRow),
      total: importedTotal,
    },
    {
      name: "SnapTldDomainAnalysis",
      description: "Analyserade domäner med kategori-, SEO- och historikdata.",
      columns: [
        "slug",
        "domain",
        "tld",
        "source",
        "fetchedAt",
        "expiresAt",
        "totalScore",
        "verdict",
        "status",
        "aiSummary",
        "estimatedValueMin",
        "estimatedValueMax",
        "estimatedValueCurrency",
        "categoriesJson",
        "seoJson",
        "waybackJson",
        "createdAt",
        "updatedAt",
      ],
      rows: analysisRows.map(serializeRow),
      total: analysisTotal,
    },
  ];

  return {
    tables,
    databaseUrl: process.env.DATABASE_URL ?? "file:./.data/snaptld/snaptld.db",
    totalRows: tables.reduce((sum, table) => sum + table.total, 0),
    previewLimit: PREVIEW_LIMIT,
  };
}

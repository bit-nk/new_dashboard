// ============================================================
// Customer + Data Source mock data
// Each customer has 4 data sources with ingestion, migration,
// health, and dashboard-level metrics
// ============================================================

import type { DataSourceName } from "@/lib/CustomerContext";
import { ALL_DATA_SOURCES } from "@/lib/CustomerContext";
import type { DashboardData, ServiceHealth } from "@/types/dashboard";
import { mockDashboardData, mockServiceHealth } from "./mock";

// ── Data Source Status ───────────────────────────────────────

export type IngestionStatus = "syncing" | "completed" | "error" | "paused";

export interface DataSourceMetrics {
  source: DataSourceName;
  status: IngestionStatus;
  ingestionPercent: number;       // 0-100
  recordsMigrated: number;
  recordsTotal: number;
  lastSync: string;
  errorCount: number;
  avgLatencyMs: number;
  uptimePercent: number;
  documentsIndexed: number;
  queriesHandled: number;
}

export interface CustomerDataSources {
  customerId: string;
  sources: DataSourceMetrics[];
}

// ── Seed helper ──────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateSourceMetrics(
  customerId: string,
  source: DataSourceName,
  seedOffset: number
): DataSourceMetrics {
  const rand = seededRandom(customerId.length * 1000 + seedOffset);

  const statuses: IngestionStatus[] = ["syncing", "completed", "completed", "completed", "paused"];
  const status = statuses[Math.floor(rand() * statuses.length)];

  const ingestionPercent = status === "completed" ? 100
    : status === "error" ? Math.round(rand() * 40 + 20)
    : status === "paused" ? Math.round(rand() * 30 + 50)
    : Math.round(rand() * 35 + 60); // syncing: 60-95

  const recordsTotal = Math.round(rand() * 200000 + 50000);
  const recordsMigrated = Math.round(recordsTotal * (ingestionPercent / 100));

  const syncAgo = Math.round(rand() * 120);
  const lastSync = syncAgo < 5 ? "Just now"
    : syncAgo < 60 ? `${syncAgo} min ago`
    : `${Math.round(syncAgo / 60)} hr ago`;

  return {
    source,
    status,
    ingestionPercent,
    recordsMigrated,
    recordsTotal,
    lastSync,
    errorCount: status === "error" ? Math.round(rand() * 20 + 1) : Math.round(rand() * 3),
    avgLatencyMs: Math.round(rand() * 80 + 10),
    uptimePercent: Math.round((rand() * 2 + 98) * 100) / 100,
    documentsIndexed: Math.round(rand() * 50000 + 10000),
    queriesHandled: Math.round(rand() * 100000 + 20000),
  };
}

// ── Per-customer data sources ────────────────────────────────

const ALL_SOURCES: DataSourceName[] = [...ALL_DATA_SOURCES];

export function getCustomerDataSources(customerId: string, activeSources?: DataSourceName[]): CustomerDataSources {
  const sources = activeSources || ALL_SOURCES;
  return {
    customerId,
    sources: sources.map((src, i) => generateSourceMetrics(customerId, src, ALL_SOURCES.indexOf(src) * 100)),
  };
}

// ── Per data-source dashboard data (scoped variant of main dashboard) ──

function scaleValue(base: number, factor: number): number {
  return Math.round(base * factor);
}

export function getSourceDashboardData(customerId: string, source: DataSourceName): DashboardData {
  const rand = seededRandom(customerId.length * 100 + ALL_SOURCES.indexOf(source) * 37);
  const factor = 0.2 + rand() * 0.3; // each source handles 20-50% of total

  const base = mockDashboardData;

  return {
    systemStatus: {
      ...base.systemStatus,
      uptimePercentage: Math.round((98 + rand() * 2) * 100) / 100,
      uptimeHistory: base.systemStatus.uptimeHistory.map(() => Math.round((97 + rand() * 3) * 100) / 100),
    },
    questionsConsumed: {
      total: scaleValue(base.questionsConsumed.total, factor),
      thisWeek: scaleValue(base.questionsConsumed.thisWeek, factor),
      todayCount: scaleValue(base.questionsConsumed.todayCount, factor),
      dailyHistory: base.questionsConsumed.dailyHistory.map((d) => ({ ...d, count: scaleValue(d.count, factor) })),
      weeklyHistory: base.questionsConsumed.weeklyHistory.map((d) => ({ ...d, count: scaleValue(d.count, factor) })),
      todayHistory: base.questionsConsumed.todayHistory.map((d) => ({ ...d, count: scaleValue(d.count, factor) })),
    },
    responsesSent: {
      total: scaleValue(base.responsesSent.total, factor),
      thisWeek: scaleValue(base.responsesSent.thisWeek, factor),
      todayCount: scaleValue(base.responsesSent.todayCount, factor),
      successful: base.responsesSent.successful,
      clarificationNeeded: base.responsesSent.clarificationNeeded,
      noAnswerFound: base.responsesSent.noAnswerFound,
      byPeriod: base.responsesSent.byPeriod,
    },
    downtime: base.downtime,
    documentRetrieval: {
      percentage: Math.round(85 + rand() * 13),
      distribution: base.documentRetrieval.distribution.map((d) => ({
        ...d,
        count: scaleValue(d.count, factor),
      })),
    },
    contentGeneration: base.contentGeneration,
    apiHits: {
      total: scaleValue(base.apiHits.total, factor),
      thisWeek: scaleValue(base.apiHits.thisWeek, factor),
      today: scaleValue(base.apiHits.today, factor),
      endpoints: base.apiHits.endpoints.map((e) => ({ ...e, count: scaleValue(e.count, factor) })),
      breakdown: base.apiHits.breakdown.map((b) => ({ ...b, count: scaleValue(b.count, factor) })),
      breakdownByPeriod: {
        total: base.apiHits.breakdownByPeriod.total.map((b) => ({ ...b, count: scaleValue(b.count, factor) })),
        thisWeek: base.apiHits.breakdownByPeriod.thisWeek.map((b) => ({ ...b, count: scaleValue(b.count, factor) })),
        today: base.apiHits.breakdownByPeriod.today.map((b) => ({ ...b, count: scaleValue(b.count, factor) })),
      },
    },
    responseLatency: {
      average: Math.round((0.5 + rand() * 1.5) * 100) / 100,
      averageThisWeek: Math.round((0.5 + rand() * 1.5) * 100) / 100,
      averageToday: Math.round((0.5 + rand() * 1.5) * 100) / 100,
      timeline: base.responseLatency.timeline.map((t) => ({ ...t, value: Math.round((0.5 + rand() * 1.8) * 100) / 100 })),
      timelineToday: base.responseLatency.timelineToday.map((t) => ({ ...t, value: Math.round((0.5 + rand() * 1.5) * 100) / 100 })),
      timelineWeek: base.responseLatency.timelineWeek.map((t) => ({ ...t, value: Math.round((0.5 + rand() * 1.8) * 100) / 100 })),
    },
    contentQuality: base.contentQuality,
    knowledgeSources: {
      sources: [
        { name: source, lastSync: "10 min ago", coverage: Math.round(85 + rand() * 14), coverageWeek: Math.round(83 + rand() * 14), coverageToday: Math.round(86 + rand() * 13) },
      ],
    },
  };
}

// ── Per-customer service health (scoped to data sources) ─────

const SOURCE_SERVICES: Record<DataSourceName, string[]> = {
  ITGlue: ["ITGlue Sync Agent", "ITGlue API Connector", "Document Parser"],
  HubSpot: ["HubSpot CRM Sync", "HubSpot API Bridge", "Contact Indexer"],
  TigerPaw: ["TigerPaw Adapter", "Ticket Ingest Pipeline", "TigerPaw Webhook"],
  ConnectWise: ["ConnectWise Sync Engine", "CW Ticket Importer", "CW Config Bridge"],
};

export function getCustomerServiceHealth(customerId: string, activeSources?: DataSourceName[]): ServiceHealth[] {
  const rand = seededRandom(customerId.length * 77);
  const statuses: ServiceHealth["status"][] = ["operational", "operational", "operational", "operational", "degraded"];
  const services: ServiceHealth[] = [];
  const sources = activeSources || ALL_SOURCES;

  for (const src of sources) {
    for (const svc of SOURCE_SERVICES[src]) {
      const status = statuses[Math.floor(rand() * statuses.length)];
      services.push({
        name: svc,
        status,
        latency: Math.round(rand() * 100 + 5),
        uptime: Math.round((98 + rand() * 2) * 100) / 100,
        lastChecked: new Date().toISOString(),
      });
    }
  }

  // Also include core services
  return [...services, ...mockServiceHealth.slice(0, 4).map((s) => ({ ...s, lastChecked: new Date().toISOString() }))];
}

// ── Source icon/color helpers ─────────────────────────────────

export const SOURCE_META: Record<DataSourceName, { color: string; bgLight: string; bgDark: string; icon: string }> = {
  ITGlue: { color: "text-blue-600 dark:text-blue-400", bgLight: "bg-blue-50", bgDark: "dark:bg-blue-900/30", icon: "📘" },
  HubSpot: { color: "text-orange-600 dark:text-orange-400", bgLight: "bg-orange-50", bgDark: "dark:bg-orange-900/30", icon: "🔶" },
  TigerPaw: { color: "text-amber-600 dark:text-amber-400", bgLight: "bg-amber-50", bgDark: "dark:bg-amber-900/30", icon: "🐾" },
  ConnectWise: { color: "text-emerald-600 dark:text-emerald-400", bgLight: "bg-emerald-50", bgDark: "dark:bg-emerald-900/30", icon: "🔗" },
};

// Progress bar color by status
export function getStatusColor(status: IngestionStatus): string {
  switch (status) {
    case "completed": return "bg-emerald-500";
    case "syncing": return "bg-teal-500";
    case "paused": return "bg-amber-500";
    case "error": return "bg-red-500";
  }
}

export function getStatusLabel(status: IngestionStatus): { text: string; className: string } {
  switch (status) {
    case "completed": return { text: "Completed", className: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30" };
    case "syncing": return { text: "Syncing", className: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30" };
    case "paused": return { text: "Paused", className: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30" };
    case "error": return { text: "Error", className: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30" };
  }
}

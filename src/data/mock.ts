// ============================================================
// Mock Data - Replace with real DB queries when connected
// ============================================================

import type { DashboardData, ApiLog, ServiceHealth } from "@/types/dashboard";

export const mockDashboardData: DashboardData = {
  systemStatus: {
    status: "healthy",
    uptimePercentage: 99.98,
    uptimeHistory: [
      99.9, 99.95, 100, 100, 99.99, 100, 100, 99.98, 100, 100, 99.97, 100,
      100, 100, 99.99, 100, 100, 99.98, 100, 100, 99.95, 100, 100, 99.98,
    ],
  },
  questionsConsumed: {
    total: 1250300,
    thisWeek: 7620,
    todayCount: 1200,
    dailyHistory: [
      { date: "Mon", count: 980 },
      { date: "Tue", count: 1100 },
      { date: "Wed", count: 850 },
      { date: "Thu", count: 1250 },
      { date: "Fri", count: 1400 },
      { date: "Sat", count: 600 },
      { date: "Sun", count: 450 },
      { date: "Mon", count: 1050 },
      { date: "Tue", count: 1180 },
      { date: "Wed", count: 920 },
      { date: "Thu", count: 1300 },
      { date: "Fri", count: 1200 },
    ],
    weeklyHistory: [
      { date: "Mon", count: 1050 },
      { date: "Tue", count: 1180 },
      { date: "Wed", count: 920 },
      { date: "Thu", count: 1300 },
      { date: "Fri", count: 1200 },
      { date: "Sat", count: 770 },
      { date: "Sun", count: 1200 },
    ],
    todayHistory: [
      { time: "12 AM", count: 15 },
      { time: "2 AM", count: 8 },
      { time: "4 AM", count: 5 },
      { time: "6 AM", count: 22 },
      { time: "8 AM", count: 145 },
      { time: "10 AM", count: 210 },
      { time: "12 PM", count: 195 },
      { time: "2 PM", count: 230 },
      { time: "4 PM", count: 185 },
      { time: "6 PM", count: 110 },
      { time: "8 PM", count: 55 },
      { time: "10 PM", count: 20 },
    ],
  },
  responsesSent: {
    total: 1248700,
    thisWeek: 7540,
    todayCount: 1180,
    successful: 78,
    clarificationNeeded: 15,
    noAnswerFound: 7,
    byPeriod: {
      total: { successful: 78, clarification: 15, noAnswer: 7 },
      thisWeek: { successful: 80, clarification: 14, noAnswer: 6 },
      today: { successful: 82, clarification: 13, noAnswer: 5 },
    },
  },
  downtime: {
    incidents: [
      { id: "1", time: "Today 11:30 PM", duration: "0 minutes", reason: "Domintes downtime recent incident" },
      { id: "2", time: "Today 11:30 PM", duration: "0 minutes", reason: "Domintes downtime recent incident" },
      { id: "3", time: "Today 11:30 PM", duration: "0 minutes", reason: "Domintes downtime recent" },
    ],
    totalDowntimeMinutes: 0,
    period: "last 24h",
  },
  documentRetrieval: {
    percentage: 92,
    distribution: [
      { confidence: "10", count: 2 },
      { confidence: "20", count: 3 },
      { confidence: "30", count: 5 },
      { confidence: "40", count: 8 },
      { confidence: "50", count: 12 },
      { confidence: "60", count: 18 },
      { confidence: "70", count: 35 },
      { confidence: "80", count: 55 },
      { confidence: "90", count: 72 },
      { confidence: "100", count: 48 },
    ],
  },
  contentGeneration: {
    distribution: [
      { label: "Low", value: 95 },
      { label: "Med-Low", value: 88 },
      { label: "Med", value: 92 },
      { label: "Med-High", value: 78 },
      { label: "High", value: 65 },
    ],
    distributionWeek: [
      { label: "Low", value: 92 },
      { label: "Med-Low", value: 90 },
      { label: "Med", value: 88 },
      { label: "Med-High", value: 82 },
      { label: "High", value: 70 },
    ],
    distributionToday: [
      { label: "Low", value: 96 },
      { label: "Med-Low", value: 93 },
      { label: "Med", value: 91 },
      { label: "Med-High", value: 85 },
      { label: "High", value: 72 },
    ],
    timeline: [
      { time: "00:00", value: 85 },
      { time: "04:00", value: 88 },
      { time: "08:00", value: 92 },
      { time: "12:00", value: 78 },
      { time: "16:00", value: 90 },
      { time: "20:00", value: 87 },
    ],
  },
  apiHits: {
    total: 5600000,
    thisWeek: 245000,
    today: 38200,
    endpoints: [
      { name: "/query", count: 3200000, color: "#0f4c5c" },
      { name: "/index", count: 1500000, color: "#e07a5f" },
      { name: "/search", count: 900000, color: "#d4c5a9" },
    ],
    breakdown: [
      { endpoint: "/query", count: 3200000 },
      { endpoint: "/index", count: 1500000 },
      { endpoint: "/search", count: 900000 },
    ],
    breakdownByPeriod: {
      total: [
        { endpoint: "/query", count: 3200000 },
        { endpoint: "/index", count: 1500000 },
        { endpoint: "/search", count: 900000 },
      ],
      thisWeek: [
        { endpoint: "/query", count: 142000 },
        { endpoint: "/index", count: 63000 },
        { endpoint: "/search", count: 40000 },
      ],
      today: [
        { endpoint: "/query", count: 22100 },
        { endpoint: "/index", count: 9800 },
        { endpoint: "/search", count: 6300 },
      ],
    },
  },
  responseLatency: {
    average: 1.2,
    averageThisWeek: 1.15,
    averageToday: 1.08,
    timeline: [
      { time: "00:00", value: 1.8 },
      { time: "02:00", value: 1.5 },
      { time: "04:00", value: 1.2 },
      { time: "06:00", value: 1.0 },
      { time: "08:00", value: 0.9 },
      { time: "10:00", value: 1.1 },
      { time: "12:00", value: 1.4 },
      { time: "14:00", value: 1.3 },
      { time: "16:00", value: 1.1 },
      { time: "18:00", value: 0.8 },
      { time: "20:00", value: 1.0 },
      { time: "22:00", value: 1.2 },
    ],
    timelineToday: [
      { time: "12 AM", value: 0.9 },
      { time: "4 AM", value: 0.7 },
      { time: "8 AM", value: 1.2 },
      { time: "12 PM", value: 1.4 },
      { time: "4 PM", value: 1.1 },
      { time: "8 PM", value: 0.95 },
    ],
    timelineWeek: [
      { time: "Mon", value: 1.2 },
      { time: "Tue", value: 1.1 },
      { time: "Wed", value: 1.25 },
      { time: "Thu", value: 1.08 },
      { time: "Fri", value: 1.15 },
      { time: "Sat", value: 0.95 },
      { time: "Sun", value: 1.08 },
    ],
  },
  contentQuality: {
    qualityScore: 85,
    qualityScoreWeek: 87,
    qualityScoreToday: 89,
    clarification: 12,
    noAnswerFound: 3,
    timeline: [
      { time: "Mon", quality: 82, clarification: 14, noAnswer: 4 },
      { time: "Tue", quality: 85, clarification: 11, noAnswer: 4 },
      { time: "Wed", quality: 88, clarification: 9, noAnswer: 3 },
      { time: "Thu", quality: 84, clarification: 13, noAnswer: 3 },
      { time: "Fri", quality: 87, clarification: 10, noAnswer: 3 },
      { time: "Sat", quality: 90, clarification: 8, noAnswer: 2 },
      { time: "Sun", quality: 86, clarification: 11, noAnswer: 3 },
    ],
    timelineToday: [
      { time: "12 AM", quality: 88, clarification: 10, noAnswer: 2 },
      { time: "4 AM", quality: 91, clarification: 7, noAnswer: 2 },
      { time: "8 AM", quality: 86, clarification: 11, noAnswer: 3 },
      { time: "12 PM", quality: 89, clarification: 9, noAnswer: 2 },
      { time: "4 PM", quality: 90, clarification: 8, noAnswer: 2 },
      { time: "8 PM", quality: 92, clarification: 6, noAnswer: 2 },
    ],
  },
  knowledgeSources: {
    sources: [
      { name: "IT Documentation", lastSync: "2 hrs ago", coverage: 98, coverageWeek: 97, coverageToday: 98 },
      { name: "Knowledge Base", lastSync: "1 hr ago", coverage: 95, coverageWeek: 94, coverageToday: 95 },
      { name: "Ticket History", lastSync: "30 min ago", coverage: 92, coverageWeek: 91, coverageToday: 92 },
      { name: "Email Archives", lastSync: "4 hrs ago", coverage: 88, coverageWeek: 87, coverageToday: 88 },
    ],
  },
};

export const mockApiLogs: ApiLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `log-${i + 1}`,
  timestamp: new Date(Date.now() - i * 60000 * Math.random() * 10).toISOString(),
  method: (["GET", "POST", "GET", "GET", "POST", "PUT"] as const)[i % 6],
  endpoint: ["/query", "/index", "/search", "/health", "/config"][i % 5],
  statusCode: i % 12 === 0 ? 500 : i % 8 === 0 ? 404 : 200,
  responseTime: Math.round((Math.random() * 2 + 0.1) * 1000) / 1000,
}));

// Customer-specific log generator with seeded randomness
function seededRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function customerHash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h) + 1;
}

const CUSTOMER_ENDPOINTS: Record<string, string[]> = {
  meridian: ["/itglue/docs", "/hubspot/contacts", "/tigerpaw/tickets", "/connectwise/configs", "/query", "/search"],
  apex: ["/itglue/passwords", "/hubspot/deals", "/tigerpaw/assets", "/connectwise/tickets", "/query", "/index"],
  summit: ["/itglue/configs", "/hubspot/companies", "/tigerpaw/invoices", "/connectwise/projects", "/search", "/health"],
  brightwave: ["/itglue/domains", "/hubspot/emails", "/tigerpaw/services", "/connectwise/members", "/query", "/config"],
};

const METHODS: ApiLog["method"][] = ["GET", "POST", "GET", "GET", "POST", "PUT", "DELETE"];

export function generateCustomerLogs(customerId: string, count = 50): ApiLog[] {
  const rng = seededRng(customerHash(customerId));
  const endpoints = CUSTOMER_ENDPOINTS[customerId] || CUSTOMER_ENDPOINTS.meridian;

  return Array.from({ length: count }, (_, i) => {
    const r1 = rng();
    const r2 = rng();
    const r3 = rng();
    const r4 = rng();
    return {
      id: `${customerId}-log-${i + 1}`,
      timestamp: new Date(Date.now() - i * 60000 * (r1 * 10 + 0.5)).toISOString(),
      method: METHODS[Math.floor(r2 * METHODS.length)],
      endpoint: endpoints[Math.floor(r3 * endpoints.length)],
      statusCode: r4 < 0.05 ? 500 : r4 < 0.12 ? 404 : r4 < 0.15 ? 429 : 200,
      responseTime: Math.round((r1 * 2 + 0.05) * 1000) / 1000,
    };
  });
}

export const mockServiceHealth: ServiceHealth[] = [
  { name: "Query Engine", status: "operational", latency: 45, uptime: 99.99, lastChecked: new Date().toISOString() },
  { name: "Vector Database", status: "operational", latency: 12, uptime: 99.98, lastChecked: new Date().toISOString() },
  { name: "Document Indexer", status: "operational", latency: 120, uptime: 99.95, lastChecked: new Date().toISOString() },
  { name: "API Gateway", status: "operational", latency: 8, uptime: 99.99, lastChecked: new Date().toISOString() },
  { name: "Search Service", status: "operational", latency: 35, uptime: 99.97, lastChecked: new Date().toISOString() },
  { name: "Auth Service", status: "operational", latency: 22, uptime: 100, lastChecked: new Date().toISOString() },
  { name: "Cache Layer", status: "degraded", latency: 85, uptime: 99.5, lastChecked: new Date().toISOString() },
  { name: "Notification Service", status: "operational", latency: 55, uptime: 99.92, lastChecked: new Date().toISOString() },
];

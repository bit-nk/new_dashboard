// ============================================================
// Lumina Dashboard - Type Definitions
// ============================================================

export interface SystemStatus {
  status: "healthy" | "degraded" | "down";
  uptimePercentage: number;
  uptimeHistory: number[]; // last 24h, hourly
}

// Shared type for time-period breakdowns
export type TimePeriod = "total" | "thisWeek" | "today";

export interface TimePeriodValues {
  total: number;
  thisWeek: number;
  today: number;
}

export interface QuestionsConsumed {
  total: number;
  thisWeek: number;
  todayCount: number;
  dailyHistory: { date: string; count: number }[];
  weeklyHistory: { date: string; count: number }[];
  todayHistory: { time: string; count: number }[];
}

export interface ResponsesSent {
  total: number;
  thisWeek: number;
  todayCount: number;
  successful: number;
  clarificationNeeded: number;
  noAnswerFound: number;
  byPeriod: {
    total: { successful: number; clarification: number; noAnswer: number };
    thisWeek: { successful: number; clarification: number; noAnswer: number };
    today: { successful: number; clarification: number; noAnswer: number };
  };
}

export interface DowntimeIncident {
  id: string;
  time: string;
  duration: string;
  reason: string;
}

export interface DowntimeMetrics {
  incidents: DowntimeIncident[];
  totalDowntimeMinutes: number;
  period: string;
}

export interface DocumentRetrievalEfficiency {
  percentage: number;
  distribution: { confidence: string; count: number }[];
}

export interface ContentGenerationQuality {
  distribution: { label: string; value: number }[];
  distributionWeek: { label: string; value: number }[];
  distributionToday: { label: string; value: number }[];
  timeline: { time: string; value: number }[];
}

export interface ApiHitsMetrics {
  total: number;
  thisWeek: number;
  today: number;
  endpoints: { name: string; count: number; color: string }[];
  breakdown: { endpoint: string; count: number }[];
  breakdownByPeriod: {
    total: { endpoint: string; count: number }[];
    thisWeek: { endpoint: string; count: number }[];
    today: { endpoint: string; count: number }[];
  };
}

export interface ResponseLatency {
  average: number;
  averageThisWeek: number;
  averageToday: number;
  timeline: { time: string; value: number }[];
  timelineToday: { time: string; value: number }[];
  timelineWeek: { time: string; value: number }[];
}

export interface ContentQualityDetail {
  qualityScore: number;
  qualityScoreWeek: number;
  qualityScoreToday: number;
  clarification: number;
  noAnswerFound: number;
  timeline: { time: string; quality: number; clarification: number; noAnswer: number }[];
  timelineToday: { time: string; quality: number; clarification: number; noAnswer: number }[];
}

export interface KnowledgeSource {
  name: string;
  lastSync: string;
  coverage: number;
  coverageWeek: number;
  coverageToday: number;
}

export interface KnowledgeSourceCoverage {
  sources: KnowledgeSource[];
}

export interface DashboardData {
  systemStatus: SystemStatus;
  questionsConsumed: QuestionsConsumed;
  responsesSent: ResponsesSent;
  downtime: DowntimeMetrics;
  documentRetrieval: DocumentRetrievalEfficiency;
  contentGeneration: ContentGenerationQuality;
  apiHits: ApiHitsMetrics;
  responseLatency: ResponseLatency;
  contentQuality: ContentQualityDetail;
  knowledgeSources: KnowledgeSourceCoverage;
}

// API Log types
export interface ApiLog {
  id: string;
  timestamp: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
}

// System Status page types
export interface ServiceHealth {
  name: string;
  status: "operational" | "degraded" | "outage";
  latency: number;
  uptime: number;
  lastChecked: string;
}

// Settings types
export interface AppSettings {
  refreshInterval: number;
  alertThresholds: {
    uptimeWarning: number;
    latencyWarning: number;
    errorRateWarning: number;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: string;
  };
  dataSources: {
    id: string;
    name: string;
    connectionString: string;
    enabled: boolean;
  }[];
}

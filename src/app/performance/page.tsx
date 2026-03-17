"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import ChartFilterPopover, {
  DateRangeFilter,
  DateTimeRangeFilter,
} from "@/components/ui/ChartFilterPopover";
import { CustomerSwitcherCompact } from "@/components/ui/CustomerSelector";
import { useCustomer } from "@/lib/CustomerContext";
import {
  generateLatencyData,
  generateRetrievalData,
  generateQualityData,
  generateQuestionsData,
  LatencyPoint,
} from "@/data/performanceMock";

// Default view: last 7 days
const defaultStart = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
const defaultEnd = new Date().toISOString().split("T")[0];

function filterByDateRange<T>(
  data: T[],
  filter: DateRangeFilter | DateTimeRangeFilter | null,
  getDate: (item: T) => string
): T[] {
  const start = filter?.startDate || defaultStart;
  const end = filter?.endDate || defaultEnd;

  return data.filter((item) => {
    const val = getDate(item);
    return val >= start && val <= end;
  });
}

function filterLatencyByTime(
  data: LatencyPoint[],
  filter: DateTimeRangeFilter | null
): LatencyPoint[] {
  if (!filter || (!filter.startTime && !filter.endTime)) return data;
  return data.filter((pt) => {
    const time = pt.datetime.split("T")[1]?.slice(0, 5) || "00:00";
    if (filter.startTime && time < filter.startTime) return false;
    if (filter.endTime && time > filter.endTime) return false;
    return true;
  });
}

export default function PerformancePage() {
  const { customer } = useCustomer();
  const [latencyFilter, setLatencyFilter] = useState<DateTimeRangeFilter | null>(null);
  const [retrievalFilter, setRetrievalFilter] = useState<DateRangeFilter | null>(null);
  const [qualityFilter, setQualityFilter] = useState<DateRangeFilter | null>(null);
  const [questionsFilter, setQuestionsFilter] = useState<DateRangeFilter | null>(null);

  // Generate customer-specific datasets
  const allLatency = useMemo(() => generateLatencyData(30, customer.id), [customer.id]);
  const allRetrieval = useMemo(() => generateRetrievalData(30, customer.id), [customer.id]);
  const allQuality = useMemo(() => generateQualityData(30, customer.id), [customer.id]);
  const allQuestions = useMemo(() => generateQuestionsData(30, customer.id), [customer.id]);

  // Filtered datasets
  const latencyData = useMemo(() => {
    const dateFiltered = filterByDateRange(allLatency, latencyFilter, (p) => p.datetime.split("T")[0]);
    return filterLatencyByTime(dateFiltered, latencyFilter);
  }, [allLatency, latencyFilter]);

  const retrievalData = useMemo(
    () => filterByDateRange(allRetrieval, retrievalFilter, (d) => d.date),
    [allRetrieval, retrievalFilter]
  );

  const qualityData = useMemo(
    () => filterByDateRange(allQuality, qualityFilter, (d) => d.date),
    [allQuality, qualityFilter]
  );

  const questionsData = useMemo(
    () => filterByDateRange(allQuestions, questionsFilter, (d) => d.date),
    [allQuestions, questionsFilter]
  );

  return (
    <div>
      <CustomerSwitcherCompact />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Performance</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Metrics for <span className="font-medium text-gray-700 dark:text-gray-300">{customer.name}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Latency Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Response Latency Over Time</h3>
            <ChartFilterPopover
              mode="datetime"
              value={latencyFilter}
              onApply={(f) => setLatencyFilter(f)}
              onClear={() => setLatencyFilter(null)}
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  interval={Math.max(0, Math.floor(latencyData.length / 8) - 1)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => `${v}s`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                  labelFormatter={(_, payload) => {
                    if (payload?.[0]?.payload) {
                      const pt = payload[0].payload as LatencyPoint;
                      return `${pt.dateLabel} ${pt.timeLabel}`;
                    }
                    return "";
                  }}
                  formatter={(v) => [`${v}s`, "Latency"]}
                />
                <defs>
                  <linearGradient id="perfLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f4c5c" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0f4c5c" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#0f4c5c" fill="url(#perfLatency)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Retrieval Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Document Retrieval Confidence</h3>
            <ChartFilterPopover
              mode="date"
              value={retrievalFilter}
              onApply={(f) => setRetrievalFilter(f)}
              onClear={() => setRetrievalFilter(null)}
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retrievalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  interval={Math.max(0, Math.floor(retrievalData.length / 8) - 1)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="high" stackId="a" fill="#0f4c5c" name="High (>70%)" radius={[0, 0, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="mid" stackId="a" fill="#10b981" name="Mid (40-70%)" isAnimationActive={false} />
                <Bar dataKey="low" stackId="a" fill="#e07a5f" name="Low (<40%)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Quality Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Content Quality Trends</h3>
            <ChartFilterPopover
              mode="date"
              value={qualityFilter}
              onApply={(f) => setQualityFilter(f)}
              onClear={() => setQualityFilter(null)}
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  interval={Math.max(0, Math.floor(qualityData.length / 8) - 1)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="quality" stroke="#0f4c5c" strokeWidth={2} name="Quality" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="clarification" stroke="#10b981" strokeWidth={2} name="Clarification" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="noAnswer" stroke="#e07a5f" strokeWidth={2} name="No Answer" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Questions Consumed Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Questions Consumed (Daily)</h3>
            <ChartFilterPopover
              mode="date"
              value={questionsFilter}
              onApply={(f) => setQuestionsFilter(f)}
              onClear={() => setQuestionsFilter(null)}
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  interval={Math.max(0, Math.floor(questionsData.length / 8) - 1)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

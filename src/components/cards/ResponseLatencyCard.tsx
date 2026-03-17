"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import ExpandableMetricCard from "@/components/ui/ExpandableMetricCard";
import type { ResponseLatency, TimePeriod } from "@/types/dashboard";

interface Props {
  data: ResponseLatency;
  onRefresh?: () => void;
}

export default function ResponseLatencyCard({ data, onRefresh }: Props) {
  const getValues = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return { average: data.averageToday, timeline: data.timelineToday, label: "avg today" };
      case "thisWeek":
        return { average: data.averageThisWeek, timeline: data.timelineWeek, label: "avg this week" };
      default:
        return { average: data.average, timeline: data.timeline, label: "avg all time" };
    }
  };

  return (
    <ExpandableMetricCard title="Response Latency" onRefresh={onRefresh}>
      {(period) => {
        const v = getValues(period);
        // Use a unique gradient ID per period to avoid SVG conflicts
        const gradId = `latencyGrad-${period}`;
        return (
          <>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{v.average} seconds</p>
            <p className="text-xs text-gray-400 mb-1">{v.label}</p>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={v.timeline}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 2]}
                    tickFormatter={(v) => `${v}s`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    fill={`url(#${gradId})`}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        );
      }}
    </ExpandableMetricCard>
  );
}

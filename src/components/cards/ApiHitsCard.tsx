"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import ExpandableMetricCard from "@/components/ui/ExpandableMetricCard";
import type { ApiHitsMetrics, TimePeriod } from "@/types/dashboard";

interface Props {
  data: ApiHitsMetrics;
  onRefresh?: () => void;
}

const BAR_COLORS = ["#0f4c5c", "#e07a5f", "#d4c5a9"];

export default function ApiHitsCard({ data, onRefresh }: Props) {
  const getValues = (period: TimePeriod) => {
    const headlineMap = { total: data.total, thisWeek: data.thisWeek, today: data.today };
    const subtitleMap = { total: "all time", thisWeek: "this week", today: "today" };
    return {
      headline: headlineMap[period],
      subtitle: subtitleMap[period],
      breakdown: data.breakdownByPeriod[period],
    };
  };

  return (
    <ExpandableMetricCard title="API Hits" onRefresh={onRefresh}>
      {(period) => {
        const v = getValues(period);
        return (
          <>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {v.headline.toLocaleString()}
            </p>
            <div className="flex items-center gap-3 mb-3">
              {data.endpoints.map((ep) => (
                <div key={ep.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ep.color }} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{ep.name}</span>
                </div>
              ))}
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={v.breakdown} barCategoryGap="25%">
                  <XAxis
                    dataKey="endpoint"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {v.breakdown.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        );
      }}
    </ExpandableMetricCard>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import ExpandableMetricCard from "@/components/ui/ExpandableMetricCard";
import type { ContentGenerationQuality, TimePeriod } from "@/types/dashboard";

interface Props {
  data: ContentGenerationQuality;
  onRefresh?: () => void;
}

export default function ContentGenerationCard({ data, onRefresh }: Props) {
  const getDistribution = (period: TimePeriod) => {
    switch (period) {
      case "today": return data.distributionToday;
      case "thisWeek": return data.distributionWeek;
      default: return data.distribution;
    }
  };

  return (
    <ExpandableMetricCard title="Content Generation Quality" onRefresh={onRefresh}>
      {(period) => {
        const dist = getDistribution(period);
        return (
          <>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dist} barCategoryGap="20%">
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </>
        );
      }}
    </ExpandableMetricCard>
  );
}

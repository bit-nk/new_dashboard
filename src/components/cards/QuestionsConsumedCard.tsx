"use client";

import { BarChart, Bar, ResponsiveContainer, XAxis } from "recharts";
import ExpandableMetricCard from "@/components/ui/ExpandableMetricCard";
import type { QuestionsConsumed, TimePeriod } from "@/types/dashboard";

interface Props {
  data: QuestionsConsumed;
  onRefresh?: () => void;
}

export default function QuestionsConsumedCard({ data, onRefresh }: Props) {
  const getValues = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return {
          headline: data.todayCount,
          subtitle: "questions today",
          chart: data.todayHistory.map((d) => ({ label: d.time, count: d.count })),
        };
      case "thisWeek":
        return {
          headline: data.thisWeek,
          subtitle: "questions this week",
          chart: data.weeklyHistory.map((d) => ({ label: d.date, count: d.count })),
        };
      default:
        return {
          headline: data.total,
          subtitle: `+${data.todayCount.toLocaleString()} today`,
          chart: data.dailyHistory.map((d) => ({ label: d.date, count: d.count })),
        };
    }
  };

  return (
    <ExpandableMetricCard title="Questions Consumed" onRefresh={onRefresh}>
      {(period) => {
        const v = getValues(period);
        return (
          <>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {v.headline.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-500 mb-3">{v.subtitle}</p>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={v.chart} barCategoryGap="20%">
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 8, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    interval={period === "today" ? 1 : 0}
                  />
                  <Bar dataKey="count" fill="#0f4c5c" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        );
      }}
    </ExpandableMetricCard>
  );
}

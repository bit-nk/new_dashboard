"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import ExpandableMetricCard from "@/components/ui/ExpandableMetricCard";
import type { ContentQualityDetail, TimePeriod } from "@/types/dashboard";

interface Props {
  data: ContentQualityDetail;
  onRefresh?: () => void;
}

export default function ContentQualityDetailCard({ data, onRefresh }: Props) {
  const getValues = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return { score: data.qualityScoreToday, timeline: data.timelineToday, label: "quality today" };
      case "thisWeek":
        return { score: data.qualityScoreWeek, timeline: data.timeline, label: "quality this week" };
      default:
        return { score: data.qualityScore, timeline: data.timeline, label: "quality all time" };
    }
  };

  return (
    <ExpandableMetricCard title="Content Generation Quality" onRefresh={onRefresh}>
      {(period) => {
        const v = getValues(period);
        return (
          <>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{v.score}%</span>
                <span className="text-[10px] text-gray-400">{v.label}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${v.score}%` }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0f4c5c]" />
                  Quality
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Clarification
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e07a5f]" />
                  No Answer
                </div>
              </div>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={v.timeline}>
                  <Line type="monotone" dataKey="quality" stroke="#0f4c5c" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="clarification" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="noAnswer" stroke="#e07a5f" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        );
      }}
    </ExpandableMetricCard>
  );
}

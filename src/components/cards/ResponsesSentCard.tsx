"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import ExpandableMetricCard from "@/components/ui/ExpandableMetricCard";
import type { ResponsesSent, TimePeriod } from "@/types/dashboard";

interface Props {
  data: ResponsesSent;
  onRefresh?: () => void;
}

const COLORS = ["#0f4c5c", "#7fb685", "#e07a5f"];

export default function ResponsesSentCard({ data, onRefresh }: Props) {
  const getValues = (period: TimePeriod) => {
    const bp = data.byPeriod[period];
    const headlineMap = { total: data.total, thisWeek: data.thisWeek, today: data.todayCount };
    const subtitleMap = {
      total: `+${data.todayCount.toLocaleString()} today`,
      thisWeek: "responses this week",
      today: "responses today",
    };
    return {
      headline: headlineMap[period],
      subtitle: subtitleMap[period],
      pieData: [
        { name: "Successful", value: bp.successful },
        { name: "Clarification Needed", value: bp.clarification },
        { name: "No Answer Found", value: bp.noAnswer },
      ],
    };
  };

  return (
    <ExpandableMetricCard title="Responses Sent" onRefresh={onRefresh}>
      {(period) => {
        const v = getValues(period);
        return (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {v.headline.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-500">{v.subtitle}</p>
              </div>
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={v.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {v.pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              {v.pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        );
      }}
    </ExpandableMetricCard>
  );
}

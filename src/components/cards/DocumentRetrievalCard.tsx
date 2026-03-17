"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import type { DocumentRetrievalEfficiency } from "@/types/dashboard";

interface Props {
  data: DocumentRetrievalEfficiency;
  onRefresh?: () => void;
}

export default function DocumentRetrievalCard({ data, onRefresh }: Props) {
  return (
    <MetricCard title="Document Retrieval Efficiency" onRefresh={onRefresh}>
      <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">{data.percentage}%</p>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.distribution} barCategoryGap="15%">
            <XAxis
              dataKey="confidence"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Bar dataKey="count" fill="#0f4c5c" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </MetricCard>
  );
}

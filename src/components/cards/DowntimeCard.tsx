"use client";

import MetricCard from "@/components/ui/MetricCard";
import type { DowntimeMetrics } from "@/types/dashboard";

interface Props {
  data: DowntimeMetrics;
  onRefresh?: () => void;
}

export default function DowntimeCard({ data, onRefresh }: Props) {
  return (
    <MetricCard title="Downtime" onRefresh={onRefresh} className="col-span-1">
      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left font-medium pb-2 pr-3">Time</th>
                <th className="text-left font-medium pb-2 pr-3">Duration</th>
                <th className="text-left font-medium pb-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {data.incidents.map((incident) => (
                <tr key={incident.id} className="border-b border-gray-50 dark:border-gray-700">
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{incident.time}</td>
                  <td className="py-2 pr-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{incident.duration}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-300 truncate max-w-[180px]">{incident.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Summary */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg px-5 py-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.totalDowntimeMinutes} minutes</p>
          <p className="text-xs text-gray-400">downtime {data.period}</p>
        </div>
      </div>
    </MetricCard>
  );
}

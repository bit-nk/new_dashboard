"use client";

import ExpandableMetricCard from "@/components/ui/ExpandableMetricCard";
import type { KnowledgeSourceCoverage, TimePeriod } from "@/types/dashboard";

interface Props {
  data: KnowledgeSourceCoverage;
  onRefresh?: () => void;
}

export default function KnowledgeSourceCard({ data, onRefresh }: Props) {
  const getCoverage = (source: (typeof data.sources)[number], period: TimePeriod) => {
    switch (period) {
      case "today": return source.coverageToday;
      case "thisWeek": return source.coverageWeek;
      default: return source.coverage;
    }
  };

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case "today": return "Coverage today";
      case "thisWeek": return "Coverage this week";
      default: return "Coverage all time";
    }
  };

  return (
    <ExpandableMetricCard title="Knowledge Source Coverage" onRefresh={onRefresh}>
      {(period) => (
        <>
          <p className="text-[10px] text-gray-400 mb-2">{getPeriodLabel(period)}</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="text-left font-medium pb-2">Data source</th>
                <th className="text-right font-medium pb-2">Last sync</th>
              </tr>
            </thead>
            <tbody>
              {data.sources.map((source, i) => {
                const coverage = getCoverage(source, period);
                return (
                  <tr key={i} className="border-t border-gray-50 dark:border-gray-700">
                    <td className="py-2 text-gray-700 dark:text-gray-200">{source.name}</td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-500 dark:text-gray-400">{source.lastSync}</span>
                        <span className="text-gray-400 font-medium">~{coverage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${coverage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </ExpandableMetricCard>
  );
}

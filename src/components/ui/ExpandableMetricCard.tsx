"use client";

import { useState } from "react";
import { RefreshCw, Clock } from "lucide-react";
import type { TimePeriod } from "@/types/dashboard";

const periodLabels: Record<TimePeriod, string> = {
  total: "All Time",
  thisWeek: "This Week",
  today: "Today",
};

interface ExpandableMetricCardProps {
  title: string;
  children: (period: TimePeriod) => React.ReactNode;
  onRefresh?: () => void;
  className?: string;
}

function getCentralTime(): string {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ExpandableMetricCard({
  title,
  children,
  onRefresh,
  className = "",
}: ExpandableMetricCardProps) {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("total");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 3500);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60"
          >
            {refreshing && <span className="text-[10px] text-teal-500 dark:text-teal-400 font-medium">Refreshing</span>}
            <RefreshCw size={14} className={refreshing ? "animate-spin text-teal-500" : ""} />
          </button>
        )}
      </div>

      {/* Time period tabs */}
      <div className="flex items-center gap-1 mb-3">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 gap-0.5">
          {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-200 ${
                activePeriod === period
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-500/40"
              }`}
            >
              {periodLabels[period]}
            </button>
          ))}
        </div>

        {activePeriod !== "total" && (
          <div className="flex items-center gap-1 ml-auto text-[10px] text-gray-400">
            <Clock size={10} />
            <span>{getCentralTime()} CT</span>
          </div>
        )}
      </div>

      {children(activePeriod)}
    </div>
  );
}

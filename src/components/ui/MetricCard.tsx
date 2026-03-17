"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface MetricCardProps {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  className?: string;
}

export default function MetricCard({ title, children, onRefresh, className = "" }: MetricCardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 3500);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
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
      {children}
    </div>
  );
}

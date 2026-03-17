"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Database, Clock, AlertTriangle, Zap, FileText, Activity } from "lucide-react";
import {
  DataSourceMetrics,
  SOURCE_META,
  getStatusColor,
  getStatusLabel,
} from "@/data/customerMock";
import type { DataSourceName } from "@/lib/CustomerContext";

interface Props {
  metrics: DataSourceMetrics;
  onExpand: (source: DataSourceName) => void;
  animateProgress?: boolean;
}

export default function DataSourceTile({ metrics, onExpand, animateProgress = true }: Props) {
  const { source, status, ingestionPercent, recordsMigrated, recordsTotal, lastSync, errorCount, avgLatencyMs, uptimePercent, documentsIndexed, queriesHandled } = metrics;
  const meta = SOURCE_META[source];
  const statusInfo = getStatusLabel(status);
  const barColor = getStatusColor(status);

  // Animate progress bar
  const [displayPercent, setDisplayPercent] = useState(0);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!animateProgress) {
      setDisplayPercent(ingestionPercent);
      return;
    }

    // Animate from current to target
    setDisplayPercent(0);
    const step = () => {
      setDisplayPercent((prev) => {
        if (prev >= ingestionPercent) {
          if (animRef.current) clearInterval(animRef.current);
          return ingestionPercent;
        }
        return Math.min(prev + 1, ingestionPercent);
      });
    };
    animRef.current = setInterval(step, 15);
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [ingestionPercent, animateProgress]);

  // Pulsing dot for syncing status
  const isSyncing = status === "syncing";

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group"
      onClick={() => onExpand(source)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${meta.bgLight} ${meta.bgDark} flex items-center justify-center text-lg`}>
            {meta.icon}
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${meta.color}`}>{source}</h3>
            <div className="flex items-center gap-1.5">
              {isSyncing && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />}
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusInfo.className}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Ingestion Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Ingestion Progress</span>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{displayPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor} ${isSyncing ? "animate-pulse" : ""}`}
            style={{ width: `${displayPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-400">
            {recordsMigrated.toLocaleString()} / {recordsTotal.toLocaleString()} records
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Clock size={9} /> {lastSync}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Zap size={12} className="text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-400">Latency</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{avgLatencyMs}ms</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Activity size={12} className="text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-400">Uptime</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{uptimePercent}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <FileText size={12} className="text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-400">Indexed</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{documentsIndexed.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {errorCount > 0 ? (
            <>
              <AlertTriangle size={12} className="text-amber-500" />
              <div>
                <p className="text-[10px] text-gray-400">Errors</p>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{errorCount}</p>
              </div>
            </>
          ) : (
            <>
              <Database size={12} className="text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-400">Queries</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{queriesHandled.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { DataSourceMetrics, SOURCE_META, getStatusColor, getStatusLabel } from "@/data/customerMock";

interface Props {
  sources: DataSourceMetrics[];
  animateProgress?: boolean;
}

export default function MigrationProgressBar({ sources, animateProgress = true }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Data Migration Progress</h3>
      <div className="space-y-3">
        {sources.map((src) => (
          <MigrationRow key={src.source} metrics={src} animateProgress={animateProgress} />
        ))}
      </div>

      {/* Overall progress */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Overall Migration</span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
            {Math.round(sources.reduce((a, s) => a + s.ingestionPercent, 0) / sources.length)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-500"
            style={{ width: `${sources.reduce((a, s) => a + s.ingestionPercent, 0) / sources.length}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function MigrationRow({ metrics, animateProgress }: { metrics: DataSourceMetrics; animateProgress: boolean }) {
  const { source, ingestionPercent, recordsMigrated, recordsTotal, status } = metrics;
  const meta = SOURCE_META[source];
  const barColor = getStatusColor(status);
  const statusInfo = getStatusLabel(status);

  const [displayPercent, setDisplayPercent] = useState(0);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!animateProgress) {
      setDisplayPercent(ingestionPercent);
      return;
    }
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
    animRef.current = setInterval(step, 12);
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [ingestionPercent, animateProgress]);

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${meta.bgLight} ${meta.bgDark} flex items-center justify-center text-sm flex-shrink-0`}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${meta.color}`}>{source}</span>
            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            {recordsMigrated.toLocaleString()} / {recordsTotal.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${displayPercent}%` }}
          />
        </div>
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-200 w-10 text-right">{displayPercent}%</span>
    </div>
  );
}

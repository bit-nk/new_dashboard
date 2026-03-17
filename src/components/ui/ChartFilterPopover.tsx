"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface DateTimeRangeFilter extends DateRangeFilter {
  startTime: string;
  endTime: string;
}

interface BaseProps {
  onClear: () => void;
}

interface DateOnlyProps extends BaseProps {
  mode: "date";
  value: DateRangeFilter | null;
  onApply: (filter: DateRangeFilter) => void;
}

interface DateTimeProps extends BaseProps {
  mode: "datetime";
  value: DateTimeRangeFilter | null;
  onApply: (filter: DateTimeRangeFilter) => void;
}

type Props = DateOnlyProps | DateTimeProps;

function formatFilterLabel(
  filter: DateRangeFilter | DateTimeRangeFilter | null,
  mode: "date" | "datetime"
): string | null {
  if (!filter) return null;
  const fmt = (d: string) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  let label = `${fmt(filter.startDate)} - ${fmt(filter.endDate)}`;
  if (mode === "datetime" && "startTime" in filter && (filter.startTime || filter.endTime)) {
    const parts: string[] = [];
    if (filter.startTime) parts.push(filter.startTime);
    if (filter.endTime) parts.push(filter.endTime);
    label += ` (${parts.join(" - ")})`;
  }
  return label;
}

export default function ChartFilterPopover(props: Props) {
  const { mode, value, onClear } = props;
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(value?.startDate || "");
  const [endDate, setEndDate] = useState(value?.endDate || "");
  const [startTime, setStartTime] = useState(
    mode === "datetime" && value && "startTime" in value ? value.startTime : ""
  );
  const [endTime, setEndTime] = useState(
    mode === "datetime" && value && "endTime" in value ? value.endTime : ""
  );
  const popRef = useRef<HTMLDivElement>(null);

  // Sync local state when external value changes (e.g. on clear)
  useEffect(() => {
    setStartDate(value?.startDate || "");
    setEndDate(value?.endDate || "");
    if (mode === "datetime" && value && "startTime" in value) {
      setStartTime(value.startTime);
      setEndTime(value.endTime);
    } else {
      setStartTime("");
      setEndTime("");
    }
  }, [value, mode]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleApply = () => {
    if (!startDate || !endDate) return;
    if (mode === "datetime") {
      (props as DateTimeProps).onApply({ startDate, endDate, startTime, endTime });
    } else {
      (props as DateOnlyProps).onApply({ startDate, endDate });
    }
    setOpen(false);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    onClear();
    setOpen(false);
  };

  const isActive = value !== null;
  const filterLabel = formatFilterLabel(value, mode);

  return (
    <div className="relative" ref={popRef}>
      {/* Filter trigger row */}
      <div className="flex items-center gap-2">
        {/* Active filter badge */}
        {isActive && filterLabel && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-md">
            <span className="text-[11px] font-medium text-teal-700 dark:text-teal-300">{filterLabel}</span>
            <button
              onClick={handleClear}
              className="text-teal-500 hover:text-teal-700 dark:hover:text-teal-200"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <button
          onClick={() => setOpen((p) => !p)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            isActive
              ? "border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30"
              : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Filter size={12} />
          Filter
        </button>
      </div>

      {/* Popover */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {mode === "datetime" ? "Date & Time Range" : "Date Range"}
            </h4>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Date inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Time inputs (only for datetime mode) */}
            {mode === "datetime" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Quick presets */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Quick Select</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Last 7 days", days: 7 },
                  { label: "Last 14 days", days: 14 },
                  { label: "Last 30 days", days: 30 },
                ].map((preset) => {
                  const end = new Date().toISOString().split("T")[0];
                  const start = new Date(Date.now() - preset.days * 86400000).toISOString().split("T")[0];
                  const isSelected = startDate === start && endDate === end;
                  return (
                    <button
                      key={preset.days}
                      onClick={() => { setStartDate(start); setEndDate(end); }}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                        isSelected
                          ? "bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300"
                          : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleClear}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Clear filter
              </button>
              <button
                onClick={handleApply}
                disabled={!startDate || !endDate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Check size={12} />
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

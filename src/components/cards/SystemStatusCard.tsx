"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import type { SystemStatus } from "@/types/dashboard";

interface Props {
  data: SystemStatus;
  onRefresh?: () => void;
}

export default function SystemStatusCard({ data, onRefresh }: Props) {
  const chartData = data.uptimeHistory.map((v, i) => ({ hour: i, value: v }));

  const statusColor = {
    healthy: "text-emerald-500",
    degraded: "text-amber-500",
    down: "text-red-500",
  };

  const statusLabel = {
    healthy: "System Healthy",
    degraded: "System Degraded",
    down: "System Down",
  };

  return (
    <MetricCard title="Overall System Status" onRefresh={onRefresh}>
      <p className={`text-2xl font-bold ${statusColor[data.status]} mb-3`}>
        {statusLabel[data.status]}
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Uptime %</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{data.uptimePercentage}%</p>
          <p className="text-xs text-gray-400 mt-1">Recent uptime last 24h</p>
        </div>
        <div className="w-1/2 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fill="url(#uptimeGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MetricCard>
  );
}

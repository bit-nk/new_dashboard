"use client";

import { useState, useMemo } from "react";
import type { ApiLog } from "@/types/dashboard";
import { Search } from "lucide-react";
import { CustomerSwitcherCompact } from "@/components/ui/CustomerSelector";
import { useCustomer } from "@/lib/CustomerContext";
import { generateCustomerLogs } from "@/data/mock";

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  POST: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  PUT: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  DELETE: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

const statusColors: Record<string, string> = {
  "2": "text-emerald-600 dark:text-emerald-400",
  "4": "text-amber-600 dark:text-amber-400",
  "5": "text-red-600 dark:text-red-400",
};

export default function ApiLogsPage() {
  const { customer } = useCustomer();
  const [filter, setFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  // Customer-specific logs
  const logs = useMemo(() => generateCustomerLogs(customer.id, 50), [customer.id]);

  const filtered = logs.filter((log) => {
    const matchesSearch = log.endpoint.toLowerCase().includes(filter.toLowerCase()) || log.id.includes(filter);
    const matchesMethod = methodFilter === "ALL" || log.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div>
      <CustomerSwitcherCompact />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">API Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Requests for <span className="font-medium text-gray-700 dark:text-gray-300">{customer.name}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Filter by endpoint..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="ALL">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                <th className="text-left px-4 py-3 font-medium">Method</th>
                <th className="text-left px-4 py-3 font-medium">Endpoint</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No logs found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${methodColors[log.method] || ""}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 font-mono text-xs">{log.endpoint}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${statusColors[String(log.statusCode)[0]] || "text-gray-600 dark:text-gray-300"}`}>
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{log.responseTime}s</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

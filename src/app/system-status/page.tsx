"use client";

import { useMemo } from "react";
import { useCustomer } from "@/lib/CustomerContext";
import { getCustomerServiceHealth, getCustomerDataSources, SOURCE_META, getStatusLabel } from "@/data/customerMock";
import { CustomerSwitcherCompact } from "@/components/ui/CustomerSelector";

const statusStyles = {
  operational: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", label: "Operational" },
  degraded: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", label: "Degraded" },
  outage: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400", label: "Outage" },
};

export default function SystemStatusPage() {
  const { customer, customerSources } = useCustomer();

  const services = useMemo(() => getCustomerServiceHealth(customer.id, customerSources), [customer.id, customerSources]);
  const dataSources = useMemo(() => getCustomerDataSources(customer.id, customerSources), [customer.id, customerSources]);

  // Count overall status
  const allOperational = services.every((s) => s.status === "operational");
  const hasDegraded = services.some((s) => s.status === "degraded");

  return (
    <div>
      <CustomerSwitcherCompact />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Status</h1>
        <span className="text-xs text-gray-400">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Overall status banner */}
      <div className={`rounded-xl p-5 mb-6 border ${
        allOperational
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
          : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${allOperational ? "bg-emerald-500" : "bg-amber-500"}`} />
          <p className={`font-semibold text-lg ${allOperational ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
            {allOperational ? "All Systems Operational" : hasDegraded ? "Some Systems Degraded" : "System Issues Detected"}
          </p>
        </div>
        <p className={`text-sm mt-1 ${allOperational ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
          Viewing status for <span className="font-medium">{customer.name}</span>
        </p>
      </div>

      {/* Data Source Ingestion Status */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Source Ingestion</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${dataSources.sources.length >= 4 ? "lg:grid-cols-4" : dataSources.sources.length === 3 ? "lg:grid-cols-3" : ""} gap-4 mb-8`}>
        {dataSources.sources.map((src) => {
          const meta = SOURCE_META[src.source];
          const statusInfo = getStatusLabel(src.status);
          return (
            <div key={src.source} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg ${meta.bgLight} ${meta.bgDark} flex items-center justify-center text-sm`}>
                  {meta.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${meta.color}`}>{src.source}</h3>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Ingestion</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{src.ingestionPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${src.ingestionPercent === 100 ? "bg-emerald-500" : "bg-teal-500"}`}
                    style={{ width: `${src.ingestionPercent}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-400">Uptime</span>
                    <p className="font-medium text-gray-700 dark:text-gray-200">{src.uptimePercent}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Latency</span>
                    <p className="font-medium text-gray-700 dark:text-gray-200">{src.avgLatencyMs}ms</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Services grid */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Service Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const style = statusStyles[service.status];
          return (
            <div key={service.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{service.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Latency</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">{service.latency}ms</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Uptime</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">{service.uptime}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Last Check</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {new Date(service.lastChecked).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

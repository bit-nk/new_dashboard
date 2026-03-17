"use client";

import { useState, useMemo } from "react";
import { useCustomer } from "@/lib/CustomerContext";
import { getCustomerDataSources } from "@/data/customerMock";
import type { DataSourceName } from "@/lib/CustomerContext";

import CustomerSelector from "@/components/ui/CustomerSelector";
import DataSourceTile from "@/components/cards/DataSourceTile";
import DataSourceDetail from "@/components/cards/DataSourceDetail";
import MigrationProgressBar from "@/components/cards/MigrationProgressBar";

export default function DashboardPage() {
  const { customer, customerSources } = useCustomer();
  const [expandedSource, setExpandedSource] = useState<DataSourceName | null>(null);

  const customerData = useMemo(
    () => getCustomerDataSources(customer.id, customerSources),
    [customer.id, customerSources]
  );

  // If a source is expanded, show its detail view
  if (expandedSource) {
    return (
      <div>
        <CustomerSelector />
        <DataSourceDetail source={expandedSource} onBack={() => setExpandedSource(null)} />
      </div>
    );
  }

  return (
    <div>
      {/* Customer Selector */}
      <CustomerSelector />

      {/* Page title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Viewing data sources for <span className="font-medium text-gray-700 dark:text-gray-300">{customer.name}</span>
          </p>
        </div>
      </div>

      {/* Data Source Tiles */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${customerData.sources.length >= 4 ? "lg:grid-cols-4" : customerData.sources.length === 3 ? "lg:grid-cols-3" : ""} gap-5 mb-6`}>
        {customerData.sources.map((src) => (
          <DataSourceTile
            key={src.source}
            metrics={src}
            onExpand={setExpandedSource}
          />
        ))}
      </div>

      {/* Migration Progress Footer */}
      <MigrationProgressBar sources={customerData.sources} />
    </div>
  );
}

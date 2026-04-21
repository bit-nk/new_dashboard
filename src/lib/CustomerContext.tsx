"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Customer {
  id: string;
  name: string;
  shortName: string;
  industry: string;
  color: string; // tailwind accent
}

export const CUSTOMERS: Customer[] = [
  { id: "meridian", name: "Meridian Healthcare", shortName: "MHC", industry: "Healthcare", color: "blue" },
  { id: "apex", name: "Apex Financial Group", shortName: "AFG", industry: "Finance", color: "violet" },
  { id: "summit", name: "Summit Logistics", shortName: "SML", industry: "Logistics", color: "amber" },
  { id: "brightwave", name: "Brightwave Media", shortName: "BWM", industry: "Media", color: "rose" },
];

export const ALL_DATA_SOURCES = ["ITGlue", "HubSpot", "TigerPaw", "ConnectWise"] as const;
export type DataSourceName = (typeof ALL_DATA_SOURCES)[number];

// Default data sources per customer (varying counts for showcase)
const DEFAULT_CUSTOMER_SOURCES: Record<string, DataSourceName[]> = {
  meridian: ["ITGlue", "HubSpot", "TigerPaw", "ConnectWise"],  // all 4
  apex: ["ITGlue", "HubSpot", "ConnectWise"],                    // 3
  summit: ["TigerPaw", "ConnectWise", "HubSpot"],                // 3
  brightwave: ["ITGlue", "ConnectWise"],                          // 2
};

interface CustomerContextValue {
  customer: Customer;
  setCustomerId: (id: string) => void;
  customers: Customer[];
  // Dynamic data source management
  customerSources: DataSourceName[];
  addSource: (source: DataSourceName) => void;
  removeSource: (source: DataSourceName) => void;
  allAvailableSources: readonly DataSourceName[];
}

const CustomerContext = createContext<CustomerContextValue>({
  customer: CUSTOMERS[0],
  setCustomerId: () => {},
  customers: CUSTOMERS,
  customerSources: ALL_DATA_SOURCES as unknown as DataSourceName[],
  addSource: () => {},
  removeSource: () => {},
  allAvailableSources: ALL_DATA_SOURCES,
});

export function useCustomer() {
  return useContext(CustomerContext);
}

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customerId, setCustomerIdState] = useState<string>(CUSTOMERS[0].id);

  // Per-customer data source map
  const [sourcesMap, setSourcesMap] = useState<Record<string, DataSourceName[]>>(() => ({
    ...DEFAULT_CUSTOMER_SOURCES,
  }));

  const customer = CUSTOMERS.find((c) => c.id === customerId) || CUSTOMERS[0];
  const customerSources = sourcesMap[customerId] || DEFAULT_CUSTOMER_SOURCES[customerId] || [...ALL_DATA_SOURCES];

  const setCustomerId = useCallback((id: string) => {
    setCustomerIdState(id);
    localStorage.setItem("lumina-customer", id);
  }, []);

  const addSource = useCallback((source: DataSourceName) => {
    setSourcesMap((prev) => {
      const current = prev[customerId] || DEFAULT_CUSTOMER_SOURCES[customerId] || [];
      if (current.includes(source)) return prev;
      return { ...prev, [customerId]: [...current, source] };
    });
  }, [customerId]);

  const removeSource = useCallback((source: DataSourceName) => {
    setSourcesMap((prev) => {
      const current = prev[customerId] || DEFAULT_CUSTOMER_SOURCES[customerId] || [];
      return { ...prev, [customerId]: current.filter((s) => s !== source) };
    });
  }, [customerId]);

  useEffect(() => {
    const stored = localStorage.getItem("lumina-customer");
    if (stored && CUSTOMERS.some((c) => c.id === stored)) {
      setCustomerIdState(stored);
    }
  }, []);

  return (
    <CustomerContext.Provider value={{
      customer,
      setCustomerId,
      customers: CUSTOMERS,
      customerSources,
      addSource,
      removeSource,
      allAvailableSources: ALL_DATA_SOURCES,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

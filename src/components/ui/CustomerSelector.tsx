"use client";

import { useCustomer, Customer } from "@/lib/CustomerContext";
import { Building2, Check } from "lucide-react";

const colorMap: Record<string, { ring: string; bg: string; text: string; badge: string }> = {
  blue:   { ring: "ring-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-300",   badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300" },
  violet: { ring: "ring-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300", badge: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300" },
  amber:  { ring: "ring-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-300", badge: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300" },
  rose:   { ring: "ring-rose-400",   bg: "bg-rose-50 dark:bg-rose-900/30",     text: "text-rose-700 dark:text-rose-300",   badge: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300" },
};

export default function CustomerSelector() {
  const { customer, setCustomerId, customers } = useCustomer();

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select Customer</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {customers.map((c) => {
          const isActive = c.id === customer.id;
          const colors = colorMap[c.color] || colorMap.blue;
          return (
            <button
              key={c.id}
              onClick={() => setCustomerId(c.id)}
              className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                isActive
                  ? `border-teal-500 ${colors.bg} ring-2 ${colors.ring} ring-opacity-30 shadow-md`
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                isActive ? `${colors.badge}` : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {c.shortName}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${isActive ? colors.text : "text-gray-900 dark:text-gray-100"}`}>
                  {c.name}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{c.industry}</p>
              </div>
              {isActive && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for non-dashboard tabs
export function CustomerSwitcherCompact() {
  const { customer, setCustomerId, customers } = useCustomer();
  const colors = colorMap[customer.color] || colorMap.blue;

  return (
    <div className="flex items-center gap-2 mb-5">
      <Building2 size={14} className="text-gray-400" />
      <span className="text-xs text-gray-500 dark:text-gray-400">Customer:</span>
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
        {customers.map((c) => {
          const isActive = c.id === customer.id;
          const cColors = colorMap[c.color] || colorMap.blue;
          return (
            <button
              key={c.id}
              onClick={() => setCustomerId(c.id)}
              title={c.name}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                isActive
                  ? `bg-white dark:bg-gray-600 shadow-sm ${cColors.text}`
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {c.shortName}
            </button>
          );
        })}
      </div>
      <span className={`text-xs font-medium ${colors.text}`}>{customer.name}</span>
    </div>
  );
}

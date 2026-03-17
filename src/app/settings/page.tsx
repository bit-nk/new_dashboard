"use client";

import { useState, useCallback } from "react";
import { Save, Check, RefreshCw, Plus, X } from "lucide-react";
import { CustomerSwitcherCompact } from "@/components/ui/CustomerSelector";
import { useCustomer } from "@/lib/CustomerContext";
import type { DataSourceName } from "@/lib/CustomerContext";
import { SOURCE_META } from "@/data/customerMock";

const refreshOptions = [
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
  { value: 300, label: "5 minutes" },
  { value: 0, label: "Manual only" },
];

interface CustomerSettings {
  refreshInterval: number;
  uptimeWarning: number;
  latencyWarning: number;
  errorRateWarning: number;
  emailNotifications: boolean;
  slackNotifications: boolean;
  webhookUrl: string;
}

const CUSTOMER_DEFAULTS: Record<string, CustomerSettings> = {
  meridian: { refreshInterval: 15, uptimeWarning: 99.9, latencyWarning: 1.5, errorRateWarning: 3, emailNotifications: true, slackNotifications: true, webhookUrl: "https://hooks.meridian-health.com/alerts" },
  apex: { refreshInterval: 30, uptimeWarning: 99.5, latencyWarning: 2.0, errorRateWarning: 5, emailNotifications: true, slackNotifications: false, webhookUrl: "" },
  summit: { refreshInterval: 60, uptimeWarning: 99.0, latencyWarning: 3.0, errorRateWarning: 8, emailNotifications: false, slackNotifications: true, webhookUrl: "https://summit-ops.slack.com/webhook" },
  brightwave: { refreshInterval: 300, uptimeWarning: 98.5, latencyWarning: 2.5, errorRateWarning: 10, emailNotifications: true, slackNotifications: false, webhookUrl: "" },
};

const FALLBACK: CustomerSettings = { refreshInterval: 30, uptimeWarning: 99.5, latencyWarning: 2.0, errorRateWarning: 5, emailNotifications: true, slackNotifications: false, webhookUrl: "" };

export default function SettingsPage() {
  const { customer, customerSources, addSource, removeSource, allAvailableSources } = useCustomer();

  const [settingsMap, setSettingsMap] = useState<Record<string, CustomerSettings>>(() => ({ ...CUSTOMER_DEFAULTS }));
  const settings = settingsMap[customer.id] || CUSTOMER_DEFAULTS[customer.id] || FALLBACK;

  const updateField = useCallback(<K extends keyof CustomerSettings>(key: K, value: CustomerSettings[K]) => {
    setSettingsMap((prev) => ({
      ...prev,
      [customer.id]: { ...(prev[customer.id] || CUSTOMER_DEFAULTS[customer.id] || FALLBACK), [key]: value },
    }));
  }, [customer.id]);

  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // Refresh state per source
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  const [refreshAll, setRefreshAll] = useState(false);

  const handleRefreshSource = (src: DataSourceName) => {
    setRefreshing((prev) => ({ ...prev, [src]: true }));
    setTimeout(() => setRefreshing((prev) => ({ ...prev, [src]: false })), 3500);
  };

  const handleRefreshAll = () => {
    setRefreshAll(true);
    const all: Record<string, boolean> = {};
    customerSources.forEach((s) => { all[s] = true; });
    setRefreshing(all);
    setTimeout(() => {
      setRefreshing({});
      setRefreshAll(false);
    }, 4000);
  };

  // Remove confirmation
  const [removeConfirm, setRemoveConfirm] = useState<DataSourceName | null>(null);

  // Sources not yet added
  const availableToAdd = allAvailableSources.filter((s) => !customerSources.includes(s));

  return (
    <div>
      <CustomerSwitcherCompact />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Configuration for <span className="font-medium text-gray-700 dark:text-gray-300">{customer.name}</span>
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? "bg-emerald-500 text-white" : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">General</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auto-Refresh Interval</label>
              <div className="space-y-1.5">
                {refreshOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateField("refreshInterval", opt.value)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      settings.refreshInterval === opt.value
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300"
                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {settings.refreshInterval === opt.value && <Check size={14} className="text-teal-600 dark:text-teal-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Alert Thresholds</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Uptime Warning (%)</label>
              <input type="number" step="0.1" value={settings.uptimeWarning} onChange={(e) => updateField("uptimeWarning", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latency Warning (seconds)</label>
              <input type="number" step="0.1" value={settings.latencyWarning} onChange={(e) => updateField("latencyWarning", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Error Rate Warning (%)</label>
              <input type="number" value={settings.errorRateWarning} onChange={(e) => updateField("errorRateWarning", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-gray-200" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</label>
              <button onClick={() => updateField("emailNotifications", !settings.emailNotifications)} className={`relative w-11 h-6 rounded-full transition-colors ${settings.emailNotifications ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.emailNotifications ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Slack Notifications</label>
              <button onClick={() => updateField("slackNotifications", !settings.slackNotifications)} className={`relative w-11 h-6 rounded-full transition-colors ${settings.slackNotifications ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.slackNotifications ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook URL</label>
              <input type="url" placeholder="https://hooks.example.com/..." value={settings.webhookUrl} onChange={(e) => updateField("webhookUrl", e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400" />
            </div>
          </div>
        </div>

        {/* Data Sources — full management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Data Sources</h2>
            <button
              onClick={handleRefreshAll}
              disabled={refreshAll || customerSources.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-700 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={12} className={refreshAll ? "animate-spin" : ""} />
              {refreshAll ? "Refreshing..." : "Refresh All"}
            </button>
          </div>

          <div className="space-y-2.5">
            {customerSources.map((src) => {
              const meta = SOURCE_META[src];
              const isRefreshing = refreshing[src];
              return (
                <div key={src} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-md ${meta.bgLight} ${meta.bgDark} flex items-center justify-center text-sm`}>
                      {meta.icon}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${meta.color}`}>{src}</span>
                      {isRefreshing && (
                        <p className="text-[10px] text-teal-500 dark:text-teal-400">Refreshing...</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isRefreshing && (
                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Connected</span>
                    )}
                    <button
                      onClick={() => handleRefreshSource(src)}
                      disabled={isRefreshing}
                      className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-40"
                      title={`Refresh ${src}`}
                    >
                      <RefreshCw size={13} className={isRefreshing ? "animate-spin text-teal-500" : ""} />
                    </button>
                    {removeConfirm === src ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { removeSource(src); setRemoveConfirm(null); }}
                          className="px-2 py-1 text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setRemoveConfirm(null)}
                          className="px-1.5 py-1 text-[10px] text-gray-500 dark:text-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRemoveConfirm(src)}
                        className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                        title={`Remove ${src}`}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {customerSources.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No data sources configured.</p>
            )}
          </div>

          {/* Add data source */}
          {availableToAdd.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Add Data Source</p>
              <div className="flex flex-wrap gap-2">
                {availableToAdd.map((src) => {
                  const meta = SOURCE_META[src];
                  return (
                    <button
                      key={src}
                      onClick={() => addSource(src)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <Plus size={12} />
                      <span>{meta.icon}</span>
                      {src}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

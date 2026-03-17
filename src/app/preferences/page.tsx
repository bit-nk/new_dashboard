"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

const timezones = [
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "GMT (London)" },
];

const themes = [
  { value: "light" as const, label: "Light", preview: "bg-white border-gray-300" },
  { value: "dark" as const, label: "Dark", preview: "bg-gray-900 border-gray-600" },
  { value: "system" as const, label: "System", preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400" },
];

const dateFormats = [
  { value: "MM/DD/YYYY", example: "03/17/2026" },
  { value: "DD/MM/YYYY", example: "17/03/2026" },
  { value: "YYYY-MM-DD", example: "2026-03-17" },
  { value: "MMM DD, YYYY", example: "Mar 17, 2026" },
];

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState({
    timezone: "America/Chicago",
    dateFormat: "MMM DD, YYYY",
    showSparklines: true,
    animateCharts: true,
    animateIngestion: true,
    defaultPeriod: "total" as "total" | "thisWeek" | "today",
    desktopNotifications: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = <K extends keyof typeof prefs>(key: K, value: (typeof prefs)[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Preferences</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Personalize your dashboard experience.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      theme === t.value
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className={`w-full h-8 rounded-md border ${t.preview}`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.label}</span>
                    {theme === t.value && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Sparklines</p>
                <p className="text-xs text-gray-400">Mini charts in metric cards</p>
              </div>
              <button
                onClick={() => update("showSparklines", !prefs.showSparklines)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  prefs.showSparklines ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    prefs.showSparklines ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Animate Charts</p>
                <p className="text-xs text-gray-400">Transition animations on data load</p>
              </div>
              <button
                onClick={() => update("animateCharts", !prefs.animateCharts)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  prefs.animateCharts ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    prefs.animateCharts ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Animate Ingestion Progress</p>
                <p className="text-xs text-gray-400">Live progress bar animation (updates every 1s)</p>
              </div>
              <button
                onClick={() => update("animateIngestion", !prefs.animateIngestion)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  prefs.animateIngestion ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    prefs.animateIngestion ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Date & Time</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
              <select
                value={prefs.timezone}
                onChange={(e) => update("timezone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 dark:text-gray-200"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Current:{" "}
                {new Date().toLocaleString("en-US", {
                  timeZone: prefs.timezone,
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
              <div className="space-y-2">
                {dateFormats.map((df) => (
                  <button
                    key={df.value}
                    onClick={() => update("dateFormat", df.value)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      prefs.dateFormat === df.value
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300"
                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-mono text-xs">{df.value}</span>
                    <span className="text-xs text-gray-400">{df.example}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Defaults */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Dashboard Defaults</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Time Period</label>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
                {(["total", "thisWeek", "today"] as const).map((p) => {
                  const labels = { total: "All Time", thisWeek: "This Week", today: "Today" };
                  return (
                    <button
                      key={p}
                      onClick={() => update("defaultPeriod", p)}
                      className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                        prefs.defaultPeriod === p
                          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {labels[p]}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Cards will open to this period by default.</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Desktop Notifications</p>
                <p className="text-xs text-gray-400">Browser push for critical alerts</p>
              </div>
              <button
                onClick={() => update("desktopNotifications", !prefs.desktopNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  prefs.desktopNotifications ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    prefs.desktopNotifications ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Plus, Copy, Eye, EyeOff, Trash2, Check, Key } from "lucide-react";
import { CustomerSwitcherCompact } from "@/components/ui/CustomerSelector";
import { useCustomer } from "@/lib/CustomerContext";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  scopes: string[];
}

// Different default keys per customer
const CUSTOMER_KEYS: Record<string, ApiKey[]> = {
  meridian: [
    { id: "m1", name: "Meridian EHR Integration", key: "cb_live_mhc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4", createdAt: "2026-01-10", lastUsed: "2026-03-17", scopes: ["query", "index", "search"] },
    { id: "m2", name: "Patient Records Sync", key: "cb_live_mhc_z9y8x7w6v5u4t3s2r1q0p9o8n7m6", createdAt: "2026-02-05", lastUsed: "2026-03-16", scopes: ["query", "search"] },
    { id: "m3", name: "Compliance Audit Read-Only", key: "cb_read_mhc_j5k6l7m8n9o0p1q2r3s4t5u6v7w8", createdAt: "2026-03-01", lastUsed: null, scopes: ["query"] },
  ],
  apex: [
    { id: "a1", name: "Trading Platform API", key: "cb_live_afg_q1w2e3r4t5y6u7i8o9p0a1s2d3f4", createdAt: "2026-01-20", lastUsed: "2026-03-17", scopes: ["query", "index", "search", "admin"] },
    { id: "a2", name: "Risk Analysis Pipeline", key: "cb_read_afg_g5h6j7k8l9z0x1c2v3b4n5m6q7w8", createdAt: "2026-02-15", lastUsed: "2026-03-15", scopes: ["query", "search"] },
  ],
  summit: [
    { id: "s1", name: "Fleet Tracking Ingest", key: "cb_live_sml_p1o2i3u4y5t6r7e8w9q0a1s2d3f4", createdAt: "2026-02-01", lastUsed: "2026-03-17", scopes: ["query", "index"] },
    { id: "s2", name: "Dispatch Dashboard", key: "cb_read_sml_g5h6j7k8l9m0n1b2v3c4x5z6q7w8", createdAt: "2026-03-10", lastUsed: "2026-03-16", scopes: ["query"] },
    { id: "s3", name: "Warehouse Staging", key: "cb_test_sml_r4t5y6u7i8o9p0q1w2e3a4s5d6f7", createdAt: "2026-03-14", lastUsed: null, scopes: ["query", "search"] },
  ],
  brightwave: [
    { id: "b1", name: "Content CMS Connector", key: "cb_live_bwm_m1n2b3v4c5x6z7l8k9j0h1g2f3d4", createdAt: "2026-01-25", lastUsed: "2026-03-17", scopes: ["query", "index", "search"] },
  ],
};

const allScopes = ["query", "index", "search", "admin", "webhooks"];

export default function ApiKeysPage() {
  const { customer } = useCustomer();

  // Per-customer key map
  const [keysMap, setKeysMap] = useState<Record<string, ApiKey[]>>(() => ({ ...CUSTOMER_KEYS }));
  const keys = keysMap[customer.id] || [];

  const setKeys = useCallback((updater: (prev: ApiKey[]) => ApiKey[]) => {
    setKeysMap((prev) => ({
      ...prev,
      [customer.id]: updater(prev[customer.id] || []),
    }));
  }, [customer.id]);

  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<Set<string>>(new Set(["query"]));
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const maskKey = (key: string) => key.slice(0, 10) + "..." + key.slice(-4);

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const id = crypto.randomUUID();
    const prefix = newKeyScopes.has("admin") ? `cb_admin_${customer.shortName.toLowerCase()}_` : newKeyScopes.size > 2 ? `cb_live_${customer.shortName.toLowerCase()}_` : `cb_read_${customer.shortName.toLowerCase()}_`;
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const random = Array.from({ length: 28 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const newKey: ApiKey = {
      id,
      name: newKeyName.trim(),
      key: prefix + random,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: null,
      scopes: Array.from(newKeyScopes),
    };
    setKeys((prev) => [newKey, ...prev]);
    setRevealedKeys((prev) => new Set(prev).add(id));
    setNewKeyName("");
    setNewKeyScopes(new Set(["query"]));
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setDeleteConfirm(null);
  };

  const toggleScope = (scope: string) => {
    setNewKeyScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) next.delete(scope);
      else next.add(scope);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <CustomerSwitcherCompact />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">API Keys</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage tokens for <span className="font-medium text-gray-700 dark:text-gray-300">{customer.name}</span>
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus size={15} />
          Create New Key
        </button>
      </div>

      {/* Create key panel */}
      {showCreate && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create API Key</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Production Pipeline"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Scopes</label>
              <div className="flex flex-wrap gap-2">
                {allScopes.map((scope) => (
                  <button
                    key={scope}
                    onClick={() => toggleScope(scope)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      newKeyScopes.has(scope)
                        ? "bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={!newKeyName.trim() || newKeyScopes.size === 0}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Generate Key
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewKeyName(""); setNewKeyScopes(new Set(["query"])); }}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div className="space-y-3">
        {keys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Key size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{apiKey.name}</h3>
                  <p className="text-xs text-gray-400">
                    Created {apiKey.createdAt}
                    {apiKey.lastUsed ? ` \u00B7 Last used ${apiKey.lastUsed}` : " \u00B7 Never used"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleReveal(apiKey.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title={revealedKeys.has(apiKey.id) ? "Hide key" : "Reveal key"}>
                  {revealedKeys.has(apiKey.id) ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button onClick={() => copyKey(apiKey.id, apiKey.key)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Copy to clipboard">
                  {copiedId === apiKey.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                </button>
                {deleteConfirm === apiKey.id ? (
                  <div className="flex items-center gap-1 ml-1">
                    <button onClick={() => handleDelete(apiKey.id)} className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(apiKey.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors" title="Revoke key">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3.5 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-300 mb-3">
              {revealedKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-gray-400 mr-1">Scopes:</span>
              {apiKey.scopes.map((scope) => (
                <span key={scope} className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{scope}</span>
              ))}
            </div>
          </div>
        ))}

        {keys.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Key size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No API keys yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first key to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

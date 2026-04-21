export interface SearchItem {
  label: string;
  page: string;
  href: string;
  keywords: string[];
}

const searchIndex: SearchItem[] = [
  // ── Customers ──────────────────────────────────────────────
  { label: "Meridian Healthcare", page: "Dashboard", href: "/", keywords: ["meridian", "healthcare", "customer", "mhc"] },
  { label: "Apex Financial Group", page: "Dashboard", href: "/", keywords: ["apex", "financial", "customer", "afg"] },
  { label: "Summit Logistics", page: "Dashboard", href: "/", keywords: ["summit", "logistics", "customer", "sml"] },
  { label: "Brightwave Media", page: "Dashboard", href: "/", keywords: ["brightwave", "media", "customer", "bwm"] },
  { label: "Customer Selector", page: "Dashboard", href: "/", keywords: ["customer", "select", "switch", "company"] },

  // ── Data Sources ───────────────────────────────────────────
  { label: "ITGlue", page: "Dashboard", href: "/", keywords: ["itglue", "data", "source", "documentation", "it"] },
  { label: "HubSpot", page: "Dashboard", href: "/", keywords: ["hubspot", "data", "source", "crm", "contacts"] },
  { label: "TigerPaw", page: "Dashboard", href: "/", keywords: ["tigerpaw", "data", "source", "tickets", "psa"] },
  { label: "ConnectWise", page: "Dashboard", href: "/", keywords: ["connectwise", "data", "source", "tickets", "psa", "cw"] },
  { label: "Ingestion Progress", page: "Dashboard", href: "/", keywords: ["ingestion", "progress", "migration", "sync", "records"] },
  { label: "Data Migration Progress", page: "Dashboard", href: "/", keywords: ["data", "migration", "progress", "overall", "records"] },

  // ── Dashboard (expanded data source view) ──────────────────
  { label: "Questions Consumed", page: "Dashboard", href: "/", keywords: ["questions", "consumed", "count", "daily", "weekly"] },
  { label: "Responses Sent", page: "Dashboard", href: "/", keywords: ["responses", "sent", "automated", "manual"] },
  { label: "System Status", page: "Dashboard", href: "/", keywords: ["system", "status", "uptime", "health"] },
  { label: "Downtime & Incidents", page: "Dashboard", href: "/", keywords: ["downtime", "incidents", "outage"] },
  { label: "Document Retrieval", page: "Dashboard", href: "/", keywords: ["document", "retrieval", "confidence", "efficiency"] },
  { label: "Content Generation Quality", page: "Dashboard", href: "/", keywords: ["content", "generation", "quality", "score"] },
  { label: "API Hits", page: "Dashboard", href: "/", keywords: ["api", "hits", "endpoints", "requests"] },
  { label: "Response Latency", page: "Dashboard", href: "/", keywords: ["response", "latency", "time", "speed", "seconds"] },
  { label: "Content Quality Detail", page: "Dashboard", href: "/", keywords: ["content", "quality", "detail", "clarity", "accuracy"] },
  { label: "Knowledge Source Coverage", page: "Dashboard", href: "/", keywords: ["knowledge", "source", "coverage", "documentation"] },

  // ── System Status ──────────────────────────────────────────
  { label: "All Systems Operational", page: "System Status", href: "/system-status", keywords: ["all", "systems", "operational", "health"] },
  { label: "Service Health Grid", page: "System Status", href: "/system-status", keywords: ["service", "health", "grid", "latency", "uptime"] },
  { label: "Data Source Ingestion", page: "System Status", href: "/system-status", keywords: ["data", "source", "ingestion", "status", "sync"] },
  { label: "ITGlue Sync Agent", page: "System Status", href: "/system-status", keywords: ["itglue", "sync", "agent", "service"] },
  { label: "HubSpot CRM Sync", page: "System Status", href: "/system-status", keywords: ["hubspot", "crm", "sync", "service"] },
  { label: "TigerPaw Adapter", page: "System Status", href: "/system-status", keywords: ["tigerpaw", "adapter", "service"] },
  { label: "ConnectWise Sync Engine", page: "System Status", href: "/system-status", keywords: ["connectwise", "sync", "engine", "service"] },
  { label: "Query Engine", page: "System Status", href: "/system-status", keywords: ["query", "engine", "service"] },
  { label: "Vector Database", page: "System Status", href: "/system-status", keywords: ["vector", "database", "db"] },
  { label: "API Gateway", page: "System Status", href: "/system-status", keywords: ["api", "gateway"] },
  { label: "Auth Service", page: "System Status", href: "/system-status", keywords: ["auth", "authentication", "service"] },

  // ── Performance ────────────────────────────────────────────
  { label: "Response Latency Over Time", page: "Performance", href: "/performance", keywords: ["response", "latency", "over", "time", "chart", "trend"] },
  { label: "Document Retrieval Confidence", page: "Performance", href: "/performance", keywords: ["document", "retrieval", "confidence", "distribution"] },
  { label: "Content Quality Trends", page: "Performance", href: "/performance", keywords: ["content", "quality", "trends", "chart"] },
  { label: "Questions Consumed Daily", page: "Performance", href: "/performance", keywords: ["questions", "consumed", "daily", "trend", "chart"] },

  // ── API Logs ───────────────────────────────────────────────
  { label: "API Logs", page: "API Logs", href: "/api-logs", keywords: ["api", "logs", "requests", "endpoints"] },
  { label: "Filter by Endpoint", page: "API Logs", href: "/api-logs", keywords: ["filter", "endpoint", "search", "method"] },
  { label: "GET Requests", page: "API Logs", href: "/api-logs", keywords: ["get", "requests", "method"] },
  { label: "POST Requests", page: "API Logs", href: "/api-logs", keywords: ["post", "requests", "method"] },

  // ── Settings ───────────────────────────────────────────────
  { label: "Auto-Refresh Interval", page: "Settings", href: "/settings", keywords: ["auto", "refresh", "interval", "polling"] },
  { label: "Alert Thresholds", page: "Settings", href: "/settings", keywords: ["alert", "thresholds", "warning", "uptime", "latency", "error"] },
  { label: "Notifications", page: "Settings", href: "/settings", keywords: ["notifications", "email", "slack", "webhook"] },
  { label: "Data Sources", page: "Settings", href: "/settings", keywords: ["data", "sources", "knowledge", "vector", "cache"] },

  // ── Preferences ────────────────────────────────────────────
  { label: "Theme", page: "Preferences", href: "/preferences", keywords: ["theme", "dark", "light", "mode", "appearance"] },
  { label: "Timezone", page: "Preferences", href: "/preferences", keywords: ["timezone", "time", "zone", "central"] },
  { label: "Date Format", page: "Preferences", href: "/preferences", keywords: ["date", "format", "display"] },
  { label: "Default Time Period", page: "Preferences", href: "/preferences", keywords: ["default", "time", "period"] },
  { label: "Animate Ingestion Progress", page: "Preferences", href: "/preferences", keywords: ["animate", "ingestion", "progress", "bar", "live"] },
  { label: "Desktop Notifications", page: "Preferences", href: "/preferences", keywords: ["desktop", "notifications", "browser"] },

  // ── Profile ────────────────────────────────────────────────
  { label: "Profile", page: "Profile", href: "/profile", keywords: ["profile", "account", "name", "email"] },
  { label: "Personal Information", page: "Profile", href: "/profile", keywords: ["personal", "information", "name", "email", "phone", "department"] },
  { label: "Security", page: "Profile", href: "/profile", keywords: ["security", "password", "2fa", "sessions"] },
  { label: "Change Password", page: "Profile", href: "/profile", keywords: ["change", "password"] },
  { label: "Two-Factor Authentication", page: "Profile", href: "/profile", keywords: ["two", "factor", "authentication", "2fa", "security"] },

  // ── API Keys ───────────────────────────────────────────────
  { label: "API Keys", page: "API Keys", href: "/api-keys", keywords: ["api", "keys", "tokens", "access"] },
  { label: "Create New Key", page: "API Keys", href: "/api-keys", keywords: ["create", "new", "key", "generate", "token"] },
  { label: "Manage Scopes", page: "API Keys", href: "/api-keys", keywords: ["manage", "scopes", "permissions", "query", "index", "admin"] },
];

export function searchItems(query: string): SearchItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const terms = q.split(/\s+/);

  const scored = searchIndex
    .map((item) => {
      const labelLower = item.label.toLowerCase();
      const pageLower = item.page.toLowerCase();

      // Exact label match = highest score
      if (labelLower === q) return { item, score: 100 };

      // Label starts with query
      if (labelLower.startsWith(q)) return { item, score: 80 };

      // Label contains query as substring
      if (labelLower.includes(q)) return { item, score: 60 };

      // All terms match in label or keywords
      const allTermsMatch = terms.every(
        (t) =>
          labelLower.includes(t) ||
          pageLower.includes(t) ||
          item.keywords.some((kw) => kw.includes(t))
      );
      if (allTermsMatch) return { item, score: 40 };

      // Some terms match
      const matchCount = terms.filter(
        (t) =>
          labelLower.includes(t) ||
          pageLower.includes(t) ||
          item.keywords.some((kw) => kw.includes(t))
      ).length;
      if (matchCount > 0) return { item, score: matchCount * 10 };

      return { item, score: 0 };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 8).map((s) => s.item);
}

export default searchIndex;

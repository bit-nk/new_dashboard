// ============================================================
// Extended mock data for the Performance page
// Generates 30 days of date-stamped data for each chart
// Seeded per-customer so each customer has distinct data
// Replace with real DB queries when connected
// ============================================================

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function dateLabel(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Seeded PRNG for deterministic per-customer data
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function customerSeed(customerId: string): number {
  let hash = 0;
  for (let i = 0; i < customerId.length; i++) {
    hash = ((hash << 5) - hash + customerId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) + 1;
}

function seededRand(rng: () => number, min: number, max: number): number {
  return Math.round((rng() * (max - min) + min) * 100) / 100;
}

// ── Response Latency: 30 days × 12 points each ──────────────
export interface LatencyPoint {
  datetime: string; // ISO string
  dateLabel: string;
  timeLabel: string;
  value: number;
}

export function generateLatencyData(days = 30, customerId = "default"): LatencyPoint[] {
  const rng = seededRandom(customerSeed(customerId) + 1);
  // Per-customer base latency range
  const baseMin = 0.3 + rng() * 0.5;  // 0.3-0.8
  const baseMax = baseMin + 0.8 + rng() * 1.2; // adds 0.8-2.0

  const points: LatencyPoint[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const base = new Date();
    base.setDate(base.getDate() - d);
    base.setHours(0, 0, 0, 0);
    for (let h = 0; h < 24; h += 4) {
      const dt = new Date(base);
      dt.setHours(h);
      points.push({
        datetime: dt.toISOString(),
        dateLabel: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        timeLabel: dt.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        value: seededRand(rng, baseMin, baseMax),
      });
    }
  }
  return points;
}

// ── Document Retrieval: one confidence distribution per day ──
export interface RetrievalDay {
  date: string;
  dateLabel: string;
  low: number;   // confidence < 40
  mid: number;   // 40-70
  high: number;  // > 70
  efficiency: number; // percentage
}

export function generateRetrievalData(days = 30, customerId = "default"): RetrievalDay[] {
  const rng = seededRandom(customerSeed(customerId) + 2);
  // Per-customer confidence profile
  const highBase = 45 + rng() * 25; // 45-70
  const midBase = 15 + rng() * 15;  // 15-30

  const data: RetrievalDay[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const high = seededRand(rng, highBase - 5, highBase + 10);
    const mid = seededRand(rng, midBase - 5, midBase + 5);
    const low = 100 - high - mid;
    data.push({
      date: dateStr(d),
      dateLabel: dateLabel(d),
      low: Math.max(0, Math.round(low)),
      mid: Math.round(mid),
      high: Math.round(high),
      efficiency: seededRand(rng, 80, 98),
    });
  }
  return data;
}

// ── Content Quality: daily quality/clarification/noAnswer ────
export interface QualityDay {
  date: string;
  dateLabel: string;
  quality: number;
  clarification: number;
  noAnswer: number;
}

export function generateQualityData(days = 30, customerId = "default"): QualityDay[] {
  const rng = seededRandom(customerSeed(customerId) + 3);
  // Per-customer quality profile
  const qualityBase = 70 + rng() * 22; // 70-92
  const clarBase = 5 + rng() * 12;     // 5-17

  const data: QualityDay[] = [];
  for (let d = days - 1; d >= 0; d--) {
    data.push({
      date: dateStr(d),
      dateLabel: dateLabel(d),
      quality: Math.round(seededRand(rng, qualityBase - 5, qualityBase + 5)),
      clarification: Math.round(seededRand(rng, clarBase - 3, clarBase + 5)),
      noAnswer: Math.round(seededRand(rng, 1, 8)),
    });
  }
  return data;
}

// ── Questions Consumed: daily counts ─────────────────────────
export interface QuestionsDay {
  date: string;
  dateLabel: string;
  count: number;
}

export function generateQuestionsData(days = 30, customerId = "default"): QuestionsDay[] {
  const rng = seededRandom(customerSeed(customerId) + 4);
  // Per-customer volume profile
  const weekdayMin = 400 + Math.round(rng() * 800);  // 400-1200
  const weekdayMax = weekdayMin + 300 + Math.round(rng() * 700); // adds 300-1000
  const weekendMin = Math.round(weekdayMin * 0.3);
  const weekendMax = Math.round(weekdayMax * 0.5);

  const data: QuestionsDay[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - d);
    const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
    data.push({
      date: dateStr(d),
      dateLabel: dateLabel(d),
      count: Math.round(isWeekend
        ? seededRand(rng, weekendMin, weekendMax)
        : seededRand(rng, weekdayMin, weekdayMax)),
    });
  }
  return data;
}

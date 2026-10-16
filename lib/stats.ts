import { isIntentId } from "@/content/interests";

export type IntentStat = { intent: string; count: number };
export type TopicStat = { topic: string; count: number };

export type VisitorStats = {
  total: number;
  intents: IntentStat[];
  topics: TopicStat[];
};

export function emptyStats(): VisitorStats {
  return { total: 0, intents: [], topics: [] };
}

export function normalizeStats(data: unknown): VisitorStats {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") return emptyStats();

  const record = row as { total?: unknown; intents?: unknown; topics?: unknown };
  const total = typeof record.total === "number" ? record.total : 0;

  const intents = Array.isArray(record.intents)
    ? record.intents.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const entry = item as { intent?: unknown; count?: unknown };
        if (!isIntentId(entry.intent) || typeof entry.count !== "number") return [];
        return [{ intent: entry.intent, count: entry.count }];
      })
    : [];

  const topics = Array.isArray(record.topics)
    ? record.topics.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const entry = item as { topic?: unknown; count?: unknown };
        if (typeof entry.topic !== "string" || typeof entry.count !== "number") return [];
        return [{ topic: entry.topic, count: entry.count }];
      })
    : [];

  return { total, intents, topics };
}

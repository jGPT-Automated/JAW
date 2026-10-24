import type { StatusBarDatum } from "@/components/charts/status-bar";
import type { QueueItem } from "./types";

const HOUR = 3_600_000;
const DAY = 86_400_000;

/** Per-hour delivery health for the 24 hours up to `now`, oldest first. */
export function deliveryHistory(
  queue: Pick<QueueItem, "status" | "attempts" | "updated_at">[],
  now = new Date(),
): StatusBarDatum[] {
  const top = new Date(now);
  top.setMinutes(0, 0, 0);
  return Array.from({ length: 24 }, (_, i) => {
    const start = top.getTime() - (23 - i) * HOUR;
    const end = start + HOUR;
    const items = queue.filter((q) => {
      const t = new Date(q.updated_at).getTime();
      return t >= start && t < end;
    });
    const failed = items.filter((q) => q.status === "failed").length;
    const delayed = items.filter((q) => q.status === "rate_limited" || (q.status === "pending" && q.attempts > 0)).length;
    const sent = items.filter((q) => q.status === "sent").length;
    const status = failed ? "outage" : delayed ? "degraded" : sent ? "operational" : "unknown";
    return {
      id: String(start),
      label: new Date(start).toLocaleTimeString([], { hour: "numeric" }),
      status,
      description: items.length ? `${sent} delivered · ${delayed} delayed · ${failed} failed` : undefined,
    };
  });
}

/**
 * `values[week][day]` intensities (Monday first, UTC) for the heat calendar,
 * ending with the week that contains `now`, plus the busiest day's count.
 */
export function activityGrid(timestamps: string[], weeks: number, now = new Date()) {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const monday = today.getTime() - ((today.getUTCDay() + 6) % 7) * DAY;
  const start = monday - (weeks - 1) * 7 * DAY;
  const counts = Array.from({ length: weeks }, () => Array<number>(7).fill(0));
  for (const ts of timestamps) {
    const idx = Math.floor((new Date(ts).getTime() - start) / DAY);
    if (idx < 0 || idx >= weeks * 7) continue;
    counts[Math.floor(idx / 7)][idx % 7]++;
  }
  const max = Math.max(1, ...counts.flat());
  return { values: counts.map((w) => w.map((c) => c / max)), max };
}

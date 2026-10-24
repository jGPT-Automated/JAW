import { describe, expect, it } from "vitest";
import { activityGrid, deliveryHistory } from "@/hub/lib/metrics";

// Friday 2026-10-23, 15:30 UTC.
const NOW = new Date("2026-10-23T15:30:00Z");

describe("activityGrid", () => {
  it("places events by UTC day with Monday first and the current week last", () => {
    const { values, max } = activityGrid(
      ["2026-10-23T01:00:00Z", "2026-10-23T22:00:00Z", "2026-10-19T09:00:00Z", "2026-10-12T09:00:00Z"],
      2,
      NOW,
    );
    expect(max).toBe(2);
    expect(values[1][4]).toBe(1); // Friday of this week: 2 events
    expect(values[1][0]).toBe(0.5); // Monday of this week
    expect(values[0][0]).toBe(0.5); // Monday of last week
  });

  it("ignores events outside the window", () => {
    const { values, max } = activityGrid(["2025-01-01T00:00:00Z", "2027-01-01T00:00:00Z"], 4, NOW);
    expect(max).toBe(1);
    expect(values.flat().every((v) => v === 0)).toBe(true);
  });
});

describe("deliveryHistory", () => {
  const at = (iso: string, status: string, attempts = 1) => ({ updated_at: iso, status, attempts });

  it("returns 24 hourly buckets ending with the current hour", () => {
    const rows = deliveryHistory([], NOW);
    expect(rows).toHaveLength(24);
    expect(Number(rows[23].id)).toBe(new Date("2026-10-23T15:00:00Z").getTime());
    expect(rows.every((r) => r.status === "unknown")).toBe(true);
  });

  it("ranks failed over delayed over delivered", () => {
    const rows = deliveryHistory(
      [
        at("2026-10-23T15:05:00Z", "sent"),
        at("2026-10-23T15:10:00Z", "failed"),
        at("2026-10-23T14:10:00Z", "sent"),
        at("2026-10-23T14:20:00Z", "rate_limited"),
        at("2026-10-23T13:10:00Z", "sent"),
        at("2026-10-23T12:10:00Z", "pending", 0),
      ],
      NOW,
    );
    expect(rows[23].status).toBe("outage");
    expect(rows[22].status).toBe("degraded");
    expect(rows[21].status).toBe("operational");
    expect(rows[20].status).toBe("unknown"); // a fresh pending item is not a delay
    expect(rows[23].description).toBe("1 delivered, 0 delayed, 1 failed");
  });
});

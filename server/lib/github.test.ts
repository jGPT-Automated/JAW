import { describe, expect, it } from "vitest";
import { parseCalendar, parsePatch, summarizeEvent } from "./github";

describe("parseCalendar", () => {
  it("reads each day's count from its tooltip, oldest first", () => {
    const html = `
      <h2>1,234 contributions in the last year</h2>
      <td data-date="2026-10-25" id="d-1" data-level="2"></td>
      <td data-date="2026-10-24" id="d-0" data-level="0"></td>
      <td data-date="2026-10-26" id="d-2" data-level="1"></td>
      <tool-tip for="d-0">No contributions on October 24th.</tool-tip>
      <tool-tip for="d-1">12 contributions on October 25th.</tool-tip>
      <tool-tip for="d-2">1 contribution on October 26th.</tool-tip>`;
    expect(parseCalendar(html)).toEqual({ counts: [0, 12, 1], end: "2026-10-26", total: 1234 });
  });
});

describe("parsePatch", () => {
  it("splits hunks and types each line", () => {
    const hunks = parsePatch("@@ -1,2 +10,3 @@ fn\n keep\n-old\n+new\n+more\n\\ No newline at end of file");
    expect(hunks).toEqual([
      {
        start: 10,
        lines: [
          { type: "context", text: "keep" },
          { type: "remove", text: "old" },
          { type: "add", text: "new" },
          { type: "add", text: "more" },
        ],
      },
    ]);
  });
});

describe("summarizeEvent", () => {
  it("names merged pull requests", () => {
    const e = summarizeEvent({
      id: "1",
      type: "PullRequestEvent",
      repo: { name: "o/r" },
      created_at: "2026-10-26T00:00:00Z",
      payload: { action: "closed", number: 7, pull_request: { merged: true, title: "Ship it", html_url: "https://github.com/o/r/pull/7" } },
    });
    expect(e.text).toBe("Merged PR #7: Ship it");
    expect(e.url).toBe("https://github.com/o/r/pull/7");
  });
});

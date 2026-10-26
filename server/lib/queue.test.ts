import { describe, expect, it } from "vitest";
import { authHeaders, isAck, replyText } from "./queue";

describe("authHeaders", () => {
  it("sends each provider's secret the way that platform expects", () => {
    expect(authHeaders("hyperagent", "s3")).toEqual({ "X-Hyperagent-Webhook-Secret": "s3" });
    expect(authHeaders("letta", "key")).toEqual({ Authorization: `Basic ${btoa("webhook:key")}` });
    expect(authHeaders("webhook", "tok")).toEqual({ Authorization: "Bearer tok" });
  });

  it("sends nothing without a secret (public webhooks)", () => {
    expect(authHeaders("letta", null)).toEqual({});
    expect(authHeaders("hyperagent", "")).toEqual({});
  });
});

describe("isAck", () => {
  it("treats 202, empty bodies and bare status objects as acknowledgements", () => {
    expect(isAck(202, '{"reply":"hi"}')).toBe(true);
    expect(isAck(200, "")).toBe(true);
    expect(isAck(200, '{"ok":true}')).toBe(true);
    expect(isAck(200, '{"status":"queued","run_id":"r1"}')).toBe(true);
  });

  it("treats real content as a reply", () => {
    expect(isAck(200, '{"reply":"Done"}')).toBe(false);
    expect(isAck(200, "plain text answer")).toBe(false);
  });
});

describe("replyText", () => {
  it("prefers known reply fields and falls back to the raw body", () => {
    expect(replyText('{"output":"result"}')).toBe("result");
    expect(replyText('{"other":1}')).toBe('{"other":1}');
    expect(replyText("text")).toBe("text");
  });
});

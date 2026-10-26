const ORIGIN = typeof window === "undefined" ? "" : window.location.origin;

/** Where agents POST replies and events back into the hub (server/routes/agent.ts). */
export const INBOUND_URL = `${ORIGIN}/api/agent/inbound`;

/** Read-only index of public docs and skills for any agent with fetch. */
export const LLMS_URL = `${ORIGIN}/api/public/llms.txt`;

export function inboundCurl(token = "<inbound token>") {
  return [
    `curl -X POST ${INBOUND_URL} \\`,
    `  -H "Authorization: Bearer ${token}" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"content": "Done: shipped the release notes", "event_type": "task_complete"}'`,
  ].join("\n");
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

/** Where agents POST replies and events back into the hub (see supabase/functions/agent-inbound). */
export const INBOUND_URL = `${SUPABASE_URL}/functions/v1/agent-inbound`;

export function inboundCurl(token = "<inbound token>") {
  return [
    `curl -X POST ${INBOUND_URL} \\`,
    `  -H "Authorization: Bearer ${token}" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"content": "Done: shipped the release notes", "event_type": "task_complete"}'`,
  ].join("\n");
}

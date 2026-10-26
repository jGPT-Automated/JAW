/** Absolute URL agents use to report back, derived from the request's origin. */
export function inboundUrl(requestUrl: string) {
  return new URL("/api/agent/inbound", process.env.JAW_PUBLIC_URL || requestUrl).toString();
}

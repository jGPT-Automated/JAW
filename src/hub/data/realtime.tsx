import { createContext, type ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/hub/lib/api";

type LiveState = "connecting" | "live" | "offline";

const LiveContext = createContext<LiveState>("connecting");

export const useLiveState = () => useContext(LiveContext);

/**
 * Lists poll every few seconds (see queries.ts). This tracks whether the API is
 * reachable so the sidebar can say so.
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => api<{ ok: boolean }>("/health"),
    refetchInterval: 15_000,
    retry: 1,
  });
  const state: LiveState = health.isError ? "offline" : health.data?.ok ? "live" : "connecting";
  return <LiveContext.Provider value={state}>{children}</LiveContext.Provider>;
}

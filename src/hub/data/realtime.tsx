import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type LiveState = "connecting" | "live" | "offline";

const LiveContext = createContext<LiveState>("connecting");

export const useLiveState = () => useContext(LiveContext);

// One realtime channel for the whole hub: any row change invalidates the
// matching queries, so every page stays live without its own subscription.
const TABLES: Record<string, string[][]> = {
  agents: [["agents"]],
  activity_logs: [["activity"]],
  agent_messages: [["messages"]],
  message_queue: [["queue"]],
};

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [state, setState] = useState<LiveState>("connecting");

  useEffect(() => {
    let channel = supabase.channel("jaw-hub");
    for (const [table, queryKeys] of Object.entries(TABLES)) {
      channel = channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
        for (const queryKey of queryKeys) qc.invalidateQueries({ queryKey });
      });
    }
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") setState("live");
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setState("offline");
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return <LiveContext.Provider value={state}>{children}</LiveContext.Provider>;
}

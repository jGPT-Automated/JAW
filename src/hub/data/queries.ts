import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ActivityLog, Agent, AgentMessage, Provider, QueueItem, RoadmapTask } from "@/hub/lib/types";

export const keys = {
  agents: ["agents"] as const,
  activity: (limit: number) => ["activity", limit] as const,
  activityDays: ["activity", "days"] as const,
  messages: (agentId?: string) => ["messages", agentId ?? "all"] as const,
  queue: ["queue"] as const,
  roadmap: ["roadmap"] as const,
};

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

export function useAgents() {
  return useQuery({
    queryKey: keys.agents,
    queryFn: async () => unwrap(await supabase.from("agents").select("*").order("name")) as Agent[],
  });
}

export function useActivity(limit = 100) {
  return useQuery({
    queryKey: keys.activity(limit),
    queryFn: async () =>
      unwrap(
        await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(limit),
      ) as ActivityLog[],
  });
}

/** Timestamps of the last ~12 weeks of activity, for the heat calendar. */
export function useActivityDays(weeks = 12) {
  return useQuery({
    queryKey: keys.activityDays,
    queryFn: async () => {
      const since = new Date(Date.now() - weeks * 7 * 86_400_000).toISOString();
      const rows = unwrap(
        await supabase
          .from("activity_logs")
          .select("created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(5000),
      ) as Pick<ActivityLog, "created_at">[];
      return rows.map((r) => r.created_at);
    },
  });
}

export function useMessages(agentId?: string) {
  return useQuery({
    queryKey: keys.messages(agentId),
    queryFn: async () => {
      let q = supabase.from("agent_messages").select("*").order("created_at", { ascending: false }).limit(300);
      if (agentId) q = q.or(`from_agent_id.eq.${agentId},to_agent_id.eq.${agentId}`);
      const rows = unwrap(await q) as AgentMessage[];
      return rows.reverse();
    },
  });
}

export function useQueue() {
  return useQuery({
    queryKey: keys.queue,
    queryFn: async () =>
      unwrap(
        await supabase.from("message_queue").select("*").order("created_at", { ascending: false }).limit(200),
      ) as QueueItem[],
  });
}

export function useRoadmap() {
  return useQuery({
    queryKey: keys.roadmap,
    queryFn: async () =>
      unwrap(await supabase.from("roadmap_tasks").select("*").order("created_at")) as RoadmapTask[],
  });
}

async function invoke<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(fn, { body });
  if (error) throw error;
  if (data && typeof data === "object" && "error" in data && data.error) throw new Error(String(data.error));
  return data as T;
}

export interface RegisterAgentInput {
  id?: string;
  name: string;
  provider?: Provider;
  type?: string;
  description?: string;
  model?: string;
  system_instructions?: string;
  webhook_url?: string;
  webhook_secret?: string;
  telegram_bot_token?: string;
  daily_message_limit?: number;
  min_seconds_between_messages?: number;
  rotate_inbound_token?: boolean;
}

export function useRegisterAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterAgentInput) =>
      invoke<{ id: string; inbound_token: string | null }>("register-agent", { ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.agents }),
  });
}

export function useUpdateAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Agent> }) =>
      unwrap(await supabase.from("agents").update(patch).eq("id", id).select("id")),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.agents }),
  });
}

export function useDeleteAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap(await supabase.from("agents").delete().eq("id", id).select("id")),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.agents }),
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { agent_id: string; payload: string; conversation_id?: string }) =>
      invoke<{ queued: boolean; status: string; scheduled_for?: string }>("enqueue-message", {
        ...input,
        source: "ui",
        reply_channel: "ui",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.queue }),
  });
}

export function useProcessQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => invoke<{ processed: number }>("queue-processor", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.queue }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<RoadmapTask> }) =>
      unwrap(await supabase.from("roadmap_tasks").update(patch).eq("id", id).select("id")),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.roadmap }),
  });
}

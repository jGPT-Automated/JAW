import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/hub/lib/api";
import type {
  ActivityLog,
  Agent,
  AgentMessage,
  Conversation,
  ConversationListItem,
  Doc,
  Memory,
  Provider,
  QueueItem,
  RoadmapTask,
  Skill,
} from "@/hub/lib/types";

export const keys = {
  agents: ["agents"] as const,
  activity: (limit: number) => ["activity", limit] as const,
  activityDays: ["activity", "days"] as const,
  messages: (agentId?: string) => ["messages", agentId ?? "all"] as const,
  queue: ["queue"] as const,
  roadmap: ["roadmap"] as const,
  memories: (q: string) => ["memories", q] as const,
  docs: ["docs"] as const,
  skills: ["skills"] as const,
  conversations: ["conversations"] as const,
  conversation: (id: string) => ["conversations", id] as const,
};

// Live-ish: lists refresh every few seconds while the tab is visible.
const LIVE = { refetchInterval: 5_000, refetchIntervalInBackground: false } as const;

export function useConversations() {
  return useQuery({ queryKey: keys.conversations, queryFn: () => api<ConversationListItem[]>("/conversations") });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: keys.conversation(id ?? ""),
    queryFn: () => api<Conversation>(`/conversations/${id}`),
    enabled: !!id,
  });
}

export function useAgents() {
  return useQuery({ queryKey: keys.agents, queryFn: () => api<Agent[]>("/agents"), ...LIVE });
}

export function useActivity(limit = 100) {
  return useQuery({ queryKey: keys.activity(limit), queryFn: () => api<ActivityLog[]>(`/activity?limit=${limit}`), ...LIVE });
}

/** Timestamps of the last weeks of activity, for the heat calendar. */
export function useActivityDays(weeks = 12) {
  return useQuery({ queryKey: keys.activityDays, queryFn: () => api<string[]>(`/activity/days?weeks=${weeks}`) });
}

export function useMessages(agentId?: string) {
  return useQuery({
    queryKey: keys.messages(agentId),
    queryFn: () => api<AgentMessage[]>(agentId ? `/messages?agent_id=${agentId}` : "/messages"),
    ...LIVE,
  });
}

export function useQueue() {
  return useQuery({ queryKey: keys.queue, queryFn: () => api<QueueItem[]>("/queue"), ...LIVE });
}

export function useRoadmap() {
  return useQuery({ queryKey: keys.roadmap, queryFn: () => api<RoadmapTask[]>("/roadmap") });
}

export function useMemories(search = "") {
  return useQuery({
    queryKey: keys.memories(search),
    queryFn: () => api<Memory[]>(`/memories?limit=100${search ? `&q=${encodeURIComponent(search)}` : ""}`),
  });
}

export function useDocs() {
  return useQuery({ queryKey: keys.docs, queryFn: () => api<Doc[]>("/docs") });
}

export function useSkills() {
  return useQuery({ queryKey: keys.skills, queryFn: () => api<Skill[]>("/public/skills") });
}

export interface RegisterAgentInput {
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
}

export function useRegisterAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterAgentInput) =>
      api<{ id: string; inbound_token: string }>("/agents", { method: "POST", json: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.agents }),
  });
}

export function useRotateToken() {
  return useMutation({
    mutationFn: (id: string) => api<{ inbound_token: string }>(`/agents/${id}/token`, { method: "POST" }),
  });
}

export function useUpdateAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Agent> }) =>
      api(`/agents/${id}`, { method: "PATCH", json: patch }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.agents }),
  });
}

export function useDeleteAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/agents/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.agents }),
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { agent_id: string; payload: string; conversation_id?: string }) =>
      api<{ id: string; status: string; scheduled_for?: string }>("/messages", { method: "POST", json: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.queue });
      qc.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useProcessQueue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ processed: number }>("/queue/process", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.queue }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<RoadmapTask> }) =>
      api(`/roadmap/${id}`, { method: "PATCH", json: patch }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.roadmap }),
  });
}

export function useSaveMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { content: string; kind?: string; pinned?: boolean }) =>
      api<Memory>("/memories", { method: "POST", json: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
  });
}

export function useDeleteMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/memories/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
  });
}

export function useSaveDoc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, ...doc }: { slug: string; title: string; body: string; source_url?: string; public: boolean }) =>
      api<Doc>(`/docs/${slug}`, { method: "PUT", json: doc }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.docs }),
  });
}

export function useVoiceToken() {
  return useMutation({
    mutationFn: () =>
      api<{ server_url: string; token: string; room: string; conversation_id: string }>("/voice/token", { method: "POST" }),
  });
}

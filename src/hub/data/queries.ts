import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/hub/lib/api";
import type {
  ActivityLog,
  Cached,
  CatalogComponent,
  ComponentLibrary,
  FileChange,
  GitHubSnapshot,
  Agent,
  AgentMessage,
  Conversation,
  ConversationListItem,
  Doc,
  Memory,
  Provider,
  QueueItem,
  Resource,
  RoadmapTask,
  Skill,
  ToolCall,
  Project,
  ProjectActivity,
  Task,
  TaskStatus,
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

export function useGitHubAccount(login: string) {
  return useQuery({
    queryKey: ["github", login.toLowerCase()],
    queryFn: () => api<Cached<GitHubSnapshot>>(`/github/accounts/${login}`),
    staleTime: 5 * 60_000,
  });
}

export function useRefreshGitHubAccount(login: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<Cached<GitHubSnapshot>>(`/github/accounts/${login}?refresh=1`),
    onSuccess: (data) => qc.setQueryData(["github", login.toLowerCase()], data),
  });
}

export function usePullFiles(repo: string | null, number: number | null) {
  return useQuery({
    queryKey: ["github", "pull", repo, number],
    queryFn: () => api<Cached<FileChange[]> & { decisions: Record<string, string> }>(`/github/pulls/${repo}/${number}`),
    enabled: !!repo && !!number,
  });
}

export function useReviewDecision() {
  return useMutation({
    mutationFn: (b: { repo: string; pr_number: number; path: string; decision: string }) =>
      api<{ ok: true }>("/github/reviews", { method: "PUT", json: b }),
  });
}

export function useComponentLibraries() {
  return useQuery({ queryKey: ["component-libraries"], queryFn: () => api<ComponentLibrary[]>("/component-libraries") });
}

export function useCatalog() {
  return useQuery({ queryKey: ["components"], queryFn: () => api<CatalogComponent[]>("/components"), staleTime: 5 * 60_000 });
}

export function useAddLibrary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: { name: string; registry_url: string; site_url?: string; namespace?: string }) =>
      api<ComponentLibrary>("/component-libraries", { method: "POST", json: b }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["component-libraries"] });
      void qc.invalidateQueries({ queryKey: ["components"] });
    },
  });
}

export function useSyncLibrary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => api<ComponentLibrary>(`/component-libraries/${slug}/sync`, { method: "POST" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["component-libraries"] });
      void qc.invalidateQueries({ queryKey: ["components"] });
    },
  });
}

export function useResources() {
  return useQuery({ queryKey: ["resources"], queryFn: () => api<Resource[]>("/resources?kind=design") });
}

export function useAddResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: { url: string; collection?: string }) => api<Resource>("/resources", { method: "POST", json: b }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

export function useUploadResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: { file: File; collection?: string }) => {
      const form = new FormData();
      form.set("file", b.file);
      if (b.collection) form.set("collection", b.collection);
      return api<Resource>("/resources/upload", { method: "POST", body: form });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<{ ok: true }>(`/resources/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

export function useToolCalls(limit = 30) {
  return useQuery({ queryKey: ["tool-calls", limit], queryFn: () => api<ToolCall[]>(`/tool-calls?limit=${limit}`) });
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
      api<{ id: string; status: string; scheduled_for?: string; last_error?: string | null }>("/messages", { method: "POST", json: input }),
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

// Projects and tasks -------------------------------------------------------------------
// Voice and phone calls change these too, so they refresh while the page is open.
export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: () => api<Project[]>("/projects"), ...LIVE });
}

export function useProject(id: string | undefined) {
  return useQuery({ queryKey: ["projects", id], queryFn: () => api<Project>(`/projects/${id}`), enabled: !!id, ...LIVE });
}

export function useProjectActivity(id: string | undefined, hasRepo: boolean) {
  return useQuery({
    queryKey: ["projects", id, "activity"],
    queryFn: () => api<ProjectActivity>(`/projects/${id}/activity`),
    enabled: !!id && hasRepo,
    staleTime: 5 * 60_000,
  });
}

/** project: a project id, "inbox" for tasks without a project, or undefined for everything. */
export function useTasks(project?: string) {
  return useQuery({
    queryKey: ["tasks", project ?? "all"],
    queryFn: () => api<Task[]>(project ? `/tasks?project=${project}` : "/tasks"),
    ...LIVE,
  });
}

function useWorkMutation<T, R = unknown>(fn: (input: T) => Promise<R>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export const useAddProject = () =>
  useWorkMutation((input: { name: string; summary?: string; repo?: string }) =>
    api<{ id: string; name: string }>("/projects", { method: "POST", json: input }),
  );
export const useUpdateProject = () =>
  useWorkMutation(({ id, ...patch }: { id: string; name?: string; summary?: string; repo?: string; status?: Project["status"] }) =>
    api(`/projects/${id}`, { method: "PATCH", json: patch }),
  );
export const useAddTask = () =>
  useWorkMutation((input: { title: string; project_id?: string | null; notes?: string }) => api("/tasks", { method: "POST", json: input }));
export const useUpdateTask = () =>
  useWorkMutation(({ id, ...patch }: { id: string; title?: string; notes?: string; status?: TaskStatus; project_id?: string | null }) =>
    api(`/tasks/${id}`, { method: "PATCH", json: patch }),
  );
export const useDeleteTask = () => useWorkMutation((id: string) => api(`/tasks/${id}`, { method: "DELETE" }));

export function useInstructions() {
  return useQuery({ queryKey: ["instructions"], queryFn: () => api<{ text: string; updated_at: string | null; base: string }>("/instructions") });
}

export function useSaveInstructions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => api<{ text: string }>("/instructions", { method: "PUT", json: { text } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["instructions"] }),
  });
}

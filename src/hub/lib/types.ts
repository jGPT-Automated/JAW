import type { Tables } from "@/integrations/supabase/types";

export type Agent = Tables<"agents">;
export type ActivityLog = Tables<"activity_logs">;
export type AgentMessage = Tables<"agent_messages">;
export type QueueItem = Tables<"message_queue">;
export type RoadmapTask = Tables<"roadmap_tasks">;

export type Provider = "hyperagent" | "letta" | "webhook";

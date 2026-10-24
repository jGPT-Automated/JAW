// Row shapes returned by the hub API (see db/migrations).

export type Provider = "hyperagent" | "letta" | "webhook" | "internal";

export interface Agent {
  id: string;
  name: string;
  type: string;
  provider: Provider;
  status: string;
  model: string | null;
  description: string | null;
  current_task: string | null;
  system_instructions: string;
  webhook_url: string | null;
  webhook_enabled: boolean;
  telegram_enabled: boolean;
  telegram_chat_id: string | null;
  daily_message_limit: number;
  min_seconds_between_messages: number;
  tasks_completed: number;
  success_rate: number | string;
  uptime_hours: number | string;
  avatar_url: string | null;
  is_user_added: boolean;
  last_heartbeat: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  agent_id: string | null;
  agent_name: string;
  event_type: string;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AgentMessage {
  id: string;
  conversation_id: string;
  from_kind: string;
  from_agent_id: string | null;
  from_label: string | null;
  to_kind: string;
  to_agent_id: string | null;
  to_label: string | null;
  channel: string;
  content: string;
  metadata: Record<string, unknown>;
  parent_message_id: string | null;
  created_at: string;
}

export interface QueueItem {
  id: string;
  agent_id: string;
  payload: string;
  source: string;
  reply_channel: string;
  conversation_id: string | null;
  from_agent_id: string | null;
  status: string;
  attempts: number;
  last_error: string | null;
  scheduled_for: string;
  created_at: string;
  updated_at: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_agent: string | null;
  progress: number | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  kind: "fact" | "preference" | "decision" | "note" | "todo";
  content: string;
  source: string;
  agent_id: string | null;
  conversation_id: string | null;
  tags: string[];
  pinned: boolean;
  created_at: string;
}

export interface Doc {
  id: string;
  slug: string;
  title: string;
  body: string;
  source_url: string | null;
  public: boolean;
  tags: string[];
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  source: string;
  description: string;
  install: string;
  url: string;
  tags: string[];
  installed_in_repo: boolean;
}

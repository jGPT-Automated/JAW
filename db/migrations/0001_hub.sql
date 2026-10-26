-- JAW Hub on Neon: shared state for every agent and the owner.
-- One statement per block, separated by blank-line + semicolon endings, so the
-- HTTP runner (scripts/migrate.mjs) can apply it statement by statement.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Agents the hub can reach -------------------------------------------------
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'executor',
  provider text NOT NULL DEFAULT 'hyperagent' CHECK (provider IN ('hyperagent', 'letta', 'webhook', 'internal')),
  status text NOT NULL DEFAULT 'idle',
  model text,
  description text,
  current_task text,
  system_instructions text NOT NULL DEFAULT '',
  webhook_url text,
  webhook_enabled boolean NOT NULL DEFAULT false,
  telegram_enabled boolean NOT NULL DEFAULT false,
  telegram_chat_id text,
  daily_message_limit integer NOT NULL DEFAULT 3,
  min_seconds_between_messages integer NOT NULL DEFAULT 60,
  tasks_completed integer NOT NULL DEFAULT 0,
  success_rate numeric NOT NULL DEFAULT 100,
  uptime_hours numeric NOT NULL DEFAULT 0,
  avatar_url text,
  is_user_added boolean NOT NULL DEFAULT true,
  last_heartbeat timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Secrets never leave the server.
CREATE TABLE IF NOT EXISTS agent_credentials (
  agent_id uuid PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  webhook_secret text,
  telegram_bot_token text,
  inbound_token text UNIQUE,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Every message between the owner, channels and agents.
CREATE TABLE IF NOT EXISTS agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  from_kind text NOT NULL,
  from_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  from_label text,
  to_kind text NOT NULL,
  to_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  to_label text,
  channel text NOT NULL,
  content text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  parent_message_id uuid REFERENCES agent_messages(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_messages_conversation_idx ON agent_messages (conversation_id, created_at);

CREATE INDEX IF NOT EXISTS agent_messages_created_idx ON agent_messages (created_at DESC);

-- Rate-limited outbound delivery queue.
CREATE TABLE IF NOT EXISTS message_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  payload text NOT NULL,
  source text NOT NULL DEFAULT 'ui',
  reply_channel text NOT NULL DEFAULT 'ui',
  reply_chat_id text,
  conversation_id uuid,
  parent_message_id uuid,
  from_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  scheduled_for timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_queue_ready_idx ON message_queue (status, scheduled_for) WHERE status IN ('pending', 'rate_limited');

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  agent_name text NOT NULL,
  event_type text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_logs_created_idx ON activity_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planned',
  priority text NOT NULL DEFAULT 'medium',
  assigned_agent text,
  progress integer NOT NULL DEFAULT 0,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Memory: what the owner and agents want remembered across conversations.
CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'note' CHECK (kind IN ('fact', 'preference', 'decision', 'note', 'todo')),
  content text NOT NULL,
  source text NOT NULL DEFAULT 'ui',
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  conversation_id uuid,
  tags text[] NOT NULL DEFAULT '{}',
  pinned boolean NOT NULL DEFAULT false,
  search tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS memories_search_idx ON memories USING gin (search);

CREATE INDEX IF NOT EXISTS memories_trgm_idx ON memories USING gin (content gin_trgm_ops);

-- Orchestration: a task is split into small units; each unit is verified;
-- a handoff note is written so the next wake-up can resume.
CREATE TABLE IF NOT EXISTS work_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  goal text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'waiting', 'done', 'failed', 'cancelled')),
  source text NOT NULL DEFAULT 'ui',
  owner_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  next_wake_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS work_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES work_tasks(id) ON DELETE CASCADE,
  seq integer NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'verifying', 'done', 'failed', 'skipped')),
  output text,
  verification jsonb,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (task_id, seq)
);

CREATE TABLE IF NOT EXISTS handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES work_tasks(id) ON DELETE CASCADE,
  author text NOT NULL,
  summary text NOT NULL,
  next_steps text,
  state jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS handoffs_task_idx ON handoffs (task_id, created_at DESC);

-- Shared library: docs/context and skills that any agent can fetch.
CREATE TABLE IF NOT EXISTS docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  source_url text,
  public boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  name text NOT NULL,
  source text NOT NULL,
  description text NOT NULL,
  install text NOT NULL,
  url text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  installed_in_repo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Voice sessions, so a conversation can be reviewed and summarized later.
CREATE TABLE IF NOT EXISTS voice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room text NOT NULL UNIQUE,
  conversation_id uuid NOT NULL DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  summary text
);

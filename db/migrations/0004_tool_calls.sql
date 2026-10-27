-- Every tool the voice agent runs (remember, recall, list_agents, delegate), for the Talk
-- workspace and conversation history. Reported by the agent at start and again at finish.
CREATE TABLE IF NOT EXISTS tool_calls (
  call_id text PRIMARY KEY,
  conversation_id uuid,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  name text NOT NULL,
  args jsonb NOT NULL DEFAULT '{}',
  output text,
  status text NOT NULL CHECK (status IN ('running', 'done', 'error')),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);
CREATE INDEX IF NOT EXISTS tool_calls_conversation_idx ON tool_calls (conversation_id, started_at);
CREATE INDEX IF NOT EXISTS tool_calls_started_idx ON tool_calls (started_at DESC)

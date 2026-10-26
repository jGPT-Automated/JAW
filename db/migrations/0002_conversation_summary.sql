-- A voice conversation is read summary-first: title, main points, decisions, follow-ups.
-- The transcript itself stays in agent_messages (channel 'voice').
ALTER TABLE voice_sessions ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE voice_sessions ADD COLUMN IF NOT EXISTS key_points jsonb NOT NULL DEFAULT '[]';
ALTER TABLE voice_sessions ADD COLUMN IF NOT EXISTS decisions jsonb NOT NULL DEFAULT '[]';
ALTER TABLE voice_sessions ADD COLUMN IF NOT EXISTS action_items jsonb NOT NULL DEFAULT '[]';
CREATE INDEX IF NOT EXISTS voice_sessions_started_idx ON voice_sessions (started_at DESC);

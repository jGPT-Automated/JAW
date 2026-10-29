-- Projects Jesse keeps top of mind, and the tasks under each. JAW reads and edits both by voice,
-- phone and the web; a task without a project sits in the Inbox lane.
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  summary text,
  repo text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'done')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS projects_name_idx ON projects (lower(name));

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects (id) ON DELETE SET NULL,
  title text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  source text NOT NULL DEFAULT 'ui',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  done_at timestamptz
);
CREATE INDEX IF NOT EXISTS tasks_project_idx ON tasks (project_id, status);

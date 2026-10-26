-- GitHub responses cached by key: "account:<login>" snapshots and "pull:<repo>#<n>" file diffs.
CREATE TABLE IF NOT EXISTS github_cache (
  key text PRIMARY KEY,
  data jsonb NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  error text
);

-- The owner's accept / reject on each file of a pull request; agents read these.
CREATE TABLE IF NOT EXISTS review_decisions (
  repo text NOT NULL,
  pr_number int NOT NULL,
  path text NOT NULL,
  decision text NOT NULL CHECK (decision IN ('pending', 'accepted', 'rejected')),
  decided_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (repo, pr_number, path)
);

-- Component libraries (shadcn registries) and their items, grouped by category.
CREATE TABLE IF NOT EXISTS component_libraries (
  slug text PRIMARY KEY,
  name text NOT NULL,
  site_url text NOT NULL,
  registry_url text NOT NULL,
  namespace text,
  added_by text NOT NULL DEFAULT 'owner',
  added_at timestamptz NOT NULL DEFAULT now(),
  synced_at timestamptz,
  item_count int NOT NULL DEFAULT 0,
  sync_error text
);

CREATE TABLE IF NOT EXISTS components (
  library text NOT NULL REFERENCES component_libraries(slug) ON DELETE CASCADE,
  name text NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  docs_url text,
  install text NOT NULL,
  PRIMARY KEY (library, name)
);

CREATE INDEX IF NOT EXISTS components_category_idx ON components (category);

-- Design references and other resources, added by URL, upload, or an agent.
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'design',
  title text NOT NULL,
  url text,
  image_url text,
  collection text NOT NULL DEFAULT 'Inbox',
  notes text,
  added_by text NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resources_created_idx ON resources (created_at DESC);

-- Uploaded files, served from /api/public/files/:id. Kept small (Vercel request limit).
CREATE TABLE IF NOT EXISTS resource_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  size int NOT NULL,
  bytes bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
)

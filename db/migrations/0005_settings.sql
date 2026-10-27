-- Small key/value settings, e.g. the owner sign-in key hash (scrypt), so sign-in works without
-- any hosting configuration.
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
)

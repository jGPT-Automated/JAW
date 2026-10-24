-- JAW Hub: provider-aware outbound delivery + inbound agent callbacks.
--
-- agents.provider decides how queue-processor authenticates to the agent's webhook:
--   hyperagent -> X-Hyperagent-Webhook-Secret: <secret>
--   letta      -> Authorization: Basic base64("webhook:<secret>")   (Letta agent webhooks)
--   webhook    -> Authorization: Bearer <secret>                    (any other endpoint)
--
-- agent_credentials.inbound_token lets an agent post replies/events back into the hub
-- through the agent-inbound edge function. Like the other credentials it is only
-- readable with the service role.

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'hyperagent';

DO $$ BEGIN
  ALTER TABLE public.agents
    ADD CONSTRAINT agents_provider_check CHECK (provider IN ('hyperagent', 'letta', 'webhook'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.agent_credentials
  ADD COLUMN IF NOT EXISTS inbound_token text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_credentials_inbound_token
  ON public.agent_credentials(inbound_token)
  WHERE inbound_token IS NOT NULL;

-- Live fleet status in the hub.
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

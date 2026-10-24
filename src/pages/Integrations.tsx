import { Link } from "react-router-dom";
import { ArrowDownToLine, ArrowUpFromLine, Bot, Send, Webhook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { CopyField } from "@/hub/components/CopyField";
import { PageHeader } from "@/hub/components/PageHeader";
import { useAgents } from "@/hub/data/queries";
import { INBOUND_URL, inboundCurl } from "@/hub/lib/endpoints";
import { PROVIDERS } from "@/hub/lib/meta";
import type { Provider } from "@/hub/lib/types";

const OUTBOUND_PAYLOAD = `{
  "prompt": "Draft the launch post",
  "agent_id": "…",
  "agent_name": "Mya",
  "conversation_id": "…",
  "source": "ui",
  "reply_url": "${INBOUND_URL}"
}`;

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
      {children}
    </pre>
  );
}

const GUIDES = [
  {
    id: "hyperagent",
    icon: <Bot className="size-4" />,
    title: "Hyperagent",
    description: (
      <ol className="list-decimal space-y-1.5 pl-4">
        <li>In Hyperagent, open the agent and copy its webhook receive URL and webhook secret.</li>
        <li>
          Register the agent here with platform <b>Hyperagent</b>, paste the URL and secret. The hub sends the secret as{" "}
          <code className="font-mono text-xs">X-Hyperagent-Webhook-Secret</code>.
        </li>
        <li>If Hyperagent answers in the response body, the reply appears in the Inbox immediately.</li>
      </ol>
    ),
  },
  {
    id: "letta",
    icon: <Webhook className="size-4" />,
    title: "Letta",
    description: (
      <ol className="list-decimal space-y-1.5 pl-4">
        <li>
          Create an agent webhook in Letta. It gives you a URL like{" "}
          <code className="font-mono text-xs">https://api.letta.com/v1/agent-webhooks/…</code> and, if secured, a security
          key.
        </li>
        <li>
          Register the agent here with platform <b>Letta</b>. The key is sent as HTTP Basic auth, user{" "}
          <code className="font-mono text-xs">webhook</code>. Leave it empty for a public webhook.
        </li>
        <li>
          Letta accepts with <code className="font-mono text-xs">202</code> and works asynchronously. Give the agent the
          inbound endpoint and token below so it can post its answer back.
        </li>
      </ol>
    ),
  },
  {
    id: "webhook",
    icon: <ArrowUpFromLine className="size-4" />,
    title: "Any other webhook",
    description: (
      <ol className="list-decimal space-y-1.5 pl-4">
        <li>Any HTTPS endpoint that accepts the JSON below works. The optional secret goes out as a Bearer token.</li>
        <li>
          Reply synchronously with <code className="font-mono text-xs">{`{"reply": "…"}`}</code>, or answer{" "}
          <code className="font-mono text-xs">202</code> and post later to the inbound endpoint.
        </li>
      </ol>
    ),
  },
  {
    id: "telegram",
    icon: <Send className="size-4" />,
    title: "Telegram",
    description: (
      <ol className="list-decimal space-y-1.5 pl-4">
        <li>Create a bot with @BotFather and copy its token.</li>
        <li>Add the token when registering the agent. DMs to the bot are polled every minute and routed to the agent.</li>
        <li>Synchronous replies go back to the Telegram chat and are mirrored in the Inbox.</li>
      </ol>
    ),
  },
];

export default function Integrations() {
  const { data: agents = [] } = useAgents();
  const count = (p: Provider) => agents.filter((a) => a.webhook_enabled && a.provider === p).length;
  const telegram = agents.filter((a) => a.telegram_enabled).length;

  return (
    <>
      <PageHeader
        title="Integrations"
        description="How the hub talks to agents, and how agents talk back."
        actions={
          <Button asChild>
            <Link to="/agents?new=1">Register agent</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(PROVIDERS) as Provider[]).map((p) => (
          <Card key={p} className="gap-3 py-5">
            <CardHeader className="px-5">
              <CardTitle>{PROVIDERS[p].label}</CardTitle>
              <CardDescription>{PROVIDERS[p].auth}</CardDescription>
            </CardHeader>
            <CardFooter className="gap-2 px-5">
              <Badge variant={count(p) ? "default" : "outline"}>{count(p)} connected</Badge>
              {PROVIDERS[p].async ? <Badge variant="secondary">Async replies</Badge> : null}
            </CardFooter>
          </Card>
        ))}
        <Card className="gap-3 py-5">
          <CardHeader className="px-5">
            <CardTitle>Telegram</CardTitle>
            <CardDescription>Bot DMs routed to an agent</CardDescription>
          </CardHeader>
          <CardFooter className="px-5">
            <Badge variant={telegram ? "default" : "outline"}>{telegram} connected</Badge>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpFromLine className="size-4" /> Hub → agent
            </CardTitle>
            <CardDescription>
              Every message is queued, then POSTed to the agent&apos;s webhook within its daily cap and pacing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Code>{OUTBOUND_PAYLOAD}</Code>
            <BouncyAccordion items={GUIDES} defaultValue="hyperagent" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownToLine className="size-4" /> Agent → hub
            </CardTitle>
            <CardDescription>
              Agents post replies, progress and events here. Each agent gets its own token when it is registered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel>Inbound endpoint</FieldLabel>
                <CopyField label="inbound endpoint" value={INBOUND_URL} />
                <FieldDescription>
                  Authenticate with <code className="font-mono text-xs">Authorization: Bearer &lt;token&gt;</code> or{" "}
                  <code className="font-mono text-xs">X-JAW-Token</code>.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Example</FieldLabel>
                <Code>{inboundCurl()}</Code>
              </Field>
              <Field>
                <FieldLabel>Body fields</FieldLabel>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <code className="font-mono text-xs text-foreground">content</code> (or message, text, reply, output):
                    what the agent says. Required.
                  </li>
                  <li>
                    <code className="font-mono text-xs text-foreground">conversation_id</code>: thread it under an
                    existing conversation.
                  </li>
                  <li>
                    <code className="font-mono text-xs text-foreground">event_type</code>: e.g. task_complete,
                    escalation, plan_updated.
                  </li>
                  <li>
                    <code className="font-mono text-xs text-foreground">metadata</code>: any JSON object.
                  </li>
                </ul>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { KeyRound, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { useAgents, useDeleteAgent, useMessages, useRotateToken, useUpdateAgent } from "@/hub/data/queries";
import { agentStatus, agentType, providerMeta } from "@/hub/lib/meta";
import { ago } from "@/hub/lib/time";
import type { Agent } from "@/hub/lib/types";
import { AgentAvatar } from "./AgentAvatar";
import { Composer } from "./Composer";
import { InboundTokenDialog } from "./InboundTokenDialog";
import { Transcript } from "./Transcript";

export function AgentSheet({ agentId, onClose }: { agentId: string | null; onClose: () => void }) {
  const { data: agents = [] } = useAgents();
  const agent = agents.find((a) => a.id === agentId);
  return (
    <Sheet open={!!agent} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        {agent ? <AgentDetail key={agent.id} agent={agent} onDeleted={onClose} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function AgentDetail({ agent, onDeleted }: { agent: Agent; onDeleted: () => void }) {
  const [tab, setTab] = useState("overview");
  const status = agentStatus(agent.status);
  const type = agentType(agent.type);

  return (
    <>
      <SheetHeader className="border-b">
        <div className="flex items-center gap-3 pr-8">
          <AgentAvatar agent={agent} className="size-11" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="truncate text-lg">{agent.name}</SheetTitle>
            <SheetDescription className="truncate">
              {type.label}
              {agent.model ? `, ${agent.model}` : ""}
            </SheetDescription>
          </div>
          <AnimatedBadge status={status.badge} pulse={agent.status === "active"} contentKey={agent.status}>
            {status.label}
          </AnimatedBadge>
        </div>
      </SheetHeader>

      <Tabs value={tab} onValueChange={setTab} variant="underline" className="flex min-h-0 flex-1 flex-col">
        <TabsList aria-label="Agent sections" className="px-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="overview" className="mt-0 p-4">
            <Overview agent={agent} />
          </TabsContent>
          <TabsContent value="messages" className="mt-0 flex h-full flex-col">
            {tab === "messages" ? <Messages agent={agent} /> : null}
          </TabsContent>
          <TabsContent value="settings" className="mt-0 p-4">
            <Settings agent={agent} onDeleted={onDeleted} />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}

function Overview({ agent }: { agent: Agent }) {
  const success = Number(agent.success_rate ?? 0);
  return (
    <div className="space-y-6">
      {agent.description ? <p className="text-sm text-muted-foreground">{agent.description}</p> : null}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Uptime", value: Number(agent.uptime_hours ?? 0), suffix: "h" },
          { label: "Tasks done", value: agent.tasks_completed ?? 0 },
          { label: "Success", value: success, suffix: "%" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-xl font-semibold">
              <AnimatedNumber value={s.value} startOnView={false} />
              {s.suffix ? <span className="text-sm text-muted-foreground">{s.suffix}</span> : null}
            </div>
          </div>
        ))}
      </div>
      <Progress value={success} aria-label="Success rate" />

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Current task</dt>
        <dd>{agent.current_task || "—"}</dd>
        <dt className="text-muted-foreground">Last heartbeat</dt>
        <dd>{ago(agent.last_heartbeat)}</dd>
        <dt className="text-muted-foreground">Channels</dt>
        <dd className="flex flex-wrap gap-1.5">
          {agent.webhook_enabled ? <Badge variant="secondary">{providerMeta(agent.provider).label} webhook</Badge> : null}
          {agent.telegram_enabled ? <Badge variant="secondary">Telegram</Badge> : null}
          {!agent.webhook_enabled && !agent.telegram_enabled ? <span>None yet</span> : null}
        </dd>
        <dt className="text-muted-foreground">Rate limit</dt>
        <dd>
          {agent.daily_message_limit} per day, {agent.min_seconds_between_messages}s apart
        </dd>
      </dl>
    </div>
  );
}

function Messages({ agent }: { agent: Agent }) {
  const { data: messages = [], isLoading } = useMessages(agent.id);
  return (
    <div className="flex h-full flex-col">
      {isLoading ? (
        <div className="grid flex-1 place-items-center">
          <Spinner />
        </div>
      ) : (
        <Transcript messages={messages} agentId={agent.id} className="min-h-0 flex-1 px-4" />
      )}
      <div className="border-t p-3">
        <Composer agents={[agent]} conversationId={messages.at(-1)?.conversation_id} />
      </div>
    </div>
  );
}

function Settings({ agent, onDeleted }: { agent: Agent; onDeleted: () => void }) {
  const update = useUpdateAgent();
  const register = useRotateToken();
  const remove = useDeleteAgent();
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    system_instructions: agent.system_instructions ?? "",
    daily_message_limit: agent.daily_message_limit,
    min_seconds_between_messages: agent.min_seconds_between_messages,
  });

  useEffect(() => {
    setForm({
      system_instructions: agent.system_instructions ?? "",
      daily_message_limit: agent.daily_message_limit,
      min_seconds_between_messages: agent.min_seconds_between_messages,
    });
  }, [agent.system_instructions, agent.daily_message_limit, agent.min_seconds_between_messages]);

  const save = () =>
    update.mutate(
      { id: agent.id, patch: form },
      { onSuccess: () => toast.success("Saved"), onError: (e) => toast.error(e.message) },
    );

  const rotate = () =>
    register.mutate(
      agent.id,
      {
        onSuccess: (res) => setToken(res.inbound_token),
        onError: (e) => toast.error(e.message),
      },
    );

  return (
    <FieldGroup className="gap-5">
      <Field>
        <FieldLabel htmlFor="sys">System instructions</FieldLabel>
        <Textarea
          id="sys"
          rows={8}
          value={form.system_instructions}
          onChange={(e) => setForm((f) => ({ ...f, system_instructions: e.target.value }))}
          className="font-mono text-xs"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="cap">Messages per day</FieldLabel>
          <Input
            id="cap"
            type="number"
            min={1}
            value={form.daily_message_limit}
            onChange={(e) => setForm((f) => ({ ...f, daily_message_limit: Number(e.target.value) || 1 }))}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="gap">Seconds between messages</FieldLabel>
          <Input
            id="gap"
            type="number"
            min={0}
            value={form.min_seconds_between_messages}
            onChange={(e) => setForm((f) => ({ ...f, min_seconds_between_messages: Number(e.target.value) || 0 }))}
          />
        </Field>
      </div>
      <div>
        <Button onClick={save} disabled={update.isPending}>
          {update.isPending ? <Spinner /> : null}
          Save changes
        </Button>
      </div>

      <FieldSeparator>Reporting back</FieldSeparator>
      <Field orientation="horizontal" className="items-center justify-between">
        <div>
          <FieldLabel>Inbound token</FieldLabel>
          <FieldDescription>Issue a new token if the old one leaked. The old one stops working.</FieldDescription>
        </div>
        <Button variant="outline" onClick={rotate} disabled={register.isPending}>
          {register.isPending ? <Spinner /> : <KeyRound />}
          New token
        </Button>
      </Field>

      <FieldSeparator>Danger zone</FieldSeparator>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-fit">
            <Trash2 /> Delete agent
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {agent.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the agent, its credentials and its message history. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() =>
                remove.mutate(agent.id, {
                  onSuccess: () => {
                    toast.success(`${agent.name} deleted`);
                    onDeleted();
                  },
                  onError: (e) => toast.error(e.message),
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InboundTokenDialog agentName={agent.name} token={token} onClose={() => setToken(null)} />
    </FieldGroup>
  );
}

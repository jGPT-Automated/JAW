import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { useRegisterAgent } from "@/hub/data/queries";
import { AGENT_TYPES, PROVIDERS } from "@/hub/lib/meta";
import type { Provider } from "@/hub/lib/types";
import { InboundTokenDialog } from "./InboundTokenDialog";

const EMPTY = {
  provider: "hyperagent" as Provider,
  name: "",
  type: "executor",
  description: "",
  webhook_url: "",
  webhook_secret: "",
  telegram_bot_token: "",
  daily_message_limit: 3,
  min_seconds_between_messages: 60,
};

export function RegisterAgentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [issued, setIssued] = useState<{ name: string; token: string } | null>(null);
  const register = useRegisterAgent();
  const provider = PROVIDERS[form.provider];

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Give the agent a name.");
    if (form.webhook_url && !/^https:\/\//.test(form.webhook_url.trim())) {
      return setError("The webhook URL must start with https://");
    }
    setError(null);
    register.mutate(
      { ...form, name: form.name.trim(), webhook_url: form.webhook_url.trim() },
      {
        onSuccess: (res) => {
          toast.success(`${form.name.trim()} registered`);
          onOpenChange(false);
          if (res.inbound_token) setIssued({ name: form.name.trim(), token: res.inbound_token });
          setForm(EMPTY);
        },
        onError: (err) => setError(err.message),
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <form onSubmit={submit} className="contents">
            <DialogHeader>
              <DialogTitle>Register an agent</DialogTitle>
              <DialogDescription>
                Point the hub at the agent&apos;s webhook. Messages are queued and delivered within its rate limit.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel>Platform</FieldLabel>
                <Tabs variant="segment" value={form.provider} onValueChange={(v) => set("provider", v as Provider)}>
                  <TabsList aria-label="Agent platform" className="w-full">
                    {(Object.keys(PROVIDERS) as Provider[]).map((p) => (
                      <TabsTrigger key={p} value={p} className="flex-1">
                        {PROVIDERS[p].label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <FieldDescription>
                  Auth: {provider.auth}.{" "}
                  {provider.async ? "Replies are asynchronous and come back through the inbound endpoint." : null}
                </FieldDescription>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="agent-name">Name</FieldLabel>
                  <Input
                    id="agent-name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Mya"
                    autoComplete="off"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="agent-role">Role</FieldLabel>
                  <Select value={form.type} onValueChange={(v) => set("type", v)}>
                    <SelectTrigger id="agent-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AGENT_TYPES).map(([value, meta]) => (
                        <SelectItem key={value} value={value}>
                          <meta.icon /> {meta.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="agent-description">What it does</FieldLabel>
                <Textarea
                  id="agent-description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={2}
                  placeholder="Drafts release notes and checks links before launch."
                />
              </Field>

              <FieldSeparator>Webhook</FieldSeparator>

              <Field>
                <FieldLabel htmlFor="agent-url">Webhook URL</FieldLabel>
                <Input
                  id="agent-url"
                  type="url"
                  inputMode="url"
                  value={form.webhook_url}
                  onChange={(e) => set("webhook_url", e.target.value)}
                  placeholder={provider.urlPlaceholder}
                  autoComplete="off"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="agent-secret">{provider.secretLabel}</FieldLabel>
                <Input
                  id="agent-secret"
                  type="password"
                  value={form.webhook_secret}
                  onChange={(e) => set("webhook_secret", e.target.value)}
                  autoComplete="new-password"
                />
                <FieldDescription>Stored server-side only. It never comes back to the browser.</FieldDescription>
              </Field>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" className="-ml-2 text-muted-foreground [&[data-state=open]>svg]:rotate-180">
                    Telegram and rate limits <ChevronDown className="transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-5">
                  <Field>
                    <FieldLabel htmlFor="agent-telegram">Telegram bot token (optional)</FieldLabel>
                    <Input
                      id="agent-telegram"
                      type="password"
                      value={form.telegram_bot_token}
                      onChange={(e) => set("telegram_bot_token", e.target.value)}
                      placeholder="123456:ABC-…"
                      autoComplete="off"
                    />
                    <FieldDescription>DMs to this bot are routed to the agent and mirrored here.</FieldDescription>
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="agent-cap">Messages per day</FieldLabel>
                      <Input
                        id="agent-cap"
                        type="number"
                        min={1}
                        max={1000}
                        value={form.daily_message_limit}
                        onChange={(e) => set("daily_message_limit", Number(e.target.value) || 1)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="agent-gap">Seconds between messages</FieldLabel>
                      <Input
                        id="agent-gap"
                        type="number"
                        min={0}
                        max={86400}
                        value={form.min_seconds_between_messages}
                        onChange={(e) => set("min_seconds_between_messages", Number(e.target.value) || 0)}
                      />
                    </Field>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {error ? <FieldError>{error}</FieldError> : null}
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={register.isPending}>
                {register.isPending ? <Spinner /> : null}
                Register agent
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <InboundTokenDialog agentName={issued?.name ?? ""} token={issued?.token ?? null} onClose={() => setIssued(null)} />
    </>
  );
}

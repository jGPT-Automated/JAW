import {
  AlertTriangle,
  ArrowRightLeft,
  BrainCircuit,
  Check,
  CircleDot,
  Compass,
  Database,
  Eye,
  FileText,
  History,
  Info,
  ListChecks,
  type LucideIcon,
  MessageSquareReply,
  Network,
  Repeat,
  RotateCcw,
  Send,
  ShieldCheck,
  ShieldX,
  SquareTerminal,
  UserPlus,
  Webhook,
  X,
} from "lucide-react";
import type { AnimatedBadgeStatus } from "@/components/motion/animated-badge";
import type { Provider } from "./types";

export const AGENT_TYPES: Record<string, { label: string; icon: LucideIcon }> = {
  orchestrator: { label: "Orchestrator", icon: Network },
  executor: { label: "Executor", icon: SquareTerminal },
  analyst: { label: "Analyst", icon: Eye },
  validator: { label: "Validator", icon: ShieldCheck },
  persistence: { label: "Persistence", icon: Database },
  planner: { label: "Planner", icon: Compass },
};

export function agentType(type: string) {
  return AGENT_TYPES[type] ?? { label: type, icon: BrainCircuit };
}

export const AGENT_STATUS: Record<string, { label: string; badge: AnimatedBadgeStatus }> = {
  active: { label: "Active", badge: "success" },
  idle: { label: "Idle", badge: "neutral" },
  standby: { label: "Standby", badge: "info" },
  error: { label: "Error", badge: "danger" },
};

export function agentStatus(status: string) {
  return AGENT_STATUS[status] ?? { label: status, badge: "neutral" as const };
}

export const PROVIDERS: Record<
  Provider,
  { label: string; auth: string; secretLabel: string; urlPlaceholder: string; async: boolean }
> = {
  hyperagent: {
    label: "Hyperagent",
    auth: "X-Hyperagent-Webhook-Secret header",
    secretLabel: "Webhook secret",
    urlPlaceholder: "https://hyperagent.com/api/webhooks/…/receive",
    async: false,
  },
  letta: {
    label: "Letta",
    auth: "HTTP Basic, username “webhook”, password = security key",
    secretLabel: "Security key (optional)",
    urlPlaceholder: "https://api.letta.com/v1/agent-webhooks/…",
    async: true,
  },
  webhook: {
    label: "Custom webhook",
    auth: "Authorization: Bearer <secret>",
    secretLabel: "Bearer secret (optional)",
    urlPlaceholder: "https://example.com/agent",
    async: false,
  },
};

export function providerMeta(provider: string | null | undefined) {
  return PROVIDERS[(provider as Provider) ?? "hyperagent"] ?? PROVIDERS.hyperagent;
}

export const EVENT_TYPES: Record<string, { label: string; icon: LucideIcon; tone: "default" | "success" | "danger" | "warning" }> = {
  task_routed: { label: "Routed", icon: Send, tone: "default" },
  task_complete: { label: "Completed", icon: Check, tone: "success" },
  state_saved: { label: "State saved", icon: CircleDot, tone: "default" },
  context_restore: { label: "Context restored", icon: RotateCcw, tone: "default" },
  validation_pass: { label: "Validation passed", icon: ShieldCheck, tone: "success" },
  validation_fail: { label: "Validation failed", icon: ShieldX, tone: "danger" },
  analysis_complete: { label: "Analysis", icon: Eye, tone: "default" },
  priority_shift: { label: "Priority shift", icon: ArrowRightLeft, tone: "warning" },
  escalation: { label: "Escalation", icon: AlertTriangle, tone: "danger" },
  plan_updated: { label: "Plan updated", icon: ListChecks, tone: "warning" },
  agent_registered: { label: "Registered", icon: UserPlus, tone: "success" },
  agent_report: { label: "Agent report", icon: MessageSquareReply, tone: "default" },
  error: { label: "Error", icon: X, tone: "danger" },
  info: { label: "Info", icon: Info, tone: "default" },
};

export function eventMeta(type: string) {
  return EVENT_TYPES[type] ?? { label: type.replace(/_/g, " "), icon: History, tone: "default" as const };
}

export const CHANNEL_ICONS: Record<string, LucideIcon> = {
  webhook: Webhook,
  telegram: Send,
  ui: MessageSquareReply,
  orchestrator: Repeat,
  system: FileText,
};

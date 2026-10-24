import {
  Activity,
  Bot,
  ExternalLink,
  Feather,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  MessagesSquare,
  ScrollText,
  Webhook,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
  /** Static page served outside the SPA. */
  external?: boolean;
}

export const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Hub",
    items: [
      { title: "Overview", url: "/", icon: LayoutDashboard, description: "Fleet health, traffic and recent events" },
      { title: "Agents", url: "/agents", icon: Bot, description: "Register, configure and message agents" },
      { title: "Inbox", url: "/inbox", icon: MessagesSquare, description: "Every conversation across channels" },
      { title: "Activity", url: "/activity", icon: Activity, description: "Live event stream and delivery queue" },
      { title: "Roadmap", url: "/roadmap", icon: ListTodo, description: "What the fleet is building" },
    ],
  },
  {
    label: "Connect",
    items: [
      { title: "Integrations", url: "/integrations", icon: Webhook, description: "Hyperagent, Letta, webhooks and Telegram" },
    ],
  },
  {
    label: "Library",
    items: [
      { title: "Protocol", url: "/protocol", icon: ScrollText, description: "Omni-Protocol Sentinel v2.0" },
      { title: "Manifesto", url: "/manifesto", icon: Feather, description: "The Sovereign Architecture" },
      {
        title: "LocalCheck",
        url: "/localcheck/index.html",
        icon: ExternalLink,
        description: "LocalCheck working file and release handoff",
        external: true,
      },
    ],
  },
];

export const ALL_NAV = NAV.flatMap((g) => g.items);

export function navFor(pathname: string) {
  return ALL_NAV.find((n) => !n.external && (n.url === "/" ? pathname === "/" : pathname.startsWith(n.url)));
}

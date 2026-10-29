import {
  ExternalLink,
  Feather,
  FolderGit2,
  FolderKanban,
  History,
  Library,
  ListChecks,
  ListTodo,
  type LucideIcon,
  MessagesSquare,
  Mic,
  ScrollText,
  SlidersHorizontal,
} from "lucide-react";
import { GITHUB_ACCOUNTS } from "./github-accounts";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
  /** Static page served outside the SPA. */
  external?: boolean;
  /** Nested pages, shown as a collapsible sub-menu. */
  children?: { title: string; url: string; image?: string }[];
}

export const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "JAW",
    items: [
      { title: "Talk", url: "/", icon: Mic, description: "Voice conversation with JAW" },
      { title: "Projects", url: "/projects", icon: FolderKanban, description: "What you're keeping top of mind" },
      { title: "Tasks", url: "/tasks", icon: ListChecks, description: "Every project's open tasks in one list" },
      { title: "Conversations", url: "/conversations", icon: History, description: "Every call, summary first" },
      { title: "Rooms", url: "/rooms", icon: MessagesSquare, description: "Message your agents' rooms (Hyperagent and more)" },
      { title: "Instructions", url: "/instructions", icon: SlidersHorizontal, description: "How JAW works with you, in every conversation" },
      { title: "Resources", url: "/resources", icon: Library, description: "Skills and taste references agents read" },
    ],
  },
  {
    label: "GitHub",
    items: [
      {
        title: "Accounts",
        url: "/github",
        icon: FolderGit2,
        description: "Activity, pull requests and projects per account",
        children: GITHUB_ACCOUNTS.map((login) => ({
          title: login,
          url: `/github/${login}`,
          image: `https://github.com/${login}.png?size=40`,
        })),
      },
    ],
  },
  {
    label: "Library",
    items: [
      { title: "LocalCheck roadmap", url: "/roadmap", icon: ListTodo, description: "LocalCheck's tracked requests" },
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

export const ALL_NAV: NavItem[] = NAV.flatMap((g) =>
  g.items.flatMap((item) =>
    item.children
      ? item.children.map((c) => ({ title: c.title, url: c.url, icon: item.icon, description: `GitHub @${c.title}` }))
      : [item],
  ),
);

export function navFor(pathname: string) {
  return ALL_NAV.find((n) => !n.external && (n.url === "/" ? pathname === "/" : pathname.startsWith(n.url)));
}

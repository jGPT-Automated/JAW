import { ExternalLink, Feather, History, Library, ListTodo, type LucideIcon, Mic, ScrollText } from "lucide-react";

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
    label: "JAW",
    items: [
      { title: "Talk", url: "/", icon: Mic, description: "Voice conversation with JAW" },
      { title: "Conversations", url: "/conversations", icon: History, description: "Every call, summary first" },
      { title: "Roadmap", url: "/roadmap", icon: ListTodo, description: "LocalCheck's tracked requests" },
      { title: "Resources", url: "/resources", icon: Library, description: "Skills and taste references agents read" },
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

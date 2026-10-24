import { format, formatDistanceToNowStrict, isToday } from "date-fns";

export function ago(iso: string | null | undefined) {
  if (!iso) return "never";
  return `${formatDistanceToNowStrict(new Date(iso))} ago`;
}

export function clock(iso: string) {
  const d = new Date(iso);
  return isToday(d) ? format(d, "HH:mm") : format(d, "MMM d, HH:mm");
}

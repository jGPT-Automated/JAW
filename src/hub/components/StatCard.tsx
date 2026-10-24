import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedNumber } from "@/components/motion/animated-number";

export function StatCard({
  label,
  value,
  icon: Icon,
  footer,
  loading,
  suffix,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  footer?: ReactNode;
  loading?: boolean;
  suffix?: string;
}) {
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="px-5">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {loading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <>
              <AnimatedNumber value={value} startOnView={false} />
              {suffix ? <span className="ml-0.5 text-lg text-muted-foreground">{suffix}</span> : null}
            </>
          )}
        </CardTitle>
        <CardAction>
          <span className="grid size-8 place-items-center rounded-md border bg-muted/40 text-muted-foreground">
            <Icon className="size-4" />
          </span>
        </CardAction>
      </CardHeader>
      {footer ? <CardFooter className="px-5 text-xs text-muted-foreground">{footer}</CardFooter> : null}
    </Card>
  );
}

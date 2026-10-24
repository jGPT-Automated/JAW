import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/** A failed request: says what is missing and offers one retry. Never leaves a skeleton behind. */
export function LoadError({ what, error, onRetry }: { what: string; error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : "The request failed.";
  return (
    <Alert className="max-w-xl">
      <CircleAlert />
      <AlertTitle>Couldn&apos;t load {what}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        {onRetry ? (
          <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

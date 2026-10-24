import { KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { CopyField } from "./CopyField";
import { INBOUND_URL, inboundCurl } from "@/hub/lib/endpoints";

export function InboundTokenDialog({
  agentName,
  token,
  onClose,
}: {
  agentName: string;
  token: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!token} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{agentName} can now report back</DialogTitle>
          <DialogDescription>
            Give the agent this endpoint and token so it can post replies and events into the hub.
          </DialogDescription>
        </DialogHeader>
        <Alert>
          <KeyRound />
          <AlertTitle>Shown once</AlertTitle>
          <AlertDescription>
            Store the token in the agent platform as a secret. You can issue a new one from the agent&apos;s settings.
          </AlertDescription>
        </Alert>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>Inbound endpoint</FieldLabel>
            <CopyField label="inbound endpoint" value={INBOUND_URL} />
          </Field>
          <Field>
            <FieldLabel>Inbound token</FieldLabel>
            <CopyField label="inbound token" value={token ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Example</FieldLabel>
            <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {inboundCurl(token ?? undefined)}
            </pre>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

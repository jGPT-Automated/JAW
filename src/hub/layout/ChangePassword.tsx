import { type FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/hub/lib/api";
import { ownerKey } from "@/hub/lib/auth";

/** Set your own JAW password. Other devices sign in again with the new one. */
export function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api("/owner-key", { method: "PUT", json: { key: value.trim() } });
      ownerKey.set(value.trim()); // keep this device signed in
      toast.success("Password changed");
      setValue("");
      setOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change password">
          <KeyRound />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={submit} className="contents">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Pick your own. This device stays signed in; others ask for the new one.</DialogDescription>
          </DialogHeader>
          <Field data-invalid={!!error || undefined}>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={16}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            <FieldDescription>At least 16 characters.</FieldDescription>
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={pending || value.trim().length < 16}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/hub/lib/auth";

/** Shows the dashboard only to a signed-in owner. Without auth configured (local dev) it passes through. */
export function AuthGate({ children }: { children: ReactNode }) {
  if (!authClient) return <>{children}</>;
  return <SessionGate>{children}</SessionGate>;
}

function SessionGate({ children }: { children: ReactNode }) {
  const session = authClient!.useSession();
  if (session.isPending) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner className="text-muted-foreground" />
      </div>
    );
  }
  if (!session.data?.user) return <SignIn />;
  return <>{children}</>;
}

function SignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result =
      mode === "in"
        ? await authClient!.signIn.email({ email, password })
        : await authClient!.signUp.email({ email, password, name: email.split("@")[0] || "Owner" });
    setPending(false);
    if (result.error) setError(result.error.message ?? "That didn't work. Check the email and password.");
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={submit} className="contents">
          <CardHeader>
            <img src="/jaw-icon.svg" alt="" className="mb-2 size-10 rounded-lg" />
            <CardTitle className="text-subheading">{mode === "in" ? "Sign in to JAW" : "Create the owner account"}</CardTitle>
            <CardDescription>Your agents, memory and conversations live behind this sign-in.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!error || undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error || undefined}
                  required
                />
              </Field>
              <Field data-invalid={!!error || undefined}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "in" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error || undefined}
                  minLength={8}
                  required
                />
                {error ? <FieldError>{error}</FieldError> : null}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {mode === "in" ? "Sign in" : "Create account"}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setMode(mode === "in" ? "up" : "in")}>
              {mode === "in" ? "First time here? Create the owner account" : "Already set up? Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

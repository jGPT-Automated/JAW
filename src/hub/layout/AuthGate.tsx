import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { AUTH_CHANGED, authClient, ownerKey } from "@/hub/lib/auth";

interface Status {
  database: "ok" | "unreachable";
  auth: "key" | "neon" | "none" | "disabled";
  owner_key: string | null;
  missing: string[];
  optional_missing: string[];
}

const WHAT: Record<string, string> = {
  DATABASE_URL: "Set, but the database didn't answer. Check the Neon connection string.",
  NEON_KEY: "Neon API key. JAW uses it to find the NeonJess database (or set DATABASE_URL directly).",
  JAW_OWNER_KEY: "Your JAW password (16+ characters).",
};

/**
 * Decides what the owner sees first: setup (the deployment is missing settings), the owner-key
 * screen, Neon Auth sign-in, or the app.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const status = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error(`The server answered ${res.status}`);
      return (await res.json()) as Status;
    },
    staleTime: 60_000,
  });
  const [key, setKey] = useState(ownerKey.get());
  useEffect(() => {
    const sync = () => setKey(ownerKey.get());
    window.addEventListener(AUTH_CHANGED, sync);
    return () => window.removeEventListener(AUTH_CHANGED, sync);
  }, []);

  if (status.isPending) return <Centered><Spinner className="text-muted-foreground" /></Centered>;
  if (status.isError) return <Setup error={status.error.message} onRetry={() => status.refetch()} />;
  const s = status.data;
  if (s.missing.length || s.owner_key) return <Setup status={s} onRetry={() => status.refetch()} />;
  if (s.auth === "disabled") return <>{children}</>;
  if (s.auth === "key") return key ? <>{children}</> : <OwnerKey />;
  if (!authClient) return <Setup status={{ ...s, missing: ["JAW_OWNER_KEY"] }} onRetry={() => status.refetch()} />;
  return <SessionGate>{children}</SessionGate>;
}

function Centered({ children }: { children: ReactNode }) {
  return <main className="grid min-h-dvh place-items-center bg-background p-4">{children}</main>;
}

function Setup({ status, error, onRetry }: { status?: Status; error?: string; onRetry: () => void }) {
  return (
    <Centered>
      <Card className="w-full max-w-md">
        <CardHeader>
          <img src="/jaw-icon.svg" alt="" className="mb-2 size-10 rounded-lg" />
          <CardTitle className="text-subheading">Almost there</CardTitle>
          <CardDescription>
            {error
              ? `Couldn't reach the server: ${error}.`
              : "This deployment is missing a setting. Add it in Vercel → Project → Settings → Environment Variables, then redeploy."}
          </CardDescription>
        </CardHeader>
        {status ? (
          <CardContent className="flex flex-col gap-4">
            <ItemGroup className="gap-2">
              {status.missing.map((name) => (
                <Item key={name} variant="outline" className="rounded-xl">
                  <ItemContent>
                    <ItemTitle className="font-mono text-sm">{name}</ItemTitle>
                    <ItemDescription className="line-clamp-none">{WHAT[name] ?? "Required."}</ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
            {status.owner_key ? <p className="text-caption text-destructive">{status.owner_key}</p> : null}
          </CardContent>
        ) : null}
        <CardFooter>
          <Button variant="outline" onClick={onRetry}>
            Check again
          </Button>
        </CardFooter>
      </Card>
    </Centered>
  );
}

function OwnerKey() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/conversations", { headers: { Authorization: `Bearer ${value.trim()}` } }).catch(() => null);
    setPending(false);
    if (res?.ok) return ownerKey.set(value.trim());
    setError(res?.status === 401 ? "That password isn't right." : "Couldn't check the password. Try again.");
  };

  return (
    <Centered>
      <Card className="w-full max-w-sm">
        <form onSubmit={submit} className="contents">
          <CardHeader>
            <img src="/jaw-icon.svg" alt="" className="mb-2 size-10 rounded-lg" />
            <CardTitle className="text-subheading">Sign in to JAW</CardTitle>
            <CardDescription>Enter your JAW password. This device stays signed in.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!error || undefined}>
                <FieldLabel htmlFor="owner-key">Password</FieldLabel>
                <Input
                  id="owner-key"
                  type="password"
                  autoComplete="current-password"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  aria-invalid={!!error || undefined}
                  required
                />
                {error ? <FieldError>{error}</FieldError> : null}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={pending || !value.trim()}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Centered>
  );
}

function SessionGate({ children }: { children: ReactNode }) {
  const session = authClient!.useSession();
  if (session.isPending) {
    return (
      <Centered>
        <Spinner className="text-muted-foreground" />
      </Centered>
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

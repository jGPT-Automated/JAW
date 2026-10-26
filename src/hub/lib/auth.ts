import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL as string | undefined;

/** Neon Auth (managed Better Auth). Null when the deployment doesn't use it. */
export const authClient = AUTH_URL ? createAuthClient(AUTH_URL, { adapter: BetterAuthReactAdapter() }) : null;

const KEY = "jaw-owner-key";
/** Fired when the owner signs out or a saved owner key stops working. */
export const AUTH_CHANGED = "jaw:auth-changed";

/** The owner key (JAW_OWNER_KEY), kept on this device only. */
export const ownerKey = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(value: string) {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // Private mode: the key lasts for this page only.
    }
    window.dispatchEvent(new Event(AUTH_CHANGED));
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Nothing stored.
    }
    window.dispatchEvent(new Event(AUTH_CHANGED));
  },
};

/** Credential for the API: the owner key if saved, else a Neon Auth JWT, else null. */
export async function authToken(): Promise<string | null> {
  const key = ownerKey.get();
  if (key) return key;
  if (!authClient) return null;
  const { data } = await authClient.token();
  return data?.token ?? null;
}

export async function signOut() {
  if (ownerKey.get()) return ownerKey.clear();
  await authClient?.signOut();
}

export const canSignOut = () => !!authClient || !!ownerKey.get();

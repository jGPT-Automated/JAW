import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL as string | undefined;

/** Neon Auth (managed Better Auth). Null when the app runs without auth configured (local dev). */
export const authClient = AUTH_URL ? createAuthClient(AUTH_URL, { adapter: BetterAuthReactAdapter() }) : null;

/** JWT for the API, or null when signed out or auth is not configured. */
export async function authToken(): Promise<string | null> {
  if (!authClient) return null;
  const { data } = await authClient.token();
  return data?.token ?? null;
}

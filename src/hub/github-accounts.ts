/** The owner's GitHub accounts, shown in the sidebar and tracked by the server. */
export const GITHUB_ACCOUNTS = ["GenJess", "AgenticJess-Star", "jGPT-Automated", "Generative-Jesse"] as const;

export function isTrackedAccount(login: string) {
  return GITHUB_ACCOUNTS.some((a) => a.toLowerCase() === login.toLowerCase());
}

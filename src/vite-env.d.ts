/// <reference types="vite/client" />

declare module "virtual:saved-meta" {
  const meta: Record<string, { author: string; date: string; message: string; commit: string }>;
  export default meta;
}

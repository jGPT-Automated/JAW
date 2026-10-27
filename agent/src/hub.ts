/**
 * Thin HTTP client for the JAW Hub agent API (`/api/agent/*`).
 *
 * Every method returns a short string (or void) and never throws: on failure it
 * returns a brief factual error so the model can tell the user, instead of
 * inventing a result. The bearer token is never included in any returned text.
 */

export const REQUEST_TIMEOUT_MS = 8_000;

export const MEMORY_KINDS = ['fact', 'preference', 'decision', 'note', 'todo'] as const;
export type MemoryKind = (typeof MEMORY_KINDS)[number];

export interface MemoryRow {
  id: string;
  kind: string;
  content: string;
  created_at: string;
}

export interface HubPeer {
  id: string;
  name: string;
  type?: string;
  provider?: string;
  description?: string;
  status?: string;
}

export interface HubClientOptions {
  baseUrl: string;
  token: string;
  /** Hub conversation this session belongs to. Null when the dispatch metadata had none. */
  conversationId: string | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

type HubResult<T> = { ok: true; data: T } | { ok: false; error: string };

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

export class HubClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;
  readonly conversationId: string | null;

  constructor(opts: HubClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, '');
    this.token = opts.token;
    this.conversationId = opts.conversationId;
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.timeoutMs = opts.timeoutMs ?? REQUEST_TIMEOUT_MS;
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: unknown,
    timeoutMs: number = this.timeoutMs,
  ): Promise<HubResult<T>> {
    try {
      const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      const text = await res.text();
      let json: unknown;
      try {
        json = text ? JSON.parse(text) : undefined;
      } catch {
        json = undefined;
      }
      if (!res.ok) {
        const detail =
          json && typeof json === 'object' && 'error' in json && typeof json.error === 'string'
            ? `: ${clip(oneLine(json.error), 160)}`
            : '';
        return { ok: false, error: `the hub returned HTTP ${res.status}${detail}` };
      }
      return { ok: true, data: json as T };
    } catch (err) {
      const name = err instanceof Error ? err.name : '';
      if (name === 'TimeoutError' || name === 'AbortError') {
        return { ok: false, error: `the hub did not respond within ${timeoutMs / 1000} seconds` };
      }
      return { ok: false, error: 'the hub could not be reached' };
    }
  }

  /** Raw memory rows, for building instructions at session start. Returns [] on any failure. */
  async fetchMemory(limit: number, timeoutMs?: number): Promise<MemoryRow[]> {
    const r = await this.request<unknown>(
      'GET',
      `/api/agent/memory?limit=${limit}`,
      undefined,
      timeoutMs,
    );
    return r.ok ? parseMemoryRows(r.data) : [];
  }

  async remember(content: string, kind: MemoryKind): Promise<string> {
    const r = await this.request<unknown>('POST', '/api/agent/memory', {
      content,
      kind,
      conversation_id: this.conversationId,
    });
    return r.ok ? `Saved ${kind} to memory.` : `Error: memory was NOT saved; ${r.error}.`;
  }

  async recall(query: string): Promise<string> {
    const r = await this.request<unknown>(
      'GET',
      `/api/agent/memory?q=${encodeURIComponent(query)}&limit=6`,
    );
    if (!r.ok) return `Error: memory lookup failed; ${r.error}.`;
    const rows = parseMemoryRows(r.data);
    if (rows.length === 0) return 'No matching memories found.';
    return `${rows.length} matching memories:\n${rows.map((row) => formatMemoryLine(row)).join('\n')}`;
  }

  async listAgents(): Promise<string> {
    const r = await this.request<{ agent?: { name?: string }; peers?: HubPeer[] }>(
      'GET',
      '/api/agent/me',
    );
    if (!r.ok) return `Error: could not list agents; ${r.error}.`;
    const peers = Array.isArray(r.data?.peers) ? r.data.peers : [];
    if (peers.length === 0) return 'No other agents are registered.';
    const lines = peers.map((p) => {
      const meta = [p.type, p.provider, p.status].filter(Boolean).join(', ');
      const desc = p.description ? ` - ${clip(oneLine(p.description), 120)}` : '';
      return `- ${p.name}${meta ? ` (${meta})` : ''}${desc}`;
    });
    return `${peers.length} agents available to delegate to:\n${lines.join('\n')}`;
  }

  async delegate(to: string, task: string): Promise<string> {
    const r = await this.request<{
      to?: string;
      id?: string;
      status?: string;
      scheduled_for?: string | null;
    }>('POST', '/api/agent/delegate', { to, task, conversation_id: this.conversationId });
    if (!r.ok) return `Error: the task was NOT delegated; ${r.error}.`;
    const d = r.data ?? {};
    const target = d.to ?? to;
    if (d.status === 'rate_limited') {
      const when = d.scheduled_for ? ` It is scheduled for ${d.scheduled_for}.` : '';
      return `Rate limited: ${target} is busy, so the task is queued for later and has NOT run yet.${when}`;
    }
    return `Delegated to ${target}. Status: ${d.status ?? 'unknown'}.${d.id ? ` Task id ${d.id}.` : ''}`;
  }

  /** Record a tool call (start or finish). Never throws; resolves to an error string on failure. */
  async sendToolCall(call: ToolCallReport): Promise<string | null> {
    const r = await this.request<unknown>('POST', '/api/agent/tool-calls', {
      ...call,
      conversation_id: this.conversationId,
    });
    return r.ok ? null : r.error;
  }

  /** Mirror one transcript line to the hub. Never throws; resolves to an error string on failure. */
  async sendTranscript(role: 'user' | 'assistant', text: string): Promise<string | null> {
    const r = await this.request<unknown>('POST', '/api/agent/transcript', {
      conversation_id: this.conversationId,
      role,
      text,
    });
    return r.ok ? null : r.error;
  }
}

export interface ToolCallReport {
  call_id: string;
  name: string;
  args: Record<string, unknown>;
  status: 'running' | 'done' | 'error';
  output?: string;
}

function parseMemoryRows(data: unknown): MemoryRow[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (r): r is MemoryRow =>
      !!r && typeof r === 'object' && typeof r.content === 'string' && r.content.length > 0,
  );
}

function shortDate(iso: unknown): string {
  if (typeof iso !== 'string') return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export function formatMemoryLine(row: MemoryRow, max = 240): string {
  const date = shortDate(row.created_at);
  return `- [${row.kind}${date ? ` ${date}` : ''}] ${clip(oneLine(row.content), max)}`;
}

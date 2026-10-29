import { describe, expect, it, vi } from 'vitest';
import { HubClient } from './hub.ts';

const BASE = 'https://jaw.example.com';
const TOKEN = 'secret-token-123';
const CONV = '11111111-2222-3333-4444-555555555555';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeHub(fetchImpl: typeof fetch, conversationId: string | null = CONV) {
  return new HubClient({
    baseUrl: `${BASE}/`,
    token: TOKEN,
    conversationId,
    fetchImpl,
    timeoutMs: 50,
  });
}

describe('HubClient requests', () => {
  it('sends bearer auth and JSON content type, and posts remember body', async () => {
    const fetchMock = vi.fn(async () => json({ id: 'm1' }, 201));
    const out = await makeHub(fetchMock as unknown as typeof fetch).remember(
      'Jesse prefers mornings',
      'preference',
    );

    expect(out).toBe('Saved preference to memory.');
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/api/agent/memory`);
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(init.body as string)).toEqual({
      content: 'Jesse prefers mornings',
      kind: 'preference',
      conversation_id: CONV,
    });
  });

  it('formats recalled memories compactly and url-encodes the query', async () => {
    const fetchMock = vi.fn(async () =>
      json([
        {
          id: 'a',
          kind: 'fact',
          content: 'Jesse lives in\nAustin',
          created_at: '2026-10-01T12:00:00Z',
        },
        { id: 'b', kind: 'todo', content: 'Renew passport', created_at: '2026-10-02T09:30:00Z' },
      ]),
    );
    const out = await makeHub(fetchMock as unknown as typeof fetch).recall('where & home');

    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url).toBe(`${BASE}/api/agent/memory?q=where%20%26%20home&limit=6`);
    expect(out).toBe(
      [
        '2 matching memories:',
        '- [fact 2026-10-01] Jesse lives in Austin',
        '- [todo 2026-10-02] Renew passport',
      ].join('\n'),
    );
  });

  it('reports an empty recall result plainly', async () => {
    const hub = makeHub((async () => json([])) as unknown as typeof fetch);
    expect(await hub.recall('nothing')).toBe('No matching memories found.');
  });

  it('lists peers with type, provider, status and description', async () => {
    const hub = makeHub((async () =>
      json({
        agent: { id: 'me', name: 'JAW' },
        peers: [
          {
            id: 'p1',
            name: 'Researcher',
            type: 'worker',
            provider: 'claude',
            description: 'Finds things',
            status: 'idle',
          },
        ],
      })) as unknown as typeof fetch);
    expect(await hub.listAgents()).toBe(
      '1 agents available to delegate to:\n- Researcher (worker, claude, idle) - Finds things',
    );
  });
});

describe('HubClient.delegate', () => {
  it('posts to, task and conversation_id and reports the accepted status', async () => {
    const fetchMock = vi.fn(async () =>
      json({ to: 'Researcher', id: 'task-9', status: 'queued_now', scheduled_for: null }),
    );
    const out = await makeHub(fetchMock as unknown as typeof fetch).delegate(
      'Researcher',
      'Summarise the inbox',
    );

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/api/agent/delegate`);
    expect(JSON.parse(init.body as string)).toEqual({
      to: 'Researcher',
      task: 'Summarise the inbox',
      conversation_id: CONV,
    });
    expect(out).toBe('Delegated to Researcher. Status: queued_now. Task id task-9.');
  });

  it('says a rate_limited task is queued for later and has not run', async () => {
    const hub = makeHub((async () =>
      json({
        to: 'Researcher',
        id: 'task-10',
        status: 'rate_limited',
        scheduled_for: '2026-10-25T08:00:00Z',
      })) as unknown as typeof fetch);
    const out = await hub.delegate('Researcher', 'x');
    expect(out).toContain('Rate limited');
    expect(out).toContain('queued for later');
    expect(out).toContain('has NOT run yet');
    expect(out).toContain('2026-10-25T08:00:00Z');
    expect(out).not.toContain('Delegated to');
  });
});

describe('HubClient error paths', () => {
  it('returns a short factual error on HTTP failure and never leaks the token', async () => {
    const hub = makeHub((async () =>
      json({ error: 'unknown agent "Nope"' }, 404)) as unknown as typeof fetch);
    const out = await hub.delegate('Nope', 'x');
    expect(out).toBe(
      'Error: the task was NOT delegated; the hub returned HTTP 404: unknown agent "Nope".',
    );
    expect(out).not.toContain(TOKEN);
  });

  it('returns a timeout error when the hub is too slow', async () => {
    const slow = ((_url: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => reject(init.signal?.reason));
      })) as unknown as typeof fetch;
    const out = await makeHub(slow).remember('x', 'note');
    expect(out).toMatch(/^Error: memory was NOT saved; the hub did not respond within/);
  });

  it('returns an unreachable error when fetch throws', async () => {
    const hub = makeHub((async () => {
      throw new TypeError('fetch failed');
    }) as unknown as typeof fetch);
    expect(await hub.recall('x')).toBe(
      'Error: memory lookup failed; the hub could not be reached.',
    );
    expect(await hub.listAgents()).toBe(
      'Error: could not list agents; the hub could not be reached.',
    );
  });

  it('fetchMemory and sendTranscript never throw', async () => {
    const hub = makeHub((async () => {
      throw new Error('boom');
    }) as unknown as typeof fetch);
    expect(await hub.fetchMemory(6)).toEqual([]);
    expect(await hub.sendTranscript('user', 'hello')).toBe('the hub could not be reached');
  });

  it('posts transcript lines with the expected body', async () => {
    const fetchMock = vi.fn(async () => json({ ok: true }));
    const err = await makeHub(fetchMock as unknown as typeof fetch).sendTranscript(
      'assistant',
      'Hi Jesse.',
    );
    expect(err).toBeNull();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/api/agent/transcript`);
    expect(JSON.parse(init.body as string)).toEqual({
      conversation_id: CONV,
      role: 'assistant',
      text: 'Hi Jesse.',
    });
  });
});

describe('HubClient.startConversation', () => {
  it('opens a conversation for a call without one and uses it afterwards', async () => {
    const fetchMock = vi.fn(async () => json({ conversation_id: CONV }, 201));
    const hub = makeHub(fetchMock as unknown as typeof fetch, null);

    expect(await hub.startConversation('call-_+15550001111_abc', 'Phone call')).toBe(CONV);
    expect(hub.conversationId).toBe(CONV);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/api/agent/conversations`);
    expect(JSON.parse(init.body as string)).toEqual({
      room: 'call-_+15550001111_abc',
      title: 'Phone call',
    });
  });

  it('returns null and keeps no conversation when the hub fails', async () => {
    const fetchMock = vi.fn(async () => json({ error: 'nope' }, 500));
    const hub = makeHub(fetchMock as unknown as typeof fetch, null);
    expect(await hub.startConversation('call-x', 'Phone call')).toBeNull();
    expect(hub.conversationId).toBeNull();
  });
});

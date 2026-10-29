import { describe, expect, it, vi } from 'vitest';
import { buildInstructions, createTools, formatMemoryBlock, instrument } from './agent.ts';
import { ConfigError, loadConfig, parseConversationId } from './config.ts';
import { HubClient } from './hub.ts';

const rows = [
  { id: '1', kind: 'fact', content: 'Jesse runs JAW Hub', created_at: '2026-10-01T00:00:00Z' },
  { id: '2', kind: 'todo', content: 'Call the accountant', created_at: '2026-10-02T00:00:00Z' },
];

describe('instructions', () => {
  it('includes recalled memory and the persona rules', () => {
    const text = buildInstructions(rows);
    expect(text).toContain('You are JAW');
    expect(text).toContain('- [fact 2026-10-01] Jesse runs JAW Hub');
    expect(text).toContain('- [todo 2026-10-02] Call the accountant');
    expect(text).toContain('wait for him to agree');
  });

  it('handles empty memory and caps the memory block size', () => {
    expect(formatMemoryBlock([])).toBe('No saved memories yet.');
    const many = Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      kind: 'note',
      content: 'x'.repeat(200),
      created_at: '2026-10-01T00:00:00Z',
    }));
    expect(formatMemoryBlock(many).length).toBeLessThanOrEqual(1600);
  });
});

describe('tools', () => {
  it('registers the hub tools', () => {
    const hub = new HubClient({ baseUrl: 'https://x.test', token: 't', conversationId: null });
    const names = createTools(hub).map((t) => t.id);
    expect(names).toEqual([
      'remember',
      'recall',
      'list_agents',
      'show_canvas',
      'list_projects',
      'add_project',
      'list_tasks',
      'add_task',
      'update_task',
      'update_instructions',
      'delegate',
    ]);
  });

  it('project and task tools run through the hub tools endpoint', async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ output: 'Added to Inbox: x.' })),
    );
    const hub = new HubClient({
      baseUrl: 'https://x.test',
      token: 't',
      conversationId: null,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(await hub.runTool('add_task', { title: 'x' })).toBe('Added to Inbox: x.');
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://x.test/api/agent/tools/add_task');
    expect(JSON.parse(init.body as string)).toEqual({
      args: { title: 'x' },
      conversation_id: null,
    });
  });

  it("uses Jesse's instructions from the hub instead of the built-in persona", () => {
    const text = buildInstructions([], { instructions: 'Call me J.', briefing: 'Project: JAW' });
    expect(text).toContain('Call me J.');
    expect(text).toContain('Project: JAW');
    expect(text).not.toContain('You are JAW, the personal voice assistant');
  });

  it('falls back to the built-in persona when the hub sent no instructions', () => {
    expect(buildInstructions([])).toContain('You are JAW, the personal voice assistant');
  });

  it('delegate tool forwards to the hub and returns its factual result', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ to: 'A', id: '1', status: 'rate_limited', scheduled_for: null }),
        ),
    );
    const hub = new HubClient({
      baseUrl: 'https://x.test',
      token: 't',
      conversationId: 'c1',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    const delegate = createTools(hub).find((t) => t.id === 'delegate')!;
    // unverified: execute's second argument (tool context) is unused by these tools.
    const out = await (
      delegate as unknown as {
        execute: (args: unknown, ctx: unknown) => Promise<string>;
      }
    ).execute({ to: 'A', task: 'do it' }, {});
    expect(out).toContain('queued for later');
  });
});

describe('config', () => {
  const good = {
    LIVEKIT_URL: 'wss://p.livekit.cloud',
    LIVEKIT_API_KEY: 'k',
    LIVEKIT_API_SECRET: 's',
    JAW_API_URL: 'https://jaw.vercel.app/',
    JAW_AGENT_TOKEN: 'tok',
  };

  it('accepts a complete env, trims the trailing slash and applies model defaults', () => {
    const c = loadConfig(good);
    expect(c.jawApiUrl).toBe('https://jaw.vercel.app');
    expect(c.models.stt).toBe('deepgram/nova-3');
    expect(c.models.llm).toBe('google/gemini-3.8-flash');
    expect(c.models.tts).toBe('cartesia/sonic-3');
  });

  it('lists every missing or invalid variable in one error', () => {
    expect(() => loadConfig({ JAW_API_URL: 'not a url' })).toThrowError(ConfigError);
    try {
      loadConfig({ JAW_API_URL: 'not a url' });
    } catch (e) {
      const msg = (e as Error).message;
      for (const name of [
        'LIVEKIT_URL',
        'LIVEKIT_API_KEY',
        'LIVEKIT_API_SECRET',
        'JAW_AGENT_TOKEN',
      ]) {
        expect(msg).toContain(name);
      }
      expect(msg).toContain('JAW_API_URL must be an absolute http(s) URL');
    }
  });

  it('parses the dispatch metadata conversation id defensively', () => {
    expect(parseConversationId('{"conversation_id":"abc"}')).toBe('abc');
    expect(parseConversationId('')).toBeNull();
    expect(parseConversationId('not json')).toBeNull();
    expect(parseConversationId('{"conversation_id":42}')).toBeNull();
  });
});

describe('instrument', () => {
  it('reports a call when it starts and when it finishes', async () => {
    const seen: string[] = [];
    const run = instrument(
      'recall',
      async ({ query }: { query: string }) => `found ${query}`,
      (c) => seen.push(`${c.call_id}:${c.status}:${c.output ?? ''}`),
    );
    await expect(run({ query: 'release' }, { toolCallId: 'c1' })).resolves.toBe('found release');
    expect(seen).toEqual(['c1:running:', 'c1:done:found release']);
  });

  it('reports failures and rethrows', async () => {
    const seen: string[] = [];
    const run = instrument(
      'remember',
      async () => {
        throw new Error('hub down');
      },
      (c) => seen.push(`${c.status}:${c.output ?? ''}`),
    );
    await expect(run({}, { toolCallId: 'c2' })).rejects.toThrow('hub down');
    expect(seen).toEqual(['running:', 'error:hub down']);
  });
});

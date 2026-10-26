import { describe, expect, it, vi } from 'vitest';
import { buildInstructions, createTools, formatMemoryBlock } from './agent.ts';
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
  it('registers the four hub tools', () => {
    const hub = new HubClient({ baseUrl: 'https://x.test', token: 't', conversationId: null });
    const names = createTools(hub).map((t) => t.id);
    expect(names).toEqual(['remember', 'recall', 'list_agents', 'delegate']);
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

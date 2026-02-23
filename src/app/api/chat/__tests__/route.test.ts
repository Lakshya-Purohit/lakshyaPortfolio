import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// We need to mock the environment and fetch for testing
let POST: (request: NextRequest) => Promise<Response>;

// Dynamic import to isolate module state between describe blocks
async function importRoute() {
  // Reset module cache to get a fresh rate limiter on each test suite
  vi.resetModules();
  const mod = await import('../route');
  POST = mod.POST;
}

function createRequest(body: Record<string, unknown>, ip = '127.0.0.1'): NextRequest {
  const req = new NextRequest('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
  return req;
}

describe('POST /api/chat', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await importRoute();
  });

  it('returns 400 for missing message', async () => {
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it('returns 400 for non-string message', async () => {
    const req = createRequest({ message: 123 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for empty message after sanitization', async () => {
    const req = createRequest({ message: '   ' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns fallback reply when no API key is set', async () => {
    // Ensure no API key
    delete process.env.GEMINI_API_KEY;

    const req = createRequest({ message: 'Hello' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain('AI is not configured');
  });

  it('returns successful reply from Gemini API', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          candidates: [
            {
              content: {
                parts: [{ text: 'Lakshya is a great developer!' }],
              },
            },
          ],
        }),
    });

    const req = createRequest({ message: 'Tell me about Lakshya' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toBe('Lakshya is a great developer!');
  });

  it('handles Gemini API error gracefully', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Internal server error' }),
    });

    const req = createRequest({ message: 'Test error' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain("having trouble connecting");
  });

  it('handles empty candidates from Gemini', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ candidates: [] }),
    });

    const req = createRequest({ message: 'empty' });
    const res = await POST(req);
    const data = await res.json();
    expect(data.reply).toContain("couldn't generate");
  });

  it('truncates oversized messages to 500 chars', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    let capturedBody = '';
    global.fetch = vi.fn().mockImplementation((_url: string, opts: RequestInit) => {
      capturedBody = opts.body as string;
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            candidates: [
              { content: { parts: [{ text: 'OK' }] } },
            ],
          }),
      });
    });

    const longMessage = 'A'.repeat(1000);
    const req = createRequest({ message: longMessage });
    await POST(req);

    const parsed = JSON.parse(capturedBody);
    // The last message (user's actual message) should be truncated
    const lastContent = parsed.contents[parsed.contents.length - 1];
    expect(lastContent.parts[0].text.length).toBeLessThanOrEqual(500);
  });

  it('strips HTML tags from messages', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    let capturedBody = '';
    global.fetch = vi.fn().mockImplementation((_url: string, opts: RequestInit) => {
      capturedBody = opts.body as string;
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            candidates: [
              { content: { parts: [{ text: 'OK' }] } },
            ],
          }),
      });
    });

    const req = createRequest({ message: 'Hello <script>alert("xss")</script> world' });
    await POST(req);

    const parsed = JSON.parse(capturedBody);
    const lastContent = parsed.contents[parsed.contents.length - 1];
    expect(lastContent.parts[0].text).not.toContain('<script>');
    expect(lastContent.parts[0].text).toContain('Hello');
    expect(lastContent.parts[0].text).toContain('world');
  });

  it('validates and sanitizes history array', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    let capturedBody = '';
    global.fetch = vi.fn().mockImplementation((_url: string, opts: RequestInit) => {
      capturedBody = opts.body as string;
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            candidates: [
              { content: { parts: [{ text: 'OK' }] } },
            ],
          }),
      });
    });

    // Send invalid history items mixed with valid ones
    const req = createRequest({
      message: 'test',
      history: [
        { role: 'user', text: 'valid message' },
        { role: 'invalid_role', text: 'bad role' },
        'not an object',
        42,
        null,
        { role: 'assistant', text: 'valid reply' },
      ],
    });

    await POST(req);

    const parsed = JSON.parse(capturedBody);
    // Should have: context (user), context reply (model), 2 valid history items, current message
    // Total: 5 entries
    expect(parsed.contents.length).toBe(5);
  });

  it('rate limits excessive requests from same IP', async () => {
    delete process.env.GEMINI_API_KEY;

    const responses: Response[] = [];

    for (let i = 0; i < 12; i++) {
      const req = createRequest({ message: `msg ${i}` }, '10.0.0.99');
      const res = await POST(req);
      responses.push(res);
    }

    // First 10 should succeed (200), 11th and 12th should be rate limited (429)
    const successCount = responses.filter((r) => r.status === 200).length;
    const rateLimitedCount = responses.filter((r) => r.status === 429).length;

    expect(successCount).toBe(10);
    expect(rateLimitedCount).toBe(2);
  });

  it('handles malformed JSON body', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.50',
      },
      body: 'not valid json {{{',
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

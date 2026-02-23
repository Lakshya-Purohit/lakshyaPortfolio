import { NextRequest, NextResponse } from 'next/server';

// ── Rate Limiter ──
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window per IP

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

// Cleanup stale entries every 5 minutes to prevent memory leaks
let cleanupInterval: ReturnType<typeof setInterval> | null = null;
if (typeof setInterval !== 'undefined' && !cleanupInterval) {
  cleanupInterval = setInterval(cleanupRateLimitMap, 5 * 60_000);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Simple LRU Cache ──
const MAX_CACHE_SIZE = 50;
const CACHE_TTL_MS = 5 * 60_000; // 5 min

interface CacheEntry {
  reply: string;
  timestamp: number;
}

const replyCache = new Map<string, CacheEntry>();

function getCachedReply(key: string): string | null {
  const entry = replyCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    replyCache.delete(key);
    return null;
  }
  return entry.reply;
}

function setCachedReply(key: string, reply: string) {
  // Evict oldest if at capacity
  if (replyCache.size >= MAX_CACHE_SIZE) {
    const firstKey = replyCache.keys().next().value;
    if (firstKey) replyCache.delete(firstKey);
  }
  replyCache.set(key, { reply, timestamp: Date.now() });
}

// ── Input Validation ──
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_ITEMS = 20;
const GEMINI_TIMEOUT_MS = 10_000;

function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // strip control chars
    .trim();
}

function validateHistory(
  history: unknown
): { role: string; text: string }[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (item): item is { role: string; text: string } =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).role === 'string' &&
        typeof (item as Record<string, unknown>).text === 'string' &&
        ['user', 'assistant'].includes((item as Record<string, string>).role)
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item.role,
      text: sanitizeText(item.text).slice(0, MAX_MESSAGE_LENGTH),
    }));
}

// ── Context ──
const LAKSHYA_CONTEXT = `You are an AI assistant embedded on Lakshya Purohit's personal portfolio website. You must answer all questions about Lakshya warmly, concisely (2-4 sentences), and professionally. Here is Lakshya's full profile:

**Personal Info:**
- Name: Lakshya Purohit
- Role: Software Developer & System Architect
- Location: Jaipur, Rajasthan, India
- Email: lakshya.purohit.2105@gmail.com
- Education: B.Tech in Computer Science

**Core Skills:**
ASP.NET Core, C#, Angular, TypeScript, Node.js, Python, Flask, WebRTC, Mediasoup, PostgreSQL, SQL Server, Docker, Microservices, REST APIs, SignalR, OpenCV, Tesseract OCR, React, Next.js, JavaScript, HTML/CSS, Git

**Work Experience:**
1. Software Developer (2024–Present): Building enterprise solutions with ASP.NET Core, Angular, and microservices architecture. Led Video e-KYC platform development.
2. Junior Developer (2023–2024): Developed OCR Invoice Engine, backend APIs, and automation tools with Python and Flask.

**Key Projects:**
1. Schema Drift Tool — Detects schema drift between database environments. Visual diffing engine, automated safe migration workflows. Live at: db-version-control.onrender.com
2. Video e-KYC Platform — Secure peer-to-peer video verification using WebRTC + Mediasoup (SFU). Angular frontend + Node.js backend. Face detection and encrypted media channels for banking compliance.
3. OCR Invoice Engine — Automated OCR system using OpenCV preprocessing (deskewing, noise removal) + Tesseract. Improved accuracy by 40%. Generates structured Excel reports.
4. Warehouse Management System — Mission-critical WMS with Printing API and Invoicing using ASP.NET Core microservices. Reduced manual errors by 30%.

**How Lakshya Uses AI:**
- Computer Vision & OCR: Built intelligent document processing with OpenCV + Tesseract, AI-driven preprocessing boosted accuracy by 40%.
- Real-time Video Intelligence: Integrated face detection into Video e-KYC for automated identity verification.
- AI-Assisted Development: Uses LLMs for code review, documentation generation, and architecture planning.
- Smart Automation: ML-based anomaly detection in database schemas and infrastructure scaling.

**This Portfolio Website:**
Built with Next.js 15, GSAP, Framer Motion, custom canvas cursor, dark/light theme toggle, Lenis smooth scrolling.

Keep answers SHORT (2-4 sentences). Be friendly. If asked something outside Lakshya's context, politely redirect.`;

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limiting ──
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { reply: "You're sending too many messages. Please wait a moment before trying again! ⏳" },
        { status: 429 }
      );
    }

    // ── Parse & Validate ──
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const cleanMessage = sanitizeText(message).slice(0, MAX_MESSAGE_LENGTH);
    if (!cleanMessage) {
      return NextResponse.json({ error: 'Message is empty after sanitization' }, { status: 400 });
    }

    const validHistory = validateHistory(history);

    // ── API Key Check ──
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "⚠️ AI is not configured yet. The site owner needs to add a Gemini API key to enable real AI responses. In the meantime, feel free to explore the portfolio!",
      });
    }

    // ── Cache Check ──
    const cacheKey = cleanMessage.toLowerCase();
    const cached = getCachedReply(cacheKey);
    if (cached && validHistory.length === 0) {
      return NextResponse.json({ reply: cached });
    }

    // ── Build Conversation ──
    const contents = [
      { role: 'user', parts: [{ text: LAKSHYA_CONTEXT }] },
      {
        role: 'model',
        parts: [{ text: "Got it! I'm Lakshya's AI assistant. I'll answer questions about his work, projects, skills, and experience concisely and professionally. How can I help?" }],
      },
      ...validHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text: cleanMessage }] },
    ];

    // ── Call Gemini with Timeout ──
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          },
        }),
        signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('Gemini API Error Status:', res.status);
      console.error('Gemini API Error Detail:', JSON.stringify(errData, null, 2));
      return NextResponse.json({
        reply: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
      });
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({
        reply: "I couldn't generate a response. Please try rephrasing your question!",
      });
    }

    // ── Cache the reply ──
    setCachedReply(cacheKey, reply);

    return NextResponse.json({ reply });
  } catch (err) {
    // Handle timeout specifically
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      console.error('Gemini API timeout');
      return NextResponse.json(
        { reply: "The AI took too long to respond. Please try again! ⏱️" },
        { status: 504 }
      );
    }

    console.error('Chat API error:', err);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again!" },
      { status: 500 }
    );
  }
}

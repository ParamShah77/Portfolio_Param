import NEXUS_SYSTEM_PROMPT from './_knowledge.js';

/*
 * Serverless proxy for the NEXUS chat widget.
 *
 * The client sends only { messages: [{ role, content }] }. Everything that
 * costs money or controls the model — system prompt, model name, temperature,
 * token ceiling — is decided here, so a caller can't repurpose this endpoint
 * as a free general-purpose Gemini key.
 */

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Request shape limits
const MAX_MESSAGES = 12; // most recent turns kept for context
const MAX_CHARS_PER_MESSAGE = 1000;
const MAX_TOTAL_CHARS = 6000;
const MAX_OUTPUT_TOKENS = 512;
const UPSTREAM_TIMEOUT_MS = 20000;

// Rate limiting (per IP, sliding window).
// Best-effort only: serverless instances are ephemeral and there may be several
// running at once, so this throttles casual abuse rather than a determined
// attacker. Move to Vercel KV / Upstash if this ever needs to be authoritative.
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 60_000;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);

  // Opportunistic cleanup so the map can't grow without bound
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX;
}

function allowedOrigins() {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);
  }
  return [
    'https://paramshah77.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
  ];
}

function isAllowedOrigin(origin) {
  if (!origin) return true; // same-origin fetches often omit Origin
  const allowed = allowedOrigins();
  if (allowed.includes(origin)) return true;
  // Accept Vercel preview deployments of this project
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
}

/** Coerce the client payload into a validated Gemini `contents` array. */
function buildContents(body) {
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Expected a non-empty "messages" array.' };
  }

  const recent = messages.slice(-MAX_MESSAGES);
  const contents = [];
  let totalChars = 0;

  for (const msg of recent) {
    if (typeof msg?.content !== 'string') {
      return { error: 'Each message needs a string "content".' };
    }
    const text = msg.content.trim().slice(0, MAX_CHARS_PER_MESSAGE);
    if (!text) continue;

    totalChars += text.length;
    if (totalChars > MAX_TOTAL_CHARS) {
      return { error: 'Conversation too long. Start a new chat.' };
    }

    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text }],
    });
  }

  if (contents.length === 0) return { error: 'No usable message content.' };
  if (contents[contents.length - 1].role !== 'user') {
    return { error: 'The last message must come from the user.' };
  }

  return { contents };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(req.headers.origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'Chat is not configured right now.' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Too many messages. Give it a minute.' });
  }

  const { contents, error } = buildContents(req.body);
  if (error) return res.status(400).json({ error });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey, // header, not a query param, so it stays out of logs
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: NEXUS_SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
      signal: controller.signal,
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      // Log the detail, return something generic: upstream errors can echo
      // back request contents and quota information.
      console.error('Gemini error', upstream.status, JSON.stringify(data));
      const status = upstream.status === 429 || upstream.status === 503 ? upstream.status : 502;
      return res.status(status).json({ error: 'NEXUS is having a moment. Try again shortly.' });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      return res.status(502).json({ error: "I didn't get a response. Try again?" });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'NEXUS took too long to respond. Try again.' });
    }
    console.error('Chat proxy failure', err);
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  } finally {
    clearTimeout(timeout);
  }
}

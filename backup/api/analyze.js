// api/analyze.js
//
// Server-side proxy for FailureTwin's agent calls, using Google's Gemini API.
// The Gemini API key lives ONLY here, as the GEMINI_API_KEY environment
// variable — it is never sent to or stored in the browser.
//
// The frontend calls this endpoint (same-origin, POST /api/analyze) with
// { systemPrompt, ideaText } and expects back { content: [{ type: 'text',
// text }] } — the same envelope shape Anthropic's API uses. Gemini's native
// response shape is different, so this file reshapes it before returning,
// which means index.html needs zero changes regardless of which model
// provider is actually behind this endpoint.

const MAX_IDEA_LENGTH = 4000;
const MAX_PROMPT_LENGTH = 8000;

// gemini-2.5-flash is free-tier eligible and stable (not a preview alias).
// Override with the GEMINI_MODEL env var if you want a different model
// without touching code.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Set it in your hosting provider\u2019s environment variables and redeploy.',
    });
    return;
  }

  const body = req.body || {};
  const { systemPrompt, ideaText } = body;

  if (typeof systemPrompt !== 'string' || typeof ideaText !== 'string' || !systemPrompt.trim() || !ideaText.trim()) {
    res.status(400).json({ error: 'Request must include non-empty systemPrompt and ideaText strings.' });
    return;
  }
  if (ideaText.length > MAX_IDEA_LENGTH) {
    res.status(400).json({ error: `ideaText is too long (max ${MAX_IDEA_LENGTH} characters).` });
    return;
  }
  if (systemPrompt.length > MAX_PROMPT_LENGTH) {
    res.status(400).json({ error: `systemPrompt is too long (max ${MAX_PROMPT_LENGTH} characters).` });
    return;
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: ideaText }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const message = (data && data.error && data.error.message) || `Gemini API error (${geminiRes.status})`;
      res.status(geminiRes.status).json({ error: message });
      return;
    }

    const candidate = data.candidates && data.candidates[0];
    const text = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]
      ? candidate.content.parts[0].text
      : '';

    if (!text) {
      const reason = (candidate && candidate.finishReason) || 'unknown';
      res.status(502).json({ error: `Gemini returned no text (finishReason: ${reason}).` });
      return;
    }

    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('analyze proxy error:', err);
    res.status(500).json({ error: (err && err.message) || 'Unexpected server error.' });
  }
};

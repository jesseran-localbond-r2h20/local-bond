// netlify/functions/match.js
// -----------------------------------------------------------------------------
// Local Bond — AI search fallback.
//
// This runs ONLY when the fast, free, in-browser keyword match finds nothing.
// The Anthropic API key is read from the server environment here, so it is
// NEVER shipped to the browser. That is the whole reason this file exists.
//
// The browser calls it like:
//   fetch("/.netlify/functions/match", {
//     method: "POST",
//     body: JSON.stringify({ query, candidates })   // candidates = [{id, name}, ...]
//   })
// and gets back { productId: "P004" }  (or { productId: null } if no match).
// -----------------------------------------------------------------------------

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",            // same-origin in production
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Use POST" }) };
  }

  // The key lives in Netlify → Site settings → Environment variables (never in git).
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not set on the server." }) };
  }

  let query, candidates;
  try {
    ({ query, candidates } = JSON.parse(event.body || "{}"));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }
  if (!query || !Array.isArray(candidates) || candidates.length === 0) {
    return { statusCode: 400, headers,
      body: JSON.stringify({ error: "Send { query, candidates: [{id, name}] }" }) };
  }

  const list = candidates.map((c) => `${c.id}: ${c.name}`).join("\n");
  const prompt =
    `A shopper typed: "${query}"\n\n` +
    `Here is the full product catalog:\n${list}\n\n` +
    `Reply with ONLY the id of the single best match (for example: P004). ` +
    `If nothing is a reasonable match, reply with exactly NONE. No other text.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Haiku is the cheapest/fastest tier — ideal for a matcher.
        // Check docs.claude.com for the current model name if this ever errors.
        model: "claude-haiku-4-5",
        max_tokens: 10,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { statusCode: 502, headers,
        body: JSON.stringify({ error: "Anthropic API error", detail }) };
    }

    const data = await res.json();
    const text = (data.content?.[0]?.text || "").trim();
    const productId = /^P\d+$/i.test(text) ? text.toUpperCase() : null;
    return { statusCode: 200, headers, body: JSON.stringify({ productId }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(err) }) };
  }
};

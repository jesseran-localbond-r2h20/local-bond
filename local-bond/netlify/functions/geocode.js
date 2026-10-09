// netlify/functions/geocode.js
// -----------------------------------------------------------------------------
// Local Bond — address lookup.
//
// Browsers aren't allowed to call the US Census geocoder directly (it doesn't
// send the permission header browsers require), so the page asks THIS function,
// and this function — running on Netlify's servers, where that rule doesn't
// apply — asks the Census geocoder and passes back just a point.
//
//   GET /.netlify/functions/geocode?address=123+Main+St+Petaluma+CA
//   -> { "found": true,  "lat": 38.23, "lng": -122.64 }
//   -> { "found": false }                      (no match)
//   -> { "error": "..." } with status 4xx/5xx  (bad request / lookup failed)
//
// Privacy: the address is used for this one lookup only. Nothing is stored or
// logged here, and the response is marked uncacheable. No CORS header is sent,
// so only pages on our own site can read the answer.
// -----------------------------------------------------------------------------

const CENSUS_URL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";

function reply(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return reply(405, { error: "Use GET" });

  const address = ((event.queryStringParameters || {}).address || "").trim();
  if (address.length < 5) return reply(400, { error: "Enter a street address." });
  if (address.length > 200) return reply(400, { error: "That address is too long." });

  const url = CENSUS_URL + "?address=" + encodeURIComponent(address)
    + "&benchmark=Public_AR_Current&format=json";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return reply(502, { error: "The address lookup service is unavailable right now." });
    const json = await res.json();
    const match = json && json.result && json.result.addressMatches && json.result.addressMatches[0];
    if (!match || !match.coordinates) return reply(200, { found: false });
    return reply(200, { found: true, lat: match.coordinates.y, lng: match.coordinates.x });
  } catch (err) {
    return reply(502, { error: "The address lookup service is unavailable right now." });
  } finally {
    clearTimeout(timer);
  }
};

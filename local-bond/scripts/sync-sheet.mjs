// scripts/sync-sheet.mjs
// -----------------------------------------------------------------------------
// OPTIONAL — pull your published Google Sheet into the repo as JSON.
//   Run:  npm run sync
//
// This fetches the "Businesses" tab (published to the web as CSV) and writes
// public/data/businesses.json.
//
// Note: today the app reads public/data/seed.json, which also holds the
// product -> vendor mapping. Treat this script as the starting point for
// regenerating seed.json automatically once your catalog grows. For now it's a
// concrete, working example of how live data flows from your sheet into the repo.
// -----------------------------------------------------------------------------

import { writeFile, mkdir } from "node:fs/promises";

// File → Share → Publish to web → (Businesses tab) → CSV → paste the link here.
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0CWJOJ6JbTl51RQPL6f4RC3o3q32CPoadjAxoxt7GmoUAz7YSmsJc8FMHRTCc03GAtBxfpy1l8pFm/pub?gid=1417391917&single=true&output=csv";

// Minimal CSV parser that respects quoted fields (needed — impact lines contain commas).
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const res = await fetch(CSV_URL);
if (!res.ok) {
  console.error("Fetch failed:", res.status, res.statusText);
  process.exit(1);
}

const rows = parseCSV(await res.text());
const header = rows.shift().map((h) => h.trim());
const businesses = rows
  .filter((r) => r.some((c) => c.trim() !== ""))
  .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || "").trim()])));

await mkdir("public/data", { recursive: true });
await writeFile("public/data/businesses.json", JSON.stringify(businesses, null, 2));
console.log(`Wrote public/data/businesses.json (${businesses.length} businesses).`);

# Local Bond & Common Bond — Product Documentation

*Last updated: August 2026 · Maintained by [your name]*

This is the single source of truth for what these two products are, what's built, what's next, and what's still open. It's meant to be lightweight and kept current — update it whenever something changes, rather than letting decisions live only in chat history.

Three sections:
1. **Current State** — what's actually built and working today
2. **Roadmap** — where things are headed, in rough order
3. **Backlog** — specific open items, not yet scheduled

---

## 1. Current State

### Local Bond
*Shop where you belong.*

**What it is:** A mobile-first web tool that intercepts the pre-purchase moment — when someone's about to default to Amazon — and shows them local alternatives instead, ranked by proximity and community impact.

**Who it's for:** The "disconnected but guilty" shopper — someone whose values and habits don't match, who wants an easy on-ramp to buying local without friction or lecturing.

**Status:** Working prototype, pilot-ready. Not yet live to the public.

**What's built:**
- Search app (`index.html`) — type a product, get a ranked list of local vendors with proximity, tier, and a local-impact line
- Deterministic keyword matching engine (typo-tolerant, synonym-aware) — no AI call needed for the fast path
- AI fallback function (`match.js`) — only fires when keyword search finds nothing; not yet connected to a live API key
- Seed database — 18 businesses, 16 products, across Kitchen & Home, Electronics, Pet Supplies, Sports & Outdoors, and Household & Personal Care
- Tier system — Locally Rooted / Community Present / Local Impact, ranking businesses by how much stays in Petaluma
- "Not on Amazon" highlight tag — flags vendors offering something no warehouse can (e.g. Refill Mercantile's bring-your-own-container refills)
- Why Local page — the case for buying local, with real stats and a Petaluma photo
- Our Story page — origin narrative, community-focused, no founder spotlight
- Brand system — bamboo mark, coral (#EA4B40) + cream (#FFFCEB), Overpass typeface
- Deployed to Netlify (via GitHub), custom domain not yet connected
- Pitch deck (for vendor outreach) and general overview deck, both in Overpass with real Petaluma photography

**Ranking logic (current):** proximity, then local economic impact. Explicitly **not** ranked by "values" — that's surfaced only as an optional tag, never pushed on the user.

**Revenue model:** Free for businesses and users through the pilot. Post-pilot: flat $100/year vendor fee (not tiered by revenue — see decision log below).

---

### Common Bond
*Share what you have, borrow what you need.*

**What it is:** A companion product to Local Bond — a neighbor-to-neighbor and small-business lending platform. Same visual family, distinct identity and purpose.

**Origin:** Came directly from conversations with Petaluma business owners and nonprofits (Aqus, CP, PDA) about idle shared equipment (pint jars, water refill stations) and a suggestion to build a simple lending database with a subscription model.

**Status:** Click-through prototype only. Not connected to real data — see Backlog.

**What's built:**
- Browse page (`common-bond.html`) — category-filtered list of shareable items with status badges (Available / Out — back [date])
- Item detail view — description, lender info, borrow request flow
- Borrow agreement gate — a one-line commitment checkbox before requesting (pilot-scale stand-in for a liability waiver)
- Live data pipeline — Google Form → Google Sheet → published CSV → app reads live on page load (same pattern as Local Bond's catalog). A hand-set "Status" column (Approved/Pending) is the moderation gate; "Availability" and "Back By" columns track loan state manually
- Falls back safely to sample data with an on-page notice if the live Sheet isn't reachable or hasn't been connected yet — never shows a broken/blank page
- "List something to share" now opens the real Google Form in a new tab (replaces the earlier non-functional in-app form)
- Free and paid items coexist in one list, priced per item — no separate "lanes" for community vs. business lending
- Brand differentiation — slate teal (#3D6B7A) for identity elements (wordmark, active states, accents); green retained only for shared status language ("Available" badge, "Free to borrow" tag) to stay visually consistent with Local Bond
- Setup guide for the Form/Sheet wiring: `docs/COMMON_BOND_SETUP.md`

**Target pilot scale:** Start at 20 people, grow to 100 — sized specifically to generate real feedback for improving the tool, not to be a finished product on day one.

**Revenue model:** Subscription-based (per the original community suggestion) — not yet priced. Rental fees for business-owned equipment (e.g. PDA's water stations) handled per-item, not as a separate track.

---

### Shared infrastructure
- **Hosting:** Netlify, deployed from a GitHub repo (`local-bond`)
- **Data:** Google Sheets → published CSV → JSON, read by the app (proven pattern for Local Bond; not yet applied to Common Bond)
- **AI fallback:** One serverless function (`match.js`), API key stored server-side only, fires only on a keyword-match miss
- **Design system:** Overpass typeface (free, SIL Open Font License), shared color tokens, bamboo mark as the family symbol

---

## 2. Roadmap

Rough order, not committed dates. Each phase assumes the previous one is validated before moving on.

### Phase 1 — Local Bond pilot (current)
- Get the live site in front of the Petaluma business owners already contacted
- Confirm vendors are comfortable with the category-level (not branded-SKU) product model
- Collect first real user feedback on search relevance and ranking

### Phase 2 — Local Bond hardening
- Connect a real domain (currently on the Netlify subdomain)
- Wire the AI fallback to a live API key; monitor actual usage/cost (expected to be low — fallback only fires on a miss)
- Move from the static seed file to live Google Sheet reads, so vendor edits flow through without a rebuild
- Begin post-pilot vendor conversations around the $100/year fee

### Phase 3 — Common Bond pilot
- Wire real data storage (Google Sheet, same pattern as Local Bond)
- Connect the "List something to share" form to actually persist listings
- Add the Pending/Approved moderation step
- Recruit the first 20 pilot participants (from people already expressing interest)
- Decide and implement the subscription price and payment mechanism (manual Venmo-style for pilot, per earlier decision)

### Phase 4 — Common Bond growth
- Scale from 20 → 100 participants
- Evaluate whether request/borrow coordination needs more structure (e.g. reservation collision handling) based on real usage
- Revisit whether a lightweight "damage/deposit" policy is needed

### Later / not yet scheduled
- Tiered vendor pricing for Local Bond, based on traffic delivered (not revenue) — only once real usage data exists
- Community-led geographic expansion beyond Petaluma
- Possible convergence: a unified account system if Local Bond and Common Bond usage patterns justify it

---

## 3. Backlog

Specific, unscheduled items — things we've identified but not yet committed to a phase.

### Local Bond
- [ ] Connect custom domain to Netlify
- [ ] Add real Anthropic API key and test the AI fallback live
- [ ] Switch app from embedded seed data to live Google Sheet fetch
- [ ] Reshoot the Great Petaluma Mill photo in daylight (current shot is dusk, slightly noisy)
- [ ] Decide whether to keep decks in Trebuchet-fallback safe mode or require Overpass install for all presenters
- [ ] Draft outreach message for vendor follow-up post-pilot-feedback

### Common Bond
- [ ] Create the real Google Form + Sheet and paste the two live URLs into `common-bond.html` (see `docs/COMMON_BOND_SETUP.md`)
- [ ] Decide on subscription price
- [ ] Decide on payment collection mechanism for the pilot (Venmo manual, confirmed for pilot — revisit for scale)
- [ ] Write the actual (simple, human) borrower agreement text — currently a placeholder line
- [ ] Test whether the tap-through detail-sheet request flow feels right, or whether visible contact info on the card itself is simpler
- [ ] Real photo uploads (currently category icons stand in for photos)
- [ ] Self-service "mark as returned" — currently a manual Sheet edit

### Cross-product
- [ ] Confirm whether Common Bond nav should live inside Local Bond's own navigation, or stay fully separate (current: separate, cross-linked in footers)
- [ ] Decide whether WordPress or the current static-site path (Netlify) is the long-term home for content pages

---

## Decision Log

A short record of notable calls made and why — useful for onboarding anyone new, or for future-you wondering "why did we do it this way?"

| Decision | Reasoning |
|---|---|
| PWA, not native app | Avoids Apple/Google's ~30% in-app fee and app-store approval friction; still installable to home screen |
| Flat $100/year vendor fee, not tiered by revenue | Tiering requires businesses to disclose revenue (invasive, unverifiable at this scale) and contradicts the brand's anti-extraction positioning |
| Rank by proximity + local impact only, not "values" | Users don't want values pushed on them; "Not on Amazon" stays an optional tag, not a ranking factor |
| Category-level product data, not branded SKUs | Sidesteps manufacturer authorized-dealer restrictions entirely; Local Bond isn't a marketplace and doesn't need that data |
| Common Bond is a separate product, not a Local Bond feature | Different mechanics (stateful lending vs. stateless search); same visual family for trust, distinct identity for clarity |
| Common Bond teal, Local Bond coral | Shared green stays reserved for status ("Available") across both products; teal chosen over an earlier purple draft for its civic/trust/library association, which fits a lending platform better |
| Manual Venmo-style payment for Common Bond pilot | Prove people will list and borrow before investing in real payment infrastructure |
| Overpass typeface over Transport | Same "wayfinding" logic, but free (SIL OFL) — Transport requires a paid commercial license |

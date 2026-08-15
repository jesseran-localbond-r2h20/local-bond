# Common Bond — Connecting Real Data

This is the one-time setup that turns Common Bond from a mockup into something
people can actually use: a Google Form for listing items, feeding a Google
Sheet, which the app reads live. No backend, no database — same spirit as
Local Bond's seed data.

Budget about 20 minutes the first time. You won't need to touch code.

---

## 1. Create the Google Form

Go to forms.google.com → blank form. Name it something like **"List an item
on Common Bond."**

Add these questions **in this order, with these exact titles** (the app
matches on these names, so exact wording matters):

| # | Question title | Type |
|---|---|---|
| 1 | Item Name | Short answer |
| 2 | Category | Multiple choice — options: `Tools & Equipment`, `Outdoor & Camping`, `Kitchen & Party`, `Kids & Baby`, `Sports & Recreation` |
| 3 | Condition & Notes | Paragraph |
| 4 | Lending Terms | Multiple choice — options: `Free to borrow`, `Small fee` |
| 5 | Fee Amount | Short answer (mark as **not required** — only relevant if they picked "Small fee") |
| 6 | Your Name | Short answer |
| 7 | Contact (phone or email) | Short answer |

Everything except Fee Amount should be marked required.

## 2. Send responses to a Sheet

In the Form editor, click the **Responses** tab → the green Sheets icon →
**Create a new spreadsheet**. Name it something like `Common Bond Listings`.

This creates a `Form Responses 1` tab that fills in automatically every time
someone submits.

## 3. Add three columns you control by hand

In that same sheet, add three more column headers **after** the last
form-collected column:

- **Status** — leave blank for new rows. Type `Approved` once you've glanced
  at a listing and it's good to go live. Anything else (blank, `Pending`,
  etc.) stays invisible to the public.
- **Availability** — type `Available` or `Out`. Leave blank and it defaults
  to Available.
- **Back By** — free text, e.g. `Aug 20`. Only matters when Availability is
  `Out`.

New form submissions won't fill these in automatically — that's the point.
You review, then fill them in by hand. This is your moderation and
loan-tracking system, and it costs you nothing to build.

## 4. Publish the Sheet as CSV

With the `Form Responses 1` tab open:
**File → Share → Publish to web** → under "Link," choose that specific sheet
tab → format **CSV** → **Publish**.

Copy the URL it gives you.

## 5. Get your Form's share link

Back in the Form editor, click **Send** (top right) → the link icon → copy
the URL. This is different from the CSV URL — it's the address people fill
out to submit a new item.

## 6. Paste both URLs into the code

Open `common-bond.html` and find this near the top of the `<script>` block:

```js
const CONFIG = {
  SHEET_CSV_URL: "PASTE_YOUR_PUBLISHED_SHEET_CSV_URL_HERE",
  FORM_URL: "PASTE_YOUR_GOOGLE_FORM_URL_HERE",
};
```

Replace both placeholder strings with the two URLs from steps 4 and 5. Save,
commit, push — Netlify redeploys automatically.

That's it. The "List something to share" button now opens your real form,
and anything you mark `Approved` in the Sheet shows up live on the site.

---

## How to test it

1. Fill out your own Form once, with a real item you own.
2. Open the Sheet, find your row, type `Approved` in the Status column.
3. Reload the Common Bond page — your item should appear within a few
   seconds (browsers cache aggressively; a hard refresh, Cmd+Shift+R, forces
   a fresh pull if it doesn't show right away).

## If nothing shows up

The app is built to fail safely: if the CSV URL is wrong, unreachable, or
returns nothing, it quietly falls back to the built-in sample listings and
shows a small note at the top of the page — *"Showing sample listings —
connect your Google Sheet to go live."* If you see that note after
completing the steps above, the most common cause is a typo in the pasted
URL, or forgetting to publish the *specific* response tab (not the whole
spreadsheet) as CSV.

## What this doesn't do yet

- **No photo uploads.** Every listing shows a category icon instead of a
  real photo, to keep this step simple. Real photos are a real backlog item
  (Google Forms does support file uploads, but it adds Drive-permission
  complexity worth doing as its own step later).
- **No self-service "mark as returned."** Right now you (or the lender,
  if you trust them to edit the Sheet) update the Availability and Back By
  columns by hand when something goes out or comes back. Fine at pilot
  scale; worth automating once it becomes the bottleneck.

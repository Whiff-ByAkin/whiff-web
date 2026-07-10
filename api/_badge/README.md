# Founder badge function

A Python **serverless function** that lives inside this Next.js project and mints
**one** founder badge per request. It stores the hidden code + email in the
**same MongoDB** the app uses and (once Gmail is configured) emails the badge.
It's the "digital gift" the `do-you-know-me` flow promises.

It runs **on demand** — nothing sits idle. When someone submits the form, the
Next route triggers this function once; it does its job and shuts down.

## Layout

- `api/badge.py` — the serverless entry point (Vercel serves it at `/api/badge`).
- `api/_badge/render.py` — your tuned PIL rendering, one badge on demand.
- `api/_badge/db.py` — MongoDB registry (replaces the CSV/JSON) + atomic counter.
- `api/_badge/mailer.py` — Gmail sender (dormant until you add credentials).
- `api/_badge/assets/` — the template PNG + bundled fonts.

The `_badge` folder starts with an underscore so Vercel doesn't turn the helper
modules into routes. `requirements.txt` and `vercel.json` sit at the repo root.

## What happens per request

1. `POST /api/badge {email}` arrives (from the Next `/api/match` route).
2. `db.next_founder_number()` atomically reads + increments the founder count —
   the "what was the last number" lookup, race-safe so two simultaneous
   requests can never get the same number.
3. `render.render_badge()` draws the badge for that number + a fresh hidden code.
4. `db.save_badge()` stores `{ founderNumber, hiddenCode, email, ... }`.
5. `mailer.send_badge_email()` emails it (once Gmail is set) and flags `sent`.

## Your template

Lives at `api/_badge/assets/whiff_founder_badge_template.png`. Swap the file to
change the artwork (or set `BADGE_TEMPLATE_PATH`).

## Run locally

Because this mixes a Node app and a Python function, use the Vercel CLI so both
run together (plain `next dev` won't serve the Python function):

    npm i -g vercel
    vercel dev            # Next + the badge function on http://localhost:3000

Trigger it directly:

    curl -X POST http://localhost:3000/api/badge \
      -H "Content-Type: application/json" \
      -H "X-Badge-Token: <your token>" \
      -d '{"email":"someone@example.com"}'

Preview a stored badge: `http://localhost:3000/api/badge?code=<hiddenCode>`.

## Deploy

Just deploy the project to Vercel as normal — **one** deploy covers the Next app
and this function. Vercel auto-detects `api/badge.py`, installs the root
`requirements.txt`, and bundles `api/_badge/**` via `vercel.json`.

Set these in the project's env vars (Settings → Environment Variables):

    MONGODB_URI            # already set for the app
    MONGODB_DB=olettrasocials
    BADGE_SERVICE_TOKEN    # optional shared secret
    BADGE_OUTPUT_DIR=/tmp  # Vercel's only writable dir
    GMAIL_USER             # later
    GMAIL_APP_PASSWORD     # later

No `BADGE_SERVICE_URL` needed — the Next route calls this function same-origin.

## Storage

Two collections in the `olettrasocials` database:

- `whiff_counters` — `{ _id: "founderNumber", seq }`, the running founder count.
- `whiff_founder_badges` — one doc per badge: `founderNumber`, `founderLabel`,
  `hiddenCode` (unique), `email`, `badgeFile`, `sent`, `sentAt`, `createdAt`.

## Fonts

Bundled in `assets/fonts/` and committed, so rendering is identical on your Mac
and on Vercel's Linux — **Arimo** (Arial-compatible) for the number, **Cousine**
(monospace) for the hidden code. Both OFL-licensed. Override with
`BADGE_NUMBER_FONT` / `BADGE_HIDDEN_FONT`.

## Gmail (later)

Set `GMAIL_USER` + `GMAIL_APP_PASSWORD` (a Google
[App Password](https://myaccount.google.com/apppasswords)) in the project's env
vars. Delivery turns on automatically — no code change.

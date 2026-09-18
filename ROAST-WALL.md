# Whiff’s complaint department

`/roast` is the public wall. `/roast/review` is the private review area. Notes
may be positive or negative; no note appears publicly before approval.

The composer sends a message (3–2,000 characters), an optional name (up to 30
characters), a color, and consent to public display after review. Empty names
display as Anonymous. No email address is collected. Text is rendered as text,
never HTML. Pending and hidden notes are excluded from the public API.

## Configured storage and local preview

The supplied MongoDB cluster is configured in `.env.local` using dedicated
`ROAST_MONGODB_URI` and `ROAST_MONGODB_DB=whiff_web` settings, alongside the
generated `ROAST_ADMIN_PASSWORD`. `ROAST_STORAGE=mongodb` is enabled. Submitted
notes are persisted in MongoDB and survive browser/server restarts.

For an offline local preview, set `ROAST_STORAGE=file`. That development-only
mode saves data in `.data/roasts.json`, protected by a file lock and atomic
writes. Both `.env.local` and `.data` are ignored by git. File-mode notes are
not automatically transferred to MongoDB when switching modes.

Run `npm run dev -- --port 3100`. Visit `/roast/review` and sign in with the
local password. Publish a pending note to put it on the wall; hide a published
note to take it down. Review changes do not rewrite the author's words.
Authentication uses an eight-hour signed HttpOnly, SameSite=Strict cookie;
production also sets Secure. Logging out clears the browser's cookie. Changing
the password invalidates all previously issued cookies.

Never commit the password or put it in a `NEXT_PUBLIC_` environment variable.
If the local process crashes during a write and leaves `.data/roasts.json.lock`,
stop all development servers before removing that lock file. Do not remove the
data file unless you intend to erase your local notes.

## Publishing the connected wall

Production deliberately refuses to use the local file as a shared database.
Configure the same `ROAST_MONGODB_URI`, `ROAST_MONGODB_DB`, and a production
`ROAST_ADMIN_PASSWORD` before launching the wall. The server creates dedicated
`website_roasts` and `website_roast_limits` collections and their indexes. It
does not access application-user collections. Local preview notes are not
automatically transferred to MongoDB.

Set `ROAST_IP_HEADER` only to a header your host's trusted reverse proxy
overwrites. Without it, all requests use a single conservative rate bucket.
The limits are five notes/hour and ten login attempts/15 minutes per bucket.
Rate-limit keys are HMACs; raw IP addresses are not saved. MongoDB expires
rate-limit records using a TTL index. The public API pages through approved
notes in batches of 24. No fake visitor feedback is seeded. Unattributed jokes are static editorial content, stored separately in `app/lib/roast-content.ts`.

The older unrelated `MONGODB_URI` in `.env` was preserved. The dedicated
`ROAST_MONGODB_*` settings take precedence for this feature only. Public
deployment remains future work. Missing/unavailable storage returns a retryable
error, never fake success.

## Homepage

The homepage uses a text-led hero and six example outing controls. The earlier
`public/whiff-circle.png` asset is retained but is no longer displayed.

## Checks

`npm run test:roast` exercises validation, private pending notes, publish/hide,
authorization, origin checks, rate limiting, pagination and body-size limits.
Tests use a temporary directory with random credentials and remove their own
data. They do not contact MongoDB or modify local visitor submissions.

Also run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Stop the dev
server before a production build so both processes do not write the same
Next.js build artifacts.


## Campaign and durable sharing

The wall leads with six unattributed editorial jokes. Their internal `team`
source remains separate from visitor submissions: they have no fake users,
customer labels, dates, or invented engagement counts. Community submissions
keep their actual supplied names and require approval. Editorial notes remain
usable if the community database is unavailable. The composer keeps its
consent, validation, honeypot and moderation flow.

Each note has one **Share** action. It opens native sharing wherever the browser
supports it, with the exact quote and canonical note URL. Cancelling does
nothing. Without native sharing (or if it fails), the button copies the roast
and link and confirms success. Clipboard failure reveals focused, selectable
text with a clear manual-copy label. Community shares retain the submitted
byline; editorial notes invent none.

The quote on every wall card links to `/roast/[id]`, where one generous sticky
note has the same Share action, an All roasts link, and a quiet homepage link.
Roast pages do not explain the product. The wall header has a single Add a
roast action; the composer retains its original moderation behavior.

`/roast/[id]/og` renders a 1200×630 social preview. A server-only
`?download=1` variant remains available for a 1080×1080 PNG attachment, but
there is no separate download or copy-link action in the interface. Both image
formats use a locally bundled Caveat font (OFL license alongside it), pastel
paper and the visible canonical note URL. Team slugs are stable; visitor links
use UUIDs.

Community lookups filter for `approved` in storage without persistent caching
of public pages or images. Pending, hidden and missing notes return no public
content, including downloads. Third-party social services may keep their own
old previews until they refresh; origin hiding cannot purge those copies.

The production public API was returning HTTP 503 during this redesign.
Production storage is **not fixed by this UI change**. Confirm MongoDB
connectivity, permissions, indexes and production environment settings before
promoting visitor submissions. Do not replace unavailable storage with fake
success. Local UI verification uses an isolated temporary file store.

See `ROAST-CAMPAIGN.md` for posting examples and campaign guidance. Tests cover
moderation, durable link/OG/download privacy, PNG dimensions and editorial-note
availability without storage.

## September feedback refresh

The public navigation is “The bad stuff” and the page headline is “What’s wrong with Whiff?”. Existing `/roast` routes remain stable. Approved submissions and three explicitly illustrative Whiff-written critiques share one wall. Longer previews open a full note page. Notes accept up to 2,000 characters; moderation still gates public visibility.

The three examples are fictional scenarios about reliability, commitment, and planning, each ending in suggested improvements. They are not beta-test reports. Example cards, detail pages, copied share text, and generated images identify their origin.

Database cleanup was not run: this checkout has no configured database connection, and the public production feedback API returned HTTP 503 during this refresh. Do not delete unrelated application collections. Confirm the intended feedback records and export a backup before removing data.

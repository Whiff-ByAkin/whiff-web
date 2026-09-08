# Roast us

`/roast` is the public wall. `/roast/review` is the private review area. Notes
may be positive or negative; no note appears publicly before approval.

The composer sends a message (3–400 characters), an optional name (up to 30
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
notes in batches of 24. No fake feedback is seeded.

The older unrelated `MONGODB_URI` in `.env` was preserved. The dedicated
`ROAST_MONGODB_*` settings take precedence for this feature only. Public
deployment remains future work. Missing/unavailable storage returns a retryable
error, never fake success.

## Replace the hero image

Save the user-created image as `public/whiff-circle.png`. Reload during local
development; rebuild for production. Home and role pages detect the file on
the server. Until it exists they retain the existing scene. The replacement
is one illustration; the six outing controls continue to change the example
activity details. A landscape 4:3 image with all objects inset is recommended.

## Checks

`npm run test:roast` exercises validation, private pending notes, publish/hide,
authorization, origin checks, rate limiting, pagination and body-size limits.
Tests use a temporary directory with random credentials and remove their own
data. They do not contact MongoDB or modify local visitor submissions.

Also run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Stop the dev
server before a production build so both processes do not write the same
Next.js build artifacts.

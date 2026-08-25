"use client";

import { track } from "@vercel/analytics";

/* ─────────────────────────────────────────────────────────────────────────
   Custom events.

   Vercel Analytics already reports organic traffic and referrer per page, so
   there is nothing to instrument for "how many people arrived from search".
   What it cannot know on its own is what happened next:

     cta_opened        the field was opened   (carries cta_variant)
     signup_submitted  an email was actually sent
     signup_succeeded  Formspree accepted it        ← the conversion
                       (carries cta_variant, and the city if one was typed)
     signup_failed     it did not                   ← catches a silent outage

   This used to also derive a `surface` and a `market` from the path, back when
   there were city pages to tell apart. On a one-page site every event fires
   from `/`, so that was two properties with one value each. What survives is
   the one signal a single page cannot infer: the city people type in.

   Event names and property keys are snake_case and stable. Renaming one
   silently splits its history in the dashboard, so treat them as an API.
   ───────────────────────────────────────────────────────────────────────── */

/* Which half of the CTA split this browser is in, as stamped on <html> before
 * paint by layout.tsx. Undefined for anyone the script could not assign (no
 * JavaScript, localStorage unavailable), and those visitors are deliberately
 * left out of both arms rather than folded into the default one. */
function ctaVariant(): "begin" | "seat" | undefined {
  const value = document.documentElement.dataset.cta;
  return value === "begin" || value === "seat" ? value : undefined;
}

export function trackCtaOpened() {
  const variant = ctaVariant();
  track("cta_opened", variant ? { cta_variant: variant } : {});
}

export function trackSignupSubmitted() {
  track("signup_submitted");
}

/** `requestedCity` is whatever the person typed into the optional city field.
 *  whiff opens one city at a time and picks the next from where people ask, so
 *  this is the demand signal — the reason the field exists at all. Normalised
 *  to keep "denver", "Denver " and "DENVER" from becoming three rows, and
 *  length-capped because a free-text field is a free-text field. */
export function trackSignupSucceeded(requestedCity?: string) {
  const requested = requestedCity?.trim().toLowerCase().slice(0, 60);
  const variant = ctaVariant();
  track("signup_succeeded", {
    ...(requested ? { requested_city: requested } : {}),
    // The conversion end of the split. Opened-rate alone would say which word
    // gets pressed; this is the one that says which word gets people in.
    ...(variant ? { cta_variant: variant } : {}),
  });
}

/** `reason` is a coarse bucket, never the message or the address — this is an
 *  analytics event, so nothing identifying goes into it. */
export function trackSignupFailed(reason: "rejected" | "network") {
  track("signup_failed", { reason });
}

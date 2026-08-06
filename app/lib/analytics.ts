"use client";

import { track } from "@vercel/analytics";

/* ─────────────────────────────────────────────────────────────────────────
   Custom events.

   Vercel Analytics already reports organic traffic and referrer per page, so
   there is nothing to instrument for "how many people arrived from search".
   What it cannot know on its own is what happened next:

     cta_opened        the invite dialog was opened
     signup_submitted  an email was actually sent
     signup_succeeded  Formspree accepted it        ← the conversion
     signup_failed     it did not                   ← catches a silent outage

   This used to also derive a `surface` and a `market` from the path, back when
   there were city pages to tell apart. On a one-page site every event fires
   from `/`, so that was two properties with one value each. What survives is
   the one signal a single page cannot infer: the city people type in.

   Event names and property keys are snake_case and stable. Renaming one
   silently splits its history in the dashboard, so treat them as an API.
   ───────────────────────────────────────────────────────────────────────── */

export function trackCtaOpened() {
  track("cta_opened");
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
  track("signup_succeeded", requested ? { requested_city: requested } : {});
}

/** `reason` is a coarse bucket, never the message or the address — this is an
 *  analytics event, so nothing identifying goes into it. */
export function trackSignupFailed(reason: "rejected" | "network") {
  track("signup_failed", { reason });
}

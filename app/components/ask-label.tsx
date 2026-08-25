/* The ask, in two words that are still being argued about.
 *
 * "Begin your experience" asks for a start rather than a signup, and it is
 * the only capitalised line on a lowercase page, which is what makes one
 * button read as a threshold. "Take your seat" is the more ownable line — the
 * seat is whiff's own mechanic, nobody else can say it, and a seat is a thing
 * that exists whether or not you sit in it, which is quietly the entire
 * pitch. Neither is obviously right, so the site runs both and counts.
 *
 * ## How the split avoids a flicker
 *
 * Both labels are always in the HTML and CSS hides one. An inline script in
 * the document body (see layout.tsx) assigns the visitor a variant and stamps
 * it on <html data-cta> before the first paint, so the right one is the only
 * one ever rendered — there is no hydration mismatch to fix, because the
 * markup is identical for everybody, and no half-second of the wrong word.
 *
 * With no JavaScript, no localStorage, or a script that threw, no attribute
 * is set and the CSS default shows "Begin your experience". A visitor in that state
 * is not counted in either arm, which is correct: they are not comparable.
 *
 * The `variant` reaches the analytics events at both ends of the funnel
 * (cta_opened and signup_succeeded), which is the only reason any of this
 * exists — an opened-rate on its own would tell you which word gets pressed,
 * not which word gets people in. */
export const CTA_LABELS = {
  begin: "Begin your experience",
  seat: "Take your seat",
} as const;

export type CtaVariant = keyof typeof CTA_LABELS;

/** Both labels, one visible. Used everywhere the site makes the ask, so the
 *  button and the explorer's closing panel can never disagree. */
export function AskLabel() {
  return (
    <>
      <span className="cta-begin">{CTA_LABELS.begin}</span>
      <span className="cta-seat">{CTA_LABELS.seat}</span>
    </>
  );
}

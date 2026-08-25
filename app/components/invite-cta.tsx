"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ASK_LABEL } from "@/app/config/roles";
import {
  trackCtaOpened,
  trackSignupFailed,
  trackSignupSubmitted,
  trackSignupSucceeded,
} from "@/app/lib/analytics";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgovgdp";

type Status = "idle" | "submitting" | "success" | "error";

/* One button, and the field it opens in place.
 *
 * A resting form is two empty boxes and a submit — three quiet grey shapes
 * asking to be filled in by somebody who has not yet decided. A button is one
 * shape with a verb on it. So the field waits behind the button and takes its
 * place when pressed: no overlay, no dialog, no second page, and the cursor
 * is already in the email by the time it finishes arriving.
 *
 * The button is not the only way in. The seventh panel of the explorer ends
 * on the same ask, and the header on every other page links here with #begin
 * — all three go through the `whiff:begin` event, so there is one door with
 * three handles. And because the panel's ask and this button would otherwise
 * sit on screen saying the same words at the same time, the page hides this
 * one while that panel is open (`triggerHidden`); the space it occupies is
 * kept, so nothing moves as you tab between roles.
 *
 * Once open it stays open. Nothing here closes, because there is nothing to
 * close back to — the button has already done its job.
 *
 * The city stays optional and stays visible. whiff opens one city at a time
 * and picks the next from where people ask, so it is the second most useful
 * thing on the page; hiding it behind a disclosure to save a row would trade
 * the roadmap for 40 pixels. */
export function InviteForm({
  // True while the explorer's closing panel is showing, because that panel
  // carries the same ask. Hidden, not unmounted: the box keeps its footprint
  // so the column does not resize when the seventh tab is pressed.
  triggerHidden = false,
}: {
  triggerHidden?: boolean;
} = {}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // A ring that fires once, when something else on the page sends you here —
  // the closing panel's "Get your reading", or an arrival on /#begin. Without
  // it the cursor lands in a field the eye has not been told about.
  const [nudged, setNudged] = useState(false);
  const opened = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  /* One "the visitor is at the ask" event, however they got here: the first
   * focus, the closing panel's button, or the hash from another page. */
  function markOpened() {
    if (opened.current) return;
    opened.current = true;
    trackCtaOpened();
  }

  useEffect(() => {
    // Asked for from somewhere else on the page: open the field, and ring it
    // once so the eye follows the cursor that just landed there.
    function begin() {
      markOpened();
      setOpen(true);
      setNudged(true);
      window.setTimeout(() => setNudged(false), 1400);
    }
    // The hash is for arriving from another page, and it is cleared as soon
    // as it is spent so a refresh does not re-fire the ring.
    if (window.location.hash === "#begin") {
      history.replaceState(null, "", window.location.pathname);
      begin();
    }
    window.addEventListener("whiff:begin", begin);
    return () => window.removeEventListener("whiff:begin", begin);
  }, []);

  // The field does not exist until `open`, so focus waits for the render that
  // creates it rather than being called beside the state change.
  useEffect(() => {
    if (open) emailRef.current?.focus({ preventScroll: true });
  }, [open]);

  // The one flourish on the whole site, and it is deliberately unreachable
  // until somebody has actually converted — so it costs a first-time visitor
  // nothing in attention and pays the one moment worth paying for. Brand
  // colours only, one burst, and nothing at all under reduced motion.
  useEffect(() => {
    if (status !== "success" || reduce) return;
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({
        particleCount: 90,
        spread: 68,
        startVelocity: 34,
        gravity: 0.9,
        scalar: 0.9,
        ticks: 160,
        origin: { y: 0.62 },
        colors: ["#241a15", "#6b5a50", "#b8adab", "#f4eee9"],
        zIndex: 200,
        disableForReducedMotion: true,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [status, reduce]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setError(null);
    trackSignupSubmitted();
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, city: city.trim() || "(not given)" }),
      });
      if (res.ok) {
        setStatus("success");
        trackSignupSucceeded(city);
        setEmail("");
        setCity("");
      } else {
        setError("Something went wrong. Please try again.");
        setStatus("error");
        trackSignupFailed("rejected");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
      trackSignupFailed("network");
    }
  }

  // The success chip replaces the well in place. Same box, same width, so the
  // column it sits in does not resize at the one moment worth celebrating.
  if (status === "success") {
    return (
      <div className="invite-shell">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          className="invite-success"
        >
          {/* the jellyfish's one cameo — the app shows the mascot only at the
              reading, and the site shows it only here */}
          <Image
            src="/whiff-mascot.png"
            alt=""
            width={2160}
            height={3870}
            sizes="52px"
            className="h-14 w-auto shrink-0 select-none mix-blend-multiply"
            draggable={false}
          />
          <div className="min-w-0">
            <p className="font-display text-base font-semibold text-ink">
              good. it’s started.
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
              we’ll write the moment your three are found, and other circles may
              reach you before that.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // The resting state: one shape with a verb on it.
  if (!open) {
    return (
      <div className="invite-shell">
        {/* Button and promise hide together. The promise is the line that
            makes pressing the button feel safe, and on its own — with the
            button gone — it is a sentence floating in the column. */}
        <div className={`invite-rest ${triggerHidden ? "is-hidden" : ""}`}>
          <motion.button
            type="button"
            onClick={() => {
              markOpened();
              setOpen(true);
            }}
            // Gesture presence must not depend on `reduce`: Motion gives
            // pressable elements a tabindex, an SSR-visible attribute, and
            // reduced-motion is unknown on the server. Only the values are
            // conditioned.
            whileHover={{ scale: reduce ? 1 : 1.03 }}
            whileTap={{ scale: reduce ? 1 : 0.97 }}
            transition={{ type: "spring", stiffness: 480, damping: 30 }}
            // Hidden by visibility rather than by unmounting, so the column
            // keeps its shape — and hidden from the keyboard and the screen
            // reader too, because the panel beside it is making the same ask.
            className="invite-trigger btn-ink group"
            aria-hidden={triggerHidden || undefined}
            tabIndex={triggerHidden ? -1 : undefined}
          >
            {ASK_LABEL}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </motion.button>

          <p className="invite-promise">
            we promise:{" "}
            <span className="font-semibold text-ink">
              strangers only on week one.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="invite-shell"
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <form onSubmit={handleSubmit} noValidate aria-label="Request an invite">
        {/* One well, hairline-divided. The border is on the group and never on
            the inputs: three bordered boxes in a row is a form, one bordered
            well with dividers is a control. */}
        <div className="invite-well" data-nudged={nudged || undefined}>
          <input
            ref={emailRef}
            id="whiff-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            aria-label="Your email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={markOpened}
            disabled={status === "submitting"}
            className="invite-input invite-email"
          />

          <input
            id="whiff-city"
            type="text"
            name="city"
            autoComplete="address-level2"
            aria-label="Which city are you in? Optional."
            placeholder="city (optional)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={markOpened}
            disabled={status === "submitting"}
            className="invite-input invite-city"
          />

          <button
            type="submit"
            disabled={status === "submitting" || !email}
            className="invite-submit btn-ink"
          >
            {status === "submitting" ? (
              <>
                <span className="spinner" />
                <span className="hidden sm:inline">sending…</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">count me in</span>
                <span aria-hidden="true" className="sm:hidden">
                  →
                </span>
                <span className="sr-only sm:hidden">count me in</span>
              </>
            )}
          </button>
        </div>

        {/* The promise sits under the field rather than inside it — it is the
            reassurance you read while deciding, not a label on an input. */}
        <p className="invite-promise">
          we promise:{" "}
          <span className="font-semibold text-ink">
            strangers only on week one.
          </span>
        </p>

        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              key="error"
              role="alert"
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="invite-error"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}

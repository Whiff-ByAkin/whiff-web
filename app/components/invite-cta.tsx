"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  trackCtaOpened,
  trackSignupFailed,
  trackSignupSubmitted,
  trackSignupSucceeded,
} from "@/app/lib/analytics";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgovgdp";

type Status = "idle" | "submitting" | "success" | "error";

/* The ask, morphing in place.
 *
 * The dialog is gone from the home page: the pill itself becomes the form
 * (one shared layoutId, so Motion FLIPs the pill's bounds into the panel's),
 * and the form becomes the success chip. Nothing is portaled and nothing is
 * modal — the page underneath stays alive.
 *
 * The page cannot scroll, so the morph must never change the page's height:
 * an invisible copy of the pill holds its exact footprint in normal flow, and
 * every real state renders in an absolute overlay anchored to that footprint's
 * bottom edge. Whatever the form grows into, it grows upward over the hero,
 * never downward into the footline. */
export function ApplyCTA({
  // Fires as the morph opens and closes, so the hero can clear the paper the
  // panel grows over — without it the panel's top edge slices through the
  // aside's text.
  onOpenChange,
  // A counter, not a boolean: something elsewhere on the page (the deck's
  // hook card) asking for the form. Every bump opens it; closing stays the
  // form's own business, so the two never fight over one piece of state.
  openNonce = 0,
  // The page's one "Begin your experience" now lives on the deck's closing
  // card, so this renders no resting pill of its own — only the panel the
  // card's button opens. Without this the page would carry two of the same
  // button, which is one more threshold than a threshold can have.
  hideTrigger = false,
}: {
  onOpenChange?: (open: boolean) => void;
  openNonce?: number;
  hideTrigger?: boolean;
} = {}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  // Optional, and the only reason the field exists: whiff opens one city at a
  // time and picks the next one from where people ask. Without this the demand
  // signal is a mailto link nobody can count.
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const emailRef = useRef<HTMLInputElement>(null);

  /* The header carries a "Begin" too, and the home page cannot scroll to
   * anything — so it asks for the form by event rather than by anchor. The
   * hash form is for arriving from another page, and it is cleared as soon
   * as it is spent so a refresh does not reopen the panel. */
  useEffect(() => {
    function begin() {
      setOpen(true);
      onOpenChange?.(true);
      trackCtaOpened();
    }
    if (window.location.hash === "#begin") {
      history.replaceState(null, "", window.location.pathname);
      begin();
    }
    window.addEventListener("whiff:begin", begin);
    return () => window.removeEventListener("whiff:begin", begin);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
    setTimeout(() => {
      setStatus("idle");
      setError(null);
    }, 200);
  }, [onOpenChange]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open]);

  // Focus follows the morph: the field is ready the moment it exists.
  useEffect(() => {
    if (open && status !== "success") emailRef.current?.focus();
  }, [open, status]);

  // The nonce is a request to open, from the deck's hook card. Same analytics
  // as the pill: however the form was reached, it was opened.
  useEffect(() => {
    if (openNonce === 0) return;
    setOpen(true);
    onOpenChange?.(true);
    trackCtaOpened();
  }, [openNonce, onOpenChange]);

  // The one flourish on the whole site, and it is deliberately unreachable
  // until somebody has actually converted — so it costs a first-time visitor
  // nothing in attention and pays the one moment worth paying for. Brand
  // colours only, one burst, and nothing at all under reduced-motion.
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
        origin: { y: 0.45 },
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

  const inputClass =
    "w-full rounded-full border border-line bg-ground px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-shadow focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/25 disabled:opacity-60";

  return (
    <div className="relative">
      {/* The footprint. Identical box to the resting pill, permanently in
          flow and permanently invisible — it is the reason the morph never
          moves anything else on the page. */}
      <span
        aria-hidden="true"
        className={`hero-primary-cta invisible items-center gap-2 rounded-full px-[clamp(1.05rem,4.6vw,2.25rem)] py-[clamp(0.45rem,1.9vw,1rem)] font-display font-semibold tracking-wide ${
          hideTrigger ? "hidden" : "inline-flex"
        }`}
      >
        <span className="text-[clamp(0.7rem,2.5vw,1rem)]">
          Begin your experience
        </span>
        <span>→</span>
      </span>

      <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center md:justify-start">
        <MotionConfig
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 32 }
          }
        >
          <AnimatePresence initial={false} mode="popLayout">
            {!open ? (
              hideTrigger ? null : (
                <motion.button
                  key="pill"
                  layoutId="whiff-cta"
                  style={{ borderRadius: 999 }}
                  type="button"
                  onClick={() => {
                    setOpen(true);
                    onOpenChange?.(true);
                    trackCtaOpened();
                  }}
                  // Gesture presence must not depend on `reduce`: Motion gives
                  // pressable elements a tabindex, an SSR-visible attribute,
                  // and reduced-motion is unknown on the server. Only the
                  // values are conditioned.
                  whileHover={{ scale: reduce ? 1 : 1.04 }}
                  whileTap={{ scale: reduce ? 1 : 0.97 }}
                  className="hero-primary-cta btn-ink ping group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-[clamp(1.05rem,4.6vw,2.25rem)] py-[clamp(0.45rem,1.9vw,1rem)] font-display font-semibold tracking-wide"
                >
                  {/* shine sweep on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                  {/* This asks for a start, not a seat — and it's the only
                    capitalised line on the page, which is what makes a
                    lowercase brand's one button read as a threshold. */}
                  <span className="relative text-[clamp(0.7rem,2.5vw,1rem)]">
                    Begin your experience
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </motion.button>
              )
            ) : status === "success" ? (
              <motion.div
                key="success"
                layoutId="whiff-cta"
                style={{ borderRadius: 24 }}
                className="relative flex w-[min(92vw,24rem)] shrink-0 items-center gap-3 border border-line bg-ground-lift p-3.5 pr-9 text-left shadow-[0_30px_60px_-28px_rgba(36,26,21,0.35)]"
                role="status"
              >
                {/* the jellyfish's one cameo — the app shows the mascot only
                    at the reading, and the site shows it only here */}
                <Image
                  src="/whiff-mascot.png"
                  alt=""
                  width={2160}
                  height={3870}
                  sizes="45px"
                  className="h-16 w-auto shrink-0 select-none mix-blend-multiply"
                  draggable={false}
                />
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-ink">
                    good. it’s started.
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
                    we’ll write the moment your three are found, and other
                    circles may reach you before that.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ground hover:text-ink"
                >
                  ✕
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                layoutId="whiff-cta"
                style={{ borderRadius: 26 }}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Request an invite"
                className="relative w-[min(92vw,33rem)] shrink-0 border border-line bg-ground-lift p-3 shadow-[0_30px_60px_-28px_rgba(36,26,21,0.35)]"
              >
                <p className="px-2 pb-2 pt-0.5 text-left text-[13px] text-ink-muted">
                  we promise:{" "}
                  <span className="font-semibold text-ink">
                    strangers only on week one.
                  </span>
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                    disabled={status === "submitting"}
                    className={`${inputClass} sm:flex-1`}
                  />
                  <input
                    id="whiff-city"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    aria-label="Which city are you in? Optional."
                    placeholder="your city (optional)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={status === "submitting"}
                    className={`${inputClass} sm:w-40`}
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting" || !email}
                    className="btn-ink inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-display text-sm font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="spinner" /> sending…
                      </>
                    ) : (
                      "count me in"
                    )}
                  </button>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="px-2 pb-0.5 pt-2 text-left text-[13px] font-semibold text-ink"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ground text-[13px] text-ink-muted shadow-sm transition-colors hover:text-ink"
                >
                  ✕
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  );
}

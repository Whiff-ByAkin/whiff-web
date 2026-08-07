"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  trackCtaOpened,
  trackSignupFailed,
  trackSignupSubmitted,
  trackSignupSucceeded,
} from "@/app/lib/analytics";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgovgdp";

type Status = "idle" | "submitting" | "success" | "error";

export function ApplyCTA({
  // fires when the cursor arrives at / leaves the button, so the hero can
  // close the empty place in the ring above it
  onReachChange,
}: {
  onReachChange?: (reaching: boolean) => void;
} = {}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  // Optional, and the only reason the field exists: whiff opens one city at a
  // time and picks the next one from where people ask. Without this the demand
  // signal is a mailto link nobody can count.
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // The dialog is portaled to <body>: the CTA sits inside a reveal wrapper that
  // animates transform/filter, and either would trap a position:fixed overlay
  // in that wrapper's box instead of the viewport. Portaling escapes it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Magnetic pull: the button drifts toward the cursor, spring-eased so it
  // feels weighty rather than twitchy.
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 250, damping: 18, mass: 0.5 });

  function handleMagnet(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  }
  function resetMagnet() {
    mx.set(0);
    my.set(0);
    onReachChange?.(false);
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setError(null);
    }, 200);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
        colors: ["#d8b9a3", "#f0d8b4", "#a76642", "#6b4a38"],
        // above the dialog overlay (z-100), or the backdrop greys it out
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
        headers: { Accept: "application/json", "Content-Type": "application/json" },
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

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          setOpen(true);
          trackCtaOpened();
        }}
        onMouseMove={handleMagnet}
        onMouseEnter={() => onReachChange?.(true)}
        onMouseLeave={resetMagnet}
        onFocus={() => onReachChange?.(true)}
        onBlur={() => onReachChange?.(false)}
        style={{ x, y }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        // Scales with the viewport like everything else in the hero. It had fixed
        // padding and a fixed label, which was fine when the headline was a fixed
        // 1.9rem — under a fluid headline it ends up the largest thing on a small
        // phone, and a button bigger than the sentence it's answering reads as the
        // page shouting.
        className="btn-latte ping group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-[clamp(1.05rem,4.6vw,2.25rem)] py-[clamp(0.45rem,1.9vw,1rem)] font-display font-semibold tracking-wide"
      >
        {/* shine sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        {/* "Apply to join" was paperwork and "I'm the sixth" claimed a chair
            we can't prove exists on day one. This asks for a start, not a
            seat — and it's the only capitalised line on the page, which is
            what makes a lowercase brand's one button read as a threshold.
            "your", not "the": the experience belongs to the person pressing
            it, not to us. */}
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

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Request an invite"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative w-full max-w-sm rounded-3xl border border-line bg-card p-7 shadow-[0_40px_80px_-30px_rgba(24,24,27,0.28)]"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-page hover:text-ink"
              >
                ✕
              </button>

              {status === "success" ? (
                <div className="py-3 text-center">
                  {/* the one celebration moment on the site */}
                  <Image
                    src="/whiff-mascot-cheer.png"
                    alt=""
                    width={298}
                    height={380}
                    className="mx-auto mb-3 h-28 w-auto select-none"
                    draggable={false}
                  />
                  <p className="font-display text-xl font-semibold text-ink">
                    good. it&rsquo;s started.
                  </p>
                  <p className="mt-2 text-ink-soft">
                    we&rsquo;ll write the moment your five are found — and
                    other circles may reach you before that.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="btn-latte mt-5 inline-flex items-center justify-center rounded-full px-6 py-2.5 font-display font-semibold"
                  >
                    close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    good. we&rsquo;ll find your five.
                  </h2>
                  <p className="text-[15px] leading-relaxed text-ink-soft">
                    we look for the five who bring out your best — then twelve
                    weeks of things you&rsquo;d actually choose to do, and a
                    few you&rsquo;ve never tried. while yours comes together,
                    other circles invite you along to what you already love.
                  </p>
                  <p className="text-[15px] leading-relaxed text-ink-soft">
                    whiff opens one city at a time. leave your email and
                    we&rsquo;ll come back when yours is ready.
                  </p>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="whiff-email"
                      className="block pl-5 text-[13px] font-medium text-ink-soft"
                    >
                      your email
                    </label>
                    <input
                      id="whiff-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "submitting"}
                      className="w-full rounded-full border border-line bg-page px-5 py-3 text-ink placeholder:text-ink-soft/60 transition-shadow focus:border-espresso focus:outline-none focus:ring-2 focus:ring-espresso/30 disabled:opacity-60"
                    />
                  </div>
                  {/* Optional on purpose — a second required field is the
                      cheapest way to lose a signup. Unlabelled inputs are a
                      real accessibility failure though, so the label is
                      visible rather than a placeholder doing double duty. */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="whiff-city"
                      className="block pl-5 text-[13px] font-medium text-ink-soft"
                    >
                      which city are you in?{" "}
                      <span className="text-ink-soft/60">(optional)</span>
                    </label>
                    <input
                      id="whiff-city"
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      placeholder="Minneapolis"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={status === "submitting"}
                      className="w-full rounded-full border border-line bg-page px-5 py-3 text-ink placeholder:text-ink-soft/60 transition-shadow focus:border-espresso focus:outline-none focus:ring-2 focus:ring-espresso/30 disabled:opacity-60"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="text-sm text-crimson">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting" || !email}
                    className="btn-latte inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-display font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="spinner" /> sending…
                      </>
                    ) : (
                      "count me in"
                    )}
                  </button>
                </form>
              )}
            </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

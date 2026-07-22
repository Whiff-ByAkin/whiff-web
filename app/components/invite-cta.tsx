"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgovgdp";

type Status = "idle" | "submitting" | "success" | "error";

export function ApplyCTA() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // The dialog is portaled to <body>: the CTA sits inside a reveal wrapper that
  // animates transform/filter, and either would trap a position:fixed overlay
  // in that wrapper's box instead of the viewport. Portaling escapes it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setError(null);
    }, 200);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        onMouseMove={handleMagnet}
        onMouseLeave={resetMagnet}
        style={{ x, y }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="ping group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-rust px-7 py-3.5 font-display font-semibold tracking-wide text-white shadow-[0_14px_30px_-14px_var(--color-rust-edge)] transition-colors duration-200 hover:bg-rust-edge sm:px-9 sm:py-4"
      >
        {/* shine sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative text-sm sm:text-base">Apply to join</span>
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
              className="relative w-full max-w-sm rounded-3xl border border-line bg-card p-7 shadow-[0_40px_80px_-30px_rgba(63,45,34,0.4)]"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
              >
                ✕
              </button>

              {status === "success" ? (
                <div className="py-3 text-center">
                  <p className="font-display text-xl font-semibold text-ink">
                    you&rsquo;re on the list.
                  </p>
                  <p className="mt-2 text-ink-soft">
                    we&rsquo;ll reach out when your city opens.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-rust px-6 py-2.5 font-display font-semibold text-white transition-colors hover:bg-rust-edge"
                  >
                    close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    apply to join
                  </h2>
                  <p className="text-[15px] leading-relaxed text-ink-soft">
                    whiff is launching in one city, invite-only. leave your
                    email to apply for one of the first spots.
                  </p>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "submitting"}
                    className="w-full rounded-full border border-line bg-cream px-5 py-3 text-ink placeholder:text-ink-soft/60 transition-shadow focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/40 disabled:opacity-60"
                  />
                  {error && (
                    <p role="alert" className="text-sm text-rust-edge">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting" || !email}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rust px-6 py-3 font-display font-semibold tracking-wide text-white transition-colors hover:bg-rust-edge disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="spinner" /> sending…
                      </>
                    ) : (
                      "apply"
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

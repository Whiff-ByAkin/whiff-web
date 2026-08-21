"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { LIVE_STATES } from "../config/site";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgovgdp";
const DEFAULT_TRIGGER_CLASS =
  "header-action rounded-full border border-line bg-transparent px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ground-lift focus-visible:bg-ground-lift";

type Status = "idle" | "submitting" | "success" | "error";

// LIVE_STATES is derived from MARKETS in config/site.ts rather than listed
// here. It used to be a hardcoded ["Minnesota"], which meant opening a market
// in a new state would have left this dialog quietly wrong — the exact kind of
// drift between two surfaces that makes an answer engine hedge on a fact.

// Header dialog showing where whiff is live and collecting a small, countable
// signal for where it should open next. The state is required because it is the
// purpose of this form; email is required so the signal can lead to a reply.
export function StatesWhiffIsIn({
  triggerClassName = DEFAULT_TRIGGER_CLASS,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [requestedState, setRequestedState] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeDialog = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
    setTimeout(() => {
      setEmail("");
      setRequestedState("");
      setStatus("idle");
      setError(null);
    }, 200);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const cleanEmail = email.trim();
    const cleanState = requestedState.trim();
    if (!cleanEmail || !cleanState) return;

    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          state: cleanState,
          source: "states-dialog",
        }),
      });

      if (!response.ok) {
        throw new Error("Formspree rejected the request");
      }

      setStatus("success");
      setEmail("");
      setRequestedState("");
    } catch {
      setStatus("error");
      setError("We couldn’t send that. Please try again.");
    }
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeDialog();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeDialog, open]);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className={triggerClassName}
      >
        States
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
                  onClick={closeDialog}
                  className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
                />
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="states-title"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-[27rem] overflow-hidden rounded-3xl border border-line bg-ground-lift shadow-[0_40px_80px_-30px_rgba(36,26,21,0.28)]"
                >
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={closeDialog}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ground hover:text-ink"
                  >
                    ✕
                  </button>

                  <div className="px-6 pb-6 pt-9 text-center sm:px-7 sm:pb-7 sm:pt-10">
                    <h2
                      id="states-title"
                      className="font-display text-sm font-medium text-ink-muted"
                    >
                      whiff is live in
                    </h2>
                    <ul className="mt-2 space-y-1">
                      {LIVE_STATES.map((state) => (
                        <li
                          key={state}
                          className="font-display text-[2.5rem] font-semibold leading-tight tracking-tight text-ink"
                        >
                          {state}
                        </li>
                      ))}
                    </ul>

                    {status === "success" ? (
                      <div
                        className="mt-6 border-t border-line pt-5"
                        aria-live="polite"
                      >
                        <p className="font-display text-xl font-semibold text-ink">
                          got it. we’ll keep you posted.
                        </p>
                        <p className="mx-auto mt-2 max-w-[30ch] text-sm leading-relaxed text-ink-muted">
                          when whiff reaches your state, you’ll be the first
                          to know.
                        </p>
                        <button
                          type="button"
                          onClick={closeDialog}
                          className="mt-5 inline-flex items-center justify-center rounded-full border border-line bg-ground px-6 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ground-lift"
                        >
                          close
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        className="mt-6 border-t border-line pt-5 text-left"
                      >
                        <p className="text-center text-sm leading-relaxed text-ink-muted">
                          not there yet? tell us where to come next.
                        </p>

                        <div className="mt-4 space-y-3">
                          <div className="space-y-1.5">
                            <label
                              htmlFor="state-interest-email"
                              className="block pl-4 text-xs font-semibold text-ink-muted"
                            >
                              your email
                            </label>
                            <input
                              id="state-interest-email"
                              type="email"
                              name="email"
                              required
                              autoComplete="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              disabled={status === "submitting"}
                              className="w-full rounded-full border border-line bg-ground px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-shadow focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/25 disabled:opacity-60"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label
                              htmlFor="state-interest-state"
                              className="block pl-4 text-xs font-semibold text-ink-muted"
                            >
                              your state
                            </label>
                            <input
                              id="state-interest-state"
                              type="text"
                              name="state"
                              required
                              autoComplete="address-level1"
                              placeholder="Wisconsin"
                              value={requestedState}
                              onChange={(event) =>
                                setRequestedState(event.target.value)
                              }
                              disabled={status === "submitting"}
                              className="w-full rounded-full border border-line bg-ground px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-shadow focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/25 disabled:opacity-60"
                            />
                          </div>
                        </div>

                        {error && (
                          <p
                            role="alert"
                            className="mt-3 text-center text-sm font-semibold text-ink"
                          >
                            {error}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={
                            status === "submitting" ||
                            !email.trim() ||
                            !requestedState.trim()
                          }
                          className="btn-ink mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-sm font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {status === "submitting" ? (
                            <>
                              <span className="spinner" /> sending…
                            </>
                          ) : (
                            "tell us your state"
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

const CONTACT_EMAIL = "hello@whiff-ai.com";
const INSTAGRAM = "https://www.instagram.com/discover_whiff/";

export function Contact() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="rounded-full border border-line bg-card px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-rust hover:text-rust"
      >
        Contact
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
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Contact whiff"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-sm rounded-3xl border border-line bg-card p-7 text-center shadow-[0_40px_80px_-30px_rgba(63,45,34,0.4)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                  >
                    ✕
                  </button>

                  <h2 className="font-display text-2xl font-semibold text-ink">
                    say hello
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    questions, press, or partnerships. we&rsquo;d love to hear
                    from you.
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="inline-flex w-full items-center justify-center rounded-full bg-rust px-6 py-3 font-display font-semibold tracking-wide text-white transition-colors hover:bg-rust-edge"
                    >
                      email us
                    </a>
                    <a
                      href={INSTAGRAM}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full border border-line bg-cream px-6 py-3 font-display font-medium text-ink transition-colors hover:border-rust hover:text-rust"
                    >
                      message us on Instagram
                    </a>
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

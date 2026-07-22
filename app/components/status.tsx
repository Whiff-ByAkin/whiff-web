"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

// A small "Status" button in the header. Clicking it opens a dialog that tells
// visitors, plainly, where whiff is right now. Edit the copy below as the
// launch progresses (stage, city, whether applications are open).
export function Status() {
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
        Status
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
                  aria-label="Where whiff is right now"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative w-full max-w-sm rounded-3xl border border-line bg-card p-7 shadow-[0_40px_80px_-30px_rgba(63,45,34,0.4)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                  >
                    ✕
                  </button>

                  <span className="inline-flex items-center rounded-full border border-rust/25 bg-rust/10 px-3 py-1 text-xs font-semibold text-rust">
                    applications open
                  </span>

                  <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
                    where we&rsquo;re at
                  </h2>

                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    whiff is pre-launch. We&rsquo;re building our first city and
                    forming the first activities with a small, invite-only group.
                    If that&rsquo;s you, apply to join and we&rsquo;ll reach out
                    as we open.
                  </p>

                  <dl className="mt-5 space-y-2.5 text-sm">
                    <StatusRow label="Stage" value="Pre-launch" />
                    <StatusRow label="Where" value="Our first city" />
                    <StatusRow label="Access" value="Invite-only, limited spots" />
                  </dl>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line pb-2.5 last:border-0 last:pb-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

// Client-only "have we hydrated yet" flag without a setState-in-effect: the
// snapshot is false on the server and true once React reads it on the client.
const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function InfoDialog({
  open,
  onClose,
  title,
  hashId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  hashId: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") trapFocus(e, panelRef.current);
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const first = panelRef.current?.querySelector<HTMLElement>(
      "[data-autofocus]",
    );
    first?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-oat/75 backdrop-blur-lg cursor-default"
          />

          <motion.div
            ref={panelRef}
            id={hashId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.8 }}
            className="relative w-full md:max-w-[460px] mx-0 md:mx-4 bg-card text-forest rounded-t-3xl md:rounded-2xl ring-1 ring-forest/20 shadow-[0_30px_80px_-20px_rgba(46,39,35,0.5),0_0_0_1px_rgba(46,39,35,0.05)] max-h-[85svh] flex flex-col font-serif"
          >
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <span className="block w-10 h-1.5 rounded-full bg-forest/20" />
        </div>

        <div className="px-6 md:px-7 pt-5 md:pt-6">
          <div className="flex items-start justify-between gap-4">
            <h2
              id={titleId}
              className="font-serif italic text-xl md:text-2xl tracking-tight text-forest"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-autofocus
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full ring-1 ring-forest/25 text-forest hover:bg-forest/5 transition-colors group"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-transform duration-200 group-hover:rotate-90"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <hr className="mt-4 border-0 h-px bg-forest/15" />
        </div>

            <div
              id={descId}
              className="px-6 md:px-7 pt-5 pb-6 md:pb-7 overflow-y-auto space-y-4 text-[14px] md:text-[15px] leading-[1.7] text-forest"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function trapFocus(e: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return;
  const focusables = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
  );
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

export const NAV_PILL_CLASS =
  "inline-flex items-center justify-center min-h-9 px-4 rounded-full border border-forest/15 bg-oat/60 backdrop-blur-sm text-forest text-sm font-serif italic hover:bg-forest hover:text-oat hover:border-forest transition-colors duration-200";

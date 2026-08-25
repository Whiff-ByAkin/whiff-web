"use client";

import Link from "next/link";
import { BeginAction } from "./begin-action";
import { INSTAGRAM_URL } from "../config/site";
import { useEffect, useId, useRef, useState } from "react";

const MENU_ACTION =
  "flex min-h-11 w-full items-center justify-end rounded-xl border border-transparent px-4 py-2.5 text-right font-display text-sm font-semibold text-ink transition-colors hover:border-line focus-visible:border-ink focus-visible:outline-none";

export function MobileNav({
  hideBlog = false,
  hideBegin = false,
}: {
  hideBlog?: boolean;
  hideBegin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeMenu({ returnFocus = true } = {}) {
    setOpen(false);
    if (returnFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeMenu();
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-transparent text-ink transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span
          aria-hidden="true"
          className="flex w-[1.125rem] flex-col gap-[0.23rem]"
        >
          <span
            className={`h-0.5 w-full rounded-full bg-ink transition-transform ${
              open ? "translate-y-[0.355rem] rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full rounded-full bg-ink transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full rounded-full bg-ink transition-transform ${
              open ? "-translate-y-[0.355rem] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        /* A real surface, not a floating list. It used to be transparent, and
           with the hero's segmented control directly underneath it the menu
           read as text printed over the page — worse now that the legal links
           sit in it at 11px. */
        className="absolute right-0 top-[calc(100%+0.5rem)] flex w-44 flex-col gap-1 rounded-2xl border border-line bg-ground p-2 shadow-[0_24px_48px_-24px_rgba(36,26,21,0.35)]"
      >
        {!hideBlog && (
          <Link
            href="/blog"
            onClick={() => closeMenu({ returnFocus: false })}
            className={MENU_ACTION}
          >
            Blog
          </Link>
        )}
        <Link
          href="/states"
          onClick={() => closeMenu({ returnFocus: false })}
          className={MENU_ACTION}
        >
          States
        </Link>
        <Link
          href="/support"
          onClick={() => closeMenu({ returnFocus: false })}
          className={MENU_ACTION}
        >
          Contact
        </Link>
        {!hideBegin && (
          <div onClick={() => closeMenu({ returnFocus: false })}>
            <BeginAction
              className={`${MENU_ACTION} btn-ink justify-center border-transparent text-center`}
            />
          </div>
        )}

        {/* The home page's footline is desktop-only now (see footer.tsx), so
            this menu is where the legal links live on a phone. Small, last,
            and after a rule — they are a requirement, not a destination. */}
        <div className="mt-1 flex items-center justify-end gap-2 border-t border-line px-4 pt-2.5 text-[0.7rem] text-ink-muted">
          <Link
            href="/privacy"
            onClick={() => closeMenu({ returnFocus: false })}
            className="py-1 transition-colors hover:text-ink"
          >
            privacy
          </Link>
          <span aria-hidden="true" className="text-ink-faint">
            ·
          </span>
          <Link
            href="/terms"
            onClick={() => closeMenu({ returnFocus: false })}
            className="py-1 transition-colors hover:text-ink"
          >
            terms
          </Link>
          <span aria-hidden="true" className="text-ink-faint">
            ·
          </span>
          <a
            href={INSTAGRAM_URL}
            rel="me noopener"
            className="py-1 transition-colors hover:text-ink"
          >
            instagram
          </a>
        </div>
      </div>
    </div>
  );
}

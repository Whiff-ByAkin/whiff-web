"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Contact } from "./contact";
import { StatesWhiffIsIn } from "./states-whiff-is-in";

const MENU_ACTION =
  "flex min-h-11 w-full items-center rounded-xl px-4 py-2.5 text-left font-display text-sm font-semibold text-ink transition-colors hover:bg-ground focus-visible:bg-ground";

export function MobileNav({ hideBlog = false }: { hideBlog?: boolean }) {
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
      // A dialog opened from the disclosure owns Escape until it closes. The
      // menu remains mounted behind it so focus can return to its trigger.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      event.preventDefault();
      closeMenu();
    }

    function onPointerDown(event: PointerEvent) {
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
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
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-ground-lift text-ink transition-colors hover:border-ink hover:bg-ground"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="flex w-[1.125rem] flex-col gap-[0.23rem]">
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
        className="absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-2xl border border-line bg-ground-lift p-1.5 shadow-[0_22px_48px_-24px_rgba(36,26,21,0.38)]"
      >
        {!hideBlog && (
          <Link href="/blog" onClick={() => closeMenu({ returnFocus: false })} className={MENU_ACTION}>
            Blog
          </Link>
        )}
        <StatesWhiffIsIn triggerClassName={MENU_ACTION} />
        <Contact triggerClassName={MENU_ACTION} />
      </div>
    </div>
  );
}

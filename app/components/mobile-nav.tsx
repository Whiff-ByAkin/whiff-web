"use client";

import Link from "next/link";
import { BeginAction } from "./begin-action";
import { useEffect, useId, useRef, useState } from "react";

const MENU_ACTION =
  "flex min-h-11 w-full items-center justify-end rounded-xl border border-transparent px-4 py-2.5 text-right font-display text-sm font-semibold text-ink transition-colors hover:border-line focus-visible:border-ink focus-visible:outline-none";

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
        className="absolute right-0 top-[calc(100%+0.5rem)] flex w-40 flex-col gap-1.5 bg-transparent p-0"
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
        <div onClick={() => closeMenu({ returnFocus: false })}>
          <BeginAction
            className={`${MENU_ACTION} btn-ink justify-center border-transparent text-center`}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { PRIMARY_LINKS } from "./navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="whiff-mobile-nav" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <button ref={triggerRef} type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)} className="whiff-menu-trigger">
        <span aria-hidden="true" className={open ? "whiff-menu-icon is-open" : "whiff-menu-icon"}><span /><span /></span>
      </button>
      <nav id={panelId} hidden={!open} className="whiff-menu-panel" aria-label="Primary">
        {PRIMARY_LINKS.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
      </nav>
    </div>
  );
}

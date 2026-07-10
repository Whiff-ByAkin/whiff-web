"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InfoDialog, NAV_PILL_CLASS } from "./info-dialog";

export function Contact() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const openFromHash = () => {
      if (window.location.hash === "#contact") {
        setOpen(true);
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="contact-dialog"
        className={NAV_PILL_CLASS}
      >
        contact
      </button>
      <InfoDialog
        open={open}
        onClose={handleClose}
        title="contact us."
        hashId="contact-dialog"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-serif text-base md:text-lg text-forest">
              restaurateur, venue owner, or event curator?
            </h3>
            <p className="text-forest/65 text-[13px] md:text-sm">
              message us by clicking below.
            </p>
          </div>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full inline-flex items-center justify-center rounded-full ring-1 ring-forest/20 bg-forest/5 text-forest/60 font-serif italic text-sm py-3 cursor-not-allowed"
          >
            join the waitlist
          </button>
          <p className="text-xs text-forest/55 text-center font-serif italic">
            coming soon
          </p>
        </div>

        <hr className="border-0 h-px bg-forest/15 my-2" />

        <div className="space-y-1">
          <h3 className="font-serif text-base md:text-lg text-forest">
            for all other inquiries,
          </h3>
          <p className="text-forest/65 text-[13px] md:text-sm">
            fill out the form below.
          </p>
        </div>

        {sent ? (
          <div
            role="status"
            className="rounded-2xl ring-1 ring-forest/15 bg-forest/[0.03] px-4 py-6 text-center font-serif italic text-forest"
          >
            thanks. we&apos;ll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <Field name="name" type="text" placeholder="name" required />
            <Field name="email" type="email" placeholder="email" required />
            <Field name="location" type="text" placeholder="location" />
            <textarea
              name="message"
              placeholder="message"
              required
              rows={4}
              className="w-full rounded-2xl ring-1 ring-forest/20 bg-transparent px-4 py-3 text-[14px] text-forest placeholder:text-forest/45 placeholder:font-serif placeholder:italic focus:outline-none focus:ring-2 focus:ring-forest/40 transition resize-none"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-full bg-sienna text-oat font-serif italic text-sm py-3 shadow-[0_8px_24px_-12px_rgba(120,44,26,0.5)] hover:bg-sienna-hover transition-colors duration-200"
            >
              send message
            </button>
          </form>
        )}
      </InfoDialog>
    </>
  );
}

function Field({
  name,
  type,
  placeholder,
  required,
}: {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      aria-label={placeholder}
      className="w-full rounded-full ring-1 ring-forest/20 bg-transparent px-5 py-3 text-[14px] text-forest placeholder:text-forest/45 placeholder:font-serif placeholder:italic focus:outline-none focus:ring-2 focus:ring-forest/40 transition"
    />
  );
}

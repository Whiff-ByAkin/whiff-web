"use client";

import { useState } from "react";
import { InfoDialog } from "./info-dialog";

// A lightweight "what do you think of whiff?" collector. Drop it anywhere and
// pass a `source` so we can tell game feedback from blog feedback later. The
// trigger is an inline pill; the form lives in the shared InfoDialog.

type Sentiment = "love" | "okay" | "not_for_me";
type Status = "idle" | "submitting" | "success" | "error";

const SENTIMENTS: { value: Sentiment; label: string }[] = [
  { value: "love", label: "love it" },
  { value: "okay", label: "it's okay" },
  { value: "not_for_me", label: "not for me" },
];

export function FeedbackWidget({
  source,
  label = "got feedback?",
  triggerClassName,
  prompt = "what do you think of whiff? anything you'd change?",
}: {
  source: string;
  label?: string;
  triggerClassName?: string;
  prompt?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = (sentiment !== null || message.trim().length > 0) && status !== "submitting";

  function handleClose() {
    setOpen(false);
    // Reset after the exit animation so it doesn't flash on close.
    setTimeout(() => {
      setStatus("idle");
      setError(null);
      setSentiment(null);
      setMessage("");
      setEmail("");
    }, 220);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          sentiment,
          message,
          email,
          path: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-oat/60 px-4 py-2 font-serif text-sm italic text-forest/75 backdrop-blur-sm transition-colors hover:bg-forest hover:text-oat"
        }
      >
        {label}
      </button>

      <InfoDialog open={open} onClose={handleClose} title="tell us what you think" hashId="feedback-dialog">
        {status === "success" ? (
          <div className="text-center py-2">
            <p className="text-base">thank you — we read every note and it genuinely shapes what we build.</p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-sienna text-oat px-6 py-2.5 text-sm font-serif italic hover:bg-sienna-hover transition-colors"
            >
              close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <p className="text-[14px] md:text-[15px]">{prompt}</p>

            <div className="flex flex-wrap gap-2">
              {SENTIMENTS.map((s) => {
                const active = sentiment === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSentiment(active ? null : s.value)}
                    className={`rounded-full px-4 py-2 text-sm font-serif italic transition-colors ${
                      active
                        ? "bg-sienna text-oat"
                        : "border border-forest/20 bg-transparent text-forest hover:border-forest/40"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            <label htmlFor="feedback-message" className="sr-only">
              your feedback
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              maxLength={1200}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="what would you change? what do you wish it did?"
              className="w-full rounded-2xl ring-1 ring-forest/20 bg-transparent px-4 py-3 text-[14px] text-forest placeholder:text-forest/45 placeholder:font-serif placeholder:italic focus:outline-none focus:ring-2 focus:ring-forest/40 transition resize-none"
            />

            <label htmlFor="feedback-email" className="sr-only">
              email (optional)
            </label>
            <input
              id="feedback-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email (optional, if you want a reply)"
              className="w-full rounded-full ring-1 ring-forest/20 bg-transparent px-5 py-3 text-[14px] text-forest placeholder:text-forest/45 placeholder:font-serif placeholder:italic focus:outline-none focus:ring-2 focus:ring-forest/40 transition font-sans not-italic"
            />

            {error && (
              <p role="alert" className="text-[13px] text-sienna not-italic font-sans">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center rounded-full bg-sienna text-oat font-serif italic text-sm py-3 shadow-[0_8px_24px_-12px_rgba(120,44,26,0.5)] hover:bg-sienna-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "sending…" : "send feedback"}
            </button>
          </form>
        )}
      </InfoDialog>
    </>
  );
}

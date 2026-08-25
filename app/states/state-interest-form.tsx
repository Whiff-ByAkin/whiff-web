"use client";

import { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgovgdp";

type Status = "idle" | "submitting" | "success" | "error";

/* The demand signal the States dialog used to collect, now at the foot of the
 * page that shows what a live market gets. Both fields are required because
 * both are the point: the state is the purpose of the form, and the email is
 * what lets the signal lead to a reply.
 *
 * The copy around it asks the visitor to open a state rather than to wait for
 * one (see the section in page.tsx), and the two states of this form follow
 * that through: the button is something they do, and what comes back names
 * the state they just did it for.
 *
 * What it deliberately does not do is show them how close that state is. That
 * number would have to come from somewhere — there is no backend here, only
 * an email in an inbox — and a progress bar with a made-up denominator is the
 * one thing that would make the rest of this page untrustworthy. */
export function StateInterestForm() {
  const [email, setEmail] = useState("");
  const [requestedState, setRequestedState] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // Kept past the reset, because the thank-you names it back to them.
  const [openedState, setOpenedState] = useState("");

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
          source: "states-page",
        }),
      });

      if (!response.ok) {
        throw new Error("Formspree rejected the request");
      }

      setStatus("success");
      setOpenedState(cleanState);
      setEmail("");
      setRequestedState("");
    } catch {
      setStatus("error");
      setError("We couldn’t send that. Please try again.");
    }
  }

  const inputClass =
    "w-full rounded-full border border-line bg-ground px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-shadow focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/25 disabled:opacity-60";

  if (status === "success") {
    return (
      <div aria-live="polite">
        <p className="font-display text-xl font-semibold text-ink">
          you just moved the map.
        </p>
        <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-ink-muted">
          {openedState} is on the board, and every name from there brings it
          closer. we’ll write to you first when it opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="space-y-3">
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
            className={inputClass}
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
            onChange={(event) => setRequestedState(event.target.value)}
            disabled={status === "submitting"}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={
          status === "submitting" || !email.trim() || !requestedState.trim()
        }
        className="btn-ink mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <span className="spinner" /> sending…
          </>
        ) : (
          "open my state"
        )}
      </button>
    </form>
  );
}

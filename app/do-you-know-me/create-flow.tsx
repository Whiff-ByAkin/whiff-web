"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MATCH_PROMPTS } from "@/lib/match-prompts";
import { WhiffAd } from "./whiff-ad";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateFlow() {
  const reduce = useReducedMotion();

  const [promptId, setPromptId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [friendName, setFriendName] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ code: string; ownerKey: string } | null>(null);

  const selected = MATCH_PROMPTS.find((p) => p.id === promptId) ?? null;
  const ready =
    !!selected &&
    !!answer.trim() &&
    !!friendName.trim() &&
    EMAIL_PATTERN.test(email.trim());

  async function handleCreate() {
    if (!selected || !ready) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: selected.id,
          answer,
          friendName,
          email,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.code) {
        setResult({ code: data.code, ownerKey: data.ownerKey });
      } else {
        setError(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setStatus("idle");
    }
  }

  if (result) {
    return <SharePanel result={result} friendName={friendName} />;
  }

  return (
    <div className="mt-8 sm:mt-10">
      <header className="max-w-3xl">
        <p className="mb-2.5 text-xs font-medium uppercase tracking-[0.22em] text-sienna-hover sm:mb-3">
          are you with your people?
        </p>
        <h1 className="font-serif text-3xl leading-[1.05] text-forest sm:text-5xl md:text-6xl">
          find out if they <span className="italic text-sienna">really get you</span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted sm:mt-4 sm:text-[16px]">
          answer one honest prompt. send it to someone close. see if they can guess
          what you said.
        </p>
      </header>

      <WhiffAd />

      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* left: the prompt bank */}
        <section aria-label="choose a prompt">
          <h2 className="mb-4 font-serif text-lg text-forest/70">choose your prompt</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {MATCH_PROMPTS.map((p) => {
              const active = p.id === promptId;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setPromptId(p.id);
                      setError(null);
                    }}
                    className={`group flex h-full w-full items-start gap-3 rounded-2xl px-5 py-4 text-left font-serif text-[15px] leading-snug transition-all ${
                      active
                        ? "bg-sienna/10 text-forest ring-2 ring-sienna"
                        : "bg-card text-forest ring-1 ring-forest/10 hover:-translate-y-0.5 hover:ring-terracotta/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] transition-colors ${
                        active
                          ? "border-sienna bg-sienna text-oat"
                          : "border-forest/25 text-transparent group-hover:border-terracotta"
                      }`}
                    >
                      ✓
                    </span>
                    <span>{p.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* right: your answer + who + email, sticky */}
        <section className="lg:sticky lg:top-8 lg:self-start">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="rounded-3xl bg-card p-6 ring-1 ring-forest/10 sm:p-7"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-sienna-hover">
              {selected ? "your honest answer" : "start here"}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={selected?.id ?? "none"}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="mb-4 font-serif text-lg leading-snug text-forest"
              >
                {selected ? selected.text : "pick a prompt on the left to begin."}
              </motion.p>
            </AnimatePresence>

            <label htmlFor="answer" className="sr-only">
              your answer
            </label>
            <textarea
              id="answer"
              rows={2}
              maxLength={140}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!selected}
              placeholder={selected ? "fill in the blank…" : "choose a prompt first"}
              className="w-full resize-none rounded-2xl bg-oat px-4 py-3 text-[16px] text-forest ring-1 ring-forest/15 placeholder:text-forest/35 focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
            />
            <p className="mb-4 mt-1 text-right text-xs text-muted">{answer.length}/140</p>

            <div className="grid gap-4">
              <div>
                <label htmlFor="friend" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-forest/75">
                  who&rsquo;s this for?
                </label>
                <input
                  id="friend"
                  type="text"
                  maxLength={40}
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="e.g. sam"
                  className="w-full rounded-full bg-oat px-5 py-3 text-[15px] text-forest ring-1 ring-forest/15 placeholder:text-forest/35 focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <p className="mt-1.5 px-1 text-xs leading-relaxed text-forest/60">
                  their name becomes the magic word 🔒 — only they can unlock it.
                </p>
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-forest/75">
                  your email
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "create-error" : undefined}
                  className="w-full rounded-full bg-oat px-5 py-3 text-[15px] text-forest ring-1 ring-forest/15 placeholder:text-forest/35 focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <p className="mt-1.5 px-1 text-xs leading-relaxed text-forest/60">
                  we&rsquo;ll send a little digital gift 🎁 here, and ping you when
                  they guess.
                </p>
              </div>
            </div>

            {error && (
              <p id="create-error" role="alert" className="mt-3 text-sm text-sienna">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!ready || status === "submitting"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sienna px-7 py-3.5 font-serif italic tracking-wide text-oat transition-colors hover:bg-sienna-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? "creating…" : "get my link →"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function SharePanel({
  result,
  friendName,
}: {
  result: { code: string; ownerKey: string };
  friendName: string;
}) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/g/${result.code}`;
  const ownerUrl = `${origin}/g/${result.code}?k=${result.ownerKey}`;
  const who = friendName || "them";

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-sienna-hover">
          your game is live
        </p>
        <h1 className="font-serif text-4xl leading-[1.05] text-forest sm:text-5xl md:text-6xl">
          send it to <span className="italic text-sienna">{who}</span>
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">
          share this link. tell them the magic word is their own name. only they
          can unlock it.
        </p>
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2 rounded-full bg-card p-1.5 pl-5 ring-1 ring-forest/15">
          <span className="flex-1 truncate text-left text-sm text-forest/70">{shareUrl}</span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "link copied to clipboard" : "copy share link to clipboard"}
            className="shrink-0 rounded-full bg-sienna px-6 py-2.5 font-serif text-sm italic tracking-wide text-oat transition-colors hover:bg-sienna-hover"
          >
            {copied ? "copied ✓" : "copy link"}
          </button>
        </div>
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? "link copied to clipboard" : ""}
        </span>

        <div className="mt-5 rounded-2xl bg-forest/5 px-5 py-4 ring-1 ring-forest/10">
          <p className="text-sm leading-relaxed text-forest">
            <span className="font-medium">bookmark your reveal.</span> come back any
            time to see if {who} nailed it. we&rsquo;ll also email you when they do.
          </p>
          <a
            href={ownerUrl}
            className="mt-2 inline-block text-sm font-medium text-sienna underline underline-offset-2 hover:text-sienna-hover"
          >
            open my private reveal →
          </a>
        </div>

        <a
          href="/do-you-know-me"
          className="mt-6 inline-block text-sm text-muted underline underline-offset-2 hover:text-forest"
        >
          start another
        </a>
      </div>
    </div>
  );
}

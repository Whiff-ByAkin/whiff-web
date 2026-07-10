"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MatchStatus } from "@/lib/match";

type Reveal = { promptText: string; answer: string; guess: string };

/* ---------- friend: magic word -> guess -> reveal ---------- */

export function GuessFlow({
  code,
  promptText,
  alreadyAnswered,
}: {
  code: string;
  promptText: string;
  alreadyAnswered: boolean;
}) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<"magic" | "guess" | "reveal">("magic");
  const [magicWord, setMagicWord] = useState("");
  const [guess, setGuess] = useState("");
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(finalGuess: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/match/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ magicWord, guess: finalGuess }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.reveal) {
        setReveal(data.reveal);
        setStage("reveal");
      } else {
        setError(data?.error ?? "Something went wrong. Please try again.");
        if (res.status === 403) setStage("magic");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 30 };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
        transition={transition}
      >
        {stage === "magic" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!magicWord.trim() || busy) return;
              // Open game: reveal the prompt and let them guess. Already
              // answered: a view-only re-open (empty guess) to re-see it.
              if (alreadyAnswered) {
                submit("");
              } else {
                setError(null);
                setStage("guess");
              }
            }}
            className="text-center"
          >
            <Eyebrow>{alreadyAnswered ? "already played 👀" : "you’ve been summoned"}</Eyebrow>
            <h1 className="mb-2 font-serif text-3xl leading-tight text-forest sm:text-4xl">
              someone wants to know if you{" "}
              <span className="italic text-sienna">really get them</span>
            </h1>
            <p className="mb-7 text-[15px] text-muted">
              enter the magic word to {alreadyAnswered ? "see how it went" : "unlock their prompt"}.
              <br />
              <span className="text-forest/70">(hint: it&rsquo;s your name.)</span>
            </p>
            <label htmlFor="magic" className="sr-only">
              the magic word
            </label>
            <input
              id="magic"
              autoFocus
              type="text"
              maxLength={60}
              value={magicWord}
              onChange={(e) => setMagicWord(e.target.value)}
              placeholder="the magic word…"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "magic-error" : undefined}
              className="w-full rounded-full bg-card px-5 py-3.5 text-center text-[16px] text-forest ring-1 ring-forest/20 placeholder:text-forest/35 focus:outline-none focus:ring-2 focus:ring-forest"
            />
            {error && (
              <p id="magic-error" role="alert" className="mt-3 text-sm text-sienna">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!magicWord.trim() || busy}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sienna px-8 py-3 font-serif italic tracking-wide text-oat transition-colors hover:bg-sienna-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "unlocking…" : "unlock 🔓"}
            </button>
          </form>
        )}

        {stage === "guess" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!guess.trim() || busy) return;
              submit(guess.trim());
            }}
            className="text-center"
          >
            <Eyebrow>your guess</Eyebrow>
            <p className="mb-6 text-[15px] text-muted">
              how do you think they filled this in?
            </p>
            <PromptCard text={promptText} />
            <label htmlFor="guess" className="sr-only">
              your guess
            </label>
            <textarea
              id="guess"
              autoFocus
              rows={3}
              maxLength={140}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="i think they&rsquo;d say…"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "guess-error" : undefined}
              className="w-full resize-none rounded-2xl bg-card px-5 py-4 text-left text-[16px] text-forest ring-1 ring-forest/20 placeholder:text-forest/35 focus:outline-none focus:ring-2 focus:ring-forest"
            />
            {error && (
              <p id="guess-error" role="alert" className="mt-3 text-sm text-sienna">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!guess.trim() || busy}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sienna px-8 py-3 font-serif italic tracking-wide text-oat transition-colors hover:bg-sienna-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "revealing…" : "lock in my guess"}
            </button>
          </form>
        )}

        {stage === "reveal" && reveal && (
          <Reveal
            reveal={reveal}
            leftLabel="your guess"
            leftValue={reveal.guess}
            rightLabel="their real answer"
            rightValue={reveal.answer}
            footer="matched? only you two know. that’s the whole point."
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- owner: waiting or reveal ---------- */

export function OwnerView({
  promptText,
  answer,
  friendName,
  guess,
  status,
}: {
  promptText: string;
  answer: string;
  friendName: string;
  guess: string | null;
  status: MatchStatus;
}) {
  if (status !== "answered" || guess === null) {
    return (
      <div className="text-center">
        <Eyebrow>your game</Eyebrow>
        <h1 className="mb-2 font-serif text-3xl text-forest sm:text-4xl">
          waiting on <span className="italic text-sienna">{friendName}</span>
        </h1>
        <p className="mb-7 text-[15px] text-muted">
          they haven&rsquo;t guessed yet. we&rsquo;ll email you the moment they do,
          or just check back here.
        </p>
        <div className="rounded-2xl bg-card px-5 py-4 text-left ring-1 ring-forest/10">
          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-sienna-hover">
            your answer
          </p>
          <p className="font-serif text-lg text-forest">{promptText}</p>
          <p className="mt-2 text-[15px] text-forest/80">{answer}</p>
        </div>
      </div>
    );
  }

  return (
    <Reveal
      reveal={{ promptText, answer, guess }}
      leftLabel="your answer"
      leftValue={answer}
      rightLabel={`${friendName}’s guess`}
      rightValue={guess}
      footer="did they get you? you already know the answer."
    />
  );
}

/* ---------- shared reveal ---------- */

function Reveal({
  reveal,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  footer,
}: {
  reveal: Reveal;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  footer: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="text-center">
      <Eyebrow>the reveal</Eyebrow>
      <PromptCard text={reveal.promptText} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          { label: leftLabel, value: leftValue, tone: "guess" },
          { label: rightLabel, value: rightValue, tone: "answer" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 0.12 + i * 0.14, type: "spring", stiffness: 300, damping: 26 }}
            className={`rounded-2xl px-5 py-4 text-left ring-1 ${
              card.tone === "answer"
                ? "bg-sienna/10 ring-sienna/25"
                : "bg-card ring-forest/10"
            }`}
          >
            <p className="mb-1 text-xs uppercase tracking-[0.18em] text-sienna-hover">
              {card.label}
            </p>
            <p className="text-[16px] leading-snug text-forest">{card.value}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-[15px] italic text-muted">{footer}</p>

      <div className="mt-8 rounded-2xl bg-forest/5 px-5 py-5 ring-1 ring-forest/10">
        <p className="font-serif text-lg text-forest">
          want more people who <span className="italic text-sienna">actually get you</span>?
        </p>
        <p className="mt-1 text-[14px] text-muted">
          that&rsquo;s the whole idea behind whiff.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded-full bg-sienna px-7 py-3 font-serif italic tracking-wide text-oat transition-colors hover:bg-sienna-hover"
        >
          meet whiff →
        </a>
      </div>

      <a
        href="/do-you-know-me"
        className="mt-6 inline-block text-sm text-muted underline underline-offset-2 hover:text-forest"
      >
        play it with someone else
      </a>
    </div>
  );
}

/* ---------- bits ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-sienna-hover">
      {children}
    </p>
  );
}

function PromptCard({ text }: { text: string }) {
  return (
    <p className="rounded-2xl bg-card px-5 py-4 font-serif text-lg leading-snug text-forest ring-1 ring-forest/10">
      {text}
    </p>
  );
}

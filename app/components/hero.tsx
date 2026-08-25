"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ApplyCTA } from "@/app/components/invite-cta";
import { TypeDeck } from "./type-deck";
import { PROMISE } from "@/app/seo-content";

// Each element gets its own delay and a spring-like ease, so the entrance never
// reads as one uniform fade (a classic AI-slop tell).
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

// Reduced motion keeps the server's initial frame so hydration is deterministic,
// then clears it immediately instead of travelling or blurring on screen.
//
// The initial values deliberately match `reveal`: reduced-motion preference is
// only known in the browser, and changing this frame during the first client
// render would produce a hydration mismatch.
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0, ease: "linear" as const, delay: delay * 0 },
});

/* The card is the hero now.
 *
 * The mascot video argued against a serious pitch, so the app removed the
 * jellyfish from its welcome screen — and the site follows. What replaced it
 * is the product's own artifact: the deck of six role cards the reading
 * produces, and the rail beneath them that shows which roles belong in the
 * same Circle. The visitor plays with the deck, and the deck answers "what do
 * I get?" — you get read, then seated with three people who fit.
 *
 * Desktop is an asymmetric two-column composition: the story reads down the
 * left edge (kicker → headline → aside → ask), the deck holds the right, and
 * nothing is centred — centred-everything is the template look this layout
 * exists to escape. On a phone the columns fold into one centred stack with
 * the deck between the headline and the ask. */
export function Hero() {
  const reduce = useReducedMotion();
  const R = reduce ? fade : reveal;

  // The open form grows upward over the aside; the aside steps aside. A CSS
  // opacity transition (zeroed globally under reduced motion) rather than a
  // motion prop, because the aside's motion props are spent on the entrance.
  const [askOpen, setAskOpen] = useState(false);

  // The deck's closing card ends on "Begin your experience"; each press bumps
  // the nonce and the form opens directly beneath the deck. That button is
  // the page's only one, so this is the only thing that opens the form here.
  const [joinNonce, setJoinNonce] = useState(0);

  return (
    <section
      aria-label="What whiff is"
      // The page owns the height (h-[100svh], overflow-hidden) and this fills
      // whatever is left between the header and the legal hairline. min-h-0 is
      // required on a flex child that must be allowed to shrink; without it
      // this would refuse to go below its content height and push the footline
      // off the bottom of a short window.
      className="hero-shell relative flex min-h-0 flex-1 flex-col px-6 pb-[clamp(0.5rem,2vh,1.25rem)] pt-[clamp(3.2rem,8vh,4.5rem)] md:px-10"
    >
      <div className="hero-grid mx-auto flex min-h-0 w-full max-w-[68rem] flex-1 flex-col items-center justify-center gap-[clamp(0.55rem,2.2vh,1.1rem)] md:grid md:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] md:grid-rows-[auto_auto] md:items-center md:gap-x-[clamp(1.25rem,3.5vw,3.5rem)] md:gap-y-[clamp(0.9rem,3.2vh,2rem)]">
        {/* ── The story ─────────────────────────────────────────────── */}
        <div className="hero-story flex min-h-0 flex-col items-center gap-[clamp(0.4rem,1.8vh,0.9rem)] text-center md:col-start-1 md:row-start-1 md:items-start md:self-end md:text-left">
          {/* Handwriting is whiff's voice, and the app's rule travels to the
              site: exactly one handwritten line per screen. This is it — the
              one line the whole site has to land, in the hand that signs it. */}
          <motion.p
            {...R(0)}
            style={{ rotate: -2 }}
            className="hero-kicker font-hand text-[clamp(1.35rem,5vw,1.9rem)] leading-tight text-ink"
          >
            {PROMISE.toLowerCase()}
          </motion.p>

          <motion.h1
            {...R(0.1)}
            className="hero-headline max-w-[21rem] text-balance font-display text-[clamp(1.35rem,6vw,2.6rem)] font-semibold leading-[1.12] tracking-tight text-ink sm:max-w-[26rem] md:max-w-none md:text-wrap md:text-[clamp(1.7rem,3.6vw,3.15rem)]"
          >
            {/* One sentence a line: the three claims read as three beats, not
                as wherever the column runs out of room. */}
            Six activities.
            <br /> Twelve weeks.
            <br /> Same four people.
          </motion.h1>

          {/* What happens before your circle exists — framed as being wanted
              rather than parked. The hairline and the "meanwhile" label keep
              its footnote register; on a phone it yields its room to the deck. */}
          <motion.div
            {...R(0.22)}
            aria-hidden={askOpen || undefined}
            className="hero-aside mt-[clamp(0.4rem,1.8vh,1rem)] hidden w-full max-w-[28rem] md:flex"
          >
            {/* The fade rides an inner wrapper: the motion parent keeps its
                entrance styles inline (opacity: 1), which would out-rank any
                opacity class set on the same element. */}
            <div
              className={`flex w-full flex-col gap-[clamp(0.3rem,1.2vh,0.55rem)] transition-opacity duration-200 ${
                askOpen ? "pointer-events-none opacity-0" : ""
              }`}
            >
              <div className="flex w-full items-center gap-[0.7em]">
                <span className="font-body text-[clamp(0.52rem,0.9vw,0.63rem)] font-bold uppercase tracking-[0.2em] text-ink-muted">
                  meanwhile
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-gradient-to-r from-line to-transparent"
                />
              </div>

              <p className="text-balance font-body text-[clamp(0.8rem,1.15vw,0.98rem)] leading-relaxed text-ink-muted">
                While we find the people who{" "}
                <span className="font-display font-semibold text-ink">
                  bring out your best
                </span>
                ,{/* the clause break is the rhythm of the line */}
                <br /> other circles{" "}
                <span className="font-display font-semibold text-ink">
                  invite you along
                </span>{" "}
                to activities whiff knows you love.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── The deck ──────────────────────────────────────────────── */}
        <motion.div
          {...R(0.32)}
          className="hero-deck flex flex-col items-center md:col-start-2 md:row-span-2 md:row-start-1 md:-ml-6 md:justify-self-center"
        >
          <TypeDeck onJoin={() => setJoinNonce((n) => n + 1)} />

          {/* ── The ask ─────────────────────────────────────────────────
              No pill of its own: this is the panel the closing card's button
              opens, and it lives inside the deck's column so the form grows
              out of the card that was pressed rather than across the page
              from it. Collapsed to nothing until then. */}
          <div className="hero-ask flex w-full shrink-0 flex-col items-center">
            <ApplyCTA
              onOpenChange={setAskOpen}
              openNonce={joinNonce}
              hideTrigger
            />
          </div>
        </motion.div>

        {/* Nunito italic, not Caveat — the handwriting is spent on the
            kicker, and two hands on one screen is a ransom note. */}
        <motion.p
          {...R(0.54)}
          style={{ rotate: -2 }}
          className="hero-disclaimer font-body text-[clamp(0.78rem,3.2vw,1.1rem)] italic text-ink-muted md:col-start-1 md:row-start-2 md:self-start md:pl-2 md:text-[clamp(0.85rem,1.3vw,1.1rem)]"
        >
          this is not a dating app.
        </motion.p>
      </div>
    </section>
  );
}

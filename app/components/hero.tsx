"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CircleHalo } from "./circle-halo";
import { MascotMedia } from "./mascot-media";
import { ApplyCTA } from "@/app/components/invite-cta";
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

export function Hero() {
  const reduce = useReducedMotion();
  const R = reduce ? fade : reveal;

  // Reaching for the button closes the open place in the ring above it.
  const [reaching, setReaching] = useState(false);

  return (
    <section
      aria-label="What whiff is"
      // The page owns the height now (h-[100svh], overflow-hidden) and this
      // fills whatever is left between the header and the legal hairline.
      // min-h-0 is required on a flex child that must be allowed to shrink;
      // without it this would refuse to go below its content height and push
      // the footline off the bottom of a short window.
      className="hero-shell relative flex min-h-0 flex-1 flex-col items-center px-6 pb-[clamp(0.5rem,2vh,1.25rem)] pt-[clamp(3.5rem,9vh,5rem)] text-center md:px-10"
    >
      {/* Two stacks, not one centred block.

          The story (mascot → headline → promise → aside) settles into the
          middle of whatever room is left, and the ask (button → disclaimer) is
          held at the bottom just above the legal links, so on every screen the
          last thing the eye reaches is the thing to press. The section's bottom
          padding is the fixed footer's own height — plus the iPhone safe-area
          inset — so nothing ever lands underneath it. */}
      {/* flex-auto, not flex-1: `flex-1` is `flex: 1 1 0%`, and a basis of zero
          means this stack contributes nothing to the section's intrinsic
          height, so `min-h-[100svh]` above never grew and the copy overflowed
          into the button. `min-h-0` compounded it by waiving the default
          min-height:auto that stops a flex item shrinking past its content.
          With basis auto and that floor restored, the section grows on a short
          window and is unchanged on a tall one. */}
      <div className="hero-story flex flex-auto flex-col items-center justify-center gap-[clamp(0.6rem,2.6vw,1.25rem)]">
        {/* Three filled places and one still open, orbiting the mascot. It says
            "four" without the page spending a word on it.

            The ring is drawn at 144% of the mascot and sits outside the flow,
            so it used to hang over the kicker and put a dot through the middle
            of the words. The mascot's height is a variable here for exactly one
            reason: the padding below can be derived from it, which reserves the
            ring's overhang at every screen size without a single breakpoint. */}
        {/* The entrance moved off this wrapper and onto the mascot itself, and
            the wrapper became a plain div, because the wrapper now also carries
            the dark field of the dawn (inside CircleHalo). A wrapper animating
            from opacity 0 would take the dark with it and flash the lit page
            for the first frames — the exact thing the dawn exists to prevent.

            Deliberately no z-index here: the lift the dark needs is temporary
            and CircleHalo owns it. This must stay a plain, unpositioned box so
            that lift reaches the root stacking context. */}
        <div className="hero-ornament">
          <CircleHalo filled={reaching}>
            <motion.div {...R(0)}>
              <MascotMedia />
            </motion.div>
          </CircleHalo>
        </div>

        {/* A kicker, not a line of copy — different size, different register, so
            it frames the headline instead of competing with it.

            It used to read "Discover what's possible", which is a sentence any
            company on earth could run and which tells a first-time visitor
            nothing. This is the actual proposition, and it is the one line the
            whole site is built to land — so it is the first thing read, above
            the headline, and it is real sentence case rather than tracked-out
            micro-caps because it is meant to be read, not decorated. */}
        <motion.p
          {...R(0.1)}
          className="hero-kicker max-w-[24rem] text-balance font-body text-[clamp(0.72rem,2.9vw,0.95rem)] font-semibold text-ink/85 sm:max-w-none"
        >
          {PROMISE}
        </motion.p>

        {/* **The headline stopped making a promise it can't keep.**

            The previous line implied a group already assembled and holding a
            chair — so anyone who joined and waited
            would feel lied to on day one. This describes what whiff does
            instead of what it has in stock, and it's a claim that stays true
            from the very first signup.

            It also avoids the word "friends". They aren't yet; that's the point
            of the twelve weeks, and the signature by the wordmark is where the
            friendship gets promised. "Same four people" is honest, and "same" is
            the entire argument against every rival app that hands you new
            strangers on a loop — and "strangers only on week one" is the answer
            to it, because "same" alone would sound like you're being handed
            people you already know. */}
        <motion.h1
          {...R(0.18)}
          className="hero-headline max-w-[20rem] text-balance font-display text-[clamp(1.2rem,6vw,2.6rem)] font-semibold leading-[1.15] tracking-tight text-ink sm:max-w-none sm:whitespace-nowrap sm:text-[clamp(1.1rem,3.7vw,2.6rem)]"
        >
          Six activities. Twelve weeks. Same four people.
        </motion.h1>

        <motion.p
          {...R(0.28)}
          className="hero-subhead max-w-[22rem] text-balance font-display text-[clamp(0.95rem,4.2vw,1.2rem)] font-semibold text-ink sm:max-w-none sm:whitespace-nowrap sm:text-[clamp(0.9rem,2.7vw,1.2rem)]"
        >
          Strangers only on week one.
        </motion.p>

        {/* What happens before your circle exists — framed as being wanted
            rather than parked. "Bring out your best" is the promise of the
            matching; "invite you along" is the promise of the waiting.

            It's set as an aside rather than a third line of copy, because a
            long grey sentence stacked under two short bold ones reads as fine
            print. The hairline and the "meanwhile" label give it its own
            register: this is the answer to "what happens while I wait", so it
            should look like a footnote to the promise instead of competing with
            it. The two phrases doing the emotional work step up into the
            display face, so the eye catches them before it reads the sentence. */}
        <motion.div
          {...R(0.36)}
          // The top margin is the whole reason this reads as a footnote rather
          // than a fourth line of the headline: it drops the block clear of the
          // promise above it, and it scales with the viewport so the gap is
          // proportional on a phone and on a monitor.
          className="hero-aside mt-[clamp(0.55rem,2.6vh,1.6rem)] flex w-full max-w-[19rem] flex-col items-center gap-[clamp(0.3rem,1.3vw,0.55rem)] sm:max-w-[34rem]"
        >
          <div className="flex w-full items-center gap-[0.7em]">
            <span
              aria-hidden
              className="h-px flex-1 bg-gradient-to-r from-transparent to-line"
            />
            <span className="font-body text-[clamp(0.52rem,2.1vw,0.63rem)] font-bold uppercase tracking-[0.2em] text-ink-muted">
              meanwhile
            </span>
            <span
              aria-hidden
              className="h-px flex-1 bg-gradient-to-l from-transparent to-line"
            />
          </div>

          <p className="text-balance font-body text-[clamp(0.72rem,3.1vw,0.95rem)] leading-relaxed text-ink-muted sm:text-[clamp(0.8rem,2.2vw,0.95rem)]">
            While we find the people who{" "}
            <span className="font-display font-semibold text-ink">
              bring out your best
            </span>
            ,{/* the clause break is the rhythm of the line, so on anything
                  wider than a phone it becomes a real break rather than
                  wherever the text happens to run out of room */}
            <br className="hidden sm:inline" /> other circles{" "}
            <span className="font-display font-semibold text-ink">
              invite you along
            </span>{" "}
            to activities whiff knows you love.
          </p>
        </motion.div>
      </div>

      {/* The ask. It sits at the bottom of the screen rather than in the middle
          of the stack, so the gap between the button and the legal links stays
          the same at every height — both are measured from the same edge. */}
      <div className="hero-ask flex shrink-0 flex-col items-center gap-[clamp(0.5rem,2vw,0.95rem)] pt-[clamp(0.9rem,3.5vh,2rem)]">
        <motion.div {...R(0.46)}>
          <ApplyCTA onReachChange={setReaching} />
        </motion.div>

        <motion.p
          {...R(0.56)}
          className="hero-disclaimer font-body text-[clamp(0.78rem,3.4vw,1.25rem)] italic text-ink-muted sm:text-[clamp(0.85rem,2.9vw,1.25rem)]"
          style={{ transform: "rotate(-2deg)" }}
        >
          this is not a dating app.
        </motion.p>

        {/* The "What is whiff? ↓" cue lived here. It pointed at #what-is-whiff
            on a section that no longer exists, and the site is deliberately one
            screen now — so a prompt to scroll would be sending people to the
            footer. */}
      </div>
    </section>
  );
}

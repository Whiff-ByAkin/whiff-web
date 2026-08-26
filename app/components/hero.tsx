"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { InviteForm } from "@/app/components/invite-cta";
import { RoleExplorer } from "@/app/components/role-explorer";
import { CLOSING, ROLES } from "@/app/config/roles";
import { BET, PROMISE } from "@/app/seo-content";

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

/* Claim, artifact, ask.
 *
 * The headline says what whiff sells, the explorer shows the thing it makes
 * (six roles, and which of them sit well together), and one button asks for
 * the one piece of information whiff needs to start. The field itself waits
 * behind that button and opens in its place — a resting form is three empty
 * grey boxes asking to be filled in by somebody who has not decided yet.
 *
 * There are two places that ask, and never at the same time: the button here,
 * and the explorer's seventh panel. `tab` is in this component for that one
 * reason — while the seventh panel is up, the button steps aside.
 *
 * Desktop is two columns — the claim and the ask read down the left edge, the
 * explorer holds the right, and nothing is centred, because centred-everything
 * is the template look this layout exists to escape. A phone folds them into
 * one centred stack in reading order: claim, bet, explorer, ask.
 *
 * The "meanwhile" aside used to live under the headline, explaining what
 * happens while your Circle is being assembled. The explorer took its room and
 * does more with it; that promise is still made in the /blog copy and in the
 * success chip after you sign up. */
export function Hero({
  // Which tab the explorer opens on. /roles/spark is this screen with Spark
  // already showing, so a link somebody was sent lands them inside the thing
  // it was about rather than on the first role in the list.
  initialRole,
}: {
  initialRole?: string;
} = {}) {
  const reduce = useReducedMotion();
  const R = reduce ? fade : reveal;

  // Which panel the explorer is showing. The page needs it for one reason:
  // the seventh panel ends on the same ask as the button beside it, and two
  // controls saying "Get your invite" at once is one too many.
  const [tab, setTab] = useState(initialRole ?? ROLES[0].id);

  return (
    <section
      aria-label="What whiff is"
      // From 768px up the page owns the height (h-[100svh], overflow-hidden)
      // and this fills whatever is left between the header and the legal
      // hairline: `md:min-h-0` is what allows a flex child to shrink below its
      // content, and it is why the composition scales down on a short window
      // instead of pushing the footline off the bottom.
      //
      // Below 768px it is deliberately absent. A 640px-tall phone was clipping
      // the handwritten line off the top, because a centred box that cannot
      // grow loses its overflow at both ends. There the page grows and scrolls
      // the last few pixels instead.
      className="hero-shell relative flex flex-1 flex-col px-5 pb-[clamp(0.5rem,2vh,1.25rem)] pt-[4.9rem] min-[380px]:px-6 min-[400px]:pt-[5.9rem] md:min-h-0 md:px-10 md:pt-[clamp(4.25rem,8vh,4.75rem)]"
    >
      <div className="hero-grid mx-auto flex w-full max-w-[70rem] flex-1 flex-col items-center justify-center gap-[clamp(0.7rem,2.4vh,1.3rem)] md:min-h-0 md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-center md:gap-[clamp(1.5rem,4vw,3.75rem)]">
        {/* The left column is one stack on a desktop and no box at all on a
            phone: `contents` dissolves this wrapper into the flex column
            above, which is what lets the explorer sit between the headline
            and the field on a phone (reading order: claim, proof, ask) while
            staying a single vertically centred column beside them on a
            desktop. A grid row per element gave the same DOM two layouts and
            neither spaced well. */}
        <div className="hero-story contents text-center md:flex md:flex-col md:items-start md:text-left">
          {/* Handwriting is whiff's voice, and the app's rule travels to the
              site: exactly one handwritten line per screen. This is it — the
              one line the whole site has to land, in the hand that signs it. */}
          <motion.p
            {...R(0)}
            style={{ rotate: -2 }}
            className="hero-kicker order-1 font-hand text-[clamp(1.3rem,4.8vw,1.9rem)] leading-tight text-ink"
          >
            {PROMISE.toLowerCase()}
          </motion.p>

          <motion.h1
            {...R(0.1)}
            className="hero-headline order-2 max-w-[21rem] text-balance font-display text-[clamp(1.4rem,6vw,2.6rem)] font-semibold leading-[1.12] tracking-tight text-ink sm:max-w-[26rem] md:mt-[0.35rem] md:max-w-none md:text-wrap md:text-[clamp(1.7rem,3.5vw,3.05rem)]"
          >
            {/* One sentence a line: the three claims read as three beats, not
                as wherever the column runs out of room. */}
            Six activities.
            <br /> Twelve weeks.
            <br /> Same four people.
          </motion.h1>

          {/* ── The bet ─────────────────────────────────────────────────
              The thing whiff actually stakes money on, and until now it was a
              0.8rem grey line under the button — the size of a disclaimer,
              which is how it read. It sits in the claim now, directly under
              the headline it completes: three facts, then the wager on them.

              A dashed stub rather than a filled block, because the button
              below is the only ink-filled shape in this column and a second
              one would fight it for the press. */}
          <motion.div {...R(0.34)} className="hero-bet order-3">
            <p className="hero-bet-label">{BET.label}</p>
            <p className="hero-bet-line">
              {BET.dare}{" "}
              {/* The only half of the sentence set in ink: the condition is
                  the reader's work, the payoff is whiff's money. */}
              <strong>{BET.payoff}</strong>
            </p>
          </motion.div>

          {/* ── The ask ─────────────────────────────────────────────── */}
          <motion.div
            {...R(0.42)}
            // The gap above the ask is the largest on the phone layout, and
            // deliberately: the explorer is something to read, the button is
            // something to do, and the two should not look like one stack of
            // controls. The room came from the footline, which no longer
            // renders at this width.
            className="hero-ask order-5 mt-[clamp(1.1rem,4.5vh,2.75rem)] flex w-full justify-center md:mt-[clamp(1.1rem,3.6vh,2.1rem)] md:justify-start"
          >
            <InviteForm triggerHidden={tab === CLOSING.id} />
          </motion.div>

          {/* Nunito italic, not Caveat — the handwriting is spent on the
              kicker, and two hands on one screen is a ransom note. */}
          <motion.p
            {...R(0.54)}
            style={{ rotate: -2 }}
            className="hero-disclaimer order-6 font-body text-[clamp(0.78rem,3.2vw,1.05rem)] italic text-ink-muted md:mt-[clamp(0.7rem,2.2vh,1.2rem)] md:pl-2"
          >
            this is not a dating app.
          </motion.p>
        </div>

        {/* ── The artifact ──────────────────────────────────────────── */}
        <motion.div
          {...R(0.28)}
          className="hero-explorer order-4 flex w-full justify-center md:order-none md:col-start-2"
        >
          <RoleExplorer
            active={tab}
            onActiveChange={setTab}
            // The closing panel's ask opens the field in the other column. It
            // goes through the same window event the header and /#begin use,
            // so there is one way in, not three.
            onBegin={() => window.dispatchEvent(new Event("whiff:begin"))}
          />
        </motion.div>
      </div>
    </section>
  );
}

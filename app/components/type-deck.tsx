"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/* The product's own artifact as the hero: the deck of role cards the app
 * writes after its reading. Six cards, one per role, and a rail of six ticks
 * underneath that is the real point of the object — the current role's tick is
 * filled, the three it clicks with are outlined, the other two are faint. The
 * compatibility graph is therefore visible the whole time, and by the third
 * card a visitor has absorbed "four complementary people in a room" without
 * reading a word of explainer. Navigation IS the pitch.
 *
 * Every card's text is real DOM text rendered on the server, so all six roles
 * are crawlable even though only the top card is exposed to a screen reader.
 * Rotations are fixed per card — no Math.random at render — so the server and
 * client draw the identical scatter and hydration stays deterministic. */

type RoleId = "host" | "connector" | "spark" | "scout" | "diver" | "anchor";

type Role = {
  id: RoleId;
  name: string;
  /** The card's hero line: a second-person read, not a label. */
  read: string;
  /** Exactly three, and the graph is symmetric — see the note below. */
  clicksWith: RoleId[];
};

/* The pairings are a SYMMETRIC graph: if A clicks with B, B clicks with A.
 * Nine edges, every role with exactly three matches. That is what lets the
 * rail light up honestly — an outlined tick means "these two belong in the
 * same Circle", and it has to mean the same thing read from either end.
 * (Directional pairings would be more interesting, but unlabelled asymmetry
 * on the card reads as a bug rather than as a claim.) */
const ROLES: Role[] = [
  {
    id: "host",
    name: "Host",
    read: "You bring the structure. Ideas turn into actual Saturdays around you.",
    clicksWith: ["spark", "scout", "diver"],
  },
  {
    id: "connector",
    name: "Connector",
    read: "You bring the chemistry. Four strangers turn into a group because you are in it.",
    clicksWith: ["diver", "anchor", "scout"],
  },
  {
    id: "spark",
    name: "Spark",
    read: "You bring the swerve. It was going to be dinner until you said the word karaoke.",
    clicksWith: ["host", "anchor", "scout"],
  },
  {
    id: "scout",
    name: "Scout",
    read: "You bring the map. You knew about the place before it had a line outside.",
    clicksWith: ["host", "spark", "connector"],
  },
  {
    id: "diver",
    name: "Diver",
    read: "You bring the depth. Small talk lasts about nine minutes once you sit down.",
    clicksWith: ["connector", "anchor", "host"],
  },
  {
    id: "anchor",
    name: "Anchor",
    read: "You bring the follow-through. You are the one who is actually there at seven.",
    clicksWith: ["spark", "connector", "diver"],
  },
];

/* The deck ends. After the sixth role it does not wrap back to Host — it
 * turns the question on the reader and asks for the one thing the page wants.
 * A loop says "browse"; an ending says "your turn". */
const CLOSER = {
  eyebrow: "your turn",
  line: "Which one are you?",
  read: "Five questions, in your own words. Then a card of your own, and the three people it fits.",
  cta: "Begin your experience",
};

const COUNT = ROLES.length;
/* Six roles plus the closer. */
const SLOTS = COUNT + 1;
const CLOSER_AT = SLOTS - 1;

const NAME_BY_ID = Object.fromEntries(
  ROLES.map((r) => [r.id, r.name]),
) as Record<RoleId, string>;

/* Cards deeper than this are fully hidden behind the pile. */
const VISIBLE_DEPTH = 3;
/* Where a card that has already been turned goes. Off stage, not round the
 * back — the deck does not cycle, so the pile visibly thins as it runs out,
 * and by the closer there is one card left in the hand. */
const GONE = VISIBLE_DEPTH + 2;

/* Fixed scatter, one angle per card. Small, uneven, and never symmetric — a
 * stack where every card is offset by the same angle reads as CSS; irregular
 * fixed angles read as paper someone set down. */
const JITTER = [-1.6, 1.1, -0.7, 1.9, -1.2, 0.8];

/* The resting stack, by depth. The top card sits a little above the frame's
 * centre so the pile's downward spread straddles it — the frame is the card's
 * box, and a pile that only ever grows downward would hang into the rail. */
const REST_Y = -13;
const DEPTH_Y = 9;
const DEPTH_Z = 22;
const DEPTH_SCALE = 0.035;

/* The deal starts each card from ITS OWN resting pose, pushed down and back —
 * not from one shared point on the table. Cards that rest deeper travel the
 * same distance as the top one, so the pile never inverts on the way in.
 * Dealing every card from one absolute y did invert it: halfway through, the
 * front card was still below the back cards and you could read three cards
 * through each other before the stack resolved. */
const DEAL_DY = 86;
const DEAL_DZ = -240;
const DEAL_SCALE_MUL = 0.88;
const DEAL_STAGGER = 0.095;
/* Opacity resolves in a fraction of the travel. A card that is still 40%
 * transparent while the next one seats behind it is a card you can read two
 * faces through — the whole reason the deal looked broken. */
const DEAL_FADE_S = 0.14;
/* The hero fades its own columns in on a stagger, and the deck's column
 * arrives last. The deal waits for it — otherwise the cards seat themselves
 * behind a wrapper that is still at 40% opacity and nobody sees the deal at
 * all, which is the one thing it exists to be seen doing. */
const DEAL_BASE = 0.46;

/* A real card pivots around the hand holding it, not its own centre: rotation
 * follows horizontal travel. This coefficient is the whole trick — higher and
 * it spins like a fidget toy, lower and it feels like a div. It also carries
 * the throw's 42° on its own, since 760 × 0.055 ≈ 42. */
const PIVOT = 0.055;

/* Release thresholds. Velocity matters as much as distance: a fast short flick
 * has to throw or the deck feels stuck. */
const THROW_DIST = 96;
const THROW_VEL = 0.55; // px/ms
const THROW_X = 760;

/* How far the card under the top one has to be dragged before it has fully
 * risen. It rises DURING the drag, not on release — that is what makes the
 * deck feel like it has depth instead of being a slideshow. */
const LIFT_SPAN = 140;

const THROW_EASE = [0.3, 0.1, 0.2, 1] as const;
/* Overshoots past 1. The tiny settle is what sells the weight. */
const SNAP_EASE = [0.18, 0.89, 0.32, 1.15] as const;
const THROW_S = 0.52;
const SNAP_S = 0.62;
/* The deck's own turn is deliberately nothing like a flick: a slow peel that
 * winds back before it commits. */
const DRIFT_S = 1.15;

/* Autoplay cadence: how long a card holds the top before the deck turns it
 * itself, and how long the deck stays hands-off after a human turn. */
const AUTO_MS = 5200;
const MANUAL_COOLDOWN_MS = 9000;

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/** Everything the cards read off the deck. One set of motion values drives the
 *  top card; the card beneath reads the same `tx` to know how far to rise. */
type Deck = {
  tx: MotionValue<number>;
  ty: MotionValue<number>;
  tz: MotionValue<number>;
  ts: MotionValue<number>;
  glare: MotionValue<string>;
  glareOn: MotionValue<number>;
  reduce: boolean;
  /** A card hands the deck its own opacity value while it is mounted. */
  register: (index: number, fade: MotionValue<number> | null) => void;
};

export function TypeDeck({
  // The closing card's "Begin your experience" — the hero wires it to the
  // form that opens under the deck. This is the page's only such button.
  onJoin,
}: {
  onJoin?: () => void;
} = {}) {
  const reduce = useReducedMotion() === true;
  const [head, setHead] = useState(0);
  // True when the latest turn was the deck's own. It gates the live region:
  // autoplay must never narrate over a screen reader that didn't ask for it.
  const [autoTurn, setAutoTurn] = useState(false);

  const headRef = useRef(0);
  headRef.current = head;
  // Blocks re-entry while the top card is mid-flight.
  const busy = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);
  // A mouse resting on the deck means someone is reading — the deck holds.
  const hover = useRef(false);
  // The moment of the last human turn; autoplay yields for a while after it.
  const lastManual = useRef(0);

  /* The top card's travel. These live on the deck rather than inside a card
   * because two cards need them: the one being thrown, and the one underneath
   * that rises out of its way. */
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const tz = useMotionValue(0);
  const ts = useMotionValue(0);

  /* Each card lends the deck its own opacity value, so a throw can fade the
   * card that is actually leaving rather than "whichever card is on top" —
   * the distinction matters at the exact frame the pile reorders. */
  const fades = useRef<(MotionValue<number> | null)[]>([]);
  const register = useCallback(
    (index: number, fade: MotionValue<number> | null) => {
      fades.current[index] = fade;
    },
    [],
  );

  /* The whole deck tilts toward the pointer. Springs, so it trails the hand
   * slightly the way an object with mass does. */
  const tiltX = useSpring(0, { stiffness: 220, damping: 22 });
  const tiltY = useSpring(0, { stiffness: 220, damping: 22 });
  const glareX = useSpring(50, { stiffness: 180, damping: 24 });
  const glareY = useSpring(40, { stiffness: 180, damping: 24 });
  const glareOn = useSpring(0, { stiffness: 200, damping: 28 });
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 248 224 / 100%) 0%, rgb(255 246 219 / 38%) 38%, transparent 66%)`;

  const dragging = useRef(false);
  const pointer = useRef({
    id: -1,
    sx: 0,
    sy: 0,
    ox: 0,
    lx: 0,
    lt: 0,
    v: 0,
    t0: 0,
    moved: 0,
  });
  const tiltFrame = useRef(0);

  const markManual = useCallback(() => {
    lastManual.current = Date.now();
    setAutoTurn(false);
  }, []);

  const restTilt = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
    glareOn.set(0);
  }, [tiltX, tiltY, glareOn]);

  /* The pile reorders here, and the order of these three lines is load-bearing.
   * flushSync commits the new head synchronously, so by the time the travel
   * values are zeroed the DOM already knows which card is on top: the thrown
   * card (now at the back, opacity 0) takes the reset, and the card that rose
   * during the drag is left exactly where the drag put it. Do this the other
   * way round and the under-card drops a frame before the swap. */
  const settle = useCallback(
    (next: number) => {
      headRef.current = next;
      flushSync(() => setHead(next));
      tx.jump(0);
      ty.jump(0);
      tz.jump(0);
      ts.jump(0);
      busy.current = false;
    },
    [tx, ty, tz, ts],
  );

  /* Throw the top card off stage and bring `next` to the front. `slow` is the
   * deck turning its own page — one continuous breath, easing back a little
   * (an unseen hand picking the card up) before it peels away. */
  const throwCard = useCallback(
    (dir: number, next: number, slow = false) => {
      if (busy.current) return;
      // The deck ends at the closer; there is nothing behind it to reveal.
      if (headRef.current >= CLOSER_AT) return;
      busy.current = true;
      if (reduce) {
        settle(next);
        return;
      }
      const fade = fades.current[headRef.current];
      const dur = slow ? DRIFT_S : THROW_S;
      const ease = slow ? ([0.4, 0, 0.9, 0.6] as const) : THROW_EASE;
      animate(ty, 90, { duration: dur, ease });
      animate(tz, 60, { duration: dur, ease });
      animate(ts, -0.06, { duration: dur, ease });
      // Opacity is delayed so the card is genuinely leaving before it fades —
      // fading immediately looks like a dissolve, not a throw.
      if (fade)
        animate(fade, 0, {
          duration: slow ? 0.5 : 0.4,
          delay: slow ? 0.55 : 0.12,
        });
      const run = slow
        ? animate(tx, [tx.get(), dir * -26, dir * THROW_X], {
            duration: dur,
            times: [0, 0.3, 1],
            ease: ["easeInOut", "easeIn"],
          })
        : animate(tx, dir * THROW_X, { duration: dur, ease });
      run.then(() => {
        if (busy.current) settle(next);
      });
    },
    [reduce, settle, tx, ty, tz, ts],
  );

  /* Backwards. Throwing a card away to reveal an earlier one would be
   * incoherent, so the previous card comes back in from off stage instead —
   * and the card it lands on top of sinks as it arrives, because that card is
   * reading the same `tx` for its lift. */
  const pullCard = useCallback(
    (prev: number) => {
      if (busy.current) return;
      busy.current = true;
      if (reduce) {
        settle(prev);
        return;
      }
      headRef.current = prev;
      flushSync(() => setHead(prev));
      tx.jump(-THROW_X);
      ty.jump(90);
      tz.jump(60);
      ts.jump(-0.06);
      animate(ty, 0, { duration: SNAP_S, ease: SNAP_EASE });
      animate(tz, 0, { duration: SNAP_S, ease: SNAP_EASE });
      animate(ts, 0, { duration: SNAP_S, ease: SNAP_EASE });
      animate(tx, 0, { duration: SNAP_S, ease: SNAP_EASE }).then(() => {
        busy.current = false;
      });
    },
    [reduce, settle, tx, ty, tz, ts],
  );

  /* A hand landing on a card that is already moving takes it over. Everything
   * in flight stops, and the fade the throw started is walked back — otherwise
   * the visitor catches a card they cannot see. */
  const interrupt = useCallback(() => {
    tx.stop();
    ty.stop();
    tz.stop();
    ts.stop();
    const fade = fades.current[headRef.current];
    if (fade && busy.current) {
      fade.stop();
      animate(fade, 1, { duration: 0.16 });
    }
    busy.current = false;
  }, [tx, ty, tz, ts]);

  const snapBack = useCallback(() => {
    if (reduce) {
      tx.jump(0);
      ty.jump(0);
      tz.jump(0);
      ts.jump(0);
      return;
    }
    animate(tx, 0, { duration: SNAP_S, ease: SNAP_EASE });
    animate(ty, 0, { duration: SNAP_S, ease: SNAP_EASE });
    animate(tz, 0, { duration: SNAP_S, ease: SNAP_EASE });
    animate(ts, 0, { duration: SNAP_S, ease: SNAP_EASE });
  }, [reduce, tx, ty, tz, ts]);

  /* ── Drag ────────────────────────────────────────────────────────────────
     Pointer events with capture, not mouse events: the deck has to work under
     a finger and a pen, and capture is what keeps a fast drag attached to the
     card once it leaves the element. */

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest?.("button")) return;
    interrupt();
    markManual();
    restTilt();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    pointer.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      ox: tx.get(),
      lx: e.clientX,
      lt: performance.now(),
      v: 0,
      t0: performance.now(),
      moved: 0,
    };
    if (!reduce) {
      animate(tz, 40, { duration: 0.18 });
      animate(ts, 0.015, { duration: 0.18 });
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const p = pointer.current;
    if (dragging.current && p.id === e.pointerId) {
      const now = performance.now();
      const dt = now - p.lt;
      if (dt > 0) {
        const inst = (e.clientX - p.lx) / dt;
        // Measured over roughly the last 8ms; shorter samples are blended in
        // rather than trusted, so one jittery frame can't fake a flick.
        p.v = dt >= 8 ? inst : p.v * 0.6 + inst * 0.4;
        p.lx = e.clientX;
        p.lt = now;
      }
      const dx = e.clientX - p.sx;
      const dy = e.clientY - p.sy;
      p.moved = Math.max(p.moved, Math.abs(dx), Math.abs(dy));
      tx.set(p.ox + dx);
      // Vertical drag is damped: cards resist lifting off the table.
      ty.set(dy * 0.55);
      return;
    }
    // Ambient tilt. Never while a hand is on a card — the two transforms
    // would fight — and never under reduced motion.
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if (tiltFrame.current) return;
    tiltFrame.current = requestAnimationFrame(() => {
      tiltFrame.current = 0;
      // Under 7°: past that it stops reading as "object on a table" and
      // starts reading as a gimmick.
      tiltY.set((px - 0.5) * 7);
      tiltX.set(-(py - 0.5) * 5);
      glareX.set(px * 100);
      glareY.set(py * 100);
      glareOn.set(1);
    });
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const p = pointer.current;
    if (!dragging.current || p.id !== e.pointerId) return;
    dragging.current = false;
    p.id = -1;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    const dx = tx.get();
    // A finger that stopped before lifting has no velocity, whatever the last
    // sample said.
    const v = performance.now() - p.lt > 90 ? 0 : p.v;
    const tap = p.moved < 6 && performance.now() - p.t0 < 400;
    const past = tap || Math.abs(dx) > THROW_DIST || Math.abs(v) > THROW_VEL;
    // On the last card a throw would empty the deck, so the card comes back
    // to the hand instead. The reader has arrived; there is nowhere past it.
    if (past && headRef.current < CLOSER_AT) {
      throwCard(Math.sign(dx || v || 1), headRef.current + 1);
    } else {
      snapBack();
    }
  }

  /* ── Keyboard ────────────────────────────────────────────────────────────
     This is the hero interaction; it cannot be pointer-only. */
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.target !== e.currentTarget) return;
    const fwd = e.key === "ArrowRight" || e.key === " " || e.key === "Enter";
    const back = e.key === "ArrowLeft";
    if (!fwd && !back) return;
    e.preventDefault();
    if (busy.current) return;
    markManual();
    const h = headRef.current;
    if (fwd) {
      if (h < CLOSER_AT) throwCard(1, h + 1);
    } else if (h > 0) {
      pullCard(h - 1);
    }
  }

  /* The deck turns its own pages. Nobody has to swipe: every few seconds the
   * top card winds up and peels itself away, so the six roles parade past a
   * visitor who only watches. It yields to people — a hover, focus inside the
   * deck, a hidden tab, or a recent manual turn all hold it. Off entirely
   * under reduced motion: a deck turning its own cards is exactly the motion
   * being declined. */
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (busy.current || dragging.current || hover.current) return;
      if (document.visibilityState === "hidden") return;
      if (Date.now() - lastManual.current < MANUAL_COOLDOWN_MS) return;
      if (frameRef.current?.contains(document.activeElement)) return;
      const h = headRef.current;
      // The parade stops on the ask. Nothing turns the closing card but a
      // person — autoplay that walked past the one thing the page wants
      // would be the deck talking over its own point.
      if (h >= CLOSER_AT) return;
      setAutoTurn(true);
      // Alternate sides so the parade never reads as a metronome.
      throwCard(h % 2 === 0 ? 1 : -1, h + 1, true);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [reduce, throwCard]);

  useEffect(
    () => () => {
      if (tiltFrame.current) cancelAnimationFrame(tiltFrame.current);
    },
    [],
  );

  const atEnd = head >= CLOSER_AT;
  const current = atEnd ? null : ROLES[head];
  const deck: Deck = { tx, ty, tz, ts, glare, glareOn, reduce, register };

  /* No modulo. A card that has been turned goes off stage and stays there —
   * wrapping it round to the back would put Host behind Diver and quietly
   * promise a deck that never runs out. */
  const depthOf = (i: number) => (i >= head ? i - head : GONE);

  return (
    <div className="deck-column">
      <div
        ref={frameRef}
        role="group"
        aria-roledescription="card deck"
        aria-label="Six whiff roles and the invitation that follows them. Use arrow keys to browse."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // Mouse only: a resting cursor is a reader, so autoplay holds. Touch
        // enter/leave is too erratic to mean anything, and a tap marks itself
        // manual through the pointer handlers.
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hover.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") hover.current = false;
          restTilt();
        }}
        className="deck-frame"
      >
        <span className="deck-shadow" aria-hidden="true" />
        <motion.div
          className="deck-tilt"
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          {ROLES.map((role, i) => (
            <DeckCard key={role.id} index={i} depth={depthOf(i)} deck={deck}>
              <div className="card-body">
                {/* The eyebrow does not repeat the name — that would waste
                    the most valuable line on the card. */}
                <p className="card-eyebrow">whiff finds</p>
                <p className="card-name">{role.name}</p>
                <span className="card-rule" aria-hidden="true" />
                <p className="card-read">{role.read}</p>
              </div>

              {/* The foot: who the role clicks with. Full ink, because this
                  is the product's mechanic, not a footnote. */}
              <div className="card-clicks">
                <p className="card-clicks-label">clicks with</p>
                <p className="card-clicks-names">
                  {role.clicksWith.map((id) => NAME_BY_ID[id]).join(" · ")}
                </p>
              </div>
            </DeckCard>
          ))}

          {/* The end of the deck. Six cards describe other people; this one
              turns the question round, and carries the only "Begin your
              experience" on the page. */}
          <DeckCard index={CLOSER_AT} depth={depthOf(CLOSER_AT)} deck={deck}>
            <div className="card-body card-body-closer">
              <p className="card-eyebrow">{CLOSER.eyebrow}</p>
              <p className="card-ask">{CLOSER.line}</p>
              <span className="card-rule" aria-hidden="true" />
              <p className="card-read">{CLOSER.read}</p>
              <button
                type="button"
                // Reachable only while it is the top card; behind the pile it
                // is aria-hidden with its whole card, and a hidden tab stop
                // is worse than none.
                tabIndex={atEnd ? 0 : -1}
                onClick={() => onJoin?.()}
                className="card-cta btn-ink"
              >
                {CLOSER.cta}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </DeckCard>
        </motion.div>
      </div>

      {/* ── The rail ────────────────────────────────────────────────────────
          The navigator and the pitch in one object: current filled, its three
          matches outlined, the other two faint. It restates in a left-to-right
          stagger on every turn, and that reshuffle is the moment the mechanic
          lands. */}
      <div className="deck-rail">
        {ROLES.map((role, i) => {
          /* On the closing card every role is lit: the question is which
             one you are, so the rail stops pointing at one answer and
             offers all six. */
          const state = atEnd
            ? "match"
            : i === head
              ? "current"
              : current!.clicksWith.includes(role.id)
                ? "match"
                : "far";
          return (
            <button
              key={role.id}
              type="button"
              className="rail-tick"
              data-state={state}
              style={{ "--i": i } as React.CSSProperties}
              aria-label={`Show ${role.name}`}
              aria-current={i === head ? "true" : undefined}
              onClick={() => {
                if (i === head || busy.current) return;
                markManual();
                // Forward is a throw; anywhere behind, the card comes back.
                if (i > head) throwCard(1, i);
                else pullCard(i);
              }}
            >
              <span className="rail-name" aria-hidden="true">
                {role.name}
              </span>
              <span className="rail-mark" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* Silent while the deck turns itself: only turns a person made are
          worth a screen reader's attention. */}
      <p className="sr-only" aria-live={autoTurn ? "off" : "polite"}>
        {atEnd
          ? `Card ${SLOTS} of ${SLOTS}. ${CLOSER.line} ${CLOSER.read} Use the ${CLOSER.cta} button to begin.`
          : `Card ${head + 1} of ${SLOTS}. ${current!.name}. ${current!.read} Clicks with ${current!.clicksWith
              .map((id) => NAME_BY_ID[id])
              .join(", ")}.`}
      </p>
    </div>
  );
}

function DeckCard({
  index,
  depth,
  deck,
  children,
}: {
  index: number;
  depth: number;
  deck: Deck;
  children: React.ReactNode;
}) {
  const { tx, ty, tz, ts, glare, glareOn, reduce, register } = deck;
  const isTop = depth === 0;
  const isNext = depth === 1;

  /* Depth is a spring, so a card promoted up the pile overshoots a hair and
   * settles — dropped onto the stack rather than placed. */
  const dv = useSpring(depth, { stiffness: 320, damping: 26 });
  const fade = useMotionValue(depth > VISIBLE_DEPTH ? 0 : 1);
  /* Two values, not one: `deal` carries the card onto the table over a third
   * of a second, `dealt` resolves its opacity in a seventh of that. The card
   * is solid long before it has finished arriving. */
  const deal = useMotionValue(0);
  const dealt = useMotionValue(0);

  /* Effective depth. The card directly under the top one is pulled toward the
   * front as the top card is dragged, and every resting formula below is
   * continuous at depth 0 and depth 1 — so the lift and the promotion are the
   * same motion, not two that have to be reconciled. */
  const ed = useTransform(() => {
    const base = dv.get();
    if (!isNext) return base;
    return base - Math.min(Math.abs(tx.get()) / LIFT_SPAN, 1);
  });

  const x = useTransform(() => (isTop ? tx.get() : 0));
  const y = useTransform(
    () =>
      REST_Y +
      ed.get() * DEPTH_Y +
      (isTop ? ty.get() : 0) +
      DEAL_DY * (1 - deal.get()),
  );
  const z = useTransform(
    () =>
      -ed.get() * DEPTH_Z + (isTop ? tz.get() : 0) + DEAL_DZ * (1 - deal.get()),
  );
  const scale = useTransform(
    () =>
      (1 - ed.get() * DEPTH_SCALE + (isTop ? ts.get() : 0)) *
      lerp(DEAL_SCALE_MUL, 1, deal.get()),
  );
  const rotate = useTransform(() => {
    const e = Math.min(Math.max(ed.get(), 0), 1);
    // The top card sits straighter than the pile behind it, and the drag
    // rotation carries the throw's 42° on its own.
    return JITTER[index] * (0.5 + 0.5 * e) + (isTop ? tx.get() * PIVOT : 0);
  });
  const opacity = useTransform(() => fade.get() * dealt.get());
  const glareOpacity = useTransform(() => (isTop ? glareOn.get() : 0));

  /* Deal-in. Back card first, 95ms apart — the first thing a visitor sees,
   * and it establishes that the deck is physical before they touch it. The
   * delay is fixed at mount from the card's starting depth. */
  const dealDelay = useRef(
    DEAL_BASE + Math.max(0, VISIBLE_DEPTH - depth) * DEAL_STAGGER,
  ).current;
  useIsoLayoutEffect(() => {
    const still = prefersReducedMotion();
    const move = animate(deal, 1, {
      duration: still ? 0 : 0.34,
      delay: still ? 0 : dealDelay,
      ease: [0.2, 0.7, 0.3, 1],
    });
    const show = animate(dealt, 1, {
      duration: still ? 0 : DEAL_FADE_S,
      delay: still ? 0 : dealDelay,
      ease: "easeOut",
    });
    return () => {
      move.stop();
      show.stop();
    };
  }, []);

  /* Depth changes. A card arriving at the front teleports its depth spring
   * rather than travelling: it is either the card that already rose during the
   * drag (so it is visually there), or it is arriving under a card that is
   * still covering it. Everything else springs, and fades with a 450ms cross
   * as it enters or leaves the visible part of the pile. */
  const first = useRef(true);
  useIsoLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (depth === 0) {
      dv.jump(0);
      fade.jump(1);
      return;
    }
    if (reduce) {
      dv.jump(depth);
      fade.jump(depth > VISIBLE_DEPTH ? 0 : 1);
      return;
    }
    dv.set(depth);
    animate(fade, depth > VISIBLE_DEPTH ? 0 : 1, { duration: 0.45 });
  }, [depth, reduce, dv, fade]);

  useIsoLayoutEffect(() => {
    register(index, fade);
    return () => register(index, null);
  }, [index, fade, register]);

  return (
    <motion.div
      aria-hidden={!isTop}
      className="type-card"
      data-top={isTop || undefined}
      style={{ x, y, z, rotate, scale, opacity }}
      initial={false}
    >
      <span className="card-corner card-corner-tl" aria-hidden="true" />
      <span className="card-corner card-corner-tr" aria-hidden="true" />
      <span className="card-corner card-corner-bl" aria-hidden="true" />
      <span className="card-corner card-corner-br" aria-hidden="true" />

      {children}

      {/* Light, painted over the print the way light lands on real stock:
          the sheen is CSS-driven and periodic, the glare follows the pointer. */}
      <span className="card-sheen" aria-hidden="true" />
      <motion.span
        className="card-glare"
        aria-hidden="true"
        style={{ backgroundImage: glare, opacity: glareOpacity }}
      />
    </motion.div>
  );
}

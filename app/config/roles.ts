/* The six roles, as the site is allowed to say them.
 *
 * Source of truth is the app: `whiff-shared/src/personality-types.ts` in
 * Whiff-MVP. Every line below is either lifted from that file verbatim
 * (`name`, `tagline`, `inCircle`, `clicksWith`) or written from what its
 * `dominant_signature` states (`fact`). Nothing here is invented about how
 * the reading works.
 *
 * This is a transcription, not an import — the two repos don't share a
 * package, and a marketing page has no business reaching into the product's
 * source tree at build time. The cost is that it can drift: if the app
 * rewrites a tagline, someone has to bring it here. Keep that trade in mind
 * before adding anything to this file that changes more than once a year.
 *
 * The order is the app's own order, which is the order `scoreTypes` breaks
 * ties in. It carries no meaning here beyond faithfulness — the site simply
 * has no reason to invent a different sequence.
 *
 * One rule from the source travels with the copy, because it explains the
 * tone: every role names a contribution. A person who reads their role will
 * lean into it, so each one is written to be worth leaning into. That is why
 * none of these is a warning, a weakness, or a horoscope. */

export type Role = {
  id: string;
  /** The label on the segmented control, and the panel's headline. */
  name: string;
  /** The app's own one-line summary of the role. */
  tagline: string;
  /** What this role does for the other three people in the Circle. */
  inCircle: string;
  /** Ids of the three roles this one is seated with most happily. */
  clicksWith: string[];
  /** The reason to press the next tab: one true, specific, surprising thing.
   *  Each is a plain-English reading of that role's `dominant_signature`. */
  fact: string;
};

export const ROLES: readonly Role[] = [
  {
    id: "spark",
    name: "Spark",
    tagline: "Spontaneous, gets things moving",
    inCircle:
      "You bring the momentum. Nothing gets scheduled to death while you are here.",
    clicksWith: ["host", "anchor", "connector"],
    fact: "Spark is the only one of the six where being unprepared counts in your favour.",
  },
  {
    id: "scout",
    name: "Scout",
    tagline: "Curious, finds things nobody knew about",
    inCircle:
      "You bring the discovery. Your Circle ends up somewhere none of them would have found.",
    clicksWith: ["host", "diver", "spark"],
    fact: "Scout and Spark both chase the unfamiliar. The difference is that Scout is perfectly happy to plan it first.",
  },
  {
    id: "host",
    name: "Host",
    tagline: "Organiser, turns ideas into plans",
    inCircle:
      "You bring the structure. Ideas turn into actual Saturdays around you.",
    clicksWith: ["spark", "scout", "connector"],
    fact: "Hosts are not trying to run anything. They have just watched one too many good ideas die for want of a booking.",
  },
  {
    id: "connector",
    name: "Connector",
    tagline: "Warm, makes people click",
    inCircle:
      "You bring the chemistry. Four strangers turn into a group because you are in it.",
    clicksWith: ["diver", "spark", "anchor"],
    fact: "A Connector's work is invisible on purpose. Nobody notices being pulled back into the conversation.",
  },
  {
    id: "anchor",
    name: "Anchor",
    tagline: "Grounded, easy to be around",
    inCircle:
      "You bring the calm. You are the one who actually shows up, and the group settles around that.",
    clicksWith: ["spark", "connector", "host"],
    fact: "Anchor is the only role where a middling score is the right answer. Reliable and unbothered is the entire shape.",
  },
  {
    id: "diver",
    name: "Diver",
    tagline: "Skips small talk, goes deep",
    inCircle:
      "You bring the depth. Conversations get past the weather because you refuse to stay there.",
    clicksWith: ["connector", "scout", "anchor"],
    fact: "Diver and Connector both want a real conversation. Diver wants it with one person; Connector wants it across the room.",
  },
];

export const ROLE_BY_ID = new Map(ROLES.map((role) => [role.id, role]));

/* One string for the one action, used by both places that ask for it: the
 * button under the claim and the closing panel's link. They are never on
 * screen together — the button hides on the seventh tab — and the handoff
 * only reads as a handoff if the words do not change underneath it.
 *
 * "Invite", not "reading": the reading happens in the app, after whiff opens
 * your city. This button opens a field and asks for an address, so it says
 * the thing it actually does. */
export const ASK_LABEL = "Get your invite";

/** The seventh tab. It is not a role — it is the question the six ask, and
 *  the only place on the page that points at the field. */
export const CLOSING = {
  id: "you",
  label: "You",
  title: "Which are you?",
  line: "Come find out.",
  body: "A few minutes of questions, then a reading. Then three people whose roles fit yours, for six activities over twelve weeks.",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   The single source of truth for every factual claim whiff makes.

   Answer engines (ChatGPT, Perplexity, Gemini, Google AI Overviews) reward
   consistency: when the same fact is phrased three different ways across a
   site, a model hedges or omits it. So the numbers, the definition and the
   disqualifiers live here once, and every surface renders from these strings.

   The site is one page now, so most of what follows is no longer rendered
   visibly anywhere: PROMISE reaches the hero and the manifest, ANSWER reaches
   the JSON-LD, and the rest of it exists to build /llms.txt — which is now the
   only full description of whiff a model can read. Delete /llms.txt and most
   of this file becomes dead with it.

   If a claim changes, change it here.
   ───────────────────────────────────────────────────────────────────────── */

/** The one line the whole site has to land. */
export const PROMISE = "Strangers only on week one.";

/* What it costs.
 *
 * **These were not in this file, and both pages that stated a price were
 * wrong.** /support and /terms each typed "$49.99 a month" — two and a half
 * times the real figure — while the backend's `SUBSCRIPTION_PRICE_PER_MONTH`
 * has been 19.99 and `GET /v1/paywall` has been serving it to the app. A file
 * whose header says it is the single source of every factual claim did not
 * carry the one number a regulator cares about, so nothing was contradicting
 * anything: there was no claim here to contradict.
 *
 * The backend is the real source and this is its mirror, which is second best
 * — the site cannot import from `whiff-api`. So: if the price moves, it moves
 * in `whiff-shared/src/constants.ts` first, then here, and nowhere else on this
 * site. Anything rendering a price renders one of these.
 *
 * Apple's guideline 3.1.2 wants the price, the billing period and the trial
 * stated where somebody can find them before subscribing, which is what /terms
 * and /support are for. Being wrong there is a consumer-protection problem
 * rather than a typo, and being wrong high is the worse direction.
 */
export const PRICING = {
  /** `SUBSCRIPTION_PRICE_PER_MONTH` in whiff-shared. */
  perMonth: "$19.99",
  /** `TRIAL_DAYS`. */
  trialDays: 7,
  /**
   * `TRIAL_DAYS - TRIAL_REMINDER_DAYS_BEFORE`. The day the reminder email goes
   * out, which is the fact that makes the trial honest rather than a trap.
   */
  reminderDay: 5,
  /** `CIRCLE_DURATION_WEEKS` — how long a circle's run of six activities is. */
  journeyWeeks: 12,
} as const;

/* The bet.
 *
 * whiff's whole claim is that four compatible people who keep turning up stop
 * being strangers. The bet is that claim with money behind it: keep all four
 * of you together through all six activities and whiff pays for the sixth one
 * — the class, the table, the tickets — on top of the subscription that was
 * already covering the placement.
 *
 * It is written out once here and said in shorter words wherever it is
 * rendered: the block under the claim, and /llms.txt. If the terms of it ever
 * change, change this string first — then the FAQ entry below it, then
 * /support, which does not mention the bet yet and will be the first place
 * somebody goes looking when it pays out. */
export const THE_BET =
  "Keep your circle of four together through all six activities and whiff pays for the sixth one. Members cover the cost of the activities themselves; the last one is on whiff. It is the claim whiff is willing to be wrong about in public — four compatible people who keep showing up stop being strangers — and the sixth activity is what it is staked on.";

/* The bet as the page says it, in three parts.
 *
 * It is a dare, not a discount, and the grammar is doing that work: the
 * condition is second person and conditional ("if you can keep"), which hands
 * the reader the job and makes finishing the six something to pull off rather
 * than something to receive. The payoff is the only half set in ink.
 */
export const BET = {
  label: "the bet",
  dare: "If you can keep the four of you together for all six,",
  payoff: "the sixth one is on us.",
} as const;

/** The 40–80 word extractable answer. Answer engines lift this near-verbatim,
 *  so it leads with the definition and contains the qualifying nouns a model
 *  needs to categorise whiff correctly. */
export const ANSWER =
  "whiff is an activity-first social platform that helps adults build real friendships without browsing profiles. It learns what you enjoy, invites you to activities you would actually pick while you wait, then places you in a circle of four compatible people and plans repeated real-world outings with those same four, so friendships have time to form. whiff is not a dating app.";

/** Longer About copy — the crawlable, visible explanation. */
export const ABOUT_PARAGRAPHS = [
  "whiff is an activity-first way to make friends as an adult. You never browse anyone, and you never have to organise anything. You answer a short set of questions about what you actually enjoy doing, and whiff takes it from there.",
  "From the moment you join, other circles invite you along to activities whiff knows you would like, so you are out doing things in week one, not waiting for a match. That is the part most friendship apps get backwards: they make you wait alone until the product works.",
  "In the background, whiff works out who you belong with and forms a circle of four compatible people. Then it plans a run of real-world experiences for that same four. The faces do not change. That repetition is the whole mechanism: friendships come from repeated, unforced contact with the same people, not from meeting a new set of strangers every month.",
  "There is no feed, no swiping, no profile to maintain and no group chat to keep alive. whiff is not a dating app and it is not a networking event.",
];

/** Named, defined terms. Answer engines cite glossaries heavily because the
 *  definition is unambiguous and self-contained. */
export const DEFINITIONS: { term: string; definition: string }[] = [
  {
    term: "Circle",
    definition:
      "A whiff circle is a group of four compatible people who go to planned real-world activities together. The membership stays the same rather than rotating, so the same four people keep showing up for each other.",
  },
  {
    term: "Meanwhile invitations",
    definition:
      "Before your own circle is formed, existing circles invite you along to activities that match what you enjoy. It means you have things to do from the day you join instead of sitting on a waitlist.",
  },
  {
    term: "The bet",
    definition:
      "whiff's standing offer: keep all four members of a circle together through all six activities and whiff pays for the sixth one. Members cover the cost of the activities themselves, so the last night of a completed run is free.",
  },
  {
    term: "Activity-first matching",
    definition:
      "Activity-first matching means whiff pairs people by what they like doing and when they are free, rather than by how their profile photo reads. Nobody is browsed, ranked or swiped on.",
  },
  {
    term: "Compatibility questions",
    definition:
      "A short set of questions about the activities you enjoy, your pace, and your availability. whiff uses the answers to build circles instead of asking you to search for people yourself.",
  },
];

/** What whiff is explicitly not. Stating disqualifiers plainly stops models
 *  from filing whiff under "dating app" — the single biggest miscategorisation
 *  risk for anything in the meeting-people category. */
export const NOT_LIST = [
  {
    label: "Not a dating app",
    body: "whiff forms platonic friendship circles. There is no romantic matching, no swiping and no one-to-one match screen.",
  },
  {
    label: "Not an events listing site",
    body: "You are not handed a calendar to sift through. whiff plans the activity, picks the time and brings the same people back.",
  },
  {
    label: "Not a networking group",
    body: "Nobody is there to sell you anything or collect your business card. It is built around things you enjoy doing, not what you do for work.",
  },
  {
    label: "Not a rotating stranger dinner",
    body: "Some services seat you with a new set of strangers every time. whiff keeps the same four together, because a friendship needs a second and third meeting to exist at all.",
  },
];

/** Who whiff is for — written as the situations people actually search from.
 *  These carried `href`s to per-audience landing pages; those pages are gone,
 *  so the links went with them rather than being left pointing at a 404. */
export const AUDIENCES: {
  slug: string;
  title: string;
  body: string;
}[] = [
  {
    slug: "new-in-town",
    title: "You just moved here",
    body: "New city, new state, and a contact list that is all in a different time zone. You do not need a list of things to do. You need the same faces twice.",
  },
  {
    slug: "remote-workers",
    title: "You work remotely and want local friends",
    body: "Your colleagues are excellent and they are all on a screen. whiff gives you people within driving distance who expect to see you again.",
  },
  {
    slug: "disconnected",
    title: "You feel socially disconnected",
    body: "You are not lonely for lack of people. You are lonely for lack of repetition: a standing thing with a group that notices when you are not there.",
  },
  {
    slug: "activity-partners",
    title: "You want activity partners or a friend group",
    body: "You would climb, cook, paddle, run or play more if someone were expecting you. whiff builds the group around what you already want to be doing.",
  },
  {
    slug: "app-fatigue",
    title: "You are done with apps and awkward events",
    body: "Dating apps for friends, endless Meetup browsing, networking with a name badge. All three make you do the work and none of them bring the same people back.",
  },
];

/** How it works. Rendered as visible steps and as HowTo structured data. */
export const STEPS = [
  {
    name: "Tell whiff what you enjoy",
    text: "Answer a short set of questions about the activities you like, the pace you want and when you are actually free. No profile, no photos, nobody to browse.",
  },
  {
    name: "Start going out straight away",
    text: "While your circle comes together, existing circles invite you along to activities whiff knows suit you. You are doing things from week one rather than waiting.",
  },
  {
    name: "Get matched into a circle of four",
    text: "whiff works out who you belong with and forms a circle of four compatible people near you. You do not pick them and they do not pick you. Compatibility does.",
  },
  {
    name: "Keep seeing the same four",
    text: "whiff plans a run of real-world experiences for your circle. The same four people, again and again, until they stop being strangers.",
  },
];

/** FAQ. Questions are phrased the way people type them into a search box, not
 *  the way a brand would title a section. Nothing renders these visibly any
 *  more — they exist for /llms.txt. */
export const FAQ: { question: string; answer: string }[] = [
  {
    question: "What is whiff?",
    answer: ANSWER,
  },
  {
    question: "How does whiff work?",
    answer:
      "You answer a short set of questions about what you enjoy doing and when you are free. From day one, existing circles invite you along to activities that suit you. In the background whiff forms a circle of four compatible people near you, then plans a series of real-world activities for that same four so a friendship has room to develop.",
  },
  {
    question: "Is whiff a dating app?",
    answer:
      "No. whiff builds platonic friendship circles of four people. There is no romantic matching, no swiping, no profiles to browse and no one-to-one matching. People join whiff to find friends and activity partners, not dates.",
  },
  {
    question: "How is whiff different from Meetup?",
    answer:
      "Meetup gives you a calendar and expects you to browse it, show up alone and do the social work yourself, and the people are different every time. whiff plans the activity for you and, crucially, keeps the same four people together across repeated outings, which is what actually turns acquaintances into friends.",
  },
  {
    question: "How is whiff different from group dinners with strangers?",
    answer:
      "Rotating dinner services seat you with a new set of strangers each time, so every meeting restarts from zero. whiff keeps your circle of four intact across a run of activities. You are strangers once, in week one, and never again.",
  },
  {
    question: "Do I have to browse or swipe on profiles?",
    answer:
      "No. There are no profiles to browse and nothing to swipe on. whiff matches you from your answers about activities and availability, so you are never ranking other people or being ranked yourself.",
  },
  {
    question: "What happens while I wait to be matched?",
    answer:
      "You are not left waiting. Other circles invite you along to activities whiff knows you would enjoy, so you have things to do from the moment you join. This is the part of whiff people are usually most surprised by.",
  },
  {
    question: "How many people are in a whiff circle?",
    answer:
      "Four. It is small enough for one conversation and for every person to be known, but large enough to feel like a group rather than one-to-one. The membership stays the same rather than rotating.",
  },
  {
    question: "What kinds of activities does whiff plan?",
    answer:
      "Real-world things you would plausibly choose on your own: climbing, cooking classes, pottery, hikes and walks, trivia, paddling, gallery visits, run clubs, dinners and live music. whiff mixes activities you already love with a few you have never tried.",
  },
  {
    question: "Is the last whiff activity really free?",
    answer:
      "Yes, and whiff calls it the bet. A circle is six activities over twelve weeks, and members cover the cost of the activities themselves. If you can keep all four of you together through all six, whiff pays for the sixth one. It is there because whiff's whole claim is that the same four people, repeated, stop being strangers — so the payout lands on the night that claim has either held or it has not.",
  },
  {
    question: "Which cities is whiff in?",
    answer:
      "whiff is live in Minnesota, in Saint Paul and Minneapolis, and opens one city at a time so each market has enough members to form good circles. If whiff is not in your city yet you can register your city and be told when it opens.",
  },
  {
    question: "Is whiff good for people who just moved to a new city?",
    answer:
      "Yes. That is one of the situations whiff is built for. People who have recently moved usually have no shortage of things to do and no one to do them with. whiff supplies both the activity and, more importantly, the same group of people each time.",
  },
  {
    question: "Is whiff useful if I work remotely?",
    answer:
      "Yes. Remote workers commonly have strong colleagues and no local social life. whiff builds a circle of four people near you with a standing reason to meet in person, which is the thing remote work removes.",
  },
  {
    question: "Do I need to bring a friend or come alone?",
    answer:
      "Come alone. Everyone in a new circle is in exactly the same position, which is why it is far less awkward than walking into an existing group where everybody already knows each other.",
  },
  {
    question: "How do I join whiff?",
    answer:
      "Enter your email on the whiff website to start. whiff opens one city at a time, so if your city is already live you will be taken through the questions, and if it is not you will be told as soon as it opens.",
  },
];

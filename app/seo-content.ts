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
export const PROMISE = "whiff gives you things to do while it finds your people.";

/** The 40–80 word extractable answer. Answer engines lift this near-verbatim,
 *  so it leads with the definition and contains the qualifying nouns a model
 *  needs to categorise whiff correctly. */
export const ANSWER =
  "whiff is an activity-first social platform that helps adults build real friendships without browsing profiles. It learns what you enjoy, invites you to activities you would actually pick while you wait, then places you in a circle of six compatible people and plans repeated real-world outings with those same six, so friendships have time to form. whiff is not a dating app.";

/** Longer About copy — the crawlable, visible explanation. */
export const ABOUT_PARAGRAPHS = [
  "whiff is an activity-first way to make friends as an adult. You never browse anyone, and you never have to organise anything. You answer a short set of questions about what you actually enjoy doing, and whiff takes it from there.",
  "From the moment you join, other circles invite you along to activities whiff knows you would like, so you are out doing things in week one, not waiting for a match. That is the part most friendship apps get backwards: they make you wait alone until the product works.",
  "In the background, whiff works out who you belong with and forms a circle of six compatible people. Then it plans a run of real-world experiences for that same six. The faces do not change. That repetition is the whole mechanism: friendships come from repeated, unforced contact with the same people, not from meeting a new set of strangers every month.",
  "There is no feed, no swiping, no profile to maintain and no group chat to keep alive. whiff is not a dating app and it is not a networking event.",
];

/** Named, defined terms. Answer engines cite glossaries heavily because the
 *  definition is unambiguous and self-contained. */
export const DEFINITIONS: { term: string; definition: string }[] = [
  {
    term: "Circle",
    definition:
      "A whiff circle is a group of six compatible people who go to planned real-world activities together. The membership stays the same rather than rotating, so the same six people keep showing up for each other.",
  },
  {
    term: "Meanwhile invitations",
    definition:
      "Before your own circle is formed, existing circles invite you along to activities that match what you enjoy. It means you have things to do from the day you join instead of sitting on a waitlist.",
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
    body: "Some services seat you with six new strangers every time. whiff keeps the same six together, because a friendship needs a second and third meeting to exist at all.",
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
    name: "Get matched into a circle of six",
    text: "whiff works out who you belong with and forms a circle of six compatible people near you. You do not pick them and they do not pick you. Compatibility does.",
  },
  {
    name: "Keep seeing the same six",
    text: "whiff plans a run of real-world experiences for your circle. The same six people, again and again, until they stop being strangers.",
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
      "You answer a short set of questions about what you enjoy doing and when you are free. From day one, existing circles invite you along to activities that suit you. In the background whiff forms a circle of six compatible people near you, then plans a series of real-world activities for that same six so a friendship has room to develop.",
  },
  {
    question: "Is whiff a dating app?",
    answer:
      "No. whiff builds platonic friendship circles of six people. There is no romantic matching, no swiping, no profiles to browse and no one-to-one matching. People join whiff to find friends and activity partners, not dates.",
  },
  {
    question: "How is whiff different from Meetup?",
    answer:
      "Meetup gives you a calendar and expects you to browse it, show up alone and do the social work yourself, and the people are different every time. whiff plans the activity for you and, crucially, keeps the same six people together across repeated outings, which is what actually turns acquaintances into friends.",
  },
  {
    question: "How is whiff different from group dinners with strangers?",
    answer:
      "Rotating dinner services seat you with a new set of strangers each time, so every meeting restarts from zero. whiff keeps your circle of six intact across a run of activities. You are strangers once, in week one, and never again.",
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
      "Six. It is large enough that a quiet night still works if one or two people cannot make it, and small enough that everyone gets spoken to. The membership stays the same rather than rotating.",
  },
  {
    question: "What kinds of activities does whiff plan?",
    answer:
      "Real-world things you would plausibly choose on your own: climbing, cooking classes, pottery, hikes and walks, trivia, paddling, gallery visits, run clubs, dinners and live music. whiff mixes activities you already love with a few you have never tried.",
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
      "Yes. Remote workers commonly have strong colleagues and no local social life. whiff builds a circle of six people near you with a standing reason to meet in person, which is the thing remote work removes.",
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

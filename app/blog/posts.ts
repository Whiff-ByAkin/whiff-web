import { DEFINITIONS, NOT_LIST } from "../seo-content";

/* Three pieces, not six.
 *
 * This started as six question-shaped entries — "What is whiff", "Who it's
 * for", "How it works" — which is the table of contents every product site on
 * earth ships, and it made the reader do admin before they got to read
 * anything. One piece can carry the whole explanation. So:
 *
 *   1. the product, all of it, in one go
 *   2. a story about how friendship actually happens
 *   3. the disqualifier, said with a straight back
 *
 * Titles are titles, not headings from a manual. "How it works" tells you the
 * shape of the content and nothing about whether it is worth reading.
 */

export type Post = {
  /** URL fragment and the key the explorer tracks. */
  id: string;
  /** The title, as it reads on the page. */
  title: string;
  /** Short label for the rail — a title is too long for a list. */
  label: string;
  /** One line under the title. Also the BlogPosting description. */
  standfirst: string;
  paragraphs: string[];
  /** Structured asides beside the prose on wide screens. */
  asides?: { heading: string; items: { term: string; body: string }[] }[];
  /** Used where a post has no list worth tabulating. */
  pullquote?: string;
};

export const POSTS: Post[] = [
  {
    id: "strangers-only-on-week-one",
    title: "Strangers only on week one",
    label: "Week one",
    standfirst:
      "The whole thing, in one go: what whiff does, who ends up here, and why the group is six people and not sixty.",
    paragraphs: [
      "whiff is an activity-first social platform that helps adults build real friendships without browsing profiles. It learns what you enjoy, invites you to activities you would actually pick while you wait, then places you in a circle of six compatible people and plans repeated real-world outings with those same six, so friendships have time to form.",
      "You never browse anyone. You never organise anything. You answer a short set of questions about what you actually like doing and when you are genuinely free, and that is the last piece of work you are asked to do.",
      "From the moment you join, circles already running near you invite you along to things whiff knows you would like, so you are out doing something in week one rather than sitting on a waitlist. That is the half most services get backwards. They make you wait alone until the product starts working.",
      "In the background, whiff works out who you belong with and forms a circle of six. Then it plans a run of real-world experiences for that same six. The faces do not change. That repetition is the entire mechanism: friendships come from repeated, unforced contact with the same people, not from meeting a fresh set of strangers every month.",
      "As for who ends up here, it is a situation, not a demographic. People who moved for a job or a partner and know nobody. People who work remotely and have realised their only reliable in-person contact is a grocery cashier. People whose friends all moved away or had children at once. People who would climb, cook, paddle or run more often if someone were expecting them. What they share is that their week stopped producing the same faces twice, and no amount of being more sociable puts that back on its own.",
      "And six, specifically, because four is fragile: two cancellations and it is a date. Ten is a party, where it is entirely possible to attend all evening and speak to nobody. Six survives a dropout without collapsing, still fits round one table where a single conversation can include everyone, and is small enough that your absence is noticed. That last one is the quiet thing that makes people come back.",
      "There is no feed, no swiping, no profile to maintain and no group chat to keep alive.",
    ],
    asides: [
      {
        heading: "The words we use",
        items: DEFINITIONS.map((d) => ({ term: d.term, body: d.definition })),
      },
    ],
  },
  {
    id: "the-bread-was-terrible",
    title: "The bread was terrible",
    label: "The bread was terrible",
    standfirst:
      "Nobody has ever made a friend by trying to make a friend. Here is roughly how it actually goes.",
    paragraphs: [
      "Picture six people at a cooking class on a Tuesday, none of whom chose each other. Two moved to the city this year. One has lived here since birth and knows nine people, all of whom now have babies and a bedtime. One came straight from work and is still wearing the lanyard.",
      "They are making focaccia. It does not go well. The dough is somehow both wet and dead, someone has confused the salt with the sugar, and the thing that comes out of the oven has the density and approximate colour of a paving slab. Everyone eats it anyway, out of politeness, and then out of something closer to defiance.",
      "Here is the important part, and it is deeply unromantic: there is another Tuesday already in the calendar. Nobody has to be brave. Nobody has to send the message that starts with \"this might be weird, but\" and then sit with their phone face-down. The second meeting, the one that almost never happens on its own, has already been arranged by something that is not a person.",
      "So they come back. And again. By the fourth week the lanyard is gone and there are in-jokes, which is a thing that cannot be manufactured and can only be accumulated. By the sixth, two of them have started going to the climbing gym on a Thursday, which nobody planned and nobody was asked to arrange.",
      "Ask any of them a year later how they met and you will get a vague answer. Something about a class. Somebody will insist the bread was fine. That fog is not a failure of memory. It is the proof. Memory files people by who they are to you now, not by the evening you were introduced.",
      "This is why looking for friends directly almost never works. Friendship is not a thing you can go and get; it is a by-product of doing something else, repeatedly, near the same people. Every service that hands you a room of new strangers each week is optimising the introduction, which was never the hard part. The hard part is the fourth Tuesday.",
      "whiff is built around the fourth Tuesday. Everything else is logistics.",
    ],
    pullquote:
      "Nobody has ever become friends by discussing friendship. They became friends while doing something else badly.",
  },
  {
    id: "tinder-is-that-way",
    title: "Tinder is that way",
    label: "Tinder is that way",
    standfirst:
      "whiff is not a dating app. If a date is what you came for, we mean this warmly: there are better places, and you should go to them.",
    paragraphs: [
      "No swiping. No profiles to browse. No romantic matching. No one-to-one match screen. whiff builds platonic friendship circles of six people, and that is the whole product.",
      "If you are looking for a date, go to Tinder, or Hinge, or Bumble, or whichever one your friends are currently complaining about. That is not a dig. Those apps are extremely good at the thing they do, and the thing they do is not this. You will have a better evening there than you will have here.",
      "We are being this blunt for a practical reason rather than a moral one. A circle works because six people want the same thing from it. One person quietly treating it as a dating pool does not have a slightly different experience. They change the experience for the other five, who now have to manage something they did not sign up to manage. The whole point of whiff is that you can turn up without doing that kind of work.",
      "So this is a filter, and we would genuinely rather it filtered. whiff does not need to be for everybody. It needs to be unambiguous, because the people it is for are largely people who are tired of things being ambiguous: tired of dating apps for friends, of browsing event listings, of networking evenings with a name badge and a lanyard.",
      "If what you want is five people who will expect you on a Tuesday, and who will notice if you do not come, you are in the right place. If what you want is a date, the door is right there and we hope it goes well.",
    ],
    asides: [
      {
        heading: "Also not",
        items: NOT_LIST.map((n) => ({ term: n.label, body: n.body })),
      },
    ],
  },
];

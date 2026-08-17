import { NOT_LIST } from "../seo-content";

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
 *
 * The copy is written to be felt, not audited. Every claim still matches
 * seo-content.ts, but the reader arrives with a feeling ("my week stopped
 * producing the same faces twice") rather than a spec sheet — and the page
 * already renders ANSWER verbatim below the explorer, so the extractable
 * paragraph is safe without these three having to sound like it.
 */

export type Post = {
  /** URL fragment and the key the explorer tracks. */
  id: string;
  /** The title, as it reads on the page. */
  title: string;
  /** Short label for the rail — a title is too long for a list. */
  label: string;
  /** Extra-compact label for the three-column phone index. */
  mobileLabel: string;
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
    id: "strangers-once",
    /* Was "Strangers only on week one", which is the hero's line and, at six
       words, was a sentence pretending to be a title. Two words carry the same
       promise and land harder; the standfirst does the explaining. */
    title: "Strangers once",
    label: "Week one",
    mobileLabel: "Week one",
    standfirst:
      "What whiff actually does, who ends up here, and why a circle is four people instead of forty.",
    paragraphs: [
      "Making friends as an adult is not hard because you are bad at it. It is hard because nothing in your week puts the same people in front of you twice. whiff is an activity-first social platform built for exactly that problem: it learns what you enjoy, invites you out while you wait, then places you in a circle of four compatible people and plans a run of real-world outings with those same four, so a friendship has the room it needs to happen on its own.",
      "You never browse anyone. You never organise anything. You answer a short set of questions about what you actually like doing and when you are genuinely free, and then you are finished. That is the last piece of work whiff will ever ask of you.",
      "You are not parked, either. From the day you join, circles already running near you invite you along to things whiff knows you would say yes to, so your first week has a Tuesday in it rather than a waiting screen. That is the half most services get backwards. They ask you to be patient, alone, until their product starts working.",
      "Meanwhile, quietly, whiff is working out who you belong with. A circle of four forms, and a run of experiences gets planned for that exact four. The faces do not change. That is the whole trick, and it is not a clever one: people become friends through repeated, unforced contact with the same faces, never by meeting a fresh set of strangers every month.",
      "Who ends up here is a situation, not a personality type. You moved for a job or for a person and know nobody. You work from home and have realised the only one who reliably says your name out loud is a grocery cashier. Your friends moved away, or had children inside the same eighteen months, and the group chat has become the place plans go to die. You would climb, cook, paddle or run far more often if somebody were expecting you. The common thread is that your week stopped producing the same faces twice, and no amount of being more sociable puts that back on its own.",
      "Four, specifically. It is small enough for one conversation to hold everyone, and small enough for every person to become known rather than disappear into the far end of a table. It is also large enough to feel like a group rather than one-to-one. Four makes room for the small, ordinary moments that turn familiar faces into friends.",
      "No feed. No swiping. No profile to keep up to date. No group chat dying slowly at the bottom of your messages.",
    ],
    /* Replaces the "The words we use" glossary. A definitions list beside the
       piece that already defines everything was the page explaining itself
       twice, and the terms still live in /llms.txt where they were always
       doing the real work. */
    pullquote:
      "You are not short of things to do. You are short of the same faces, twice.",
  },
  {
    id: "the-bread-was-terrible",
    title: "The bread was terrible",
    label: "The bread was terrible",
    mobileLabel: "The bread",
    standfirst:
      "Nobody has ever made a friend by trying to make a friend. Here is how it actually goes.",
    paragraphs: [
      "Four people at a cooking class on a Tuesday, none of whom chose each other. Two moved to the city this year. One has lived here since birth and knows nine people, all of whom now have a stroller and a bedtime. One came straight from work and is still wearing the lanyard.",
      "They are making focaccia. It goes badly. The dough is somehow both wet and lifeless, someone has confused the salt with the sugar, and the thing that comes out of the oven has the weight and roughly the colour of a paving slab. They eat it anyway, first out of politeness, then out of something closer to defiance.",
      "Here is the part that matters, and it is gloriously unromantic: there is already another Tuesday in the calendar. Nobody has to be brave. Nobody has to type \"this might be weird, but\" and then put their phone face-down on the table. The second meeting, the one that almost never survives contact with real life, has already been made by something that is not a person.",
      "So they come back. And again. By week four the lanyard is gone and there are in-jokes, which cannot be manufactured and can only be accumulated. By week six, two of them are at the climbing gym on Thursdays, which nobody planned and nobody had to organise.",
      "Ask any of them a year later how they met and you will get a shrug and something vague about a class. Someone will insist the bread was fine. That fog is not a failure of memory. It is the receipt. Memory files people by who they are to you now, not by the evening you were introduced.",
      "Which is why going looking for friends head-on almost never works. Friendship is not a thing you can go out and get. It shows up as a by-product of doing something else, repeatedly, near the same people. Every service that hands you a fresh room of strangers is perfecting the introduction, and the introduction was never the hard part. The fourth Tuesday is the hard part.",
      "whiff is built entirely around the fourth Tuesday. Everything else is logistics.",
    ],
    pullquote:
      "Nobody ever became friends by discussing friendship. They became friends while doing something else badly.",
  },
  {
    id: "tinder-is-that-way",
    title: "Tinder is that way",
    label: "Tinder is that way",
    mobileLabel: "Not dating",
    standfirst:
      "whiff is not a dating app. If a date is what you came for, we mean this warmly: there are better rooms than this one, and you should go and find them.",
    paragraphs: [
      "No swiping. No profiles to browse. No romantic matching. No one-to-one match screen. whiff builds platonic friendship circles of four people, and that is the entire product.",
      "If you want a date, go to Tinder, or Hinge, or Bumble, or whichever one your friends are currently complaining about. That is not a dig. Those apps are extremely good at the thing they do, and the thing they do is not this. You will have a better evening there than you will have here.",
      "We are being this blunt for a practical reason rather than a moral one. A circle works because four people want the same thing from it. One person quietly treating it as a dating pool does not simply have a different evening; they hand the other three a job nobody applied for, which is reading the room and managing it. The whole promise of whiff is that you can turn up without doing that kind of work.",
      "So yes, this is a filter, and we would genuinely rather it filtered. whiff does not need to be for everybody. It needs to be unmistakable, because the people it is for are largely people who are tired of things being ambiguous: tired of dating apps wearing a friendship costume, of scrolling event listings at eleven at night, of an evening that turns out to be networking with a name badge.",
      "If what you want is three people who will expect you on a Tuesday and know when you are not there, you are in the right place. If what you want is a date, the door is right there, and we hope it goes well.",
    ],
    asides: [
      {
        heading: "Also not",
        items: NOT_LIST.map((n) => ({ term: n.label, body: n.body })),
      },
    ],
  },
];

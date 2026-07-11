// The prompt bank for the "are you with your people?" game — a top-of-funnel
// taste of whiff. Each prompt is a fill-in-the-blank that reveals taste and
// character, and — crucially — is *guessable*: a person who truly knows you
// should be able to take a real swing at your answer. Voice is warm, candid,
// a little unguarded. No AI generation; this list is curated and stable.
//
// The bank is intentionally larger than what we show. The create flow surfaces
// only a random handful at a time (see HOME_PROMPT_COUNT) so the page feels
// fresh on every visit — but every id here stays valid for validation.

export type MatchPrompt = {
  id: string;
  text: string;
};

export const MATCH_PROMPTS: MatchPrompt[] = [
  { id: "instant-yes", text: "I would instantly say yes to an invite to ___" },
  { id: "more-of", text: "The kind of people I want more of in my life are people who ___" },
  { id: "low-pressure", text: "My ideal low-pressure hangout looks like ___" },
  { id: "wish-activity", text: "An oddly specific activity I wish I had people to do with is ___" },
  { id: "most-myself", text: "I feel most like myself when I'm ___" },
  { id: "leave-house", text: "The event I'd actually leave the house for is ___" },
  { id: "easy-moment", text: "My perfect \"we just met, but this is easy\" moment is ___" },
  { id: "group-chat", text: "The kind of group chat I secretly wish I had is one where people ___" },
  { id: "talk-hours", text: "A hobby, interest, or random obsession I could talk about for hours is ___" },
  { id: "left-alone", text: "Left entirely to myself, the thing I'd probably be doing is ___" },
  { id: "more-nights", text: "The kind of night I wish happened more often is ___" },
  { id: "randomly-yes", text: "I want people in my life who would randomly say yes to ___" },
  { id: "new-people", text: "A very specific thing I'd love to do with new people is ___" },
  { id: "good-time", text: "My version of a good time is usually ___" },
  { id: "find-my-people", text: "The place you'd probably find my kind of people is ___" },
  { id: "weirdly-happy", text: "I'm weirdly happy around people who ___" },
  { id: "no-effort", text: "The kind of plan that never feels like effort to me is ___" },
  { id: "friends-fast", text: "I could become friends with someone fast if they also loved ___" },
  { id: "try-group", text: "The group activity I'd be most excited to try is ___" },
];

// How many prompts the create flow shows at once.
export const HOME_PROMPT_COUNT = 5;

const PROMPTS_BY_ID = new Map(MATCH_PROMPTS.map((p) => [p.id, p]));

export function getMatchPrompt(id: unknown): MatchPrompt | null {
  return typeof id === "string" ? PROMPTS_BY_ID.get(id) ?? null : null;
}

// Return `count` prompts in random order — a fresh sample of the bank on each
// call. Fisher–Yates on a copy so the source array is never mutated.
export function pickRandomPrompts(count = HOME_PROMPT_COUNT): MatchPrompt[] {
  const pool = [...MATCH_PROMPTS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

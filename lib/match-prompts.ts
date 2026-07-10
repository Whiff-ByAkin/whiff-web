// The prompt bank for the "are you with your people?" game — a top-of-funnel
// taste of whiff. Each prompt is a fill-in-the-blank that reveals taste and
// character, and — crucially — is *guessable*: a person who truly knows you
// should be able to take a real swing at your answer. Voice is warm, candid,
// a little unguarded. No AI generation; this list is curated and stable.

export type MatchPrompt = {
  id: string;
  text: string;
};

export const MATCH_PROMPTS: MatchPrompt[] = [
  { id: "vanish", text: "If I vanished for 24 hours with no warning, you'd find me ___" },
  { id: "unseen", text: "The side of me most people never get to meet is ___" },
  { id: "toxic", text: "My most toxic trait, if I'm being honest, is that I ___" },
  { id: "lose-me", text: "I quietly lose interest in someone the second they ___" },
  { id: "green-flag", text: "An oddly specific green flag for me is ___" },
  { id: "roast", text: "If my closest friends roasted me in one line, they'd say I'm ___" },
  { id: "secretly", text: "I act unbothered, but the thing I secretly care way too much about is ___" },
  { id: "win-me", text: "The fastest way into my good graces is ___" },
  { id: "overnight", text: "The one thing I'd become instantly great at overnight is ___" },
  { id: "perfect-night", text: "Left entirely to myself, my perfect night looks like ___" },
];

const PROMPTS_BY_ID = new Map(MATCH_PROMPTS.map((p) => [p.id, p]));

export function getMatchPrompt(id: unknown): MatchPrompt | null {
  return typeof id === "string" ? PROMPTS_BY_ID.get(id) ?? null : null;
}

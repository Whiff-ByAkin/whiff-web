import { randomBytes } from "node:crypto";
import type { Collection } from "mongodb";
import { getMongoDb } from "./mongodb";
import { getMatchPrompt } from "./match-prompts";

// One "match" = one game a starter kicks off: they answer a prompt, name the
// friend they're sending it to (that name becomes the magic word), and leave an
// email for the digital gift. The friend opens the shared link, proves the
// magic word, and guesses. The reveal is answer-vs-guess.

export const MATCH_COLLECTION_NAME = "whiff_match_games";

export type MatchStatus = "open" | "answered";

type MatchDocument = {
  code: string;
  ownerKey: string;
  promptId: string;
  promptText: string;
  answer: string;
  friendName: string;
  friendNameKey: string; // normalized magic word for comparison
  starterEmail: string;
  giftSent: boolean;
  guess: string | null;
  guessedAt: Date | null;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
};

let indexesReady: Promise<void> | null = null;

async function getCollection(): Promise<Collection<MatchDocument>> {
  const db = await getMongoDb();
  const collection = db.collection<MatchDocument>(MATCH_COLLECTION_NAME);

  // Ensure the unique index on `code` exists once per process. Best-effort:
  // a failure here shouldn't take down a read.
  if (!indexesReady) {
    indexesReady = collection
      .createIndex({ code: 1 }, { unique: true })
      .then(() => undefined)
      .catch((error) => {
        console.error("Failed to ensure match index", error);
        indexesReady = null; // allow a retry next call
      });
  }
  await indexesReady;

  return collection;
}

// The magic word is the friend's name. Compare forgivingly: trim, lowercase,
// collapse whitespace, drop surrounding punctuation. "Sam", " sam ", "SAM!"
// all match.
export function normalizeMagicWord(value: unknown): string {
  return typeof value === "string"
    ? value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

// URL-safe short code for the shareable link. base62-ish from random bytes.
const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomCode(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export type CreateMatchInput = {
  promptId: string;
  answer: string;
  friendName: string;
  email: string;
};

export type CreatedMatch = {
  code: string;
  ownerKey: string;
};

export async function createMatch(input: CreateMatchInput): Promise<CreatedMatch> {
  const collection = await getCollection();
  const prompt = getMatchPrompt(input.promptId);
  if (!prompt) {
    throw new Error("Unknown prompt.");
  }

  const now = new Date();
  const ownerKey = randomBytes(24).toString("base64url");

  // Retry a few times in the astronomically unlikely event of a code
  // collision (the unique index is the real guard).
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = randomCode(7);
    try {
      await collection.insertOne({
        code,
        ownerKey,
        promptId: prompt.id,
        promptText: prompt.text,
        answer: input.answer,
        friendName: input.friendName,
        friendNameKey: normalizeMagicWord(input.friendName),
        starterEmail: input.email,
        giftSent: false,
        guess: null,
        guessedAt: null,
        status: "open",
        createdAt: now,
        updatedAt: now,
      });
      return { code, ownerKey };
    } catch (error) {
      if (isDuplicateKeyError(error) && attempt < 5) continue;
      throw error;
    }
  }

  throw new Error("Could not allocate a unique game code.");
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000
  );
}

// What the guessing friend is allowed to see before they've guessed: never the
// answer, never the magic word.
export type PublicMatch = {
  code: string;
  promptText: string;
  status: MatchStatus;
};

// What the owner (with the secret key) sees: everything, including the reveal.
export type OwnerMatch = {
  code: string;
  promptText: string;
  answer: string;
  friendName: string;
  guess: string | null;
  status: MatchStatus;
};

// The reveal, returned only after a correct magic word + guess.
export type MatchReveal = {
  promptText: string;
  answer: string;
  guess: string;
};

export async function getPublicMatch(code: string): Promise<PublicMatch | null> {
  const collection = await getCollection();
  const doc = await collection.findOne(
    { code },
    { projection: { promptText: 1, status: 1, code: 1 } },
  );
  if (!doc) return null;
  return { code: doc.code, promptText: doc.promptText, status: doc.status };
}

export async function getOwnerMatch(
  code: string,
  ownerKey: string,
): Promise<OwnerMatch | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ code });
  if (!doc || doc.ownerKey !== ownerKey) return null;
  return {
    code: doc.code,
    promptText: doc.promptText,
    answer: doc.answer,
    friendName: doc.friendName,
    guess: doc.guess,
    status: doc.status,
  };
}

export type SubmitGuessResult =
  | { ok: true; reveal: MatchReveal; firstTime: boolean }
  | { ok: false; reason: "not-found" | "wrong-magic-word" | "empty-guess" };

// `guess` may be empty only when the game is already answered — that's a
// view-only re-open by someone who knows the magic word. An open game requires
// a real guess.
export async function submitGuess(
  code: string,
  magicWord: string,
  guess: string,
): Promise<SubmitGuessResult> {
  const collection = await getCollection();
  const doc = await collection.findOne({ code });
  if (!doc) return { ok: false, reason: "not-found" };

  if (normalizeMagicWord(magicWord) !== doc.friendNameKey) {
    return { ok: false, reason: "wrong-magic-word" };
  }

  // Already answered: the magic word was correct, so let them re-see the
  // reveal, but never overwrite the original guess.
  if (doc.status === "answered" && doc.guess !== null) {
    return {
      ok: true,
      firstTime: false,
      reveal: { promptText: doc.promptText, answer: doc.answer, guess: doc.guess },
    };
  }

  if (!guess.trim()) {
    return { ok: false, reason: "empty-guess" };
  }

  const now = new Date();
  await collection.updateOne(
    { code, status: "open" },
    { $set: { guess, guessedAt: now, status: "answered", updatedAt: now } },
  );

  return {
    ok: true,
    firstTime: true,
    reveal: { promptText: doc.promptText, answer: doc.answer, guess },
  };
}

// Best-effort: who to ping when a guess lands (Option B). Returns the starter's
// email so a caller can dispatch the "your friend guessed" notification once an
// email provider is wired up. Kept separate so the guess path stays fast.
export async function getStarterEmailForPing(code: string): Promise<string | null> {
  const collection = await getCollection();
  const doc = await collection.findOne(
    { code },
    { projection: { starterEmail: 1 } },
  );
  return doc?.starterEmail || null;
}

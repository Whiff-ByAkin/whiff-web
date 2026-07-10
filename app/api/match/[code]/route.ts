import {
  getOwnerMatch,
  getPublicMatch,
  getStarterEmailForPing,
  submitGuess,
} from "@/lib/match";

export const runtime = "nodejs";

const MAX_GUESS_LENGTH = 140;
const MAX_MAGIC_LENGTH = 60;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

// GET /api/match/[code]          -> public view (never the answer)
// GET /api/match/[code]?k=owner  -> owner view (full, including the reveal)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const ownerKey = new URL(request.url).searchParams.get("k");

  if (ownerKey) {
    const owner = await getOwnerMatch(code, ownerKey);
    if (!owner) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }
    return Response.json({ mode: "owner", ...owner });
  }

  const publicMatch = await getPublicMatch(code);
  if (!publicMatch) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ mode: "public", ...publicMatch });
}

// POST /api/match/[code] -> submit a guess, gated by the magic word.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  let payload: { magicWord?: unknown; guess?: unknown };
  try {
    payload = (await request.json()) as { magicWord?: unknown; guess?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const magicWord = clean(payload.magicWord, MAX_MAGIC_LENGTH);
  const guess = clean(payload.guess, MAX_GUESS_LENGTH);

  if (!magicWord) {
    return Response.json({ error: "Enter the magic word." }, { status: 400 });
  }

  try {
    // `guess` may be empty here — the lib allows it only for a view-only
    // re-open of an already-answered game, and rejects it otherwise.
    const result = await submitGuess(code, magicWord, guess);
    if (!result.ok) {
      if (result.reason === "not-found") {
        return Response.json({ error: "This game doesn't exist." }, { status: 404 });
      }
      if (result.reason === "empty-guess") {
        return Response.json({ error: "Add your guess first." }, { status: 400 });
      }
      return Response.json(
        { error: "That's not the magic word. (Hint: it's your name.)" },
        { status: 403 },
      );
    }

    // Option B hook: on the first guess, ping the starter that their friend
    // answered. Email delivery needs a provider (e.g. Resend) + key; until
    // that's wired up we resolve the recipient and log the intent so the
    // reveal path never blocks on it.
    if (result.firstTime) {
      getStarterEmailForPing(code)
        .then((email) => {
          if (email) {
            console.info(`[match] guess landed for ${code}; ping ${email} (delivery TODO)`);
          }
        })
        .catch(() => undefined);
    }

    return Response.json({ ok: true, reveal: result.reveal });
  } catch (error) {
    console.error("Failed to submit guess", error);
    return Response.json({ error: "We could not save your guess right now." }, { status: 500 });
  }
}

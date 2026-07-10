import { createMatch } from "@/lib/match";
import { getMatchPrompt } from "@/lib/match-prompts";
import { issueFounderBadge } from "@/lib/badge-service";

export const runtime = "nodejs";

const MAX_ANSWER_LENGTH = 140;
const MAX_NAME_LENGTH = 40;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CreatePayload = {
  promptId?: unknown;
  answer?: unknown;
  friendName?: unknown;
  email?: unknown;
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export async function POST(request: Request) {
  let payload: CreatePayload;
  try {
    payload = (await request.json()) as CreatePayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const promptId = typeof payload.promptId === "string" ? payload.promptId : "";
  const answer = clean(payload.answer, MAX_ANSWER_LENGTH);
  const friendName = clean(payload.friendName, MAX_NAME_LENGTH);
  const email = typeof payload.email === "string"
    ? payload.email.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH)
    : "";

  if (!getMatchPrompt(promptId)) {
    return Response.json({ error: "Pick a prompt first." }, { status: 400 });
  }
  if (!answer) {
    return Response.json({ error: "Add your answer first." }, { status: 400 });
  }
  if (!friendName) {
    return Response.json({ error: "Tell us who this is for." }, { status: 400 });
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Add a valid email." }, { status: 400 });
  }

  try {
    const { code, ownerKey } = await createMatch({ promptId, answer, friendName, email });

    // The digital gift: mint this starter's founder badge in the background.
    // Same-origin call, fire-and-forget so a slow/down function never blocks the game.
    issueFounderBadge(email, new URL(request.url).origin).catch(() => undefined);

    return Response.json({ ok: true, code, ownerKey }, { status: 201 });
  } catch (error) {
    console.error("Failed to create match", error);
    return Response.json({ error: "We could not start your game right now." }, { status: 500 });
  }
}

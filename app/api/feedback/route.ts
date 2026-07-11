import {
  EMAIL_PATTERN,
  cleanBlock,
  cleanLine,
  normalizeEmail,
  saveFeedback,
} from "@/lib/leads";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 1200;
const MAX_SOURCE_LENGTH = 60;
const MAX_PATH_LENGTH = 200;

// Keep the sentiment field to a known vocabulary so it stays useful to filter
// on later. Anything else is dropped to null.
const SENTIMENTS = new Set(["love", "okay", "not_for_me"]);

type FeedbackPayload = {
  message?: unknown;
  sentiment?: unknown;
  email?: unknown;
  source?: unknown;
  path?: unknown;
};

export async function POST(request: Request) {
  let payload: FeedbackPayload;
  try {
    payload = (await request.json()) as FeedbackPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = cleanBlock(payload.message, MAX_MESSAGE_LENGTH);
  const sentimentRaw = typeof payload.sentiment === "string" ? payload.sentiment : "";
  const sentiment = SENTIMENTS.has(sentimentRaw) ? sentimentRaw : null;
  const email = normalizeEmail(payload.email);
  const source = cleanLine(payload.source, MAX_SOURCE_LENGTH) || "site";
  const path = cleanLine(payload.path, MAX_PATH_LENGTH);

  // Accept feedback with either a written note or at least a sentiment tap, so
  // a quick "love it" still counts, but block truly empty submissions.
  if (!message && !sentiment) {
    return Response.json({ error: "Tell us a little more first." }, { status: 400 });
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Add a valid email or leave it blank." }, { status: 400 });
  }

  try {
    await saveFeedback({ source, sentiment, message, email, path });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save feedback", error);
    return Response.json(
      { error: "We could not save your feedback right now." },
      { status: 500 },
    );
  }
}

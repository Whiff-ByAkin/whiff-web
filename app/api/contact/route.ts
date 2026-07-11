import {
  EMAIL_PATTERN,
  cleanBlock,
  cleanLine,
  normalizeEmail,
  saveContactMessage,
} from "@/lib/leads";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 80;
const MAX_LOCATION_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 2000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  location?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = cleanLine(payload.name, MAX_NAME_LENGTH);
  const email = normalizeEmail(payload.email);
  const location = cleanLine(payload.location, MAX_LOCATION_LENGTH);
  const message = cleanBlock(payload.message, MAX_MESSAGE_LENGTH);

  if (!name) {
    return Response.json({ error: "Add your name." }, { status: 400 });
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Add a valid email." }, { status: 400 });
  }
  if (!message) {
    return Response.json({ error: "Add a message." }, { status: 400 });
  }

  try {
    await saveContactMessage({ name, email, location, message });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact message", error);
    return Response.json(
      { error: "We could not send your message right now." },
      { status: 500 },
    );
  }
}

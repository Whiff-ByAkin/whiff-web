import { EMAIL_PATTERN, cleanLine, normalizeEmail, saveInviteRequest } from "@/lib/leads";

export const runtime = "nodejs";

const MAX_SOURCE_LENGTH = 60;

type InvitePayload = {
  email?: unknown;
  source?: unknown;
};

export async function POST(request: Request) {
  let payload: InvitePayload;
  try {
    payload = (await request.json()) as InvitePayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = normalizeEmail(payload.email);
  const source = cleanLine(payload.source, MAX_SOURCE_LENGTH) || "home_invite";

  if (!email || !EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Add a valid email." }, { status: 400 });
  }

  try {
    await saveInviteRequest({ email, source });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save invite request", error);
    return Response.json(
      { error: "We could not save your request right now." },
      { status: 500 },
    );
  }
}

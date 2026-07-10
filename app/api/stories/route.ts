import { getMongoDb } from "@/lib/mongodb";
import {
  STORY_COLLECTION_NAME,
  cleanBlockText,
  cleanInlineText,
  cleanQuote,
} from "@/lib/stories";

export const runtime = "nodejs";

const MAX_STORY_LENGTH = 2000;
const MAX_NICKNAME_LENGTH = 40;
const MAX_LABEL_LENGTH = 44;
const MAX_QUOTE_LENGTH = 180;
const MAX_TAKEAWAY_LENGTH = 220;
const MAX_EMAIL_LENGTH = 254;
const MAX_TAG_LENGTH = 32;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type StoryPayload = {
  story?: unknown;
  creditMode?: unknown;
  nickname?: unknown;
  email?: unknown;
  label?: unknown;
  quote?: unknown;
  takeaway?: unknown;
  tags?: unknown;
};

export async function POST(request: Request) {
  let payload: StoryPayload;

  try {
    payload = (await request.json()) as StoryPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const story = cleanBlockText(payload.story);
  const creditMode = payload.creditMode === "nickname" ? "nickname" : "anonymous";
  const nickname = cleanInlineText(payload.nickname).slice(0, MAX_NICKNAME_LENGTH);
  const email = normalizeEmail(payload.email);
  const label = cleanInlineText(payload.label).slice(0, MAX_LABEL_LENGTH);
  const quote = cleanQuote(payload.quote).slice(0, MAX_QUOTE_LENGTH);
  const takeaway = cleanInlineText(payload.takeaway).slice(0, MAX_TAKEAWAY_LENGTH);
  const tags = normalizeTags(payload.tags);

  if (!story) {
    return Response.json({ error: "Story is required." }, { status: 400 });
  }

  if (story.length > MAX_STORY_LENGTH) {
    return Response.json(
      { error: `Story must be ${MAX_STORY_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  if (creditMode === "nickname" && !nickname) {
    return Response.json(
      { error: "Add a nickname or choose anonymous." },
      { status: 400 },
    );
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    return Response.json(
      { error: "Add a valid email or leave it blank." },
      { status: 400 },
    );
  }

  try {
    const db = await getMongoDb();
    const now = new Date();
    const result = await db.collection(STORY_COLLECTION_NAME).insertOne({
      story,
      creditMode,
      nickname: creditMode === "nickname" ? nickname : null,
      email: email || null,
      emailPurpose: email ? "digital_gift_only" : null,
      marketingOptIn: false,
      ...(label ? { label } : {}),
      ...(quote ? { quote } : {}),
      ...(takeaway ? { takeaway } : {}),
      ...(tags.length > 0 ? { tags } : {}),
      status: "published",
      source: "blog_story_wall",
      createdAt: now,
      updatedAt: now,
    });

    return Response.json(
      {
        ok: true,
        id: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save story submission", error);

    return Response.json(
      { error: "We could not save your story right now." },
      { status: 500 },
    );
  }
}

function normalizeEmail(value: unknown) {
  return typeof value === "string"
    ? value.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH)
    : "";
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((tag) => cleanInlineText(tag).slice(0, MAX_TAG_LENGTH))
    .filter(Boolean)
    .slice(0, 5);
}

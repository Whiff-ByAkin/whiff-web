import { getMongoDb } from "./mongodb";
import type { StoryPreview } from "@/app/blog/data";

export const STORY_COLLECTION_NAME = "whiff_dating_app_stories";

const STORY_SOURCE = "blog_story_wall";
const DEFAULT_LABEL = "Dating app experience";
const MAX_PUBLIC_STORIES = 48;
const QUOTE_LENGTH = 118;

type StoryDocument = {
  _id: { toString(): string };
  story?: unknown;
  creditMode?: unknown;
  nickname?: unknown;
  label?: unknown;
  quote?: unknown;
  takeaway?: unknown;
  status?: unknown;
  source?: unknown;
  createdAt?: unknown;
};

export async function getStoryPreviews(limit = MAX_PUBLIC_STORIES): Promise<StoryPreview[]> {
  const db = await getMongoDb();
  const docs = await db
    .collection<StoryDocument>(STORY_COLLECTION_NAME)
    .find({
      source: STORY_SOURCE,
      status: { $ne: "hidden" },
    })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .toArray();

  return docs
    .map(toStoryPreview)
    .filter((story): story is StoryPreview => story !== null);
}

export function toStoryPreview(doc: StoryDocument): StoryPreview | null {
  const story = cleanBlockText(doc.story);
  if (!story) return null;

  const nickname = cleanInlineText(doc.nickname);
  const label = cleanInlineText(doc.label) || DEFAULT_LABEL;
  const quote = cleanQuote(doc.quote) || makeQuote(story);
  const takeaway = cleanInlineText(doc.takeaway);

  return {
    id: doc._id.toString(),
    label,
    author: doc.creditMode === "nickname" && nickname ? nickname : "Anonymous",
    quote,
    story,
    ...(takeaway ? { takeaway } : {}),
  };
}

export function cleanBlockText(value: unknown) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

export function cleanInlineText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function cleanQuote(value: unknown) {
  return cleanInlineText(value).replace(/^["']|["']$/g, "");
}

function makeQuote(story: string) {
  const compact = cleanInlineText(story);
  const firstSentence = compact.match(/^.{1,120}?(?:[.!?](?:\s|$)|$)/)?.[0] ?? compact;

  return trimToWord(firstSentence, QUOTE_LENGTH);
}

function trimToWord(value: string, maxLength: number) {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;

  return `${trimmed
    .slice(0, maxLength)
    .trimEnd()
    .replace(/\s+\S*$/, "")}...`;
}

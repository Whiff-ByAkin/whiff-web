// Lead + signal capture for whiff's marketing surfaces. Three lightweight
// collections, one per intent, all in the same database the rest of the app
// uses:
//   - contact form ("restaurateur / other inquiries")   -> whiff_contact_messages
//   - "request an invite" on the home page              -> whiff_invite_requests
//   - product feedback from the game + blog             -> whiff_feedback
//
// Every writer here is best-effort and defensive: a capture failing should
// never take down the page the visitor is on, so callers surface a friendly
// error and move on.

import { getMongoDb } from "./mongodb";

export const CONTACT_COLLECTION_NAME = "whiff_contact_messages";
export const INVITE_COLLECTION_NAME = "whiff_invite_requests";
export const FEEDBACK_COLLECTION_NAME = "whiff_feedback";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: unknown, max = 254): string {
  return typeof value === "string"
    ? value.trim().toLowerCase().slice(0, max)
    : "";
}

// Collapse whitespace, trim, and cap length. Used for single-line fields.
export function cleanLine(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, max)
    : "";
}

// Preserve paragraph breaks but tidy stray whitespace. Used for message bodies.
export function cleanBlock(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, max);
}

type ContactInput = {
  name: string;
  email: string;
  location: string;
  message: string;
};

export async function saveContactMessage(input: ContactInput): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection(CONTACT_COLLECTION_NAME).insertOne({
    name: input.name,
    email: input.email,
    location: input.location || null,
    message: input.message,
    status: "new",
    source: "contact_dialog",
    createdAt: now,
    updatedAt: now,
  });
}

type InviteInput = {
  email: string;
  source: string;
};

// One row per person: re-requesting from the same email just bumps the count
// and timestamp rather than piling up duplicates.
export async function saveInviteRequest(input: InviteInput): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection(INVITE_COLLECTION_NAME).updateOne(
    { email: input.email },
    {
      $set: { email: input.email, source: input.source, updatedAt: now, status: "requested" },
      $setOnInsert: { createdAt: now },
      $inc: { requestCount: 1 },
    },
    { upsert: true },
  );
}

type FeedbackInput = {
  source: string;
  sentiment: string | null;
  message: string;
  email: string;
  path: string;
};

export async function saveFeedback(input: FeedbackInput): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection(FEEDBACK_COLLECTION_NAME).insertOne({
    source: input.source,
    sentiment: input.sentiment,
    message: input.message,
    email: input.email || null,
    path: input.path || null,
    status: "new",
    createdAt: now,
    updatedAt: now,
  });
}

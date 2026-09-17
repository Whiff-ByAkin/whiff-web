import type { NoteColor } from "./roast-types";
import { SITE_URL } from "../config/site";

export type ShareableRoast = {
  id: string; message: string; name: string; color: NoteColor;
  source: "team" | "community";
};

/** Editorial jokes, deliberately separate from visitor submissions and their moderation. */
export const TEAM_ROASTS: readonly ShareableRoast[] = [
  { id: "houseplants", message: "A twelve-week commitment? My houseplants would like a word.", color: "yellow" },
  { id: "group-project", message: "Four strangers. Six activities. Finally, a group project I chose.", color: "pink" },
  { id: "bold-business-model", message: "An app that tells you to put your phone down. Bold business model.", color: "sage" },
  { id: "friendship-syllabus", message: "Making friends apparently comes with a syllabus.", color: "lilac" },
  { id: "calendar-invite", message: "The cure for ‘we should hang out sometime’ is apparently a calendar invite.", color: "sage" },
  { id: "leaving-the-house", message: "Great concept. Unfortunately, it involves leaving the house.", color: "yellow" },
].map(note => ({ ...note, color: note.color as NoteColor, name: "The Whiff team", source: "team" as const }));

export function roastUrl(id: string) { return `${SITE_URL}/roast/${encodeURIComponent(id)}`; }
export function roastShareText(note: ShareableRoast) {
  return `“${note.message}”${note.source === "community" ? `\n— ${note.name || "Anonymous"}, a community note` : ""}\nRoast Whiff\n\n${roastUrl(note.id)}`;
}

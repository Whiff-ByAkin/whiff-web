export const NOTE_MAX_LENGTH = 2000;
export const NOTE_COLORS = ["yellow", "pink", "sage", "lilac"] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];
export type NoteStatus = "pending" | "approved" | "rejected";
export type RoastNote = {
  id: string;
  message: string;
  name: string;
  color: NoteColor;
  status: NoteStatus;
  createdAt: string;
  publishedAt: string | null;
};

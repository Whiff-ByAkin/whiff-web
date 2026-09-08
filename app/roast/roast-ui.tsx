import Link from "next/link";

export const NOTE_COLORS = ["yellow", "pink", "sage", "lilac"] as const;
export type NoteColor = typeof NOTE_COLORS[number];
export type NoteStatus = "pending" | "approved" | "rejected";
export type RoastNote = { id: string; message: string; name: string; color: NoteColor; createdAt: string; publishedAt: string | null; status?: NoteStatus };
export type NotesResponse = { notes: RoastNote[]; nextCursor: string | null };

export async function readResponse<T>(response: Response): Promise<T> {
  let data;
  try { data = await response.json(); } catch { throw new Error("We couldn’t read the response. Please try again."); }
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.");
  return data as T;
}

export function RoastHeader({ review = false }: { review?: boolean }) {
  return <header className="roast-header roast-wrap"><Link href="/" className="roast-wordmark" aria-label="Whiff home">whiff</Link><nav aria-label="Page navigation"><Link href="/">Meet Whiff <span aria-hidden="true">↗</span></Link>{review ? <Link href="/roast">Public wall <span aria-hidden="true">↗</span></Link> : <a href="#write-a-note">Leave a note <span aria-hidden="true">↘</span></a>}</nav></header>;
}

export function RoastFooter() {
  return <footer className="roast-footer roast-wrap"><Link href="/" className="roast-wordmark">whiff</Link><p>Good company starts with honesty.</p><nav aria-label="Footer navigation"><Link href="/support">Support</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav><span>© 2026 WHIFF</span></footer>;
}

export function NotePaper({ note, children, review = false }: { note: RoastNote; children?: React.ReactNode; review?: boolean }) {
  const date = review ? note.createdAt : note.publishedAt ?? note.createdAt;
  return <article className={`roast-note roast-color-${note.color}`}><span className="roast-note-category">{review ? "SUBMITTED NOTE" : "FROM THE WALL"}</span><p className="roast-note-message">{note.message}</p><footer><span>{note.name || "Anonymous"}</span><time dateTime={date}>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></footer>{children}</article>;
}

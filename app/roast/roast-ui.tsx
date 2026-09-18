import Link from "next/link";
import { RoastShare } from "./roast-share";
import type { ShareableRoast } from "../lib/roast-content";


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

export function RoastHeader({ showWall = false, onAdd }: { showWall?: boolean; onAdd?: () => void }) {
  return <header className="roast-header roast-wrap"><Link href="/" className="roast-wordmark" aria-label="Whiff home">whiff</Link><nav aria-label="Feedback navigation">{showWall && <Link href="/roast">All notes</Link>}<Link href="/roast#write-a-note" onClick={onAdd}>Add a note</Link></nav></header>;
}

export function RoastFooter() {
  return <footer className="roast-footer roast-wrap"><Link href="/" className="roast-wordmark">whiff</Link><p>No sugar-coating.</p><nav aria-label="Footer navigation"><Link href="/support">Support</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav><span>© 2026 WHIFF</span></footer>;
}

export function NotePaper({ note, children, review = false, linked = false }: { note: RoastNote | ShareableRoast; children?: React.ReactNode; review?: boolean; linked?: boolean }) {
  const source = "source" in note ? note.source : "community";
  const date = "createdAt" in note ? review ? note.createdAt : note.publishedAt ?? note.createdAt : null;
  return <article className={`roast-note roast-color-${note.color}`}>
    <span className="roast-note-category">{review ? "SUBMITTED NOTE" : source === "team" ? "ILLUSTRATIVE EXAMPLE" : "COMMUNITY NOTE"}</span>
    <p className="roast-note-message">{linked && !review ? <Link href={`/roast/${encodeURIComponent(note.id)}`} className="roast-note-link">{note.message}</Link> : note.message}</p>
    <footer><span>{source === "team" ? "Whiff-written · not a user review" : note.name || "Anonymous"}</span>{review && date && <time dateTime={date}>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time>}</footer>
    {linked && !review && <Link href={`/roast/${encodeURIComponent(note.id)}`} className="roast-read-full">Read full note <span aria-hidden="true">↗</span></Link>}
    {!review && <RoastShare note={{ id: note.id, message: note.message, name: note.name, color: note.color, source }} />}{children}
  </article>;
}

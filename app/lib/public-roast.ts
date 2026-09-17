import "server-only";
import { TEAM_ROASTS, type ShareableRoast } from "./roast-content";
import { getPublicNote } from "./roast-store";

/** No persistent cache: hiding a visitor note removes it from every origin surface. */
export async function getPublicRoast(id: string): Promise<ShareableRoast | null> {
  const team = TEAM_ROASTS.find(note => note.id === id);
  if (team) return team;
  // Visitor ids are server-issued UUIDs; arbitrary paths never touch storage.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const note = await getPublicNote(id);
  return note ? { id: note.id, message: note.message, name: note.name, color: note.color, source: "community" } : null;
}

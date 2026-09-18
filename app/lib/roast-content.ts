import type { NoteColor } from "./roast-types";
import { SITE_URL } from "../config/site";

export type ShareableRoast = {
  id: string; message: string; name: string; color: NoteColor;
  source: "team" | "community";
};

/** Fictional scenarios written by Whiff; never represented as beta-tester submissions. */
export const TEAM_ROASTS: readonly ShareableRoast[] = [
  {
    id: "example-reliability", color: "yellow",
    message: "You want to be the app that gets me out of the house, but in this imagined beta test I can’t even get past making a plan. I spend my evening filling things out, open the next screen, and the app crashes. I come back and I’m wondering whether anything saved. That is a pretty rough first impression for something asking me to trust it with my free time.\n\nI don’t need another clever pitch about fixing loneliness. I need the basics to work before I invite anyone else into this. My advice: prioritize the crashes, save progress as I go, and make it obvious what to do when something fails. A boring app that works beats a beautiful promise every time."
  },
  {
    id: "example-commitment", color: "pink",
    message: "I like the concept. Genuinely. In this fictional scenario I’ve moved to a new city, my friends are far away, and ‘just join a club’ has become everyone’s favorite advice. Having a small group and an actual reason to meet sounds useful. But twelve weeks is a big ask before I know whether we’ll get along. What if the first outing is painfully awkward? What if my schedule changes halfway through?\n\nThe idea makes me curious, but the commitment makes me hesitate. My advice: show me exactly what a typical week looks like, explain how missed outings work, and consider a low-pressure first meetup. Give me enough information to say yes without feeling like I’ve enrolled in a second job."
  },
  {
    id: "example-planning", color: "sage",
    message: "Here’s an imagined beta experience: four people are finally willing to meet, and then the planning starts. One is across town, one finishes work late, and I’m trying to work out whether the suggested outing fits my budget. If we still spend the whole evening negotiating, I’m going to wonder what the app actually solved. I already have group chats where plans go to die.\n\nSmall groups could be the best part of Whiff, but the last mile matters. My advice: make the cost, travel distance, and time commitment clear before people agree. Give us a simple way to flag a bad fit and pick an alternative. Help us leave with a real plan, not another ‘we should do something soon.’"
  },
].map(note => ({ ...note, color: note.color as NoteColor, name: "The Whiff team", source: "team" as const }));

export function roastUrl(id: string) { return `${SITE_URL}/roast/${encodeURIComponent(id)}`; }
export function roastShareText(note: ShareableRoast) {
  return `“${note.message}”\n— ${note.source === "community" ? `${note.name || "Anonymous"}, a community note` : "Whiff-written example — not a user review"}\nWhat’s wrong with Whiff?\n\n${roastUrl(note.id)}`;
}

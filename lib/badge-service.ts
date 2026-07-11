// Triggers the Python badge function (api/badge.py). The badge is the "digital
// gift" the do-you-know-me flow promises: on match creation we mint one founder
// badge for the starter's email and (eventually) email it.
//
// Same project, so we call it same-origin — no service URL to configure.
// BADGE_SERVICE_URL is only needed if you later split the function onto its own
// deployment. Best-effort by design: creating a game must never fail on this,
// so callers should fire-and-forget.

import { getMongoDb } from "./mongodb";

// Kept in sync with api/_badge/db.py (BADGE_COLLECTION). The Python function
// writes here when it mints a badge; we read it to enforce one game per email.
const BADGE_COLLECTION_NAME = "whiff_founder_badges";

// Has this email already claimed a founder badge? One badge per person means one
// game per person, so the create flow uses this to turn repeat plays away.
export async function hasFounderBadge(email: string): Promise<boolean> {
  try {
    const db = await getMongoDb();
    const doc = await db
      .collection(BADGE_COLLECTION_NAME)
      .findOne({ email }, { projection: { _id: 1 } });
    return doc !== null;
  } catch (error) {
    // If the lookup itself fails, don't wrongly block a first-time player.
    console.error("[badge] could not check existing badge", error);
    return false;
  }
}

export async function issueFounderBadge(email: string, origin: string): Promise<void> {
  const baseUrl = process.env.BADGE_SERVICE_URL || origin;
  if (!baseUrl) return;

  const token = process.env.BADGE_SERVICE_TOKEN;

  try {
    const res = await fetch(`${baseUrl}/api/badge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Badge-Token": token } : {}),
      },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      console.error(`[badge] function responded ${res.status} for ${email}`);
    }
  } catch (error) {
    console.error("[badge] could not reach badge function", error);
  }
}

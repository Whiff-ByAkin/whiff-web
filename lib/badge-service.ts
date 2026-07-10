// Triggers the Python badge function (api/badge.py). The badge is the "digital
// gift" the do-you-know-me flow promises: on match creation we mint one founder
// badge for the starter's email and (eventually) email it.
//
// Same project, so we call it same-origin — no service URL to configure.
// BADGE_SERVICE_URL is only needed if you later split the function onto its own
// deployment. Best-effort by design: creating a game must never fail on this,
// so callers should fire-and-forget.

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

"use client";

import { track } from "@vercel/analytics";

export function homepageContext(): { homepage_variant?: string; audience?: string } {
  const page = document.querySelector<HTMLElement>("[data-home-variant]");
  const story = document.querySelector<HTMLElement>("[data-home-audience]");
  const audience = story?.dataset.homeAudience;
  return {
    ...(page ? { homepage_variant: page.dataset.homeVariant } : {}),
    ...(story?.dataset.homeAudienceSelected === "true" && ["new", "local"].includes(audience || "") ? { audience } : {}),
  };
}

function publicTrack(name: string, properties: Record<string, string> = {}) {
  // Owner previews must not count toward campaign conversion results.
  if (window.location.pathname.startsWith("/owner")) return;
  track(name, { ...homepageContext(), ...properties });
}

export function trackAudienceSelected(audience: "new" | "local") {
  publicTrack("homepage_audience_selected", { audience });
}

export function trackStoryChapter(chapter: number, audience: "new" | "local") {
  if (Number.isInteger(chapter) && chapter >= 0 && chapter < 3) {
    publicTrack("homepage_story_chapter", { chapter: String(chapter + 1), audience });
  }
}

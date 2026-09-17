import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { homeStoreCacheKey, homeStorageConfigured, readStoredHome } from "./home-store";
import { homeVariantOverride, type HomeSettings } from "./home-types";

export const HOME_SETTINGS_TAG = "whiff-homepage-settings";
const storedVariant = unstable_cache(async (namespace: string) => {
  void namespace; // The argument is part of Next's persistent cache identity.
  return readStoredHome();
}, ["homepage-v1"], {
  tags: [HOME_SETTINGS_TAG], revalidate: 60,
});
export async function getHomeSettings(fresh = false): Promise<HomeSettings> {
  const override = homeVariantOverride();
  if (override) return { variant: override, source: "environment", editable: false };
  const editable = homeStorageConfigured();
  if (!editable) return { variant: "classic", source: "default", editable: false };
  try {
    const variant = fresh ? await readStoredHome() : await storedVariant(homeStoreCacheKey());
    return { variant: variant || "classic", source: variant ? "stored" : "default", editable };
  } catch {
    // Do not cache failed reads as successful defaults. The data cache keeps
    // its last successful value on background refresh errors; cold starts use
    // the original page and never expose connection details.
    return { variant: "classic", source: "default", editable: false,
      error: "Homepage storage is unavailable. Publishing is paused; the original page is the fallback." };
  }
}
/** Keep metadata and visible HTML on the same decision within a render. */
export const getPublicHome = cache(() => getHomeSettings());

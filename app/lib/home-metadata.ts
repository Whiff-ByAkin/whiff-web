import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/app/config/site";
import type { HomeVariant } from "./home-types";
export function homeMetadata(variant: HomeVariant): Metadata {
  const city = variant === "city";
  const path = city ? "/mn" : "/";
  const title = city ? "New to Minnesota? Make friends in the Twin Cities | Whiff" : "Whiff | Make friends in Minneapolis and Saint Paul";
  const description = city
    ? "Moving to Minnesota or making new friends? Explore Twin Cities activities, local guides and Whiff’s platonic friendship circles. App-store links coming soon."
    : "Make friends in the Twin Cities with Whiff: the same four people, six activities, twelve weeks. Platonic friendship, with first circles forming and app-store links coming soon.";
  const shareTitle = city ? "You moved here. Now live a little." : "Strangers only on week one.";
  const images = city ? [{ url: `${SITE_URL}/home-share/city`, width: 1200, height: 630, alt: "Whiff. You moved here. Now live a little." }] : undefined;
  return {
    title: { absolute: title }, description, alternates: { canonical: path },
    openGraph: { type: "website", url: new URL(path, SITE_URL).toString(), siteName: SITE_NAME, title: shareTitle, description, locale: "en_US", ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title: shareTitle, description, ...(images ? { images } : {}) },
  };
}

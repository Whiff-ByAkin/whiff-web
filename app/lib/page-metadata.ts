import type { Metadata } from "next";
import { SITE_NAME } from "../config/site";

/** Keep each public page’s search result and share preview on its own URL. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const shareTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, url: path, title: shareTitle, description },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}

import type { Metadata } from "next";
import { connection } from "next/server";
import { getStoryPreviews } from "@/lib/stories";
import { BlogHubJsonLd } from "./structured-data";
import { BLOG_URL, OG_IMAGE, TWITTER_IMAGE } from "./data";
import { StoryHub } from "./story-hub";

const TITLE = "Dating App Stories, Fatigue, and Burnout";
const DESCRIPTION =
  "Read and share real dating app stories about burnout, ghosting, swiping fatigue, choice overload, bad dates, and why whiff is rethinking modern connection.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: BLOG_URL },
  keywords: [
    "dating app stories",
    "dating app fatigue",
    "dating app burnout",
    "dating app horror stories",
    "worst dating app stories",
    "swiping fatigue",
    "online dating burnout",
    "ghosting stories",
    "bad dating app experiences",
    "online dating stories",
    "dating app experiences",
    "dating app alternatives",
    "modern dating",
    "meet people without swiping",
    "whiff dating app alternative",
    "real-life connection",
  ],
  openGraph: {
    type: "website",
    url: BLOG_URL,
    siteName: "whiff",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Dating app story wall from whiff",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: TWITTER_IMAGE,
        alt: "Dating app story wall from whiff",
      },
    ],
  },
};

export default async function BlogPage() {
  await connection();
  const stories = await getStoryPreviews().catch((error) => {
    console.error("Failed to load story wall", error);
    return [];
  });

  return (
    <>
      <BlogHubJsonLd stories={stories} />
      <StoryHub stories={stories} />
    </>
  );
}

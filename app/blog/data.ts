export const SITE_URL = "https://whiff-ai.com";
export const BLOG_URL = `${SITE_URL}/blog`;
export const FEATURED_ESSAY_PATH = "/blog/dating-app-fatigue";
export const FEATURED_ESSAY_URL = `${SITE_URL}${FEATURED_ESSAY_PATH}`;
export const OG_IMAGE = `${SITE_URL}/opengraph-image`;
export const TWITTER_IMAGE = `${SITE_URL}/twitter-image`;
export const PUBLISHED_DATE = "2026-07-08";

export const sources = [
  {
    title: "Forbes Health survey on dating app fatigue",
    href: "https://www.forbes.com/health/dating/dating-app-fatigue/",
  },
  {
    title: "Match Group SEC filing on subscription and a la carte revenue",
    href: "https://www.sec.gov/Archives/edgar/data/891103/000089110325000027/mtch-20241231.htm",
  },
  {
    title: "University of Wisconsin-Madison: choice overload in online dating",
    href: "https://news.wisc.edu/online-dating-study-shows-too-many-choices-can-lead-to-dissatisfaction/",
  },
  {
    title: "Tilburg University: A Rejection Mind-Set",
    href: "https://research.tilburguniversity.edu/en/publications/a-rejection-mind-set-choice-overload-in-online-dating",
  },
] as const;

export type StoryPreview = {
  id: string;
  label: string;
  author: string;
  quote: string;
  story: string;
  takeaway?: string;
};

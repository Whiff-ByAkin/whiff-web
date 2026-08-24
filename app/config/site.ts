export const CONTACT_EMAIL = "admin@whi-ff.com";

// The canonical origin. This must match the domain that actually serves the
// site: canonical tags, the sitemap, robots `host` and every generated OG image
// URL are all built from it, so pointing it at a domain without DNS silently
// de-indexes the whole site.
export const SITE_URL = "https://whi-ff.com";

export const SITE_NAME = "whiff";

export const INSTAGRAM_URL = "https://www.instagram.com/discover_whiff/";

export const FOUNDED_YEAR = "2026";

/** Markets whiff actually operates in. Nothing here is aspirational. */
export type Market = {
  /** URL segment under /cities */
  slug: string;
  /** City name as a person would type it */
  city: string;
  state: string;
  stateAbbr: string;
  /** How locals refer to the wider area — used in copy, never keyword-stuffed */
  region: string;
  status: "live" | "waitlist";
  /** Neighbourhoods and venues circles actually go to. Local specificity is
   *  what keeps a city page from being a template with the name swapped. */
  neighborhoods: string[];
  /** Seasonal reality of the market — the reason a generic national page can't
   *  answer "what would I actually be doing here". */
  seasons: { label: string; activities: string }[];
  /** Why making friends here is specifically hard. */
  localTension: string;
  latitude: number;
  longitude: number;
};

export const MARKETS: Market[] = [
  {
    slug: "saint-paul",
    city: "Saint Paul",
    state: "Minnesota",
    stateAbbr: "MN",
    region: "the Twin Cities",
    status: "live",
    neighborhoods: [
      "Cathedral Hill",
      "Lowertown",
      "Grand Avenue",
      "Como",
      "West Seventh",
      "Highland Park",
    ],
    seasons: [
      {
        label: "Winter",
        activities:
          "indoor climbing at Vertical Endeavors, pottery and print studios in Lowertown, trivia and board-game nights on West Seventh, skating at Landmark Center",
      },
      {
        label: "Spring and autumn",
        activities:
          "walks around Como Lake, the Saint Paul Farmers' Market on a Saturday morning, gallery crawls in Lowertown, cooking classes on Grand Avenue",
      },
      {
        label: "Summer",
        activities:
          "kayaking the Mississippi, patio dinners in Cathedral Hill, bike loops along the Sam Morgan trail, live music at Mears Park",
      },
    ],
    localTension:
      "Saint Paul is a city of long-standing circles. A lot of people here met their closest friends in high school or college and never had to make a new friend again, which is fine for them and quietly brutal if you arrived at thirty.",
    latitude: 44.9537,
    longitude: -93.09,
  },
  {
    slug: "minneapolis",
    city: "Minneapolis",
    state: "Minnesota",
    stateAbbr: "MN",
    region: "the Twin Cities",
    status: "live",
    neighborhoods: [
      "North Loop",
      "Uptown",
      "Northeast",
      "Lyn-Lake",
      "Seward",
      "Longfellow",
    ],
    seasons: [
      {
        label: "Winter",
        activities:
          "bouldering in Northeast, sauna sessions and cold plunges, ceramics studios, dim-lit listening bars in the North Loop",
      },
      {
        label: "Spring and autumn",
        activities:
          "the Chain of Lakes on foot or two wheels, brewery taprooms in Northeast, run clubs, the Midtown Farmers' Market",
      },
      {
        label: "Summer",
        activities:
          "paddleboarding Bde Maka Ska, patio nights in Lyn-Lake, outdoor films at the Walker, cycling the Greenway",
      },
    ],
    localTension:
      "Minneapolis has no shortage of things to do and a well-earned reputation for being hard to break into. People are friendly on the first meeting and busy on the second. The problem was never the events calendar. It is that nothing brings the same people back.",
    latitude: 44.9778,
    longitude: -93.265,
  },
];

export const LIVE_MARKETS = MARKETS.filter((m) => m.status === "live");

export function marketBySlug(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}

/** States with at least one live market — the header dialog reads from this so
 *  the site can never claim a state the markets list doesn't back up. */
export const LIVE_STATES = Array.from(
  new Set(LIVE_MARKETS.map((m) => m.state)),
);

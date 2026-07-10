import {
  BLOG_URL,
  FEATURED_ESSAY_URL,
  OG_IMAGE,
  PUBLISHED_DATE,
  SITE_URL,
  type StoryPreview,
} from "./data";

export function BlogHubJsonLd({ stories }: { stories: readonly StoryPreview[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BLOG_URL}#stories`,
        name: "Dating App Stories, Fatigue, and Burnout",
        url: BLOG_URL,
        description:
          "A growing wall of real stories from people dealing with dating app fatigue, burnout, ghosting, choice overload, bad dates, and modern connection.",
        publisher: publisher(),
        isPartOf: {
          "@id": `${SITE_URL}#website`,
        },
        about: [
          "dating app fatigue",
          "dating app burnout",
          "swiping fatigue",
          "online dating stories",
          "dating app alternatives",
          "real-life connection",
        ],
        keywords:
          "dating app stories, dating app fatigue, dating app burnout, worst dating app stories, ghosting stories, swiping fatigue, online dating burnout, dating app alternative",
        hasPart: stories.map((story, index) => ({
          "@type": "CreativeWork",
          "@id": `${BLOG_URL}#story-${story.id}`,
          position: index + 1,
          name: story.label,
          text: story.quote,
          author: story.author,
        })),
        inLanguage: "en-US",
      },
      featuredArticleJsonLd(),
      breadcrumbJsonLd(),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function breadcrumbJsonLd() {
  return {
    "@type": "BreadcrumbList",
    "@id": `${BLOG_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "whiff",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dating App Stories",
        item: BLOG_URL,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Why Dating Apps Feel So Exhausting",
        item: FEATURED_ESSAY_URL,
      },
    ],
  };
}

export function FeaturedEssayJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [featuredArticleJsonLd(), breadcrumbJsonLd()],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function featuredArticleJsonLd() {
  return {
    "@type": "Article",
    "@id": `${FEATURED_ESSAY_URL}#article`,
    headline: "Why Dating Apps Feel So Exhausting (And It's Not Your Fault)",
    description:
      "A research-backed essay on dating app fatigue, burnout, swiping fatigue, ghosting, choice overload, and why modern dating can feel like work.",
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    mainEntityOfPage: FEATURED_ESSAY_URL,
    image: [OG_IMAGE],
    author: {
      "@type": "Organization",
      name: "whiff",
      url: SITE_URL,
    },
    publisher: publisher(),
    keywords: [
      "dating app fatigue",
      "dating app burnout",
      "online dating stories",
      "swiping fatigue",
      "ghosting burnout",
      "choice overload",
      "dating app alternative",
      "meet people without swiping",
    ],
    articleSection: "Modern dating",
    wordCount: 1200,
    timeRequired: "PT6M",
    about: [
      "dating app fatigue",
      "dating app burnout",
      "online dating",
      "choice overload",
      "real-life connection",
    ],
    inLanguage: "en-US",
  };
}

function publisher() {
  return {
    "@type": "Organization",
    name: "whiff",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/whiff-icon.png`,
    },
  };
}

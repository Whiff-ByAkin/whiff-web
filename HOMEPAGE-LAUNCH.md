# Whiff page addresses

The original Whiff homepage is always served at `/`. The Minnesota story page is served at `/mn`. Uppercase variants such as `/MN` permanently redirect to `/mn`, preserving campaign query parameters. The old homepage publishing switch is retired; saved settings and HOME_VARIANT cannot replace the homepage.

`/owner` retains authenticated preview access. Its former publishing endpoint returns 410. Public pages now show store buttons; invite-list email collection has been removed. No production deployment is implied by local preview.

## Copy and facts

The story has two perspectives: newcomer by default, and local through **Know the city?**. **New here?** returns to the newcomer perspective. Outings are imagined examples, not customer testimonials or scheduled events.

Verified against Whiff's shared product constants: four members, six activities, twelve weeks, $19.99 per month and a trial of seven days. Minimum membership age is 21 in participation.ts. The site states that first circles are forming, activities cost extra, and app availability is marked coming soon until store links are supplied. City prose, metadata and social card use no dash punctuation. Local examples are possibilities and imply no venue partnership.

## Search setup

Both public pages have their own title, description, canonical URL and social URL. The Minnesota page has a WebPage entity and a local Service entity referring to `/mn`; it does not redefine the whole website. It is included in sitemap.xml and linked from the main homepage footer and locations page. Owner previews remain noindex and excluded from the sitemap.

References: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [Como Lake](https://www.stpaul.gov/departments/parks-and-recreation/como-regional-park/como-lake), [Chain of Lakes](https://www.minneapolisparks.org/parks-destinations/parks-lakes/minneapolis_chain_of_lakes_regional_park/).

Analytics retain homepage_variant and the explicit perspective selection. The public URL distinguishes campaign traffic. Do not count private preview views as conversions.

## Helping first-time visitors join

The feedback wall and individual note pages introduce Whiff and link to the homepage's `#first-outing` example and `#download` app-store section. This introduction is shown to everyone; it does not infer that a visitor came from Reddit.

The homepage's first-outing itinerary is explicitly illustrative: a 75-minute coffee and walk in the Minneapolis lakes area, with an optional drink. It is not a scheduled event, venue quote, or reservation; membership is separate. The `#awkward-questions` section covers joining alone, platonic intent, quiet first meetings, chemistry, missed nights, cost, app availability, and other cities. Answers follow existing support/product facts and do not promise immediate matching or a guaranteed friendship.

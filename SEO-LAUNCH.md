# Minnesota search and app-store launch

## Intent

Whiff is for adult platonic friendship. Build discovery around settling into Minnesota, exploring activities with other people, and repeat contact in Minneapolis and Saint Paul. The product starts in the Twin Cities; statewide guide coverage does not mean statewide service availability. Search rankings and indexing are controlled by search engines, not guaranteed by these changes.

## Content map

- `/`: main product introduction, app-store controls, Minnesota guide links, friendship research and Yancy story.
- `/mn`: Minnesota product/story hub, with links to the same research and guides.
- `/mn/moving-to-minnesota`: social routines and a practical first-month approach after a move.
- `/mn/things-to-do`: activities to try with friends, local starting points and official references.
- `/mn/make-friends`: recurring social activities and realistic ways to meet adults.
- `/blog/how-long-does-it-take-to-make-friends`: Jeffrey A. Hall's research, interpretation and limitations.

Pages need useful visible content, unique titles/descriptions, canonical URLs, internal links, correct Article/Breadcrumb structured data and sitemap entries. Do not add thin pages that merely swap town names, fake reviews, endorsements, fabricated events or keywords hidden from readers.

## Research source

Jeffrey A. Hall, *How many hours does it take to make a friend?*, first published online March 15, 2018; Journal of Social and Personal Relationships, 36(4), 1278–1296 (2019). DOI: https://doi.org/10.1177/0265407518761225

University of Kansas summary (March 28, 2018): https://news.ku.edu/news/article/2018/03/06/study-reveals-number-hours-it-takes-make-friend

Approximate total-time estimates are about 50 hours for casual friendship, 90 for friendship, and over 200 for close friendship. These are associations from the samples, not guarantees, requirements or proof that Whiff works. The stages are not additional blocks of hours to add together. Six outings do not imply 200 hours together.

## Missing destinations

Add the real `APP_STORE_URL`, `GOOGLE_PLAY_URL`, and `TIKTOK_URL` in `app/config/site.ts` when known. Store controls stay visibly coming soon while a URL is absent. Do not link to store homepages or imply that the app can already be installed. Email lead collection has been retired; support and account-contact email remain valid.

## After publishing

1. Verify the production canonical origin and all new page responses.
2. Submit `https://whi-ff.com/sitemap.xml` to the site's Google Search Console property and Bing Webmaster Tools; these require the site owner's authenticated accounts.
3. Inspect `/mn` and each new guide in Search Console, confirm indexing is allowed, and request indexing after the URLs are live.
4. Monitor impressions, clicks and relevant non-brand queries over time. Expand guides based on real search demand, reader questions and actual service coverage; keep venue details current using official sources.
5. Add genuine contextual links from the Whiff Instagram/TikTok profiles and relevant community participation. Do not manufacture reviews or spam local forums.

The website updates do not themselves verify Search Console ownership, submit URLs through an authenticated dashboard, publish social posts or guarantee rankings.

## Technical references

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Validation (September 18, 2026)

Production build, TypeScript, ESLint, and all 21 existing tests passed. HTTP checks covered eight public pages for one canonical URL, one H1, valid JSON-LD and no email input; all four guide URLs occur in the sitemap and an unknown guide returns 404. Visual review passed at desktop, tablet and mobile widths. Store-button wrapping and mascot background blending were polished after review. These changes have not been deployed or submitted to search engines.

# whiff-web

Marketing site for **whiff** — an activity-first social platform for building
real friendships without browsing profiles. whiff learns what you enjoy, invites
you out while you wait, forms a circle of four compatible people, and plans
repeated real-world activities for that same four.

> Strangers only on week one.

whiff is **not** a dating app. That distinction is load-bearing throughout the
copy and the structured data — see `app/seo-content.ts`.

Built with [Next.js](https://nextjs.org) (App Router), Tailwind CSS v4, and
[Motion](https://motion.dev).

> **Note:** this repo pins a customized build of Next.js whose APIs and file
> conventions can differ from upstream. Read the bundled guides in
> `node_modules/next/dist/docs/` before changing framework-level code, and heed
> deprecation notices. See `AGENTS.md`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Project layout

The **home page is a single screen that does not scroll** — `h-[100svh]` plus
`overflow-hidden`, with everything inside sized in fluid clamps so it shrinks to
fit rather than overflowing. Everything the hero cannot say lives on `/blog`.

```
app/
  layout.tsx                 root metadata, fonts, analytics
  page.tsx                   the one screen: header, hero, legal hairline
  blog/                      the interactive editorial explorer
    posts.ts                 the three articles
    blog-explorer.tsx        the accessible tablist + the animation
  roles/[role]/              one page per role, from config/roles.ts
    opengraph-image.tsx      a social card per role
  states/                    where whiff is open, and the form to ask for more
    state-interest-form.tsx  posts to Formspree, client-side
  support/                   the help page, and the only FAQPage JSON-LD
  privacy/ terms/            legal (kept deliberately — see below)
  seo-content.ts             SINGLE SOURCE OF TRUTH for every factual claim
  config/site.ts             origin, contact, and the market list
  config/roles.ts            the roles /roles/[role] is generated from
  lib/structured-data.ts     the JSON-LD nodes + the @graph builder
  lib/analytics.ts           typed custom events
  llms.txt/route.ts          plain-text brief for AI assistants
  robots.ts sitemap.ts       crawl rules (AI crawlers explicitly welcomed)
  manifest.ts                the web app manifest
  opengraph-image.tsx        generated social card
  twitter-image.tsx          the same card, Twitter's tags
  components/                UI — see below
public/                      mascot art
artifacts/                   QA and design-review output. GITIGNORED, not source
```

`components/` holds `header`, `mobile-nav`, `footer`, `hero`, `home-screen`,
`ambient-background`, `ask-label`, `begin-action`, `doc-shell`, `invite-cta`,
`json-ld` and `role-explorer`. The old card deck is gone; `role-explorer`
replaced it and only a comment remembers it.

## The content contract

Every factual claim lives once, in `app/seo-content.ts`. This is deliberate:
answer engines reward consistency, and when the same fact is phrased three
different ways a model hedges or omits it. **If a claim changes, change it
there**, not in a component.

Most of that file is no longer rendered visibly. `PROMISE` reaches the hero and
the manifest, `ANSWER` reaches the JSON-LD, and the rest builds `/llms.txt` —
now the only full description of whiff a crawler or model can read.

`app/config/site.ts` is the same idea for operational facts: the canonical
origin and `MARKETS`, the list of markets whiff genuinely serves. Nothing in it
is aspirational — the header's "States" dialog and the structured data both
derive from it.

**`status` on a market means a circle has FILLED there, not that whiff is
open.** It mirrors `CityCoverageStatus` in whiff-shared, which holds the Twin
Cities hub at `FORMING` and says why: *"LIVE on day one would be the lie this
status exists to prevent."* Both entries here said `"live"` for a while and the
word reached the layout description, `/llms.txt`, both `areaServed` nodes and
the whole of `/states`. Render from `OPEN_MARKETS`; `LIVE_MARKETS` is markets
where a circle has actually completed a run, and is currently empty.

Saint Paul and Minneapolis are two entries and **one** pool — whiff-shared
merges them into `twin-cities` because two 25-mile city circles halve the
matching pool. They stay separate here only because the neighbourhoods and
seasons genuinely differ. `HUB_NAME` is what to call the metro.

**`PRICING` lives in `seo-content.ts` and mirrors the backend.** The price, the
trial length and the reminder day were not in this file at all, and `/terms` and
`/support` each typed `$49.99` against a real `SUBSCRIPTION_PRICE_PER_MONTH` of
`19.99`. The site cannot import from `whiff-api`, so this is a mirror: change
`whiff-shared/src/constants.ts` first, then `PRICING`, and nowhere else.

## The blog

The blog is three editorial pieces presented in an accessible tab interface,
so one rule matters:

**Every answer stays in the DOM at all times.** Inactive panels carry `hidden`
rather than being unmounted, so the initial HTML contains all three pieces. The
obvious AnimatePresence build would ship a page containing exactly one, which
defeats the point of the page. That rules out mount-driven animation, so the
stagger is variant-driven instead.

Every entry carries an `aside` or a `pullquote` so the third column is never a
blank third of a wide monitor.

## Why privacy and terms survived

The site is otherwise one page. Those two stayed because the invite form
collects email addresses via Formspree, and shipping a data-collecting form
with no privacy policy is a legal exposure, not a design choice. They are
linked from the footer and listed in the sitemap. Remove them only deliberately.

## SEO & AI discoverability

- **Structured data** (`app/lib/structured-data.ts`) — a JSON-LD `@graph` on
  three pages, not one. `/` carries `Organization`, `WebSite` and `Service`;
  `/states` carries `Organization` and `Service`; `/support` carries
  `Organization` and `FAQPage`. **`FAQPage` came back with `/support` and this
  section said it had been deleted** — `HowTo`, `DefinedTermSet`,
  `BreadcrumbList` and the per-city `Service`/`Event` builders really are gone,
  with the pages they described. The rule they went for still holds: structured
  data for a URL you do not serve is worse than none, which cuts both ways —
  a page you DO serve should carry it.
- **Crawler access** (`app/robots.ts`) — search, AI *training* and AI
  *retrieval* crawlers are each allowed explicitly. Blocking the retrieval
  crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot) is what removes a
  brand from AI answers, and it is usually done by accident with a blanket rule.
- **`/llms.txt`** — generated from `seo-content.ts`, never hand-written, so it
  cannot go stale. On a one-page site it carries the entire story.

## Analytics

`app/lib/analytics.ts` defines the custom events sent to Vercel Analytics:
`cta_opened` → `signup_submitted` → `signup_succeeded`. Traffic and referrer
come free from Vercel; these answer what happened next.

`signup_succeeded` carries `requested_city` — whatever the person typed into
the optional city field. whiff opens one city at a time and picks the next from
where people ask, so that field is the demand signal.

## Deploy

Deploys on [Vercel](https://vercel.com); the site rebuilds on push to `main`.
`SITE_URL` in `app/config/site.ts` must match the domain actually serving the
site — canonical tags, the sitemap and every OG image URL are built from it.

# whiff

Marketing site for **whiff** — an AI for real-life connection. You talk to it, it
learns who you are and finds your people, then its AI talks to theirs to
introduce you in real life. No profiles, no swiping. Invite-only, 25+.

Built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS v4, with
motion by [Motion](https://motion.dev).

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

```
app/
  layout.tsx               root metadata, fonts, JSON-LD structured data
  page.tsx                 home + how-it-works, plus a crawlable About/FAQ block
  flags.ts                 build-time feature flags (see below)
  seo-content.ts           single source of truth for the About + FAQ copy
  robots.ts                robots rules (AI crawlers explicitly welcomed)
  sitemap.ts               sitemap
  manifest.ts              web app manifest
  opengraph-image.tsx      generated OG image
  twitter-image.tsx        generated Twitter card
  components/              UI (hero, how-it-works section, dialogs, etc.)
public/
  llms.txt                 plain-text summary for AI assistants / answer engines
```

## SEO & AI discoverability

The site is tuned to be found and accurately cited by both search engines and
AI answer engines (ChatGPT, Perplexity, Claude, Gemini, etc.):

- **Structured data** (`app/layout.tsx`): a JSON-LD `@graph` of `Organization`,
  `WebSite`, `Service`, and `FAQPage`.
- **Answer-first copy** (`app/seo-content.ts`): the `ABOUT` and `FAQ` strings are
  the single source of truth, rendered into both the JSON-LD `FAQPage` and a
  crawlable on-page block so structured data and visible text never drift.
- **Crawler access** (`app/robots.ts`): major AI crawlers are explicitly
  allowed.
- **`public/llms.txt`**: a concise, plain-text overview for LLM-based assistants.

When you change positioning or FAQ copy, edit `app/seo-content.ts` and
`public/llms.txt` so every surface stays in sync.

## Feature flags

Build-time flags live in `app/flags.ts`. Each is read from a `NEXT_PUBLIC_` env
var with a sensible default, and is inlined at build time (a static deploy needs
a rebuild for a change to take effect).

- **`spectrumPositioning`** — env `NEXT_PUBLIC_SPECTRUM_POSITIONING`, default
  **off**. Shows the "made for the way you actually connect, especially if
  you're autistic, neurodivergent…" line on the page. SEO and structured data
  mention the audience regardless of this flag.

Enable a flag for a build:

```bash
NEXT_PUBLIC_SPECTRUM_POSITIONING=true npm run build
```

## Deploy

Deploys on [Vercel](https://vercel.com). Set any flag env vars in the project's
environment settings; the site rebuilds on push to `main`.

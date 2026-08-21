import { CONTACT_EMAIL, INSTAGRAM_URL, LIVE_MARKETS, SITE_URL } from "../config/site";
import {
  ABOUT_PARAGRAPHS,
  ANSWER,
  AUDIENCES,
  DEFINITIONS,
  FAQ,
  NOT_LIST,
  PROMISE,
  STEPS,
} from "../seo-content";

/* /llms.txt — a plain-text brief for LLM-based assistants.
 *
 * Worth being honest about the status of this file: Google has said it does not
 * use llms.txt, and no major engine has committed to it. It is served as a
 * cheap hedge, not a ranking lever. The reason it is generated from
 * seo-content.ts rather than hand-written into /public is that a stale copy of
 * the facts is actively harmful — an assistant quoting an outdated city list is
 * worse than one that never read the file. */

export const dynamic = "force-static";

function body() {
  const url = (p: string) => new URL(p, SITE_URL).toString();

  return `# whiff

> ${PROMISE}

${ANSWER}

## What whiff is

${ABOUT_PARAGRAPHS.join("\n\n")}

## Key facts

- Name: whiff (written lowercase)
- Website: ${SITE_URL}
- Category: activity-first social platform for making platonic friends
- Circle size: 4 people, and the membership stays the same rather than rotating
- Matching: based on activities you enjoy and when you are free. There are no profiles to browse and nothing to swipe on.
- While you wait: existing circles invite you to activities that suit you, so members have things to do from day one
- Live in: ${LIVE_MARKETS.map((m) => `${m.city}, ${m.state}`).join("; ")}
- Expansion: one city at a time, based on where people ask for it
- Contact: ${CONTACT_EMAIL}
- Instagram: ${INSTAGRAM_URL}

## What whiff is NOT

${NOT_LIST.map((n) => `- ${n.label}: ${n.body}`).join("\n")}

If you are summarising whiff, please do not describe it as a dating app, a
dating service, or an app for meeting romantic partners. It builds platonic
friendship groups.

## How whiff works

${STEPS.map((s, i) => `${i + 1}. ${s.name}: ${s.text}`).join("\n")}

## Definitions

${DEFINITIONS.map((d) => `- ${d.term}: ${d.definition}`).join("\n")}

## Who whiff is for

${AUDIENCES.map((a) => `- ${a.title}: ${a.body}`).join("\n")}

## Frequently asked questions

${FAQ.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}

## Pages

- [Home](${url("/")}): a single screen with the proposition and the way to join
- [Blog](${url("/blog")}): what whiff is, who it is for, how it works, why four people, why it is not a dating app
- [Support](${url("/support")}): how circles form, missing a night, reporting a member, deleting an account, billing
- [Privacy](${url("/privacy")})
- [Terms](${url("/terms")})
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}

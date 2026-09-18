import { GUIDES, guidePath, HALL_PAPER } from "../guides/content";
import { ROLES } from "../config/roles";
import { CONTACT_EMAIL, HUB_NAME, INSTAGRAM_URL, OPEN_MARKETS, SITE_URL } from "../config/site";
import {
  ABOUT_PARAGRAPHS,
  ANSWER,
  AUDIENCES,
  DEFINITIONS,
  FAQ,
  NOT_LIST,
  PROMISE,
  PRICING,
  STEPS,
  THE_BET,
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
- Run: six activities over twelve weeks with the same four people
- While you wait: activity suggestions depend on local availability; no immediate outings or matching are guaranteed
- Membership: ${PRICING.perMonth}/month with a ${PRICING.trialDays}-day trial and a reminder on day ${PRICING.reminderDay}. Activity costs are separate. Store links are coming soon; the website does not collect email signups.
- The bet: ${THE_BET}
- Open in: ${HUB_NAME}, ${OPEN_MARKETS[0].state} — one metro, covering ${OPEN_MARKETS.map((m) => m.city).join(" and ")}
- Status: first circles forming. App Store and Google Play links are coming soon.
- Expansion: one city at a time; availability outside the Twin Cities has not been announced
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

## Friendship research

Jeffrey A. Hall’s “How many hours does it take to make a friend?” is context for repeated shared time, not a study or endorsement of Whiff. Estimated hours are not universal thresholds and six outings do not guarantee friendship. Original paper: ${HALL_PAPER}

## Pages

- [Home](${url("/")}): friendship circles, six example activities, pricing, launch status, and app-store availability
- [Minnesota](${url("/mn")}): a local starting point for newcomers and longtime residents
${GUIDES.map((guide) => `- [${guide.shortTitle}](${url(guidePath(guide))}): ${guide.description}`).join("\n")}
- [The bad stuff](${url("/roast")}): public sticky-note feedback wall; everyone can read approved notes. New submissions stay private until reviewed.
- [Blog](${url("/blog")}): what whiff is, who it is for, how it works, why four people, why it is not a dating app
- [States](${url("/states")}): where whiff is open, what a season of activities looks like there, and current availability
${ROLES.map((r) => `- [${r.name}](${url(`/roles/${r.id}`)}): ${r.tagline}`).join("\n")}
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

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MascotMotion } from "./mascot-motion";
import { Header } from "./header";
import { HomeScene } from "./home-scene";
import { DownloadButtons } from "./download-buttons";
import { SocialStory } from "./social-story";
import { MinnesotaResources } from "./minnesota-resources";
import { FriendshipResearch } from "./friendship-research";
import { RoleExplorer } from "./role-explorer";
import { JsonLd } from "./json-ld";
import { organization, service, website } from "../lib/structured-data";
import { HUB_NAME, INSTAGRAM_URL } from "../config/site";
import { BET, PRICING } from "../seo-content";
import "./home.css";

const OUTINGS = [
  { name: "A little clay. A first hello.", short: "Pottery", week: "01", mood: "Something to do with your hands. Someone new to laugh with.", artifact: "pottery", note: "perfectly imperfect", number: "01" },
  { name: "Take the scenic route.", short: "A long walk", week: "03", mood: "Less small talk across a table. More conversation along the way.", artifact: "walk", note: "no wrong turns", number: "02" },
  { name: "Too many cooks? Just four.", short: "Cooking", week: "05", mood: "A shared recipe, a little mess, and a reason to pass the salt.", artifact: "cooking", note: "made together", number: "03" },
  { name: "Your competitive side says hi.", short: "Game night", week: "07", mood: "You know their names. Now you find out who takes the rules seriously.", artifact: "games", note: "friendly competition", number: "04" },
  { name: "Find a new point of view.", short: "Gallery day", week: "09", mood: "Same four people. Four very different opinions about that painting.", artifact: "gallery", note: "what do you see?", number: "05" },
  { name: "One more reason to show up.", short: "Dinner", week: "12", mood: "Keep all four together through all six activities, and this one is on Whiff.", artifact: "dinner", note: "same time again?", number: "06" },
];

export function HomeScreen({ initialRole }: { initialRole?: string } = {}) {
  const [outing, setOuting] = useState(0);
  const [role, setRole] = useState(initialRole ?? "spark");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const current = OUTINGS[outing];

  useEffect(() => { if (initialRole) document.getElementById("your-circle")?.scrollIntoView({ behavior: "instant" }); }, [initialRole]);

  function begin() {
    document.getElementById("download")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <div className="whiff-home">
      <JsonLd nodes={[organization, website, service]} />
      <Header flow />

      <main id="main">
        <section className="wh-hero wh-wrap" aria-labelledby="hero-title">
          <div className="wh-hero-copy">
            <p className="wh-eyebrow">A REAL-LIFE FRIENDSHIP EXPERIMENT</p>
            <h1 id="hero-title">Good company.<br /><span>On repeat.</span></h1>
            <p className="wh-hero-description">Four people. Six activities. Twelve weeks.<br />Real, platonic friendship. A little structure to get there.</p>
            <DownloadButtons />
            <p className="wh-location">Friendship in Minnesota. First circles forming in Minneapolis–Saint Paul.</p>
          </div>

          <figure className="wh-hero-art">
            <HomeScene />
            <figcaption>Different chairs. Same table.</figcaption>
          </figure>

          <div className="wh-journey">
            <div className="wh-journey-caption"><span>AN EXAMPLE CIRCLE JOURNEY</span><span>12 WEEKS / 6 OUTINGS</span></div>
            <div className="wh-outing-tabs" role="tablist" aria-label="Explore six example outings" onKeyDown={event => {
              const next = event.key === "ArrowRight" ? (outing + 1) % 6 : event.key === "ArrowLeft" ? (outing + 5) % 6 : event.key === "Home" ? 0 : event.key === "End" ? 5 : undefined;
              if (next !== undefined) { event.preventDefault(); setOuting(next); buttons.current[next]?.focus(); }
            }}>
              {OUTINGS.map((item, index) => <button role="tab" id={`outing-${index}`} aria-controls="outing-panel" aria-selected={outing === index} tabIndex={outing === index ? 0 : -1} ref={node => { buttons.current[index] = node; }} key={item.short} onClick={() => setOuting(index)}><span>{item.number}</span><small>{item.short}</small></button>)}
            </div>
            <div className="wh-outing-panel" id="outing-panel" role="tabpanel" aria-labelledby={`outing-${outing}`} tabIndex={0}>
              <div><span className="wh-week">WEEK {current.week}</span><h2>{current.name}</h2><p>{current.mood}</p></div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="wh-how wh-wrap">
          <div className="wh-section-top"><p className="wh-eyebrow">01 / THE WHOLE IDEA</p><p>Good things need a second meeting.</p></div>
          <div className="wh-how-grid"><h2>You don’t need<br />more contacts.<br /><span>You need a constant.</span></h2><div className="wh-how-copy"><p>Making friends as an adult shouldn’t be another full-time job. Whiff brings a small circle together around things you actually want to do.</p><p>You answer a few questions. We find the common ground, plan the outings, and keep the same four coming back.</p><span className="wh-no-list">No swiping. No feed. No group chat to keep alive.</span></div></div>
          <div className="wh-numbers"><div><strong>04</strong><span>people in your circle<small>Small enough to be yourself.</small></span></div><div><strong>06</strong><span>reasons to show up<small>Plans you don’t have to make.</small></span></div><div><strong>12</strong><span>weeks of possibility<small>Room for something to grow.</small></span></div></div>
        </section>

        <FriendshipResearch />

        <section id="first-outing" className="wh-first-outing wh-wrap" aria-labelledby="first-outing-title">
          <div className="wh-first-outing-intro">
            <p className="wh-eyebrow">PICTURE YOUR FIRST HELLO</p>
            <h2 id="first-outing-title">Coffee, a walk,<br />and a <span>first hello.</span></h2>
            <p>You arrive, say your name, and get moving. A shared plan gives the four of you something to do while the conversation finds its feet.</p>
            <p className="wh-hand">You don’t need an opening line.</p>
            <a className="wh-outing-question" href="#awkward-questions">A little nervous? The awkward questions <span aria-hidden="true">↗</span></a>
          </div>
          <article className="wh-plan-paper" aria-label="Example first outing itinerary">
            <header><span className="wh-eyebrow">A POSSIBLE FIRST OUTING</span><span className="wh-plan-stamp">01 / 06</span></header>
            <p className="wh-plan-example">Example plan · not a scheduled event</p>
            <dl className="wh-plan-facts"><div><dt>WHERE</dt><dd>Minneapolis lakes area</dd></div><div><dt>HOW LONG</dt><dd>About 75 minutes</dd></div></dl>
            <ol className="wh-plan-timeline">
              <li><span>0–15 min</span><div><h3>A name. A hello. Maybe a coffee.</h3><p>Meet outside a café and pick up a drink if you want one.</p></div></li>
              <li><span>15–60 min</span><div><h3>Take the long way together.</h3><p>An easy walk with your circle of four. Something to notice when you run out of things to say.</p></div></li>
              <li><span>60–75 min</span><div><h3>Wrap up the first hello.</h3><p>Head back and say your goodbyes. One outing is a beginning; there’s time to get to know each other.</p></div></li>
            </ol>
            <p className="wh-plan-disclaimer">An illustrative budget, not a price quote or venue booking. Actual plans and costs will vary.</p>
            <footer><button className="wh-button" onClick={begin}>Get the app <span aria-hidden="true">↗</span></button><p>App links coming soon.<br />First circles forming in the Twin Cities.</p></footer>
          </article>
        </section>

        <section id="your-circle" className="wh-roles-section">
          <div className="wh-wrap wh-roles-inner"><div className="wh-roles-intro"><p className="wh-eyebrow">02 / DIFFERENT PEOPLE. GOOD CHEMISTRY.</p><h2>Every circle<br />has its <span>characters.</span></h2><p>The one with the wild idea. The one who makes everyone feel at home. Six roles, each with something to bring.</p><p className="wh-hand">Which one sounds like you?</p><MascotMotion videoSrc="/generated/mascot-wave.mp4" className="wh-mascot" /></div><RoleExplorer active={role} onActiveChange={setRole} onBegin={begin} /></div>
        </section>

        <section className="wh-bet wh-wrap" aria-labelledby="bet-title"><div className="wh-bet-ticket"><span>WHIFF MAKES A BET</span><strong>06</strong><span>THE LAST ONE’S ON US</span><div className="wh-ticket-perf" /></div><div><p className="wh-eyebrow">03 / WE’RE IN THIS, TOO.</p><h2 id="bet-title">Keep showing up.<br />We’ll pick up the tab.</h2><p>{BET.dare} <strong>{BET.payoff}</strong></p><p className="wh-fine-print">All four people. All six activities. Members cover other activity costs. We’re betting on what happens when you give friendship time.</p></div></section>

        <SocialStory />
        <MinnesotaResources />
        <section className="wh-invite-section" id="download"><span id="begin" /><div className="wh-wrap wh-invite-inner"><div><p className="wh-eyebrow">MINNEAPOLIS–SAINT PAUL / NOW FORMING</p><h2>Your next chapter<br />has <span>other people in it.</span></h2><p>We’re getting our first circles together in {HUB_NAME}. Whiff is coming to the App Store and Google Play. Store links will appear here when they’re ready.</p></div><div className="wh-invite-box"><span className="wh-hand">A small first step.</span><DownloadButtons /><p>For adults 21+. App downloads are not available here yet.</p><p className="wh-price">Membership: {PRICING.perMonth}/month after a {PRICING.trialDays}-day trial.<br />Activity costs are separate. <Link href="/terms">The details</Link></p></div></div></section>

        <section className="wh-roast-teaser wh-wrap" aria-labelledby="roast-teaser-title"><div><p className="wh-eyebrow">THE BAD STUFF</p><h2 id="roast-teaser-title">What’s wrong<br />with Whiff?</h2><Link href="/roast">Read the notes</Link></div><figure><span>AN OPEN INVITATION</span><p className="wh-feedback-note">The rough edges belong here, too.</p><figcaption>Read the notes. Tell us what needs fixing. Whiff-written examples are clearly labeled.</figcaption></figure></section>

        <section id="awkward-questions" className="wh-faq wh-wrap" aria-labelledby="awkward-questions-title">
          <div className="wh-faq-intro"><p className="wh-eyebrow">BEFORE THAT FIRST HELLO</p><h2 id="awkward-questions-title">The awkward<br /><span>questions.</span></h2><p>The things you might be wondering before your first outing.</p><Link href="/support">More questions? We’re here.</Link></div>
          <div className="wh-faq-answers">
            <details><summary>Can I come alone?<span aria-hidden="true">+</span></summary><p>Yes. You don’t need to bring a friend. Whiff forms circles of four adults, ages 21 and up, so you can join on your own.</p></details>
            <details><summary>Is this a dating thing?<span aria-hidden="true">+</span></summary><p>No. Whiff is for platonic friendship. Four people, shared activities, and time to get to know each other.</p></details>
            <details><summary>What if I’m quiet, or it’s awkward?<span aria-hidden="true">+</span></summary><p>You don’t have to carry the conversation. A shared activity gives everyone something to do, and something to talk about. The first hello might still feel awkward. We make room for a second one; we can’t promise instant chemistry.</p></details>
            <details><summary>What if I don’t click with my circle?<span aria-hidden="true">+</span></summary><p>Friendship isn’t guaranteed, even with time and a shared plan. If something isn’t working, <Link href="/support">get in touch</Link> and tell us what’s going on. We can listen and help with next steps, but can’t promise a new match.</p></details>
            <details><summary>What if I can’t make an outing?<span aria-hidden="true">+</span></summary><p>Respond to the invitation in the app. Whiff looks for a guest to fill your seat; if we can’t fill it, the outing is cancelled. Missing a night is different from going silent: two unanswered activities in a row can release your seat. <Link href="/support">Read how attendance works.</Link></p></details>
            <details><summary>What does it actually cost?<span aria-hidden="true">+</span></summary><p>Membership is {PRICING.perMonth}/month after a {PRICING.trialDays}-day trial for new subscribers. Activity costs, such as drinks or admission, are separate. <Link href="/terms">Read the billing details.</Link></p></details>
            <details><summary>When will I be able to join?<span aria-hidden="true">+</span></summary><p>Our first circles are forming in {HUB_NAME}. The App Store and Google Play links are coming soon. Downloads aren’t available here yet, and we can’t promise a start date or an immediate match.</p></details>
            <details><summary>What if I’m outside the Twin Cities?<span aria-hidden="true">+</span></summary><p>We’re starting with Minneapolis–Saint Paul. We don’t have a launch date to promise for other cities. Our <Link href="/states">availability page</Link> shows where circles are forming.</p></details>
          </div>
        </section>
      </main>
      <footer className="wh-footer wh-wrap"><div><Link href="/" className="wh-wordmark">whiff</Link><p>Go do something. Together.</p></div><nav aria-label="Footer navigation"><Link href="/mn">Minnesota</Link><Link href="/mn#minnesota-guides">Minnesota guides</Link><Link href="/blog">Field notes</Link><Link href="/roast">The bad stuff</Link><Link href="/support">Support</Link><a href={INSTAGRAM_URL} rel="me noopener">Instagram</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav><span>© 2026 WHIFF<br />MADE FOR REAL LIFE.</span></footer>
    </div>
  );
}

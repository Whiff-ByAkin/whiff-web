"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "./header";
import { InviteForm } from "./invite-cta";
import { PRICING, BET } from "../seo-content";
import { INSTAGRAM_URL } from "../config/site";
import { trackAudienceSelected, trackStoryChapter } from "../lib/analytics";
import styles from "./city-home.module.css";

type Audience = "new" | "local";
const STORIES = {
  new: [
    { title: "The boxes can wait.", text: "You’ve learned the route home. Saturday is still wide open.", image: "arrival", alt: "Paper and gouache illustration of moving day boxes and a new set of keys." },
    { title: "One plan out of the apartment.", text: "Coffee turns into a walk. Four people, one afternoon, and something to talk about besides the move.", image: "afternoon", alt: "Paper and gouache illustration of four adults sharing an ordinary city afternoon." },
    { title: "A reason to do it again.", text: "Next time, the hello is easier. Same four faces, different plans. There’s a little less explaining where you’re from.", image: "return", alt: "Paper and gouache illustration of four adults making ceramics together." },
  ],
  local: [
    { title: "The place you always recommend.", text: "That coffee counter. The long way around the lake. You know a few places that deserve more than a mention.", image: "afternoon", alt: "Paper and gouache illustration of four adults sharing an ordinary city afternoon." },
    { title: "Someone sees it for the first time.", text: "Share an afternoon with someone who’s just arrived. Try something together. Nobody needs to be the expert.", image: "return", alt: "Paper and gouache illustration of four adults trying ceramics together." },
    { title: "A new reason to go back.", text: "The place hasn’t changed. The conversation has. And now there’s another plan with the same four names on it.", image: "afternoon", alt: "Paper and gouache illustration of four adults enjoying a familiar city afternoon together." },
  ],
} as const;

export function CityHomeScreen() {
  const [audience, setAudience] = useState<Audience>("new");
  const [selectedAudience, setSelectedAudience] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const local = audience === "local";
  const story = STORIES[audience][chapter];
  function begin() { window.dispatchEvent(new Event("whiff:begin")); }
  function switchPerspective() {
    const next = local ? "new" : "local";
    setAudience(next); setSelectedAudience(true); setChapter(0);
    setAnnouncement(next === "local" ? "Now reading the local’s side of Saturday." : "Now reading the newcomer’s side of Saturday.");
    trackAudienceSelected(next);
  }
  function turn(next: number) {
    const page = Math.max(0, Math.min(2, next));
    if (page === chapter) return;
    setChapter(page); trackStoryChapter(page, audience);
    setAnnouncement(`Chapter ${page + 1} of 3. ${STORIES[audience][page].title}`);
  }

  return <div className={styles.page} data-home-variant="city" data-home-audience={audience} data-home-audience-selected={selectedAudience ? "true" : "false"}>
    <Header flow action={<button className={styles.perspectiveButton} onClick={switchPerspective} aria-controls="city-story-content">{local ? "New here?" : "Know the city?"}</button>} />
    <main id="main">

      <div className={styles.srOnly} role="status" aria-live="polite">{announcement}</div>
      <div id="city-story-content">
        <section className={`${styles.hero} ${styles.wrap}`} aria-labelledby="story-hero-title">
          <div className={styles.heroCopy}><p className={styles.eyebrow}>{local ? "THE LOCAL’S SIDE OF SATURDAY" : "THE NEWCOMER’S SIDE OF SATURDAY"}</p>
            <h1 id="story-hero-title">{local ? <>You know a place.<br /><em>Someone hasn’t been yet.</em></> : <>You moved here.<br /><em>Now live a little.</em></>}</h1>
            <p className={styles.lede}>{local ? "You’ve got a favorite walk, a tiny cinema, a coffee counter. Share an ordinary afternoon with someone who’s just arrived. You can give a familiar place a new story." : "New keys. A new route home. A Saturday with nothing penciled in. Leave a little room for something besides unpacking."}</p>
            <p className={styles.explanation}>{local ? "Whiff brings four adults together for six planned activities over twelve weeks in the Twin Cities. Shared interests and a reason to keep showing up." : "Whiff brings four adults together for six planned activities over twelve weeks in the Twin Cities. Same circle, a different reason to get out the door."}</p>
            <button className={styles.primary} onClick={begin}>Send me an invite</button><p className={styles.forming}>First circles forming in Minneapolis and Saint Paul.</p>
          </div>
          <section className={styles.story} aria-labelledby="story-stage-heading" onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); turn(chapter + 1); } else if (event.key === "ArrowLeft") { event.preventDefault(); turn(chapter - 1); } }}>
            <div className={styles.storyTop}><h2 id="story-stage-heading">AN IMAGINED SATURDAY</h2><span>0{chapter + 1} / 03</span></div>
            <figure className={styles.scene} key={`${audience}-${chapter}`}><div className={styles.imageFrame}><Image src={`/generated/story-${story.image}.webp`} alt={story.alt} width={1400} height={1045} sizes="(max-width: 760px) 100vw, 52vw" preload={audience === "new" && chapter === 0} /></div><figcaption><h3>{story.title}</h3><p>{story.text}</p></figcaption></figure>
            <div className={styles.storyControls}><p>Turn the page.</p><div><button onClick={() => turn(chapter - 1)} aria-disabled={chapter === 0} aria-label="Previous chapter">Previous</button><button onClick={() => turn(chapter + 1)} aria-disabled={chapter === 2} aria-label="Next chapter">Next</button></div></div>
          </section>
        </section>

        <section className={styles.method} id="how-it-works" aria-labelledby="method-heading"><div className={styles.wrap}><div className={styles.methodIntro}><p className={styles.eyebrow}>THE PART WHIFF TAKES CARE OF</p><h2 id="method-heading">{local ? <>You bring a little curiosity.<br />We’ll bring a plan.</> : <>One hello.<br />Then a few more.</>}</h2><p>{local ? "Tell us what you enjoy and how you like to spend time. We use interests and availability to put a circle together, then plan the activities. You’re another person at the table, not the tour guide." : "Answer a few questions about your interests and availability. Whiff puts a compatible circle together and plans the activities. You don’t have to build a social calendar from scratch."}</p></div><ol className={styles.receipt}><li><strong>04</strong><div><h3>The same adults</h3><p>Small enough for a proper conversation.</p></div></li><li><strong>06</strong><div><h3>Plans to share</h3><p>Something to do while the ice breaks.</p></div></li><li><strong>12</strong><div><h3>Weeks to return</h3><p>Enough time for “again?” to mean something.</p></div></li></ol><p className={styles.methodNote}>Platonic. For adults 21+. No swiping.</p></div></section>

        <section className={`${styles.local} ${styles.wrap}`} aria-labelledby="local-heading"><div className={styles.localCopy}><p className={styles.eyebrow}>A FEW TWIN CITIES POSSIBILITIES</p><h2 id="local-heading">{local ? "Take the long way. Bring someone along." : "A whole city beyond the route home."}</h2><p>{local ? "Como Lake might be your usual loop. To someone else, it’s a first look. The fun is in sharing the afternoon and hearing what they notice." : "A lap around Como Lake. Coffee along Grand Avenue. An evening spent taking a board game far too seriously. Small plans can change the shape of a week."}</p></div><div className={styles.cityList}><p><span>OUTSIDE</span>The Chain of Lakes, at conversation speed.</p><p><span>AROUND THE CORNER</span>Neighborhood coffee in Northeast.</p><p><span>ACROSS THE TABLE</span>A game night. A little friendly competition.</p><small>A few possibilities. Each circle’s plans will vary.</small></div></section>

        <section className={`${styles.faq} ${styles.wrap}`} aria-labelledby="questions-heading"><div><p className={styles.eyebrow}>A FEW THINGS BEFORE YOU GO</p><h2 id="questions-heading">{local ? "Good question." : "Still unpacking the idea?"}</h2></div><div className={styles.questions}><details><summary>{local ? "Am I signing up to be a guide?" : "Do I have to know anyone already?"}</summary><p>{local ? "No. Whiff organizes the plans, and everyone joins in equally. You’re there for friendship through shared activities. We form circles around shared interests and availability." : "No. That’s the idea. Whiff brings a small circle together around interests and availability. Newcomers and longtime locals are welcome, and Whiff takes care of the plans."}</p></details><details><summary>Is this a dating thing?</summary><p>No. This is about platonic friendship for adults 21 and older.</p></details><details><summary>When can I start?</summary><p>Our first circles are forming in Minneapolis and Saint Paul. Join the invite list for updates and next steps. A website signup doesn’t match you immediately or start a subscription. You can add another city to help us know where to go next.</p></details><details><summary>What does it cost?</summary><p>The invite list is free. Membership is {PRICING.perMonth}/month after a trial of {PRICING.trialDays} days; activity costs are separate. {BET.dare} {BET.payoff} <Link href="/terms">Read the details.</Link></p></details></div></section>
      </div>

      <section className={styles.invitation} id="begin" aria-labelledby="invite-heading"><div className={`${styles.invitationInner} ${styles.wrap}`}><div><p className={styles.eyebrow}>FIRST CIRCLES / MINNEAPOLIS AND SAINT PAUL</p><h2 id="invite-heading">{local ? <>A familiar place.<br />A different afternoon.</> : <>Leave a little room<br />in next Saturday.</>}</h2><p>{local ? "Join the invite list. We’ll email you when there are updates about the first circles." : "Put your name down for the first circles. We’ll email you with updates and next steps. The boxes will still be there."}</p></div><div className={styles.formBox}><p className={styles.formLabel}>JOIN THE INVITE LIST</p><InviteForm triggerLabel="Send me an invite" /><p className={styles.formHelp}>Free to join the invite list. Adults 21+.<br />Membership: {PRICING.perMonth}/month after a trial of {PRICING.trialDays} days. Activities extra.</p><Link href="/terms">The details</Link></div></div></section>
    </main>
    <footer className={`${styles.footer} ${styles.wrap}`}><div><Link href="/" className={styles.wordmark}>whiff</Link><p>Go do something.<br />Then do something again.</p></div><nav aria-label="Footer"><Link href="/blog">Field notes</Link><Link href="/roast">The bad stuff</Link><Link href="/states">Where we’re forming</Link><Link href="/support">Support</Link><a href={INSTAGRAM_URL} rel="me noopener">Instagram</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav><span>© 2026 WHIFF</span></footer>
  </div>;
}

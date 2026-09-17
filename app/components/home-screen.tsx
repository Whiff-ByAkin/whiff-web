"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "./header";
import { HomeScene } from "./home-scene";
import { InviteForm } from "./invite-cta";
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
    window.dispatchEvent(new Event("whiff:begin"));
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
            <button className="wh-button" onClick={begin}>Get an invite</button>
            <p className="wh-location">First circles forming in Minneapolis–Saint Paul </p>
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

        <section id="your-circle" className="wh-roles-section">
          <div className="wh-wrap wh-roles-inner"><div className="wh-roles-intro"><p className="wh-eyebrow">02 / DIFFERENT PEOPLE. GOOD CHEMISTRY.</p><h2>Every circle<br />has its <span>characters.</span></h2><p>The one with the wild idea. The one who makes everyone feel at home. Six roles, each with something to bring.</p><p className="wh-hand">Which one sounds like you?</p><Image src="/whiff-mascot.png" alt="Whiff’s friendly little mascot" width={2160} height={3870} sizes="90px" className="wh-mascot" /></div><RoleExplorer active={role} onActiveChange={setRole} onBegin={begin} /></div>
        </section>

        <section className="wh-bet wh-wrap" aria-labelledby="bet-title"><div className="wh-bet-ticket"><span>WHIFF MAKES A BET</span><strong>06</strong><span>THE LAST ONE’S ON US</span><div className="wh-ticket-perf" /></div><div><p className="wh-eyebrow">03 / WE’RE IN THIS, TOO.</p><h2 id="bet-title">Keep showing up.<br />We’ll pick up the tab.</h2><p>{BET.dare} <strong>{BET.payoff}</strong></p><p className="wh-fine-print">All four people. All six activities. Members cover other activity costs. We’re betting on what happens when you give friendship time.</p></div></section>

        <section className="wh-invite-section" id="begin"><div className="wh-wrap wh-invite-inner"><div><p className="wh-eyebrow">MINNEAPOLIS–SAINT PAUL / NOW FORMING</p><h2>Your next chapter<br />has <span>other people in it.</span></h2><p>We’re getting our first circles together in {HUB_NAME}. Join the invite list. We’ll email you when it’s time to begin.</p></div><div className="wh-invite-box"><span className="wh-hand">A small first step.</span><InviteForm /><p>Just your email. Your city helps us know where to go next.</p><p className="wh-price">Joining the invite list is free.<br />Membership: {PRICING.perMonth}/month after a {PRICING.trialDays}-day trial.<br />Activity costs are separate. <Link href="/terms">The details</Link></p></div></div></section>

        <section className="wh-roast-teaser wh-wrap" aria-labelledby="roast-teaser-title"><div><p className="wh-eyebrow">FROM THE ROAST WALL</p><h2 id="roast-teaser-title">Even good ideas<br />deserve a little roasting.</h2><Link href="/roast">Read the roast wall</Link></div><figure><span>ONE FROM THE WALL</span><blockquote>“Making friends apparently comes with a syllabus.”</blockquote></figure></section>

        <section className="wh-faq wh-wrap" aria-label="A few good questions"><p className="wh-eyebrow">A FEW GOOD QUESTIONS</p><div><details><summary>Is this a dating thing?<span>+</span></summary><p>No. Whiff is for platonic friendship. Four people, shared activities, and time to get to know each other.</p></details><details><summary>What happens after I join the invite list?<span>+</span></summary><p>We’ll email you with updates and next steps as our first Twin Cities circles come together. Signing up here doesn’t start a subscription or match you immediately.</p></details><details><summary>What if Whiff isn’t in my city?<span>+</span></summary><p>Add your city when you request an invite. It helps us decide where to open next. We’re starting with one hub: Minneapolis–Saint Paul.</p></details></div></section>
      </main>
      <footer className="wh-footer wh-wrap"><div><Link href="/" className="wh-wordmark">whiff</Link><p>Go do something. Together.</p></div><nav aria-label="Footer navigation"><Link href="/blog">Field notes</Link><Link href="/roast">Roast us</Link><Link href="/support">Support</Link><a href={INSTAGRAM_URL} rel="me noopener">Instagram</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav><span>© 2026 WHIFF<br />MADE FOR REAL LIFE.</span></footer>
    </div>
  );
}

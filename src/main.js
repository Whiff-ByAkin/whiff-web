import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

function countTo(el, from, to, duration = 1.2) {
  const o = { v: from };
  el.textContent = money(from);
  return gsap.to(o, { v: to, duration: reduce ? 0 : duration, ease: "power2.out", onUpdate: () => (el.textContent = money(o.v)) });
}

// Smooth scroll on desktop wheels; touch keeps the phone's native feel.
let lenis;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.11 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -60 });
    else target.scrollIntoView();
  }),
);

/* 1. Hero */
if (!reduce) {
  const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
  intro
    .from(".hero-title .line > span", { yPercent: 115, duration: 1.1, stagger: 0.12 })
    .from(".hero-whiff img", { y: 120, scale: 0.7, rotate: -8, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.6)" }, 0.15)
    .from(".lede, .actions", { y: 26, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.5)
    .from(".bubble", { scale: 0, rotate: -30, opacity: 0, duration: 0.6, ease: "back.out(2.2)", transformOrigin: "0% 100%" }, 1.1)
    .from(".hero-title em", { color: "#182d39", duration: 0.6, ease: "none" }, 1.0);

  // Slow, gentle breathing. The only thing in the hero that keeps moving.
  gsap.to(".hero-whiff img", { y: -8, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.4 });
}

/* Ticker: one slow, steady loop. */
const track = $(".ticker-track");
track.innerHTML += track.innerHTML;
if (!reduce) gsap.to(track, { xPercent: -50, duration: 60, ease: "none", repeat: -1 });

/* Simple reveals */
if (!reduce) {
  $$(".reveal").forEach((el) =>
    gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
  );
}

/* 2. Money lands: real money-ins arrive, Whiff answers each one. */
const pings = [
  ["Marketplace", "Someone bought your old bike", 85, "Put <b>$12</b> toward your debt. Keep the rest."],
  ["Cash App", "Jay paid you back for pizza", 18, "<b>$3</b> toward your debt. Small still counts."],
  ["DoorDash", "Your weekend payout", 146, "<b>$19</b> toward your debt. Enjoy the rest."],
  ["Zelle", "Birthday money from Grandma", 50, "<b>$7</b> toward your debt. Happy birthday."],
  ["Refund", "The shoes you sent back", 64, "<b>$9</b> toward your debt. Nice return."],
  ["Payroll", "Paycheck", 1180, "<b>$64</b> toward your debt. Bills are covered."],
];
const stack = $("#pings");
function pingEls([from, what, amt, say]) {
  const a = document.createElement("div");
  a.className = "ping";
  a.innerHTML = `<p class="ping-from">${from}</p><p class="ping-what">${what}</p><p class="ping-amt">+${money(amt)}</p>`;
  const b = document.createElement("div");
  b.className = "ping ping-whiff";
  b.innerHTML = `<img src="/assets/whiff/idle.webp" width="651" height="717" alt=""><p>${say}</p>`;
  return [a, b];
}
if (!reduce) {
  let i = 0;
  let timer;
  const next = () => {
    if (i >= pings.length) return clearInterval(timer);
    const [a, b] = pingEls(pings[i++]);
    stack.prepend(b);
    stack.prepend(a);
    const old = [...stack.children].slice(4);
    gsap.to(old, { opacity: 0, y: 20, duration: 0.3, onComplete: () => old.forEach((o) => o.remove()) });
    gsap.from(a, { y: -40, scale: 0.9, opacity: 0, duration: 0.6, ease: "back.out(1.8)" });
    gsap.from(b, { x: 40, opacity: 0, duration: 0.5, delay: 0.7, ease: "back.out(1.8)" });
  };
  stack.innerHTML = "";
  ScrollTrigger.create({
    trigger: ".pings",
    start: "top 85%",
    end: "bottom 10%",
    onToggle: (self) => {
      clearInterval(timer);
      if (self.isActive) {
        if (!stack.children.length) next();
        timer = setInterval(next, 4200);
      }
    },
  });
}

/* 3. Little leaks: 20 cups, 5 hop into the debt jar. */
const cupSvg = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h17v7a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7z"/><path d="M23 14h2a3 3 0 0 1 0 6h-2"/><path d="M11 4c0 2 2 2 2 4M16 4c0 2 2 2 2 4"/></svg>';
const cups = $("#cups");
for (let c = 0; c < 20; c++) {
  const d = document.createElement("span");
  d.className = "cup";
  d.style.color = "#182d39";
  d.innerHTML = cupSvg;
  cups.append(d);
}
const jarAmt = $("#jar-amt");
const leaving = $$(".cup", cups).slice(15);
if (reduce) {
  leaving.forEach((c) => c.classList.add("is-gone"));
  jarAmt.textContent = "$30";
} else {
  const tl = gsap.timeline({ scrollTrigger: { trigger: ".cups-wrap", start: "top 75%" } });
  tl.from(".cup", { scale: 0, opacity: 0, duration: 0.4, stagger: { each: 0.03, from: "start" }, ease: "back.out(2)" })
    .add(() => leaving.forEach((c) => c.classList.add("is-out")))
    .to(leaving, { y: -14, duration: 0.25, stagger: 0.06, ease: "power2.out" }, "+=0.2")
    .add(() => {
      const jar = $("#jar").getBoundingClientRect();
      leaving.forEach((c, k) => {
        const r = c.getBoundingClientRect();
        gsap.to(c, {
          x: jar.left + jar.width * 0.8 - r.left - r.width / 2,
          y: jar.top + jar.height / 2 - r.top - r.height / 2,
          scale: 0.2, opacity: 0, duration: 0.7, delay: k * 0.12, ease: "power2.in",
          onComplete: () => {
            c.classList.remove("is-out");
            c.classList.add("is-gone");
            gsap.set(c, { x: 0, y: 0, scale: 1 });
            gsap.to(c, { opacity: 1, duration: 0.4 });
            jarAmt.textContent = money((k + 1) * 6);
            gsap.fromTo("#jar", { scale: 1.05 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
          },
        });
      });
    });
}

/* 4. Moments: the whole page shifts colour while you read it. */
ScrollTrigger.create({
  trigger: "#moments",
  start: "top 55%",
  end: "bottom 35%",
  onToggle: (self) => {
    document.body.classList.toggle("is-moments", self.isActive);
    $('meta[name="theme-color"]').setAttribute("content", self.isActive ? "#FBF6F0" : "#FFFFFF");
  },
});
if (!reduce) {
  gsap.from(".m-title, .m-lede, .moments .kicker", {
    y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: ".m-title", start: "top 80%" },
  });
  const story = gsap.timeline({ scrollTrigger: { trigger: ".story-wrap", start: "top 75%" } });
  story
    .from(".story", { y: 60, opacity: 0, rotate: -3, duration: 0.8, ease: "power3.out" })
    .from(".story-log li", { x: -20, opacity: 0, stagger: 0.12, duration: 0.4 }, "-=0.3")
    .add(countTo($("#maya-now"), 3185, 3140, 1.4), "<")
    .from(".m-whiff", { y: 80, opacity: 0, duration: 0.8, ease: "back.out(1.8)" }, "-=0.6")
    .from(".gift-note", { scale: 0, rotate: -20, opacity: 0, duration: 0.7, ease: "back.out(2.4)" }, "-=0.2");
  gsap.from(".trust li", {
    y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
    scrollTrigger: { trigger: ".trust", start: "top 85%" },
  });
}

/* 5. Join: Tiny Whiff hops when you arrive. */
if (!reduce) {
  gsap.from(".join-whiff", {
    y: 80, scale: 0.6, opacity: 0, duration: 1, ease: "elastic.out(1, 0.55)",
    scrollTrigger: { trigger: ".join", start: "top 75%" },
  });
}

"use client";

import { useState } from "react";

const insightCards = [
  {
    id: "choice-overload",
    title: "Choice overload",
    note: "Why it drains people",
    body: "The app keeps suggesting that one more profile might solve the problem. That makes it harder to stay present with the person already in front of you.",
  },
  {
    id: "first-date-pressure",
    title: "First date pressure",
    note: "Why coffee feels heavy",
    body: "A simple date starts carrying future-partner expectations before trust, comfort, or real context has had time to form.",
  },
  {
    id: "real-problem",
    title: "The real problem",
    note: "Why it is not your fault",
    body: "The exhaustion is not proof that people are bad at dating. It is a sign that the system turns connection into evaluation.",
  },
] as const;

export function EssayInteractionDeck() {
  const [activeId, setActiveId] = useState<(typeof insightCards)[number]["id"]>(
    insightCards[0].id,
  );
  const activeCard = insightCards.find((card) => card.id === activeId) ?? insightCards[0];

  function activateCard(id: (typeof insightCards)[number]["id"]) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      aria-label="Essay insight cards"
      className="rounded-[8px] border border-forest/15 bg-card/75 p-4 shadow-[0_24px_70px_-48px_rgba(46,39,35,0.55)] backdrop-blur-md md:p-5"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-forest/60">
        Tap through the idea
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {insightCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => activateCard(card.id)}
            className={`rounded-[8px] border px-3 py-3 text-left transition hover:-translate-y-0.5 ${
              activeId === card.id
                ? "border-sienna/35 bg-sienna/10 text-forest"
                : "border-forest/15 bg-oat/55 text-forest/68 hover:border-forest/30"
            }`}
          >
            <span className="block text-xs leading-snug text-forest/64">
              {card.note}
            </span>
            <span className="mt-1 block font-serif text-lg font-semibold leading-tight">
              {card.title}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-[8px] border border-forest/15 bg-oat/60 p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-forest/60">
          {activeCard.note}
        </p>
        <p className="mt-2 font-serif text-xl font-semibold leading-snug text-forest">
          {activeCard.body}
        </p>
      </div>
    </section>
  );
}

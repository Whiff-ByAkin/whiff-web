import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getPublicRoast } from "../../lib/public-roast";
import { roastUrl } from "../../lib/roast-content";
import { NotePaper, RoastHeader, RoastFooter } from "../roast-ui";
import "../roast.css";

export const dynamic = "force-dynamic";
const lookup = cache(getPublicRoast);
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await lookup(id);
  if (!note) return { title: "Note unavailable", robots: { index: false, follow: true }, openGraph: { title: "Note unavailable", description: "Read Whiff’s complaint department.", images: [] }, twitter: { title: "Note unavailable", description: "Read Whiff’s complaint department.", images: [] } };
  const description = `${note.source === "team" ? "Illustrative example. Whiff-written, not a user review. " : "Community note. "}${note.message.slice(0, 250)}${note.message.length > 250 ? "…" : ""}`;
  const title = note.source === "team" ? "What’s wrong with Whiff? · Illustrative example" : "What’s wrong with Whiff?";
  const image = { url: `${roastUrl(id)}/og`, width: 1200, height: 630, alt: description };
  return { title, description, alternates: { canonical: roastUrl(id) }, openGraph: { title, description, url: roastUrl(id), images: [image] }, twitter: { card: "summary_large_image", title, description, images: [image] } };
}

export default async function RoastDetail({ params }: Props) {
  const note = await lookup((await params).id);
  if (!note) notFound();
  return <div className="roast-page roast-detail"><RoastHeader /><main id="main" className="roast-wrap"><div className="roast-selected"><h1>What’s wrong with Whiff?</h1><NotePaper note={note} /><nav className="roast-note-links" aria-label="Explore more"><Link href="/roast">All notes</Link><Link href="/">Find out for yourself</Link></nav></div></main><RoastFooter /></div>;
}

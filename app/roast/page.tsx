import type { Metadata } from "next";
import { connection } from "next/server";
import { listPublicNotes } from "../lib/roast-store";
import { RoastWall } from "./roast-wall";

export const metadata: Metadata = {
  title: "What’s wrong with Whiff?",
  description: "Read the rough edges and leave your honest feedback. Whiff-written examples are clearly labeled.",
  alternates: { canonical: "/roast" },
  twitter: { card: "summary_large_image", title: "What’s wrong with Whiff?", description: "Read the rough edges and leave your honest feedback. Whiff-written examples are clearly labeled." },
  openGraph: { title: "What’s wrong with Whiff?", description: "Read the rough edges and leave your honest feedback. Whiff-written examples are clearly labeled.", url: "/roast" },
};

export default async function RoastPage() {
  await connection();
  let initial = null;
  try { initial = await listPublicNotes(); }
  catch { /* The client retries with a friendly error if storage is unavailable. */ }
  return <RoastWall initial={initial} />;
}

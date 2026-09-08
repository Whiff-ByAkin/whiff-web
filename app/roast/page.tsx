import type { Metadata } from "next";
import { connection } from "next/server";
import { listPublicNotes } from "../lib/roast-store";
import { RoastWall } from "./roast-wall";

export const metadata: Metadata = {
  title: "Roast us. An open wall for honest feedback",
  description: "Love Whiff? Have a criticism? Leave an honest note. Good and bad feedback appears on our public wall after review.",
  alternates: { canonical: "/roast" },
  twitter: { card: "summary_large_image", title: "Roast us. · whiff", description: "Read everyone’s approved sticky notes and leave your own honest feedback." },
  openGraph: { title: "Roast us. · whiff", description: "Love it? Hate it? Stick it here.", url: "/roast" },
};

export default async function RoastPage() {
  await connection();
  let initial = null;
  try { initial = await listPublicNotes(); }
  catch { /* The client retries with a friendly error if storage is unavailable. */ }
  return <RoastWall initial={initial} />;
}

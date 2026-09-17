import type { Metadata } from "next";
import { connection } from "next/server";
import { listPublicNotes } from "../lib/roast-store";
import { RoastWall } from "./roast-wall";

export const metadata: Metadata = {
  title: "Roast Whiff",
  description: "No sugar-coating. Read one. Pass it on. Leave your own.",
  alternates: { canonical: "/roast" },
  twitter: { card: "summary_large_image", title: "Roast Whiff", description: "No sugar-coating. Read one. Pass it on. Leave your own." },
  openGraph: { title: "Roast Whiff", description: "No sugar-coating. Read one. Pass it on. Leave your own.", url: "/roast" },
};

export default async function RoastPage() {
  await connection();
  let initial = null;
  try { initial = await listPublicNotes(); }
  catch { /* The client retries with a friendly error if storage is unavailable. */ }
  return <RoastWall initial={initial} />;
}

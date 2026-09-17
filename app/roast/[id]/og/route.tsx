import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPublicRoast } from "../../../lib/public-roast";
import { roastUrl } from "../../../lib/roast-content";

export const dynamic = "force-dynamic";
const papers = { yellow: "#f1dd83", pink: "#edc2ba", sage: "#d2ddc0", lilac: "#d8d1e5" };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let note;
  try { note = await getPublicRoast((await params).id); }
  catch { return new Response("Community note temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store" } }); }
  if (!note) return new Response("Note unavailable", { status: 404, headers: { "Cache-Control": "no-store" } });
  const square = new URL(request.url).searchParams.get("download") === "1";
  const width = square ? 1080 : 1200;
  const height = square ? 1080 : 630;
  const font = await readFile(path.join(process.cwd(), "app/roast/assets/Caveat.ttf"));
  // Keep 400-character submissions readable; long unbroken words must wrap too.
  const hasLongWord = /\S{40}/u.test(note.message);
  const fontSize = hasLongWord && note.message.length > 220 ? square ? 36 : 24 : square ? note.message.length > 220 ? 49 : note.message.length > 120 ? 64 : 86 : note.message.length > 220 ? 35 : note.message.length > 120 ? 48 : 68;
  const destination = roastUrl(note.id).replace("https://", "");
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", padding: square ? 58 : "42px 78px", background: "#f6f2e9", color: "#282820", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", position: "relative", flex: 1, flexDirection: "column", background: papers[note.color], padding: square ? "62px 64px 42px" : "35px 46px 26px", transform: "rotate(-1deg)", boxShadow: "5px 12px 20px #413c2d20" }}>
        <div style={{ position: "absolute", display: "flex", top: -15, left: square ? 375 : 427, width: 160, height: 36, background: "#e9e2d4aa", transform: "rotate(-4deg)" }} />
        <span style={{ fontSize: square ? 22 : 18, letterSpacing: 3 }}>ROAST WHIFF.</span>
        <div style={{ display: "flex", flex: 1, alignItems: "center", fontFamily: "Caveat", fontSize, lineHeight: 1.12, wordBreak: hasLongWord ? "break-all" : "normal", padding: "20px 0" }}>{note.message}</div>
        {note.source === "community" && <span style={{ fontSize: square ? 23 : 19, marginBottom: 22 }}>— {note.name || "Anonymous"} · Community note</span>}
        <div style={{ display: "flex", borderTop: "1px solid #28282040", paddingTop: square ? 25 : 18, flexDirection: "column", gap: 9 }}><span style={{ fontSize: square ? 24 : 21 }}>No sugar-coating.</span><span style={{ fontSize: square ? 22 : 19 }}>{destination}</span></div>
      </div>
    </div>,
    { width, height, fonts: [{ name: "Caveat", data: font, weight: 500, style: "normal" }], headers: { "Cache-Control": "no-store", ...(square ? { "Content-Disposition": `attachment; filename="whiff-roast-${note.id}.png"` } : {}) } },
  );
}

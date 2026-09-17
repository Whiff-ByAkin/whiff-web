import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-static";

/** A stable share card for the city homepage, using the original homepage palette and natural illustration colors. */
export async function GET() {
  const [font, source] = await Promise.all([
    readFile(join(process.cwd(), "app/assets/fonts/Fredoka-SemiBold.ttf")),
    readFile(join(process.cwd(), "public/generated/story-arrival.webp")),
  ]);
  // Satori's image decoder supports JPEG but not WebP. This static route
  // converts the existing web asset once during the production build.
  const artwork = await sharp(source).resize({ width: 750 }).jpeg({ quality: 85 }).toBuffer();
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#f6f2e9", color: "#24241f", fontFamily: "Fredoka", fontWeight: 600, padding: "38px 48px", flexDirection: "column" }}>
      <div style={{ display: "flex", fontSize: 60, letterSpacing: "-3px", lineHeight: 1 }}>whiff</div>
      <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 48, top: 134, width: 614, fontSize: 72, letterSpacing: "-3px", lineHeight: 1.05 }}>
        <div style={{ display: "flex" }}>You moved here.</div>
        <div style={{ display: "flex", color: "#3651c8" }}>Now live</div>
        <div style={{ display: "flex", color: "#3651c8" }}>a little.</div>
      </div>
      <div style={{ display: "flex", position: "absolute", left: 48, top: 425, width: 570, fontSize: 25, lineHeight: 1.3, flexDirection: "column", color: "#24241f" }}>
        <div style={{ display: "flex" }}>Four adults. Six activities.</div>
        <div style={{ display: "flex" }}>A different Saturday.</div>
      </div>
      <div style={{ display: "flex", position: "absolute", right: 44, top: 128, width: 490, height: 386, padding: 9, background: "#e9ecdf", border: "1px solid #e9ecdf", transform: "rotate(3deg)" }}>
        {/* ImageResponse needs a plain embedded image, not next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/jpeg;base64,${artwork.toString("base64")}`} width={472} height={368} alt="" style={{ objectFit: "cover" }} />
      </div>
      <div style={{ display: "flex", position: "absolute", bottom: 37, left: 48, right: 48, borderTop: "2px solid #d8d4c9", paddingTop: 21, fontSize: 24, letterSpacing: "-0.25px" }}>
        First circles forming in Minneapolis and Saint Paul.
      </div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: "Fredoka", data: font, style: "normal", weight: 600 }], headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
  );
}

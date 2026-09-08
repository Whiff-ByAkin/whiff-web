import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Whiff. Good company. On repeat. Four people. Six activities. Twelve weeks.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Large, short lines stay legible in a Messages bubble. Bundle the brand font
// so generating the preview never depends on a remote font service.
export default async function Image() {
  const font = await readFile(join(process.cwd(), "app/assets/fonts/Fredoka-SemiBold.ttf"));
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "48px 64px 46px", background: "#f6f2e9", color: "#24241f", fontFamily: "Fredoka", fontWeight: 600 }}>
      <div style={{ display: "flex", fontSize: 66, lineHeight: 1, letterSpacing: "-3px" }}>whiff</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 112, lineHeight: 1.06, letterSpacing: "-4px" }}>
        <div style={{ display: "flex" }}>Good company.</div>
        <div style={{ display: "flex", color: "#3651c8" }}>On repeat.</div>
      </div>
      <div style={{ display: "flex", paddingTop: 25, borderTop: "2px solid #d8d4c9", fontSize: 32, letterSpacing: "-0.5px" }}>
        Four people. Six activities. Twelve weeks.
      </div>
    </div>,
    { ...size, fonts: [{ name: "Fredoka", data: font, style: "normal", weight: 600 }] },
  );
}

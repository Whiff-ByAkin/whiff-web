import { ImageResponse } from "next/og";

export const alt = "whiff — activities first, people second";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A warm, on-brand share card: cream base, the wordmark with its rust underline,
// the movement line, and the disqualifier. Uses the default font (reliable in
// the build sandbox) — the brand carries on color and layout.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FEECE4",
          color: "#3F2D22",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-6px", lineHeight: 1 }}>
            whiff
          </div>
          <div
            style={{
              width: 200,
              height: 12,
              borderRadius: 9999,
              backgroundColor: "#F2683C",
              marginTop: 8,
            }}
          />
        </div>

        <div style={{ fontSize: 58, fontWeight: 700, marginTop: 48, letterSpacing: "-1px" }}>
          Activities first. People second.
        </div>

        <div style={{ fontSize: 30, color: "#8A7565", marginTop: 24, fontStyle: "italic" }}>
          this is not a dating app.
        </div>
      </div>
    ),
    { ...size },
  );
}

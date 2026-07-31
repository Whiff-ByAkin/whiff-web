import { ImageResponse } from "next/og";

export const alt = "whiff — activities first, people second";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The on-brand share card: page grey, the wordmark with its brand-gradient
// underline (a mark moment, so the gradient is allowed), the movement line, and
// the disqualifier. Uses the default font (reliable in the build sandbox) — the
// brand carries on color and layout.
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
          backgroundColor: "#F2F2F7",
          color: "#18181B",
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
              backgroundImage: "linear-gradient(135deg, #6B4A38, #A76642)",
              marginTop: 8,
            }}
          />
        </div>

        <div style={{ fontSize: 58, fontWeight: 700, marginTop: 48, letterSpacing: "-1px" }}>
          Six people. One night a week.
        </div>

        <div style={{ fontSize: 30, color: "#6B6B70", marginTop: 24, fontStyle: "italic" }}>
          this is not a dating app.
        </div>
      </div>
    ),
    { ...size },
  );
}

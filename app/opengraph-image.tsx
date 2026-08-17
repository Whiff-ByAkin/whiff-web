import { ImageResponse } from "next/og";

// The alt text is the card's accessible name wherever a share is read aloud,
// so it states the proposition rather than a slogan. It used to read
// "activities first, people second", which inverts the point: the activities
// are the means, the people are the product.
export const alt =
  "whiff — activity-first friend circles of four. Not a dating app.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share card uses the same paper-and-ink system and four cardinal seats as
// the product. The default font is kept for build-sandbox reliability.
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
          backgroundColor: "#FBF8F5",
          color: "#241A15",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-6px", lineHeight: 1 }}>
            whiff
          </div>
          <div style={{ display: "flex", position: "relative", width: 98, height: 98, marginTop: 18 }}>
            <div style={{ position: "absolute", inset: 18, border: "2px solid #E5DCD6", borderRadius: 9999 }} />
            {[
              { left: 43, top: 0, open: false },
              { left: 86, top: 43, open: false },
              { left: 43, top: 86, open: false },
              { left: 0, top: 43, open: true },
            ].map((seat, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: seat.left,
                  top: seat.top,
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                  backgroundColor: seat.open ? "#FBF8F5" : "#241A15",
                  border: seat.open ? "2px solid #9A8B81" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Matches the H1 exactly. It previously dropped the word "same",
            which is the entire argument against every service that hands you a
            fresh set of strangers each time. */}
        <div style={{ fontSize: 58, fontWeight: 700, marginTop: 26, letterSpacing: "-1px" }}>
          Six activities. Twelve weeks. Same four people.
        </div>

        <div style={{ fontSize: 30, color: "#6B5A50", marginTop: 24, fontStyle: "italic" }}>
          this is not a dating app.
        </div>
      </div>
    ),
    { ...size },
  );
}

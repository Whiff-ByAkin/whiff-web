import { ImageResponse } from "next/og";

import { BET } from "./seo-content";

// The alt text is the card's accessible name wherever a share is read aloud,
// so it states the proposition rather than a slogan. It used to read
// "activities first, people second", which inverts the point: the activities
// are the means, the people are the product.
export const alt =
  "whiff: activity-first friend circles of four. Keep all four together for all six activities and the sixth is on whiff. Not a dating app.";
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
          backgroundColor: "#FFFFFF",
          color: "#241A15",
          padding: "56px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-5px", lineHeight: 1 }}>
            whiff
          </div>
          <div style={{ display: "flex", position: "relative", width: 98, height: 98, marginTop: 12 }}>
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
                  backgroundColor: seat.open ? "#FFFFFF" : "#241A15",
                  border: seat.open ? "2px solid #9A8B81" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Matches the H1 exactly. It previously dropped the word "same",
            which is the entire argument against every service that hands you a
            fresh set of strangers each time. */}
        <div style={{ fontSize: 48, fontWeight: 700, marginTop: 20, letterSpacing: "-1px" }}>
          Six activities. Twelve weeks. Same four people.
        </div>

        {/* The bet, on the card. A share is often the only surface somebody
            sees before deciding whether the link is worth opening, and a free
            sixth night is the most openable thing whiff has to say. Dashed,
            like the stub on the page, so the two read as the same object. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 18,
            padding: "12px 26px",
            border: "2px dashed #C9BCB3",
            borderRadius: 16,
            fontSize: 28,
          }}
        >
          <span style={{ color: "#6B5A50" }}>{BET.dare}</span>
          <span style={{ fontWeight: 700 }}>{BET.payoff}</span>
        </div>

        <div style={{ fontSize: 26, color: "#6B5A50", marginTop: 14, fontStyle: "italic" }}>
          this is not a dating app.
        </div>
      </div>
    ),
    { ...size },
  );
}

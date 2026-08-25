import { ImageResponse } from "next/og";
import { ROLES, ROLE_BY_ID } from "../../config/roles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The share card, and the only object on this site built to be forwarded.
 *
 * It is laid out the way the panel is — eyebrow, name, line, hairline — so
 * that opening the link feels like arriving at the thing you just saw, and it
 * ends on the question rather than on a pitch. "Which of the six are you?" is
 * what makes the preview worth a tap; the wordmark is small and top-left,
 * because the sender is the interesting part of this message, not whiff.
 *
 * The default font is kept deliberately: loading Fredoka here means fetching
 * and embedding a font file at build time in a sandbox that may have no
 * network, and a share card that fails to render is worse than one set in a
 * system face. */
export function generateStaticParams() {
  return ROLES.map((role) => ({ role: role.id }));
}

export const alt = "Which of the six are you? A whiff role card.";

export default async function Image({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: id } = await params;
  const role = ROLE_BY_ID.get(id);
  if (!role) return new ImageResponse(<div />, { ...size });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FBF8F5",
          color: "#241A15",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-2px",
              color: "#241A15",
            }}
          >
            whiff
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#9A8B81",
              marginTop: 56,
            }}
          >
            {role.tagline}
          </div>

          <div
            style={{
              fontSize: 128,
              fontWeight: 800,
              letterSpacing: "-4px",
              lineHeight: 1,
              marginTop: 10,
            }}
          >
            {role.name}
          </div>

          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: "#241A15",
              marginTop: 26,
              maxWidth: 880,
            }}
          >
            {role.inCircle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, backgroundColor: "#E5DCD6" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: 26,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 700 }}>
              which of the six are you?
            </div>
            <div style={{ fontSize: 24, color: "#6B5A50", fontStyle: "italic" }}>
              this is not a dating app.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

// Shared Open Graph / Twitter image generator. It avoids request-time APIs so
// the social image remains deterministic at build time.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "whiff: AI-curated rooms for real-life connection";

const OAT = "#f2ebe0";
const FOREST = "#2e2723";
const MUTED = "#6b5e4c";
const TERRA = "#c67b5c";

type Font = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: "normal";
};

// Fetch a Fraunces weight as TTF from Google Fonts (old UA forces a ttf url
// that Satori can read). Returns null on failure so the build never breaks.
async function loadFraunces(weight: 400 | 600): Promise<Font | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Fraunces:wght@${weight}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Version/5.1 Safari/534.30",
        },
      })
    ).text();
    const match = css.match(/src:\s*url\((https:\/\/[^)]+\.(?:ttf|otf|woff))\)/);
    if (!match) return null;
    const data = await (await fetch(match[1])).arrayBuffer();
    return { name: "Fraunces", data, weight, style: "normal" };
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const loaded = (await Promise.all([loadFraunces(400), loadFraunces(600)])).filter(
    (f): f is Font => f !== null,
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: OAT,
          fontFamily: "Fraunces",
          position: "relative",
        }}
      >
        {/* soft ambient glows, echoing the site's drifting orbs */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 620,
            height: 620,
            display: "flex",
            borderRadius: 9999,
            backgroundImage:
              "radial-gradient(circle at 35% 35%, rgba(198,123,92,0.6), rgba(198,123,92,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: -140,
            width: 660,
            height: 660,
            display: "flex",
            borderRadius: 9999,
            backgroundImage:
              "radial-gradient(circle at 65% 65%, rgba(138,154,91,0.5), rgba(138,154,91,0) 65%)",
          }}
        />

        {/* top: wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", fontSize: 42, fontWeight: 600, color: FOREST }}>
            whiff
          </div>
          <div
            style={{ display: "flex", width: 16, height: 16, borderRadius: 9999, backgroundColor: TERRA }}
          />
        </div>

        {/* middle: context line and headline */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 10 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 8,
              color: "rgba(46,39,35,0.5)",
              marginBottom: 26,
            }}
          >
            NO PROFILES · NO SWIPING · NO ALGORITHMS
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.04,
              color: FOREST,
            }}
          >
            <div style={{ display: "flex" }}>AI-curated rooms for</div>
            <div style={{ display: "flex", color: MUTED }}>real-life connection.</div>
          </div>
        </div>

        {/* bottom: tagline + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 27,
              color: "rgba(46,39,35,0.62)",
              maxWidth: 760,
            }}
          >
            some connections become romantic · friendship · community · family
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(46,39,35,0.55)" }}>
            whiff-ai.com
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: loaded.length ? loaded : undefined },
  );
}

import type { MetadataRoute } from "next";
import { PROMISE } from "./seo-content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "whiff",
    short_name: "whiff",
    // Was "Six people, one night a week. The same faces until they're yours."
    // — which promised a weekly cadence that appears on no other surface. The
    // description now renders from the same PROMISE string as the rest of the
    // site, so there is one claim rather than two.
    description: PROMISE,
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f7",
    theme_color: "#f2f2f7",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}

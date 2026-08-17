import type { MetadataRoute } from "next";
import { PROMISE } from "./seo-content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "whiff",
    short_name: "whiff",
    // Rendered from the same PROMISE string as the rest of the site, so there
    // is one claim rather than a second manifest-only cadence promise.
    description: PROMISE,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}

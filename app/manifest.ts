import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "whiff",
    short_name: "whiff",
    description:
      "An activity-first way to meet people. Do what you love, with someone who loves it too.",
    start_url: "/",
    display: "standalone",
    background_color: "#feece4",
    theme_color: "#feece4",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}

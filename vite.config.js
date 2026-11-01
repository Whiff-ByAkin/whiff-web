import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;
const partial = (name) => readFileSync(resolve(root, "partials", name), "utf8");

export default defineConfig({
  base: "/",
  plugins: [
    {
      // One footer for every page: <!--FOOTER--> is swapped for partials/footer.html.
      name: "whiff-partials",
      transformIndexHtml: (html) => html.replace("<!--FOOTER-->", partial("footer.html")),
    },
  ],
  build: {
    // Keep hashed bundles apart from public/assets (mascot and mood images).
    assetsDir: "static",
    target: "es2020",
    rollupOptions: {
      input: {
        home: resolve(root, "index.html"),
        contact: resolve(root, "contact.html"),
        terms: resolve(root, "terms.html"),
        privacy: resolve(root, "privacy.html"),
      },
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
});

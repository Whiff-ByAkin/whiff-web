import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;
const partial = (name) => readFileSync(resolve(root, "partials", name), "utf8");

// The FAQ page's questions (h2) and answers (the p after each) become FAQPage
// structured data, so the visible page and what search engines read never drift apart.
function faqSchema(html) {
  if (!html.includes('class="doc faq"')) return "";
  const strip = (t) => t.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const items = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/g)].map(([, q, a]) => ({
    "@type": "Question",
    name: strip(q),
    acceptedAnswer: { "@type": "Answer", text: strip(a) },
  }));
  const data = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items };
  return `  <script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

export default defineConfig({
  base: "/",
  plugins: [
    {
      // One footer for every page: <!--FOOTER--> is swapped for partials/footer.html.
      name: "whiff-partials",
      transformIndexHtml: (html) =>
        html
          .replace("<!--HEAD-->", partial("head.html"))
          .replace("<!--FOOTER-->", partial("footer.html"))
          .replace("</head>", faqSchema(html) + "</head>"),
    },
  ],
  build: {
    // Keep hashed bundles apart from public/assets (mascot and mood images).
    assetsDir: "static",
    target: "es2020",
    rollupOptions: {
      input: {
        home: resolve(root, "index.html"),
        faq: resolve(root, "faq.html"),
        contact: resolve(root, "contact.html"),
        terms: resolve(root, "terms.html"),
        privacy: resolve(root, "privacy.html"),
      },
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
});

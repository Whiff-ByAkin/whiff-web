# Whiff website

Marketing site for Whiff: home, contact, terms, and privacy. Vite + vanilla JS, GSAP for motion, Lenis for smooth scroll. Deployed on Vercel.

## Commands

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve dist/ at http://localhost:4173
```

## Pages

| URL        | File           | Script          |
|------------|----------------|-----------------|
| `/`        | `index.html`   | `src/main.js`   |
| `/contact` | `contact.html` | `src/page.js`   |
| `/terms`   | `terms.html`   | `src/page.js`   |
| `/privacy` | `privacy.html` | `src/page.js`   |

Every page ends with `<!--FOOTER-->`, which the build swaps for `partials/footer.html` (see `vite.config.js`). Edit the footer there once.

## Look

Colours come from the app (`lib/core/design.dart`): petrol `#145661` and lime `#D1ED9B` on white, Manrope. While the Whiff Moments section is on screen the whole page blends to Moments colours: plum `#5E2A52` and honey `#E9A93A` on ivory `#FBF6F0`. Tiny Whiff cut-outs live in `public/assets/whiff/`, mood photos in `public/assets/moods/`.

Motion is calm on purpose: one-time scroll reveals, Tiny Whiff breathing in the hero, a slow ticker, one round of money-in alerts. `prefers-reduced-motion` turns it all off.

## Contact form

The form posts to [FormSubmit](https://formsubmit.co), which forwards to **contact@whi-ff.com**. The very first message triggers a one-time "Activate form" email to that inbox; click it, and every message after that is delivered. After activating, FormSubmit also gives you a random alias you can swap in for the address in `src/page.js` so the email isn't visible in the code. A hidden honeypot field drops most bots.

## Deploy (Vercel)

`vercel.json` sets the Vite framework, `dist` output, clean URLs (`/terms` instead of `/terms.html`), security headers, and caching. Pushing to `main` deploys.

## Legal

`terms.html` and `privacy.html` are a solid starting draft for Whiff, Inc. (Delaware). Have a lawyer review them before launch, especially arbitration, Moments gifts, and money transmission.

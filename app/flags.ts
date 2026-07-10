// Build-time feature flags.
//
// Flip a flag by editing its default below, or override it at build time with
// the matching NEXT_PUBLIC_ env var, e.g.:
//
//   NEXT_PUBLIC_SPECTRUM_POSITIONING=true npm run build
//
// Values are inlined at build time, so a static deploy needs a rebuild (or a
// changed env var on your host) for a toggle to take effect.

export const FLAGS = {
  /**
   * Show the "built for autistic & neurodivergent adults" positioning as
   * visible copy on the page. Defaults off. Set the env var to "true" to show
   * it. SEO and structured data mention the audience regardless of this flag.
   */
  spectrumPositioning:
    process.env.NEXT_PUBLIC_SPECTRUM_POSITIONING === "true",
} as const;

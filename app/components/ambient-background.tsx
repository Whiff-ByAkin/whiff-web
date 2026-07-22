// The living backdrop: three warm rust orbs drifting on long, offset loops,
// a whisper of film grain for printed-paper tactility, and a soft vignette to
// pull the eye to the center. All pure CSS, all paused under reduced-motion.
export function AmbientBackground() {
  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

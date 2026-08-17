// Tonal paper depth and a whisper of grain. The mobile brand deliberately has
// no general accent hue, so the old drifting colored orbs are gone.
export function AmbientBackground() {
  return (
    <>
      <div className="paper-atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

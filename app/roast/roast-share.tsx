"use client";

import { useId, useRef, useState } from "react";
import { roastShareText, roastUrl, type ShareableRoast } from "../lib/roast-content";

export function RoastShare({ note }: { note: ShareableRoast }) {
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false);
  const sharing = useRef(false);
  const manualId = useId();
  const manualRef = useRef<HTMLTextAreaElement>(null);

  async function share() {
    if (sharing.current) return;
    sharing.current = true; setBusy(true); setStatus(""); setManual("");
    const text = roastShareText(note);
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: "Roast Whiff", text: text.slice(0, text.lastIndexOf("\n\n")), url: roastUrl(note.id) });
          setStatus("Roast shared."); return;
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }
      try {
        if (!navigator.clipboard) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(text);
        setStatus("Roast and link copied.");
      } catch {
        setManual(text);
        setStatus("Automatic sharing is unavailable. Copy the roast and link below.");
        requestAnimationFrame(() => { manualRef.current?.focus(); manualRef.current?.select(); });
      }
    } finally { sharing.current = false; setBusy(false); }
  }

  return <div className="roast-share">
    <button className="roast-share-button" type="button" disabled={busy} onClick={share}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" /></svg>
      {busy ? "Sharing…" : "Share"}
    </button>
    <p className="roast-share-status" role="status" aria-live="polite">{status}</p>
    {manual && <div className="roast-manual-copy"><label htmlFor={manualId}>Select and copy this roast and link</label><textarea id={manualId} ref={manualRef} readOnly value={manual} onFocus={event => event.currentTarget.select()} /><button type="button" onClick={() => { setManual(""); setStatus(""); }}>Close</button></div>}
  </div>;
}

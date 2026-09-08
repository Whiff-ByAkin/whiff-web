"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NOTE_COLORS, NotePaper, RoastFooter, RoastHeader, readResponse, type NoteColor, type NotesResponse, type RoastNote } from "./roast-ui";
import "./roast.css";

export function RoastWall({ initial = null }: { initial?: NotesResponse | null }) {
  const [notes, setNotes] = useState<RoastNote[]>(initial?.notes ?? []);
  const [cursor, setCursor] = useState<string | null>(initial?.nextCursor ?? null);
  const [loading, setLoading] = useState(initial === null);
  const [moreLoading, setMoreLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const request = useRef(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState<NoteColor>("yellow");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [sendError, setSendError] = useState("");
  const sending = useRef(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initial && revision === 0) return;
    const controller = new AbortController();
    const id = ++request.current;
    setLoading(true);
    setLoadError("");
    fetch("/api/roasts", { signal: controller.signal, cache: "no-store" })
      .then(response => readResponse<NotesResponse>(response))
      .then(data => { if (id === request.current) { setNotes(data.notes); setCursor(data.nextCursor); } })
      .catch(error => { if (!controller.signal.aborted && id === request.current) setLoadError(error instanceof Error ? error.message : "The wall couldn’t load. Please try again."); })
      .finally(() => { if (id === request.current && !controller.signal.aborted) setLoading(false); });
    return () => { controller.abort(); request.current = id + 1; };
  }, [initial, revision]);

  async function loadMore() {
    if (!cursor || moreLoading || loading) return;
    const id = request.current;
    setMoreLoading(true); setLoadError("");
    try {
      const data = await readResponse<NotesResponse>(await fetch(`/api/roasts?cursor=${encodeURIComponent(cursor)}`, { cache: "no-store" }));
      if (id === request.current) {
        setNotes(previous => [...previous, ...data.notes.filter(note => !previous.some(existing => existing.id === note.id))]);
        setCursor(data.nextCursor);
      }
    } catch (error) { if (id === request.current) setLoadError(error instanceof Error ? error.message : "More notes couldn’t load. Please try again."); }
    finally { if (id === request.current) setMoreLoading(false); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (!message.trim()) { setSendError("Give your note a few words first."); setSendStatus("error"); messageRef.current?.focus(); return; }
    sending.current = true; setSendStatus("sending"); setSendError("");
    try {
      await readResponse<{ status: "pending" }>(await fetch("/api/roasts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: message.trim(), name: name.trim(), color, consent, website }) }));
      setSendStatus("success"); setMessage(""); setName(""); setConsent(false);
    } catch (error) { setSendError(error instanceof Error ? error.message : "Your note couldn’t send. Please try again."); setSendStatus("error"); }
    finally { sending.current = false; }
  }

  return <div className="roast-page">
    <RoastHeader />
    <main id="main" className="roast-wrap">
      <section className="roast-intro"><div><p className="roast-eyebrow">THE HONEST OPINION DEPARTMENT</p><h1>Roast us<span>.</span></h1><p className="roast-subhead">Love it? Hate it? <span>Stick it here.</span></p></div><p className="roast-intro-aside">We’re building Whiff for real people. <br />So let’s hear from some.<br /><strong>Good or bad, we want the honest version.</strong></p></section>
      <div className="roast-layout">
        <section className="roast-composer-section" id="write-a-note" aria-labelledby="composer-title"><div className="roast-section-heading"><h2 id="composer-title">Your two cents.</h2><span>NO EMAIL NEEDED</span></div>
          {sendStatus === "success" ? <div className={`roast-composer roast-color-${color} roast-sent`} role="status"><span className="roast-note-category">THANKS FOR KEEPING IT REAL</span><h3>Noted. Literally.</h3><p>Sent for review. Your note will appear here once approved.</p><button type="button" className="roast-button" onClick={() => { setSendStatus("idle"); requestAnimationFrame(() => messageRef.current?.focus()); }}>Write another note <span aria-hidden="true">↗</span></button></div> : <form onSubmit={submit} className={`roast-composer roast-color-${color}`}>
            <div className="roast-message-label"><label htmlFor="roast-message">Dear Whiff,</label><span>{message.length}/400</span></div>
            <textarea ref={messageRef} id="roast-message" name="message" placeholder="Here’s what I really think…" maxLength={400} required value={message} onChange={event => setMessage(event.target.value)} disabled={sendStatus === "sending"} aria-describedby="note-guidance" />
            <div className="roast-name-row"><label htmlFor="roast-name">From</label><input id="roast-name" name="name" autoComplete="nickname" placeholder="Anonymous (or your name)" maxLength={30} value={name} onChange={event => setName(event.target.value)} disabled={sendStatus === "sending"} /></div>
            <fieldset className="roast-swatches" disabled={sendStatus === "sending"}><legend>Pick your paper</legend>{NOTE_COLORS.map(item => <label key={item} className={`roast-swatch roast-color-${item}`}><input type="radio" name="color" value={item} checked={color === item} onChange={() => setColor(item)} aria-label={`${item[0].toUpperCase()}${item.slice(1)} paper`} /><span aria-hidden="true">{color === item ? "✓" : ""}</span></label>)}</fieldset>
            <div className="roast-honeypot" aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
            <label className="roast-consent"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} disabled={sendStatus === "sending"} /><span>I’m okay with my note and name appearing publicly after review.</span></label>
            {sendError && <p className="roast-error" role="alert">{sendError}</p>}
            <button type="submit" className="roast-button" disabled={sendStatus === "sending"}>{sendStatus === "sending" ? "Sending your note…" : "Stick it to us"}<span aria-hidden="true">↗</span></button>
          </form>}
          <p id="note-guidance" className="roast-composer-help">Notes appear after review. Criticism is welcome. Please leave out personal details, spam, and attacks on other people.</p><a href="#the-wall" className="roast-wall-jump">See the wall below <span aria-hidden="true">↓</span></a>
        </section>
        <section className="roast-wall-section" id="the-wall" aria-labelledby="wall-title" aria-busy={loading || moreLoading}>
          <div className="roast-section-heading"><h2 id="wall-title">The wall.</h2><button onClick={() => setRevision(value => value + 1)} disabled={loading || moreLoading} aria-label="Refresh public notes">{loading ? "Loading…" : "Refresh ↻"}</button></div>
          <p className="roast-wall-intro">Good notes. Bad notes. All real opinions.<br />Published after review, just as they were written.</p>
          {loading ? <div className="roast-wall-loading" role="status"><span className="roast-loading-paper" /><p>Gathering the notes…</p></div> : loadError && notes.length === 0 ? <div className="roast-wall-error" role="alert"><h3>The wall needs a moment.</h3><p>{loadError}</p><button className="roast-outline-button" onClick={() => setRevision(value => value + 1)}>Try again</button></div> : notes.length === 0 ? <div className="roast-empty"><div className="roast-note roast-color-lilac roast-first-note"><span className="roast-note-category">A NOTE FROM WHIFF</span><p className="roast-note-message">Be the first to leave a note.<br /><br />We can take it.<br />Probably.</p><footer><span>The Whiff team</span><span>YOUR TURN ↗</span></footer></div><p>No published notes yet.<br />Yours could start the conversation.</p></div> : <div className="roast-note-grid">{notes.map(note => <NotePaper key={note.id} note={note} />)}</div>}
          {!loading && loadError && notes.length > 0 && <p className="roast-error" role="alert">{loadError}</p>}
          {!loading && cursor && <button className="roast-outline-button roast-load-more" onClick={loadMore} disabled={moreLoading}>{moreLoading ? "Loading more…" : "More from the wall ↓"}</button>}
        </section>
      </div>
      <div className="roast-bottom-line"><span>A work in progress.</span><p>And better with you in the conversation.</p><Link href="/#begin">Get to know Whiff <span aria-hidden="true">↗</span></Link></div>
    </main>
    <RoastFooter />
  </div>;
}

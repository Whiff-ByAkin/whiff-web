"use client";

import { useEffect, useRef, useState } from "react";
import { NotePaper, RoastFooter, RoastHeader, readResponse, type NotesResponse, type NoteStatus, type RoastNote } from "../roast-ui";
import "../roast.css";

const FILTERS: { status: NoteStatus; label: string }[] = [{ status: "pending", label: "Pending" }, { status: "approved", label: "Published" }, { status: "rejected", label: "Hidden" }];

export function RoastReview() {
  const [auth, setAuth] = useState<"checking" | "login" | "ready">("checking");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [filter, setFilter] = useState<NoteStatus>("pending");
  const [notes, setNotes] = useState<RoastNote[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const request = useRef(0);
  const mutation = useRef(false);
  const loginLock = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const id = ++request.current;
    setLoading(true); setError(""); setConfirm(null); setNotes([]); setCursor(null);
    fetch(`/api/roasts/review?status=${filter}`, { cache: "no-store", signal: controller.signal })
      .then(async response => { if (response.status === 401) { if (id === request.current) setAuth("login"); return null; } return readResponse<NotesResponse>(response); })
      .then(data => { if (data && id === request.current) { setAuth("ready"); setNotes(data.notes); setCursor(data.nextCursor); } })
      .catch(cause => { if (!controller.signal.aborted && id === request.current) setError(cause instanceof Error ? cause.message : "The review queue couldn’t load."); })
      .finally(() => { if (!controller.signal.aborted && id === request.current) setLoading(false); });
    return () => { controller.abort(); request.current = id + 1; };
  }, [filter, version]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginLock.current) return;
    loginLock.current = true; setLoggingIn(true); setLoginError("");
    try { await readResponse(await fetch("/api/roasts/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) })); setPassword(""); setVersion(value => value + 1); }
    catch (cause) { setLoginError(cause instanceof Error ? cause.message : "Couldn’t sign in. Please try again."); }
    finally { setLoggingIn(false); loginLock.current = false; }
  }

  async function logout() {
    if (mutation.current) return;
    mutation.current = true; setBusy("logout"); setError("");
    try { await readResponse(await fetch("/api/roasts/session", { method: "DELETE" })); request.current++; setNotes([]); setCursor(null); setPassword(""); setAuth("login"); setNotice(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Couldn’t sign out. Please try again."); }
    finally { mutation.current = false; setBusy(null); }
  }

  async function loadMore() {
    if (!cursor || moreLoading || loading) return;
    const id = request.current;
    setMoreLoading(true); setError("");
    try {
      const response = await fetch(`/api/roasts/review?status=${filter}&cursor=${encodeURIComponent(cursor)}`, { cache: "no-store" });
      if (response.status === 401) { if (id === request.current) { setAuth("login"); setNotes([]); } return; }
      const data = await readResponse<NotesResponse>(response);
      if (id === request.current) { setNotes(previous => [...previous, ...data.notes.filter(note => !previous.some(existing => existing.id === note.id))]); setCursor(data.nextCursor); }
    } catch (cause) { if (id === request.current) setError(cause instanceof Error ? cause.message : "More notes couldn’t load."); }
    finally { if (id === request.current) setMoreLoading(false); }
  }

  async function moderate(note: RoastNote, status: "approved" | "rejected") {
    if (mutation.current) return;
    mutation.current = true; setBusy(note.id); setError(""); setNotice("");
    const id = request.current;
    try {
      const response = await fetch("/api/roasts/review", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: note.id, status }) });
      if (response.status === 401) { setAuth("login"); setNotes([]); return; }
      await readResponse(response);
      if (id === request.current) { setNotes(previous => previous.filter(item => item.id !== note.id)); setConfirm(null); setNotice(status === "approved" ? "Note published. It is now on the public wall." : "Note hidden. It is not visible on the public wall."); }
    } catch (cause) { if (id === request.current) setError(cause instanceof Error ? cause.message : "Couldn’t update this note. Please try again."); }
    finally { mutation.current = false; setBusy(null); }
  }

  return <div className="roast-page roast-review-page"><RoastHeader /><main id="main" className="roast-wrap roast-review-main"><div className="roast-review-heading"><div><p className="roast-eyebrow">PRIVATE / THE HONEST OPINION DEPARTMENT</p><h1>Review the notes.</h1><p>Keep the good and the bad. Leave out spam, private details, and abuse.</p></div>{auth === "ready" && <button className="roast-outline-button" onClick={logout} disabled={!!busy || loading || moreLoading}>{busy === "logout" ? "Signing out…" : "Sign out"}</button>}</div>
    {auth === "login" ? <form className="roast-login" onSubmit={login}><h2>A little privacy, please.</h2><p>Enter the reviewer password to open the queue.</p><label htmlFor="review-password">Reviewer password</label><input id="review-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} disabled={loggingIn} />{loginError && <p className="roast-error" role="alert">{loginError}</p>}<button className="roast-button" disabled={loggingIn}>{loggingIn ? "Signing in…" : "Open the review queue"}</button></form> : <>
      <div className="roast-review-controls"><div role="tablist" aria-label="Filter notes" className="roast-review-tabs" onKeyDown={event => { const index = FILTERS.findIndex(item => item.status === filter); const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : undefined; if (next !== undefined && !busy && !moreLoading) { event.preventDefault(); setFilter(FILTERS[next].status); tabRefs.current[next]?.focus(); } }}>{FILTERS.map((item, index) => <button key={item.status} ref={node => { tabRefs.current[index] = node; }} role="tab" id={`review-tab-${item.status}`} aria-controls="review-list" aria-selected={filter === item.status} tabIndex={filter === item.status ? 0 : -1} disabled={!!busy || moreLoading} onClick={() => { setFilter(item.status); setNotice(""); }}>{item.label}</button>)}</div><button className="roast-refresh" onClick={() => setVersion(value => value + 1)} disabled={loading || !!busy || moreLoading}>Refresh ↻</button></div>
      {notice && <p className="roast-review-notice" role="status">{notice}</p>}
      {error && <div className="roast-review-error" role="alert"><p>{error}</p><button className="roast-outline-button" onClick={() => setVersion(value => value + 1)} disabled={loading || !!busy}>Try again</button></div>}
      <section id="review-list" role="tabpanel" aria-labelledby={`review-tab-${filter}`} aria-busy={loading || moreLoading} tabIndex={0}>{loading ? <p className="roast-review-empty" role="status">Opening the queue…</p> : !error && notes.length === 0 ? <div className="roast-review-empty"><h2>{filter === "pending" ? "All caught up." : filter === "approved" ? "Nothing published yet." : "No hidden notes."}</h2><p>{filter === "pending" ? "New notes will land here for your review." : "Use the tabs above to move between queues."}</p></div> : <div className="roast-review-grid">{notes.map(note => <NotePaper key={note.id} note={note} review><div className="roast-review-actions">{confirm === note.id ? <div className="roast-action-confirm"><p>{filter === "approved" ? "Hide this note from the public wall?" : "Keep this note off the public wall?"} You can publish it later.</p><button className="roast-button" onClick={() => moderate(note, "rejected")} disabled={!!busy}>{busy === note.id ? "Saving…" : "Yes, hide note"}</button><button className="roast-text-button" onClick={() => setConfirm(null)} disabled={!!busy}>Cancel</button></div> : <>{filter !== "approved" && <button className="roast-button" onClick={() => moderate(note, "approved")} disabled={!!busy}>{busy === note.id ? "Publishing…" : filter === "pending" ? "Approve & publish" : "Publish"}</button>}{filter !== "rejected" && <button className="roast-outline-button" onClick={() => setConfirm(note.id)} disabled={!!busy}>{filter === "approved" ? "Hide" : "Reject"}</button>}</>}</div></NotePaper>)}</div>}</section>
      {!loading && cursor && <button className="roast-outline-button roast-load-more" onClick={loadMore} disabled={moreLoading || !!busy}>{moreLoading ? "Loading more…" : "Load more notes"}</button>}
    </>}
  </main><RoastFooter /></div>;
}

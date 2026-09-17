"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./home-owner-controls.module.css";

export function HomeOwnerControls({ authenticated, localPreview = false }: { authenticated: boolean; localPreview?: boolean }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);

  async function request(url: string, method: string, body?: unknown) {
    const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    let data;
    try { data = await response.json(); } catch { data = null; }
    if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "That didn’t work. Please try again.");
    return data;
  }
  async function login(event: React.FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true; setBusy(true); setError("");
    try { await request("/owner/api/session", "POST", { password }); window.location.reload(); }
    catch (err) { setError(err instanceof Error ? err.message : "Couldn’t sign in. Please try again."); }
    finally { sending.current = false; setBusy(false); }
  }
  async function logout() {
    if (sending.current) return;
    sending.current = true; setBusy(true); setError("");
    try { await request("/owner/api/session", "DELETE"); window.location.reload(); }
    catch { setError("Couldn’t sign out. Please try again."); }
    finally { sending.current = false; setBusy(false); }
  }
  return <div className={styles.page}><header className={styles.header}><Link href="/" className={styles.logo}>whiff</Link><span>PRIVATE / PAGE PREVIEWS</span>{authenticated && !localPreview && <button onClick={logout} disabled={busy}>Sign out</button>}</header><main id="main" className={styles.main}><p className={styles.eyebrow}>OWNER CONTROLS</p><h1>Your front door.</h1>{localPreview && <p className={styles.storage}>Local preview. These pages are running on this computer.</p>}
    {!authenticated ? <><p className={styles.intro}>Sign in to preview Whiff’s pages.</p><form onSubmit={login} className={styles.login}><label htmlFor="owner-password">Owner password</label><input id="owner-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} disabled={busy} /><button className={styles.primary} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>{error && <p className={styles.error} role="alert">{error}</p>}</> : <>
      <p className={styles.intro}>Each page now has its own address. The original homepage stays at the main site.</p>
      <section className={styles.current}><strong>Original homepage</strong><Link href="/">Open main site</Link></section>
      <section className={styles.current}><strong>Minnesota</strong><Link href="/mn">Open Minnesota page</Link></section>
      <p><Link href="/owner/preview/city">Open private Minnesota preview</Link></p>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </>}
  </main></div>;
}

import { APP_STORE_URL, GOOGLE_PLAY_URL } from "../config/site";
import styles from "./download-buttons.module.css";

export function DownloadButtons({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <div className={`${styles.buttons} ${compact ? styles.compact : ""} ${className}`} aria-label="Get the Whiff app">
    {[{ name: "App Store", url: APP_STORE_URL, icon: "apple" }, { name: "Google Play", url: GOOGLE_PLAY_URL, icon: "play" }].map(store => {
      const content = <><span className={styles.icon} aria-hidden="true">{store.icon === "apple" ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.4 12.8c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 1.9-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.8-1.1-2.8-2.9ZM15.4 6.7c.5-.7.9-1.6.8-2.5-.8 0-1.8.6-2.4 1.2-.5.6-1 1.5-.9 2.4.9.1 1.8-.5 2.5-1.1Z" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m5 3 15 9L5 21V3Z"/><path d="m5 3 10 12M5 21 15 9"/></svg>}</span><span><small>{store.url ? "Get it on" : "Coming soon"}</small><strong>{store.name}</strong></span></>;
      return store.url ? <a key={store.name} href={store.url} className={styles.store} rel="noopener">{content}</a> : <button type="button" key={store.name} className={styles.store} disabled aria-label={`${store.name} — coming soon`}>{content}</button>;
    })}
  </div>;
}

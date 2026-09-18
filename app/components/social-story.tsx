import Image from "next/image";
import { INSTAGRAM_URL, TIKTOK_URL } from "../config/site";
import styles from "./social-story.module.css";

function SocialIcon({ platform }: { platform: "Instagram" | "TikTok" }) {
  return platform === "Instagram" ? <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M16.7 2h-3.4v13.7a3.1 3.1 0 1 1-2.7-3.1V9.2a6.5 6.5 0 1 0 6.1 6.5V8.8a8.1 8.1 0 0 0 4.7 1.5V6.9A4.7 4.7 0 0 1 16.7 2Z"/></svg>;
}

export function SocialStory() {
  return <section id="yancys-story" className={styles.section} aria-labelledby="yancy-heading">
    <div className={styles.poster}>
      <div className={styles.masthead}><span>WHIFF / SOCIAL STORIES</span><span>MEET YANCY</span></div>
      <Image src="/stories/yancy-moving.webp" width={1200} height={800} sizes="(max-width: 760px) 90vw, 46vw" alt="Illustrated Yancy settling into her new Minneapolis apartment among moving boxes." />
      <p className={styles.caption}>New city. Unpacked boxes.<br /><em>A little room for someone new.</em></p>
    </div>
    <div className={styles.copy}>
      <p className={styles.eyebrow}>A NEW CHAPTER, ONE HELLO AT A TIME</p>
      <h2 id="yancy-heading">Follow<br /><span>Yancy’s story.</span></h2>
      <p>Moving to Minneapolis is the beginning. Making it feel like home is the next chapter.</p>
      <p>Follow along on our social channels as Yancy’s story unfolds.</p>
      <div className={styles.actions}><a href={INSTAGRAM_URL} rel="noopener" aria-label="Follow Yancy’s story on Instagram" title="Instagram"><SocialIcon platform="Instagram" /></a>{TIKTOK_URL ? <a href={TIKTOK_URL} rel="noopener" aria-label="Follow Yancy’s story on TikTok" title="TikTok"><SocialIcon platform="TikTok" /></a> : <button type="button" disabled aria-label="TikTok — coming soon" title="TikTok — coming soon"><SocialIcon platform="TikTok" /><small>Coming soon</small></button>}</div>
    </div>
  </section>;
}

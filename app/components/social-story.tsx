import Image from "next/image";
import { INSTAGRAM_URL, TIKTOK_URL } from "../config/site";
import styles from "./social-story.module.css";

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
      <p>A first coffee on her own. Three unfamiliar names. A bowling night with a few gutter balls and a little less awkwardness. Follow along as her story unfolds.</p>
      <div className={styles.actions}><a href={INSTAGRAM_URL} rel="noopener">Follow on Instagram <span aria-hidden="true">↗</span></a>{TIKTOK_URL ? <a href={TIKTOK_URL} rel="noopener">Follow on TikTok <span aria-hidden="true">↗</span></a> : <button type="button" disabled>Follow on TikTok <small>Coming soon</small></button>}</div>
      <p className={styles.disclosure}>An illustrated, imagined journey. Not a customer testimonial.</p>
    </div>
  </section>;
}

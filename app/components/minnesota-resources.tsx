import Link from "next/link";
import { MINNESOTA_GUIDES, guidePath } from "../guides/content";
import styles from "../guides/guide.module.css";
export function MinnesotaResources() {
  return <section id="minnesota-guides" className={styles.resources} aria-labelledby="minnesota-guides-title"><p className={styles.eyebrow}>A LITTLE LOCAL KNOW-HOW</p><h2 id="minnesota-guides-title">New place.<br />A few places to start.</h2><p className={styles.resourceIntro}>Moving to Minnesota, finding something to do, or making room for new friends? Start with a plan you can actually repeat.</p><ol className={styles.resourceList}>{MINNESOTA_GUIDES.map((guide, index) => <li key={guide.slug}><Link href={guidePath(guide)}><span className={styles.number}>0{index + 1}</span><div><h3>{guide.shortTitle}</h3><p>{guide.description}</p></div><span className={styles.arrow} aria-hidden="true">↗</span></Link></li>)}</ol></section>;
}

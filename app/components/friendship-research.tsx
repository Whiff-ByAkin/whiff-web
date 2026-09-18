import Link from "next/link";
import { HALL_PAPER } from "../guides/content";
import styles from "../guides/guide.module.css";
export function FriendshipResearch() {
  return <section className={styles.research} aria-labelledby="friendship-research-title"><div className={styles.researchNote} aria-hidden="true">The second meeting<br />deserves a plan, too.</div><div><p className={styles.eyebrow}>WHY THE SAME PEOPLE?</p><h2 id="friendship-research-title">Friendship needs<br />time together.</h2><p>Researcher Jeffrey A. Hall studied how shared time relates to friendship. His findings give us a reason to care about the next meeting, not just the introduction. They don’t establish a universal timeline, prove Whiff works, or promise that six outings make close friends. Our part is to make showing up again easier.</p><div className={styles.researchLinks}><Link href="/blog/how-long-does-it-take-to-make-friends">Read the research, in plain English →</Link><a href={HALL_PAPER}>Hall’s original paper ↗</a></div></div></section>;
}

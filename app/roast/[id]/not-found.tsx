import Link from "next/link";
import { RoastHeader, RoastFooter } from "../roast-ui";
import "../roast.css";

export default function NoteNotFound() {
  return <div className="roast-page"><RoastHeader /><main id="main" className="roast-wrap"><section className="roast-selected"><p className="roast-eyebrow">WHIFF’S COMPLAINT DEPARTMENT</p><h1>This note isn’t on the wall.</h1><p>It may no longer be available. There’s more to read in the complaint department.</p><Link href="/roast" className="roast-outline-button">All roasts</Link></section></main><RoastFooter /></div>;
}

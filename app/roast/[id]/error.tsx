"use client";

import Link from "next/link";
import { RoastFooter, RoastHeader } from "../roast-ui";
import "../roast.css";

export default function RoastError({ reset }: { reset: () => void }) {
  return <div className="roast-page"><RoastHeader /><main id="main" className="roast-wrap"><section className="roast-selected"><p className="roast-eyebrow">WHIFF’S COMPLAINT DEPARTMENT</p><h1>This note needs a moment.</h1><p>We couldn’t load this community note. Please try again, or read the wall while we reconnect.</p><div className="roast-bridge-actions"><button className="roast-button" onClick={reset}>Try again</button><Link href="/roast">All roasts</Link></div></section></main><RoastFooter /></div>;
}

import Link from "next/link";
import { HUB_NAME } from "../config/site";

export function RoastBridge() {
  return (
    <aside className="roast-bridge" aria-labelledby="roast-bridge-title">
      <div><h2 id="roast-bridge-title">New here? Meet Whiff.</h2><p>The same four people. Six activities. Twelve weeks to get to know each other. A little structure for platonic friendship.</p><p className="roast-bridge-location">First circles forming in {HUB_NAME}.</p></div>
      <div className="roast-bridge-actions"><Link className="roast-button" href="/#first-outing">See an example outing <span aria-hidden="true">↗</span></Link><Link className="roast-bridge-invite" href="/#download">Get the app</Link><p>App Store and Google Play links coming soon.</p></div>
    </aside>
  );
}

import { graph } from "@/app/lib/structured-data";

/** One <script type="application/ld+json"> per page, always a single @graph.
 *  Rendered server-side so it is in the initial HTML — crawlers that do not
 *  execute JavaScript still get the full graph. */
export function JsonLd({ nodes }: { nodes: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is inserted into a <script> block, so the only
      // escape that matters is "</script>" appearing inside a string value.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph(nodes)).replace(/</g, "\\u003c"),
      }}
    />
  );
}

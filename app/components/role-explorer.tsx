"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { SITE_URL } from "@/app/config/site";
import { AskLabel } from "@/app/components/ask-label";
import { CLOSING, ROLES, ROLE_BY_ID } from "@/app/config/roles";

/* The six roles, and the question they add up to.
 *
 * This is the product's own artifact on the page: the reading hands you one of
 * these, and the three names under "clicks with" are the shape of the Circle
 * you get seated in. It replaced a deck of draggable cards, which was the same
 * information behind a gesture nobody asked to perform — you had to flick
 * through paper to find out what whiff does.
 *
 * A segmented control instead, because it shows all seven choices at once and
 * costs one tap to answer "what are the others". The three names in each panel
 * are buttons too, so the compatibility graph is walkable: press Host, press
 * Spark from inside it, and you have learned the mechanic without a diagram.
 *
 * Standard tabs semantics (tablist / tab / tabpanel, roving tabindex, arrows
 * to move, Home and End to jump) — a segmented control is what this pattern
 * looks like when it is drawn well, not a different widget. */

const TABS = [
  ...ROLES.map((role) => ({ id: role.id, label: role.name })),
  { id: CLOSING.id, label: CLOSING.label },
];

/* Which tab is showing is the hero's business as well as this component's:
 * the closing panel carries the same ask as the button under the claim, and
 * the page hides one while the other is up. So the state lives above and
 * arrives back as props. */
export function RoleExplorer({
  active,
  onActiveChange,
  onBegin,
}: {
  active: string;
  onActiveChange: (id: string) => void;
  onBegin: () => void;
}) {
  const setActive = onActiveChange;
  const reduce = useReducedMotion();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const touched = useRef(false);
  const [shareStatus, setShareStatus] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [sharing, setSharing] = useState(false);
  const sharingRef = useRef(false);
  const shareRevision = useRef(0);
  const manualRef = useRef<HTMLInputElement>(null);
  const manualId = useId();

  const index = TABS.findIndex((tab) => tab.id === active);
  const role = ROLE_BY_ID.get(active);

  /* Every role has a real address (/roles/spark), and pressing a tab moves
   * the bar to it. That is the whole reason the pages exist: a role is worth
   * sending to somebody, and a URL nobody can see is not a link.
   *
   * `replaceState`, not `push`: seven tabs would otherwise leave seven entries
   * in the back stack and trap the visitor on the page. And nothing happens
   * until a tab is actually pressed — rewriting the address on mount would
   * turn every arrival on / into /roles/spark before the visitor had done
   * anything at all. */
  useEffect(() => {
    if (!touched.current) return;
    const path = active === CLOSING.id ? "/" : `/roles/${active}`;
    if (window.location.pathname !== path) {
      history.replaceState(null, "", path);
    }
  }, [active]);

  function select(id: string) {
    touched.current = true;
    // The confirmation belongs to the role that was copied, not to the panel.
    setShareStatus(""); setManualLink(""); shareRevision.current++;
    setActive(id);
  }

  async function share(name: string, url: string) {
    if (sharingRef.current) return;
    sharingRef.current = true; setSharing(true); setShareStatus(""); setManualLink("");
    const revision = shareRevision.current;
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: `${name} · whiff`, url });
          if (revision === shareRevision.current) setShareStatus("Role shared.");
          return;
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }
      try {
        if (!navigator.clipboard) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(url);
        if (revision === shareRevision.current) setShareStatus("Role link copied. Ready to send.");
      } catch {
        if (revision === shareRevision.current) {
          setManualLink(url); setShareStatus("Automatic sharing is unavailable. Copy the link below.");
          requestAnimationFrame(() => { manualRef.current?.focus(); manualRef.current?.select(); });
        }
      }
    } finally { sharingRef.current = false; setSharing(false); }
  }

  // Automatic activation: for a tablist whose panels are already loaded, the
  // arrow key should select, not merely focus. Moving focus without selecting
  // is the pattern for expensive panels, and these are three lines of text.
  function move(to: number) {
    const next = TABS[(to + TABS.length) % TABS.length];
    select(next.id);
    tabRefs.current[next.id]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: TABS.length - 1,
    };
    const to = keys[event.key];
    if (to === undefined) return;
    event.preventDefault();
    move(to);
  }

  return (
    <MotionConfig
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 520, damping: 42, mass: 0.7 }
      }
    >
      <div className="role-explorer">
        {/* ── The control ─────────────────────────────────────────────
            One track, seven stops, and a pill that slides between them.
            The pill is a single element shared across the tabs by layoutId,
            so Motion moves the actual box rather than cross-fading two of
            them — which is the whole difference between this and six divs
            that light up. */}
        <div
          role="tablist"
          aria-label="The six roles"
          onKeyDown={onKeyDown}
          className="role-track"
        >
          {TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                role="tab"
                id={`role-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="role-panel"
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => select(tab.id)}
                className={`role-tab ${selected ? "is-selected" : ""}`}
              >
                {selected && (
                  <motion.span
                    aria-hidden="true"
                    layoutId="role-segment"
                    className="role-segment"
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Keep the active role readable without reserving blank space on phones. */}
        <div
          role="tabpanel"
          id="role-panel"
          aria-labelledby={`role-tab-${active}`}
          tabIndex={0}
          className="role-panel"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -6 }}
              transition={{
                duration: reduce ? 0 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="role-card"
            >
              {role ? (
                <>
                  {/* The eyebrow carries the app's own one-line summary, so
                      the big word is never alone with no idea attached. */}
                  <p className="role-eyebrow">{role.tagline}</p>
                  <h2 className="role-name">{role.name}</h2>
                  <p className="role-line">{role.inCircle}</p>

                  <dl className="role-meta">
                    <dt>Clicks with</dt>
                    <dd className="role-connections">
                      {role.clicksWith.map((id) => (
                        <span key={id}>
                          {/* Walkable, not decorative: this is how you find
                              out what the other three do. */}
                          <button
                            type="button"
                            onClick={() => select(id)}
                            className="role-link"
                          >
                            {ROLE_BY_ID.get(id)?.name}
                          </button>
                        </span>
                      ))}
                    </dd>

                    <dt>Fun fact</dt>
                    <dd>{role.fact}</dd>
                  </dl>

                  <div className="role-share-area">
                    <button type="button" aria-label={`Share ${role.name}`} disabled={sharing} onClick={() => share(role.name, `${SITE_URL}/roles/${role.id}`)} className="role-share">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" /></svg>
                      {sharing ? "Sharing…" : `Share ${role.name}`}
                    </button>
                    <p className="role-share-hint">For the {role.name} you know.</p>
                    <p className="role-share-status" role="status" aria-live="polite">{shareStatus}</p>
                    {manualLink && <div className="role-share-manual"><label htmlFor={manualId}>Select and copy this role link</label><input id={manualId} ref={manualRef} readOnly value={manualLink} onFocus={event => event.currentTarget.select()} /><button type="button" onClick={() => { setManualLink(""); setShareStatus(""); }}>Close</button></div>}
                  </div>
                </>
              ) : (
                <>
                  <p className="role-eyebrow">Six roles, one of them yours</p>
                  <h2 className="role-name">{CLOSING.title}</h2>
                  <p className="role-line">{CLOSING.line}</p>

                  <p className="role-closing-body">{CLOSING.body}</p>

                  {/* The same ask as the button under the claim, in the same
                      words — and the reason that button is hidden while this
                      panel is up. Pressing it opens the field over there and
                      puts the cursor in it. */}
                  <button
                    type="button"
                    onClick={onBegin}
                    className="role-cta group"
                  >
                    <AskLabel />

                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}

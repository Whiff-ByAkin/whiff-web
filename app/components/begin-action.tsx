"use client";

import Link from "next/link";

export function BeginAction({ className, onBegin }: { className: string; onBegin?: () => void }) {
  if (onBegin) return <button type="button" onClick={onBegin} className={className}>Get an invite</button>;
  return <Link href="/#begin" className={className}>Get an invite</Link>;
}

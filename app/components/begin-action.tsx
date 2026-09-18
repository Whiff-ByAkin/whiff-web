"use client";

import Link from "next/link";

export function BeginAction({ className, onBegin }: { className: string; onBegin?: () => void }) {
  if (onBegin) return <button type="button" onClick={onBegin} className={className}>Get the app</button>;
  return <Link href="/#download" className={className}>Get the app</Link>;
}

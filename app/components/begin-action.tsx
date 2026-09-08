import Link from "next/link";

export function BeginAction({ className }: { className: string }) {
  return <Link href="/#begin" className={className}>Get an invite</Link>;
}

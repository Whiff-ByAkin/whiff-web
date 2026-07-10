import type { Metadata } from "next";
import Link from "next/link";
import { getOwnerMatch, getPublicMatch } from "@/lib/match";
import { GuessFlow, OwnerView } from "./guess-flow";

// Private game sessions — keep them out of search results.
export const metadata: Metadata = {
  title: "a game for you",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col px-6 py-10 sm:py-14">
      <Link
        href="/"
        aria-label="whiff home"
        className="mx-auto mb-8 inline-flex items-center gap-2 font-serif text-lg tracking-tight text-forest/80 transition-colors hover:text-forest"
      >
        whiff<span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden="true" />
      </Link>
      <div className="flex flex-1 flex-col">{children}</div>
    </main>
  );
}

export default async function GameLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ k?: string }>;
}) {
  const { code } = await params;
  const { k } = await searchParams;

  // Owner view: the starter came back with their private key.
  if (k) {
    const owner = await getOwnerMatch(code, k);
    if (owner) {
      return (
        <Shell>
          <OwnerView
            promptText={owner.promptText}
            answer={owner.answer}
            friendName={owner.friendName}
            guess={owner.guess}
            status={owner.status}
          />
        </Shell>
      );
    }
  }

  // Friend view: the shareable link.
  const publicMatch = await getPublicMatch(code);
  if (!publicMatch) {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="mb-2 font-serif text-3xl text-forest">this link isn&rsquo;t working</h1>
          <p className="text-[15px] text-muted">
            it may have expired or been mistyped. ask your friend to resend it.
          </p>
          <Link
            href="/do-you-know-me"
            className="mt-6 inline-block rounded-full bg-sienna px-7 py-3 font-serif italic tracking-wide text-oat transition-colors hover:bg-sienna-hover"
          >
            start your own →
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <GuessFlow
        code={publicMatch.code}
        promptText={publicMatch.promptText}
        alreadyAnswered={publicMatch.status === "answered"}
      />
    </Shell>
  );
}

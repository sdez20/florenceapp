"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// The two layout shells every redesigned screen is built inside.
// Both use the identical frame: flat white ground, 56 / 32 / 48 padding,
// Cormorant body. Auth screens show the centred wordmark; inner screens show
// a header bar with a back arrow on the left and the section name centred in
// the wordmark style.

const SCREEN = "flex min-h-[100dvh] flex-col bg-ground px-8 pt-14 pb-12 font-body";

const WORDMARK =
  "shrink-0 text-center font-display text-[17px] font-normal leading-[22px] tracking-[0.34em] text-ink opacity-60 [text-indent:0.34em]";

/** The Florence wordmark, in the display face at the fixed size and 60% opacity. */
export function Wordmark({ as = "Florence" }: { as?: string }) {
  return <div className={WORDMARK}>{as}</div>;
}

/** Auth screens: centred wordmark, then the screen's content. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className={SCREEN}>
      <Wordmark />
      {children}
    </div>
  );
}

/** Inner screens: back arrow on the left, section name centred, then content. */
export function InnerShell({
  title,
  children,
  onBack,
  backHref,
}: {
  title: string;
  children: ReactNode;
  onBack?: () => void;
  backHref?: string;
}) {
  const router = useRouter();
  const goBack = () => {
    if (onBack) return onBack();
    if (backHref) return router.push(backHref);
    router.back();
  };
  return (
    <div className={SCREEN}>
      <div className="relative flex h-[22px] shrink-0 items-center">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="absolute left-0 border-none bg-transparent p-0 text-[18px] leading-[22px] text-ink opacity-40"
        >
          &lsaquo;
        </button>
        <div className="w-full text-center font-display text-[17px] font-normal tracking-[0.34em] text-ink opacity-60 [text-indent:0.34em]">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

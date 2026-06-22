import type { ReactNode } from "react";

/**
 * The Florence "screen" — fills the device on mobile and sits as a centered
 * card on the sand background on larger displays, mirroring the design mockups.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-sand sm:p-6">
      <div className="relative flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-paper sm:h-[min(844px,92vh)] sm:rounded-[44px] sm:shadow-[0_40px_120px_rgba(58,53,46,0.30),0_0_0_1px_rgba(92,107,67,0.18)]">
        {children}
      </div>
    </main>
  );
}

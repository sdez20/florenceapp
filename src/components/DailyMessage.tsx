"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { getCycle } from "@/lib/cycle-store";
import { getLastFocus } from "@/lib/focus-store";
import {
  cachedMessageForToday,
  getFrequency,
  isDueToday,
  saveDailyState,
  today,
} from "@/lib/daily-message-store";

// Florence's one warm message for the day, shown as a closeable pop-up over the
// dashboard when she opens the app. Fetches at most once per calendar day,
// caches the result, and shows nothing when the safety layer stays quiet.
export default function DailyMessage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (getFrequency() === "off") return;

    const cached = cachedMessageForToday();
    if (cached) {
      setMessage(cached);
      return;
    }
    if (!isDueToday()) return;

    const profile = getProfile();
    const gatedSeason = /pregnan|postpartum|trying to conceive/i.test(profile.season ?? "");
    const cycle = getCycle();

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/daily-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            focus: getLastFocus() || undefined,
            profile,
            gatedSeason,
            cycle: gatedSeason
              ? null
              : { lastPeriod: cycle.lastPeriod, cycleLength: cycle.cycleLength },
          }),
        });
        const data = (await res.json()) as { message?: string | null };
        saveDailyState({ lastShown: today(), message: data.message ?? undefined });
        if (!cancelled && data.message) setMessage(data.message);
      } catch {
        saveDailyState({ lastShown: today() });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!message || dismissed) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-6">
      {/* dimmed backdrop — tapping it closes the message */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => setDismissed(true)}
        className="absolute inset-0 bg-ink/25 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-[330px] rounded-[22px] border border-olive/15 bg-paper p-6 shadow-[0_30px_80px_rgba(58,53,46,0.28)]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest">
            From Florence
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="text-[20px] leading-none text-ink-soft/60 transition-colors hover:text-ink-soft"
          >
            &times;
          </button>
        </div>
        <p className="text-[15px] font-light leading-[1.62] text-ink">{message}</p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            router.push("/chat");
          }}
          className="mt-5 w-full rounded-[14px] bg-ink py-3.5 text-center font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-olive"
        >
          Talk with Florence
        </button>
      </div>
    </div>
  );
}

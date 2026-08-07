"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

// Florence's one warm message for the day, shown when she opens the app. Fetches
// at most once per calendar day, caches the result, and shows nothing when the
// safety layer decides to stay quiet.
export default function DailyMessage() {
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
        // Record one attempt per day so we don't refetch on every open, even if
        // the safety layer chose to stay quiet (message null).
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
    <div className="mb-5 rounded-[18px] border-[1.5px] border-forest/22 bg-paper p-5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest">
          From Florence
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-[18px] leading-none text-ink-soft/55 transition-colors hover:text-ink-soft"
        >
          &times;
        </button>
      </div>
      <p className="text-[14.5px] font-light leading-[1.62] text-ink">{message}</p>
      <Link
        href="/chat"
        className="mt-3 inline-block text-[13px] font-semibold text-clay no-underline"
      >
        Talk with Florence &rsaquo;
      </Link>
    </div>
  );
}

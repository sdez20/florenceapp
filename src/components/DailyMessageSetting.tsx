"use client";

import { useEffect, useState } from "react";
import { getFrequency, saveDailyState, type Frequency } from "@/lib/daily-message-store";

const OPTS: { value: Frequency; label: string; sub: string }[] = [
  { value: "daily", label: "Daily", sub: "One warm message each day" },
  { value: "few", label: "A few times a week", sub: "Every couple of days" },
  { value: "off", label: "Off", sub: "No messages for now" },
];

export default function DailyMessageSetting() {
  const [freq, setFreq] = useState<Frequency>("daily");
  useEffect(() => setFreq(getFrequency()), []);

  const pick = (f: Frequency) => {
    setFreq(f);
    saveDailyState({ frequency: f });
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {OPTS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => pick(o.value)}
          className={`flex items-center justify-between rounded-[14px] border p-4 text-left transition-colors ${
            freq === o.value
              ? "border-forest/45 bg-blush"
              : "border-olive/16 hover:border-clay-soft"
          }`}
        >
          <span className="flex min-w-0 flex-col">
            <span className="font-serif text-[18px] font-semibold leading-[1.15] text-ink">
              {o.label}
            </span>
            <span className="mt-0.5 text-[12px] font-light text-ink-soft">{o.sub}</span>
          </span>
          {freq === o.value && (
            <span className="ml-3 flex-shrink-0 text-[16px] font-semibold text-forest">
              &#10003;
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

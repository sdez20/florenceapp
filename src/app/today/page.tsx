"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import NavMenu from "@/components/NavMenu";
import { getStoredName, firstNameOf } from "@/lib/user";

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const dims = [
  { label: "Mental", core: "#6E7B4C", words: ["heavy", "foggy", "steady", "clear", "sharp"] },
  { label: "Emotional", core: "#B0A06F", words: ["shut down", "low", "tender", "open", "light"] },
  { label: "Nutrition", core: "#97A06E", words: ["depleted", "running low", "nourished", "satisfied", "strong"] },
];

const initialPct = [70, 46, 64];
const initialWords = ["clear", "tender", "nourished"];

function clamp(p: number) {
  return Math.max(4, Math.min(96, p));
}

function wordFor(i: number, p: number) {
  const list = dims[i].words;
  const idx = Math.min(list.length - 1, Math.floor((p / 100) * list.length));
  return list[idx];
}

export default function TodayPage() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(initialPct);
  const [words, setWords] = useState(initialWords);

  // Computed after mount from the user's local time and stored name, so there
  // is no server/client hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    setNow(new Date());
    setFirstName(firstNameOf(getStoredName()));
  }, []);
  const greeting = now ? greetingFor(now) : "Hello";
  const dateLabel = now ? formatDate(now) : " ";

  const setDim = (i: number, raw: number) => {
    const p = clamp(raw);
    setPct((prev) => prev.map((v, j) => (j === i ? p : v)));
    setWords((prev) => prev.map((v, j) => (j === i ? wordFor(i, p) : v)));
  };

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-4 pt-14">
        <div className="font-serif text-[16px] font-medium text-ink-soft">
          {dateLabel}
        </div>
        <div className="mt-[5px] inline-flex items-center gap-2 text-[12px] font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-olive shadow-[0_0_0_4px_rgba(110,123,83,0.15)]" />
          Cycling
        </div>
        <div className="mt-[22px] font-serif text-[32px] font-medium leading-[1.05] text-ink">
          {greeting}
          {firstName ? (
            <>
              ,
              <br />
              <em className="italic text-clay">{firstName}</em>.
            </>
          ) : (
            "."
          )}
        </div>
        {!done && (
          <div className="mt-[14px] text-[14.5px] font-light text-ink-soft">
            How are you feeling today?
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center py-2">
          {!done ? (
            <div className="flex flex-col gap-[30px]">
              {dims.map((dim, i) => (
                <Slider
                  key={dim.label}
                  label={dim.label}
                  word={words[i]}
                  pct={pct[i]}
                  onChange={(p) => setDim(i, p)}
                />
              ))}
              <button
                type="button"
                onClick={() => setDone(true)}
                className="mt-[38px] w-full rounded-[16px] border-[1.5px] border-clay-soft bg-transparent p-4 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-clay transition-colors hover:bg-sage/14"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[26px]">
              {dims.map((dim, i) => (
                <div key={dim.label} className="flex items-center gap-[18px]">
                  <span className="relative flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center">
                    {/* constantly pulsing glow */}
                    <span
                      className="absolute inset-0 rounded-full blur-[5px]"
                      style={{
                        background: dim.core,
                        animation: "floGlow 4s ease-in-out infinite",
                        animationDelay: `${i * 1.3}s`,
                      }}
                    />
                    <span
                      className="relative h-4 w-4 rounded-full"
                      style={{ background: dim.core }}
                    />
                  </span>
                  <div>
                    <div className="font-serif text-[22px] font-semibold leading-none text-ink">
                      {dim.label}
                    </div>
                    <div className="mt-[3px] text-[13px] font-semibold text-clay">
                      {words[i]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {done && (
          <Link
            href="/chat"
            className="mt-auto block w-full rounded-[16px] border-[1.5px] border-olive bg-ink p-[17px] text-center font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition-[transform,background-color] duration-300 hover:-translate-y-px hover:bg-olive"
          >
            Talk with Florence
          </Link>
        )}
      </div>

      <NavMenu />
    </PhoneFrame>
  );
}

function Slider({
  label,
  word,
  pct,
  onChange,
}: {
  label: string;
  word: string;
  pct: number;
  onChange: (p: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onChange(((clientX - r.left) / r.width) * 100);
  };

  return (
    <div>
      <div className="mb-[13px] flex items-baseline justify-between">
        <span className="font-serif text-[20px] font-semibold text-ink">{label}</span>
        <span className="text-[13px] font-semibold text-clay">{word}</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-1 cursor-pointer rounded-[2px] bg-olive/16 touch-none"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) update(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 rounded-[2px] bg-paper transition-[width] duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_7px_rgba(58,53,46,0.22),0_0_0_1px_rgba(92,107,67,0.18)] transition-[left] duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

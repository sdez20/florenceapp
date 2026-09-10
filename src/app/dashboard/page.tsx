"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredName, firstNameOf } from "@/lib/user";
import { getProfile } from "@/lib/profile";
import { greetingForZone, deviceTimezone } from "@/lib/timezone";

// The dashboard (build file 07), plus the arrival sequence into it.
//
// On a FRESH open of the app a signed-in woman is met by the greeting, which
// settles in, waits for a tap (or nine seconds), fades out, and then the
// dashboard's own blocks arrive one after another. It runs ONCE PER SESSION:
// navigating back to the dashboard from elsewhere goes straight there, no
// greeting. If prefers-reduced-motion is on, everything appears at once.

const ARRIVED_KEY = "florence:arrived";
type Phase = "init" | "greeting" | "fadeout" | "revealing" | "done";

export default function DashboardPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [greeting, setGreeting] = useState("Good morning");
  const [phase, setPhase] = useState<Phase>("init");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const advancing = useRef(false);

  // Name and greeting, from her stored zone. Re-check the greeting whenever she
  // returns to the app, so 11:58 → 12:05 flips morning to afternoon.
  useEffect(() => {
    setFirstName(firstNameOf(getStoredName()));
    const zone = getProfile().timezone || deviceTimezone();
    setGreeting(greetingForZone(zone));
    const onVis = () => {
      if (document.visibilityState === "visible") setGreeting(greetingForZone(zone));
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Decide whether the arrival plays (client-only, so no hydration mismatch).
  useEffect(() => {
    const t = timers.current;
    let reduced = false;
    let arrived = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}
    try {
      arrived = sessionStorage.getItem(ARRIVED_KEY) === "1";
    } catch {}
    if (reduced || arrived) {
      setPhase("done");
      return;
    }
    // Mark arrived immediately, so leaving mid-greeting and coming back does not replay it.
    try {
      sessionStorage.setItem(ARRIVED_KEY, "1");
    } catch {}
    setPhase("greeting");
    const auto = setTimeout(advance, 9000); // advances by itself if she does nothing
    t.push(auto);
    return () => {
      t.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function advance() {
    if (advancing.current) return;
    advancing.current = true;
    setPhase("fadeout"); // greeting fades over 700ms
    // 700ms fade, then 420ms of nothing, then the blocks arrive
    timers.current.push(setTimeout(() => setPhase("revealing"), 700 + 420));
    // settle to a plain, non-animating state once the stagger has finished
    timers.current.push(setTimeout(() => setPhase("done"), 700 + 420 + 3 * 120 + 700 + 60));
  }

  const hidden = phase === "init" || phase === "greeting" || phase === "fadeout";
  const revealStyle = (i: number): React.CSSProperties | undefined =>
    phase === "revealing" ? { animation: `flo-reveal 700ms ease ${i * 120}ms both` } : undefined;

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-ground font-body">
      {(phase === "greeting" || phase === "fadeout") && (
        <div
          onClick={advance}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-ground px-8"
          style={phase === "fadeout" ? { animation: "flo-fade 700ms ease forwards" } : undefined}
        >
          <div
            className="text-center font-display text-[29px] font-normal leading-[1.18] text-ink"
            style={{ animation: "flo-rise 900ms cubic-bezier(.2,.7,.3,1) 260ms both" }}
          >
            {greeting},
            <br />
            <span className="italic text-accent">{firstName || "there"}.</span>
          </div>
          <div
            className="absolute bottom-[58px] font-body text-[10px] uppercase tracking-[0.24em] text-ink-soft"
            style={{ animation: "flo-cue 2.6s ease-in-out 2.2s infinite" }}
          >
            tap anywhere
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col px-6 pt-[46px]">
        <div className="shrink-0 text-center font-display text-[15px] font-normal tracking-[0.34em] text-ink opacity-45 [text-indent:0.34em]">
          Florence
        </div>

        <div className="mt-10 flex-1 overflow-y-auto pb-10 [scrollbar-width:none]">
          {/* the greeting block */}
          <div className={hidden ? "opacity-0" : ""} style={revealStyle(0)}>
            <div className="text-[9px] font-medium uppercase tracking-[0.28em] text-sage">
              Welcome back
            </div>
            <h1 className="mt-4 font-display text-[29px] font-normal leading-[1.18] text-ink">
              {greeting}, <em className="italic text-accent">{firstName || "there"}</em>.
            </h1>
            <p className="mt-4 text-[15px] font-light leading-[1.62] text-ink-soft">
              Everything you have told Florence, kept in one place. Pick up where you left off.
            </p>
          </div>

          {/* the continue card */}
          <div className={hidden ? "opacity-0" : ""} style={revealStyle(1)}>
            <div className="mt-10 flex items-start gap-[18px] border border-line bg-card px-5 py-[22px]">
              <div className="relative shrink-0 basis-[78px]">
                <svg viewBox="0 0 78 78" className="h-[78px] w-[78px] -rotate-90">
                  <circle cx="39" cy="39" r="33" fill="none" stroke="#E8E5DC" strokeWidth="7" />
                  <circle
                    cx="39"
                    cy="39"
                    r="33"
                    fill="none"
                    stroke="#4A5340"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="207"
                    strokeDashoffset="78"
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="font-display text-[21px] font-normal leading-none text-ink">21</div>
                    <div className="mt-[3px] text-[7px] font-medium uppercase tracking-[0.2em] text-ink-soft">
                      of thirty
                    </div>
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-[19px] font-normal leading-[1.24] text-ink">
                  Plants this week
                </h2>
                <p className="mt-2 text-[11.5px] font-light leading-[1.7] text-ink-soft">
                  Nine more before Sunday. The herbs in your green seasoning already counted.
                </p>
              </div>
            </div>
          </div>

          {/* the button */}
          <div className={hidden ? "opacity-0" : ""} style={revealStyle(2)}>
            <button
              type="button"
              onClick={() => router.push("/chat")}
              className="mt-4 w-full border-none bg-ink py-[15px] font-body text-[9px] font-medium uppercase tracking-[0.26em] text-ground transition-opacity hover:opacity-[0.87]"
            >
              Talk with Florence
            </button>
          </div>

          {/* the record */}
          <div className={hidden ? "opacity-0" : ""} style={revealStyle(3)}>
            <div className="mb-6 mt-12 text-center font-display text-[23px] font-normal text-ink">
              This week
            </div>

            <Entry
              day="Wednesday"
              name="Nutrition"
              note="Warm food while you were bleeding. Meals at regular times on the busy days."
              tag="Holistic nutrition"
              status="Three notes"
              done
            />
            <Entry
              day="Tuesday"
              name="Nervous system"
              note="Four in, six out before the meeting. Chamomile in the evening."
              tag="Somatic"
              status="One practice"
              done
            />
            <Entry
              day="Today"
              name="Nothing yet"
              note="Tell Florence what is happening and it will appear here."
              status="Not started"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Entry({
  day,
  name,
  note,
  tag,
  status,
  done = false,
}: {
  day: string;
  name: string;
  note: string;
  tag?: string;
  status: string;
  done?: boolean;
}) {
  return (
    <div className="mb-4 border border-line bg-ground px-[18px] py-5">
      <div className="font-display text-[13px] italic text-sage">{day}</div>
      <h3 className="mt-[5px] font-body text-[16px] font-medium leading-[1.25] text-ink">{name}</h3>
      <p className="mt-2 text-[11.5px] font-light leading-[1.65] text-ink-soft">{note}</p>
      {tag && (
        <span className="mt-4 inline-block bg-card px-3 py-[6px] text-[8.5px] font-medium uppercase tracking-[0.18em] text-accent">
          {tag}
        </span>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span
          className={`text-[9px] font-medium uppercase tracking-[0.22em] ${
            done ? "text-accent" : "text-ink-soft"
          }`}
        >
          {status}
        </span>
        {done ? (
          <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-accent text-[11px] text-ground">
            ✓
          </span>
        ) : (
          <span className="grid h-[22px] w-[22px] place-items-center rounded-full border border-line" />
        )}
      </div>
    </div>
  );
}

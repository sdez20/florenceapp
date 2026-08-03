"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";
import { cta } from "@/components/ui";
import { getProfile } from "@/lib/profile";
import { getCycle, saveCycle, type Regularity } from "@/lib/cycle-store";
import { cyc, fmt, PHASES, PHASE_LABEL, dishFor } from "@/lib/florence-cycle";

const REG_OPTS: { value: Regularity; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "irregular", label: "Irregular" },
  { value: "very-irregular", label: "Very irregular" },
];

export default function CyclePage() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [length, setLength] = useState(28);
  const [regularity, setRegularity] = useState<Regularity>("regular");
  const [culture, setCulture] = useState("");
  const [gated, setGated] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    setCulture(profile.culture ?? "");
    // Pregnancy, postpartum, and trying-to-conceive: her body isn't cycling and
    // Florence defers to her doctor or midwife (safety gate).
    setGated(/pregnan|postpartum|trying to conceive/i.test(profile.season ?? ""));
    const c = getCycle();
    if (c.lastPeriod) setDate(new Date(c.lastPeriod + "T00:00:00"));
    if (c.cycleLength) setLength(c.cycleLength);
    if (c.regularity) setRegularity(c.regularity);
  }, []);

  if (gated) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col px-7 pb-8 pt-14">
          <BackLink href="/dashboard" />
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="mb-3 font-serif text-[26px] font-medium leading-[1.15] text-ink">
              This season is different
            </h1>
            <p className="text-[14px] font-light leading-[1.65] text-ink-soft">
              Your body isn&apos;t moving through a monthly cycle right now, so
              Florence leaves the specifics of this season to your doctor or
              midwife, who know you and can guide you safely. She&apos;s here for
              everything else, any time.
            </p>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  const result = date ? cyc(fmt(date), length) : null;
  const phase = result?.phase ?? null;
  const dish = phase ? dishFor(culture, phase) : null;

  const save = () => {
    if (!date) return;
    saveCycle({ lastPeriod: fmt(date), cycleLength: length, regularity });
    router.push("/dashboard");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-7 pb-8 pt-14">
        <BackLink href="/dashboard" />
        <h1 className="mb-1 font-serif text-[26px] font-medium leading-[1.15] text-ink">
          Where are you in your cycle?
        </h1>
        <p className="mb-5 text-[13.5px] font-light leading-[1.6] text-ink-soft">
          Tap the first day of your last period, and Florence will meet you where
          your body is this week.
        </p>

        {/* Calendar */}
        <div className="flo-cal mb-6 rounded-[18px] border-[1.5px] border-olive/18 bg-paper p-3">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ after: new Date() }}
            defaultMonth={date}
          />
        </div>

        {/* Cycle length */}
        <label className="mb-2 block text-[12px] font-medium tracking-[0.04em] text-ink-soft">
          Your usual cycle length
        </label>
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setLength((n) => Math.max(20, n - 1))}
            className="h-10 w-10 rounded-full border-[1.5px] border-olive/25 text-[18px] text-ink transition-colors hover:bg-blush"
            aria-label="Fewer days"
          >
            −
          </button>
          <div className="min-w-[92px] text-center font-serif text-[22px] text-ink">
            {length} <span className="text-[14px] text-ink-soft">days</span>
          </div>
          <button
            type="button"
            onClick={() => setLength((n) => Math.min(45, n + 1))}
            className="h-10 w-10 rounded-full border-[1.5px] border-olive/25 text-[18px] text-ink transition-colors hover:bg-blush"
            aria-label="More days"
          >
            +
          </button>
        </div>

        {/* Regularity */}
        <label className="mb-2 block text-[12px] font-medium tracking-[0.04em] text-ink-soft">
          Are your cycles regular?
        </label>
        <div className="mb-6 flex gap-2">
          {REG_OPTS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setRegularity(o.value)}
              className={`flex-1 rounded-[13px] border-[1.5px] px-2 py-3 text-[13px] font-medium transition-colors ${
                regularity === o.value
                  ? "border-forest bg-forest text-white"
                  : "border-olive/20 text-ink hover:border-clay-soft"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Phase result */}
        {phase && dish && (
          <div className="mb-6 rounded-[18px] border-[1.5px] border-olive/18 bg-paper p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-forest">
              {PHASE_LABEL[phase]} phase
            </p>
            <h2 className="mb-2 font-serif text-[22px] font-medium text-ink">
              {PHASES[phase].subtitle}
            </h2>

            {regularity !== "regular" && (
              <p className="mb-3 rounded-[12px] bg-blush px-3 py-2.5 text-[12.5px] font-light leading-[1.55] text-ink-soft">
                {regularity === "very-irregular"
                  ? "Because your cycles are very irregular, this is a rough estimate. Ongoing irregularity can have an underlying cause worth understanding, so it's a good idea to check in with your doctor rather than rely on an estimate alone."
                  : "Because your cycles are irregular, treat this as a gentle estimate. If they stay irregular, it's worth mentioning to your doctor."}
              </p>
            )}

            <p className="mb-3 text-[13.5px] font-light leading-[1.62] text-ink-soft">
              {PHASES[phase].hormone} {PHASES[phase].gut}
            </p>

            <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-sage">
              Eating for this week
            </p>
            <p className="mb-1 text-[14px] font-light leading-[1.6] text-ink">
              {dish.main}
            </p>
            <p className="text-[13px] font-light italic leading-[1.55] text-ink-soft">
              {dish.why}
            </p>

            <p className="mt-4 border-t border-olive/12 pt-3 text-[12px] font-light leading-[1.55] text-ink-soft">
              These are gentle ideas for nourishment and care, not medical advice.
              If anything feels off in your body, Florence would rather you talk it
              through with your doctor.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={save}
          disabled={!date}
          className={`${cta} mt-auto disabled:opacity-50`}
        >
          Save my cycle
        </button>
      </div>
    </PhoneFrame>
  );
}

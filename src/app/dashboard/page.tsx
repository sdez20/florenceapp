"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import NavMenu from "@/components/NavMenu";
import DailyMessage from "@/components/DailyMessage";
import { domains } from "@/lib/domains";
import { getProfile } from "@/lib/profile";
import { getCycle } from "@/lib/cycle-store";
import { getStoredName, firstNameOf } from "@/lib/user";
import { cyc, dishFor, PHASE_LABEL, type PhaseKey } from "@/lib/florence-cycle";

type FoodCard =
  | { kind: "gated" }
  | { kind: "setup" }
  | { kind: "phase"; phase: PhaseKey; main: string; why: string; estimate: boolean };

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("");
  const [food, setFood] = useState<FoodCard>({ kind: "setup" });

  useEffect(() => {
    setFirstName(firstNameOf(getStoredName()));
    const profile = getProfile();
    const season = profile.season ?? "";
    // Pregnancy, postpartum, and trying-to-conceive: Florence defers food
    // specifics to her doctor or midwife (safety gate), no specifics shown.
    if (/pregnan|postpartum|trying to conceive/i.test(season)) {
      setFood({ kind: "gated" });
      return;
    }
    const c = getCycle();
    if (c.lastPeriod && c.cycleLength) {
      const { phase } = cyc(c.lastPeriod, c.cycleLength);
      const dish = dishFor(profile.culture ?? "", phase);
      // Irregular cycles: the phase is an estimate; the card says so gently.
      const estimate = c.regularity === "irregular" || c.regularity === "very-irregular";
      setFood({ kind: "phase", phase, main: dish.main, why: dish.why, estimate });
    } else {
      setFood({ kind: "setup" });
    }
  }, []);

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-24 pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
          Your space
        </p>
        <h1 className="mb-5 font-serif text-[30px] font-medium leading-[1.1] text-ink">
          {firstName ? `Hello, ${firstName}` : "Hello"}
        </h1>

        {/* Clear way into the conversation */}
        <Link
          href="/chat"
          className="mb-5 block w-full rounded-[16px] bg-ink py-4 text-center font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-paper no-underline transition-colors hover:bg-olive"
        >
          Talk with Florence
        </Link>

        {/* Eating for your phase — pulled from the cultural food maps */}
        <Link
          href="/cycle"
          className="mb-4 block rounded-[18px] border-[1.5px] border-forest/25 bg-paper p-5 no-underline transition-colors hover:bg-blush"
        >
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-forest">
            {food.kind === "phase"
              ? `Eating for your ${PHASE_LABEL[food.phase].toLowerCase()} week`
              : "Eating for your cycle"}
          </p>
          {food.kind === "phase" && (
            <>
              <p className="mb-1 font-serif text-[19px] font-medium leading-[1.25] text-ink">
                {food.main}
              </p>
              <p className="text-[13px] font-light italic leading-[1.5] text-ink-soft">
                {food.why}
              </p>
              {food.estimate && (
                <p className="mt-2 text-[12px] font-light leading-[1.5] text-ink-soft">
                  A gentle estimate, since your cycles vary. If they stay
                  irregular, it&apos;s worth a word with your doctor.
                </p>
              )}
            </>
          )}
          {food.kind === "setup" && (
            <p className="font-serif text-[18px] font-medium leading-[1.3] text-ink">
              Tap to set your cycle, and Florence will nourish you for the week
              your body is in.
            </p>
          )}
          {food.kind === "gated" && (
            <p className="font-serif text-[17px] font-medium leading-[1.35] text-ink">
              This season, Florence leaves the food specifics to your doctor or
              midwife, who know you and your pregnancy. She&apos;s here for
              everything else.
            </p>
          )}
        </Link>

        {/* Focus-area cards */}
        <p className="mb-3 mt-3 text-[12px] font-medium tracking-[0.04em] text-ink-soft">
          Your focus areas
        </p>
        <div className="grid grid-cols-2 gap-3">
          {domains.map((d) => (
            <Link
              key={d.slug}
              href={`/explore/${d.slug}`}
              className="flex aspect-square flex-col justify-between rounded-[18px] border-[1.5px] border-olive/18 bg-paper p-4 no-underline transition-colors hover:border-clay-soft"
            >
              <span className="font-serif text-[18px] font-medium leading-[1.15] text-ink">
                {d.title}
              </span>
              <span className="text-[11.5px] font-light leading-[1.4] text-ink-soft">
                {d.cardSub}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <NavMenu />
      {/* Florence's daily message as a closeable pop-up over the dashboard */}
      <DailyMessage />
    </PhoneFrame>
  );
}

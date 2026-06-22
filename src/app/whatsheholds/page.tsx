import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta } from "@/components/ui";

export default function WhatSheHoldsPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-7 pt-14">
        <div className="flex flex-1 flex-col justify-center py-6">
          <p className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
            What she holds
          </p>
          <h1 className="mb-[18px] font-serif text-[32px] font-medium leading-[1.1] text-ink">
            Florence asked&hellip;
          </h1>
          <p className="mb-8 text-[14px] font-light leading-[1.7] text-ink-soft">
            Your season and life stage are how she knows what your body is carrying
            right now. Your region tells her how you live and where to send you if
            you ever need help close to home. Your heritage lets her honor where you
            come from, and your birthday is hers to remember, so you don&apos;t spend
            it unseen.
          </p>

          <div className="rounded-[22px] bg-blush p-6">
            <div className="mb-[9px] font-serif text-[23px] font-semibold leading-[1.2] text-ink">
              You can change anything, any time.
            </div>
            <p className="text-[13.5px] font-light leading-[1.6] text-ink">
              Update your season, life stage, region, lifestyle, and nutrition at any
              time.
            </p>
          </div>
        </div>

        <Link href="/howto" className={`${cta} flex-shrink-0`}>
          I&apos;m ready
        </Link>
      </div>
    </PhoneFrame>
  );
}

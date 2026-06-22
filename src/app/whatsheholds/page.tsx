import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta } from "@/components/ui";

const items = [
  {
    label: "Your season and life stage",
    text: "This helps Florence understand exactly what your body is carrying right now.",
  },
  {
    label: "Your region",
    text: "This gives her context on how you live and helps her guide you to local resources if you ever need care close to home.",
  },
  {
    label: "Your heritage",
    text: "Knowing your roots allows Florence to honor and respect where you come from.",
  },
  {
    label: "Your birthday",
    text: "So Florence can celebrate your day with you and make sure you always feel seen.",
  },
];

export default function WhatSheHoldsPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-7 pt-14">
        <div className="flex flex-1 flex-col justify-center py-6">
          <h1 className="mb-[18px] font-serif text-[32px] font-medium leading-[1.1] text-ink">
            What Florence holds
          </h1>

          <ul className="mb-8 flex flex-col gap-4">
            {items.map((item) => (
              <li
                key={item.label}
                className="text-[14px] font-light leading-[1.7] text-ink-soft"
              >
                <strong className="font-semibold text-ink">{item.label}:</strong>{" "}
                {item.text}
              </li>
            ))}
          </ul>

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

import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta, eyebrow } from "@/components/ui";

const points = [
  "Florence saves your email so you can sign in, some basic information about you, including anything you choose to share about your health, and your past conversations so you can revisit them anytime.",
  "She never tracks your weight, calories, food, or measurements.",
  "Your information is never sold, shared for advertising, or handed to anyone. It's only used for Florence to help you.",
  "You can view or download your information anytime, or delete your account whenever you want.",
  "Everything you share is encrypted and protected.",
];

export default function ConsentPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-hidden px-8 pt-16">
        <p className={`${eyebrow} mb-4 tracking-[0.3em]`}>Florence</p>
        <h1 className="mb-2 font-serif text-[34px] font-medium leading-[1.1] text-ink">
          Before we begin
        </h1>
        <p className="mb-6 max-w-[34ch] text-[14px] font-light leading-[1.6] text-ink-soft">
          Here&apos;s how your privacy is protected.
        </p>

        <div className="flex flex-1 flex-col overflow-y-auto pr-1.5">
          <ul className="flex flex-col gap-[15px]">
            {points.map((point) => (
              <li
                key={point}
                className="flex gap-[11px] text-[13.5px] font-light leading-[1.6] text-ink-soft"
              >
                <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clay-soft" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-[18px] text-[13px] font-semibold text-clay no-underline"
          >
            Read the full privacy policy &rsaquo;
          </a>
        </div>
      </div>

      <div className="flex-shrink-0 bg-paper px-8 pb-[30px] pt-2">
        <Link href="/signup" className={cta}>
          I agree, let&apos;s begin
        </Link>
      </div>
    </PhoneFrame>
  );
}

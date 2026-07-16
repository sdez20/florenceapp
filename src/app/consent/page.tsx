import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta, eyebrow } from "@/components/ui";

const blocks = [
  {
    title: "What Florence keeps",
    body: "Florence saves your email so you can sign in, some basic information about you, and your past conversations so you can revisit them anytime.",
  },
  {
    title: "What Florence never keeps",
    body: "She never tracks your weight, calories, food, or measurements.",
  },
  {
    title: "What Florence will never do",
    body: "Your information is never sold, shared for advertising, or handed to anyone. It's only used for Florence to help you.",
  },
  {
    title: "What is always yours",
    body: "You can view or download your information anytime, or delete your account whenever you want. Deleting it erases everything.",
  },
  {
    title: "How it is kept",
    body: "Everything you share is encrypted and protected.",
  },
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
          Florence is a private place. Before you share anything, here is how
          your privacy is protected.
        </p>

        <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto pr-1.5">
          {blocks.map((block) => (
            <div key={block.title}>
              <div className="mb-[5px] flex items-center gap-[9px] font-serif text-[18px] font-semibold text-ink">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clay-soft" />
                {block.title}
              </div>
              <p className="pl-[15px] text-[13.5px] font-light leading-[1.62] text-ink-soft">
                {block.body}
              </p>
            </div>
          ))}
          <a
            href="#"
            className="pl-[15px] text-[13px] font-semibold text-clay no-underline"
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

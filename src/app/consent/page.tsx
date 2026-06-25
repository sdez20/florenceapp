import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta, eyebrow } from "@/components/ui";

const blocks = [
  {
    title: "What Florence keeps",
    body: "Your email, so you can sign in. Your season and a little about you, so Florence can meet you where you are. Your check-ins and conversations, so you can look back and see yourself over time.",
  },
  {
    title: "What Florence never keeps",
    body: "No weight, no calories, no food logs, no measurements. Florence is about how you feel, not numbers about your body.",
  },
  {
    title: "What Florence will never do",
    body: "We do not sell your data. We do not share it for advertising. We do not hand it to anyone or use it for anything beyond Florence being here for you.",
  },
  {
    title: "What is always yours",
    body: "You can see everything Florence holds, and take a copy whenever you want. You can delete your account at any time. When you do, your information is removed right away and fully cleared from our systems shortly after.",
  },
  {
    title: "How it is kept",
    body: "Your data is encrypted and protected, and only you can ever see it.",
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
          Florence is a private place. Before you share anything, here is exactly
          how your trust is held.
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

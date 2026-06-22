import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta } from "@/components/ui";

const rows = [
  { n: "i", title: "Start with a check-in", d: "Tell her how you're feeling today." },
  { n: "ii", title: "Then talk", d: "Say what's on your mind and how you're feeling." },
  {
    n: "iii",
    title: "Reflect",
    d: "View your chats, days, weeks, and months when you want to see how far you've come.",
  },
];

export default function HowToPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-7 pt-14">
        <div className="flex flex-1 flex-col justify-center py-6">
          <p className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
            A few words first
          </p>
          <h1 className="mb-[6px] font-serif text-[32px] font-medium leading-[1.1] text-ink">
            How Florence works.
          </h1>

          <div className="mt-7 flex flex-col gap-4">
            {rows.map((row) => (
              <div key={row.n} className="flex items-start gap-[14px]">
                <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-clay-soft font-serif text-[18px] italic text-clay">
                  {row.n}
                </div>
                <div>
                  <div className="font-serif text-[19px] font-semibold leading-[1.2] text-ink">
                    {row.title}
                  </div>
                  <div className="mt-[3px] text-[13px] font-light leading-[1.55] text-ink-soft">
                    {row.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/today" className={`${cta} flex-shrink-0`}>
          I&apos;m ready
        </Link>
      </div>
    </PhoneFrame>
  );
}

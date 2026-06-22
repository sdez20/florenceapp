import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta, eyebrow } from "@/components/ui";

type Block = {
  title: string;
  body?: string;
  items?: { label?: string; text: string }[];
};

const blocks: Block[] = [
  {
    title: "Data we retain to support you",
    items: [
      { label: "Authentication", text: "Your email address for secure account access." },
      { label: "Personalization", text: "Insights about your current season of life to guide our interactions." },
      { label: "Reflection", text: "A secure log of your check-ins and conversations so you can review your progress." },
    ],
  },
  {
    title: "Data we explicitly do not collect",
    body: "Florence is metric-free. We never track weight, calories, food, or physical measurements. We prioritize your emotional well-being over physical numbers.",
  },
  {
    title: "Our privacy guarantees",
    items: [
      { text: "We do not monetize, sell, or trade your data." },
      { text: "We do not share information with advertisers or external parties." },
    ],
  },
  {
    title: "Your data rights",
    items: [
      { label: "Data Portability", text: "Access and export a full copy of your retained information at any time." },
      { label: "Account Deletion", text: "Deleting your account triggers immediate removal of your data, followed by a permanent, complete purge from our storage infrastructure shortly after." },
    ],
  },
  {
    title: "Security infrastructure",
    body: "All data is encrypted both in transit and at rest, ensuring absolute confidentiality. Your records are strictly restricted to your private access.",
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
          Before you get started, we want you to know how your privacy is
          protected. Florence is a confidential environment built on absolute
          trust.
        </p>

        <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto pr-1.5">
          {blocks.map((block) => (
            <div key={block.title}>
              <div className="mb-[5px] flex items-center gap-[9px] font-serif text-[18px] font-semibold text-ink">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clay-soft" />
                {block.title}
              </div>

              {block.body && (
                <p className="pl-[15px] text-[13.5px] font-light leading-[1.62] text-ink-soft">
                  {block.body}
                </p>
              )}

              {block.items && (
                <ul className="flex flex-col gap-[6px] pl-[15px]">
                  {block.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-[13.5px] font-light leading-[1.62] text-ink-soft"
                    >
                      {item.label && (
                        <strong className="font-semibold text-ink">
                          {item.label}:
                        </strong>
                      )}{" "}
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <a
            href="#"
            className="pl-[15px] text-[13px] font-semibold text-clay no-underline"
          >
            Review our full Privacy Policy &rsaquo;
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

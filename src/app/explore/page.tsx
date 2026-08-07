import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import NavMenu from "@/components/NavMenu";
import BackLink from "@/components/BackLink";
import { domains } from "@/lib/domains";

export default function ExplorePage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-4 pt-14">
        <div className="mb-1.5 flex items-center gap-[13px]">
          <BackLink href="/dashboard" />
          <span className="font-serif text-[32px] font-semibold text-ink">
            Explore
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-[14px]">
          {domains.map((d) => (
            <Link
              key={d.slug}
              href={`/explore/${d.slug}`}
              className="mb-[11px] block rounded-[18px] border border-olive/15 px-5 py-[18px] no-underline transition-[transform,border-color] duration-[250ms] hover:-translate-y-0.5 hover:border-clay-soft"
            >
              <div className="font-serif text-[20px] font-semibold text-ink">
                {d.title}
              </div>
              <div className="mt-[3px] text-[12.5px] font-light leading-[1.5] text-ink-soft">
                {d.cardSub}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <NavMenu />
    </PhoneFrame>
  );
}

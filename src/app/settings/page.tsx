import Link from "next/link";
import type { ReactNode } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import NavMenu from "@/components/NavMenu";
import BackLink from "@/components/BackLink";
import StoredName from "@/components/StoredName";
import ProfileField from "@/components/ProfileField";
import SignOutRow from "@/components/SignOutRow";
import DailyMessageSetting from "@/components/DailyMessageSetting";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-clay first:mt-0">
      {children}
    </div>
  );
}

function Row({
  k,
  sub,
  cur,
  href,
  danger,
}: {
  k: string;
  sub?: ReactNode;
  cur?: string;
  href?: string;
  danger?: boolean;
}) {
  const inner = (
    <>
      <div className="flex min-w-0 flex-col">
        <span
          className={`font-serif text-[18px] font-semibold leading-[1.15] ${
            danger ? "text-clay" : "text-ink"
          }`}
        >
          {k}
        </span>
        {sub && (
          <span className="mt-0.5 truncate text-[12px] font-light text-ink-soft">
            {sub}
          </span>
        )}
      </div>
      <div className="ml-[14px] flex flex-shrink-0 items-center gap-2">
        {cur && <span className="text-[13px] font-medium text-clay">{cur}</span>}
        <span className="text-[18px] text-clay-soft">&rsaquo;</span>
      </div>
    </>
  );

  const className =
    "flex items-center justify-between rounded-[14px] border border-olive/16 bg-transparent p-4 no-underline transition-colors hover:border-clay-soft hover:bg-sage/14";

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={`${className} cursor-pointer`}>{inner}</div>
  );
}

export default function SettingsPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-4 pt-14">
        <div className="mb-7 flex items-center gap-[13px]">
          <BackLink href="/dashboard" />
          <span className="font-serif text-[32px] font-semibold text-ink">
            Settings
          </span>
        </div>

        <SectionLabel>Your story</SectionLabel>
        <div className="flex flex-col gap-[10px]">
          <Row
            k="See how far you've come"
            sub="Your days, weeks, and months"
            href="/story"
          />
        </div>

        <SectionLabel>Where you are</SectionLabel>
        <div className="flex flex-col gap-[10px]">
          <Row
            k="Season"
            sub={<ProfileField field="season" fallback="Not set yet" />}
            cur="Change"
          />
          <Row k="Life stage" sub="Command years" cur="Change" />
          <Row
            k="Region"
            sub={<ProfileField field="region" fallback="Not set yet" />}
            cur="Change"
          />
        </div>

        <SectionLabel>How you live</SectionLabel>
        <div className="flex flex-col gap-[10px]">
          <Row k="Lifestyle" sub="Pace, work, rest, movement" />
          <Row k="Nutrition" sub="Your food preferences & traditions" />
        </div>

        <SectionLabel>You</SectionLabel>
        <div className="flex flex-col gap-[10px]">
          <Row k="Name" sub={<StoredName fallback="Your name" />} />
          <Row
            k="Birthday"
            sub={<ProfileField field="birthday" fallback="Not set yet" />}
          />
          <Row
            k="Heritage"
            sub={<ProfileField field="culture" fallback="Not set yet" />}
          />
          <Row
            k="Conditions"
            sub={<ProfileField field="conditions" fallback="Nothing shared" />}
          />
          <Row
            k="Surgeries"
            sub={<ProfileField field="surgeries" fallback="Nothing shared" />}
          />
          <Row
            k="Language"
            sub={<ProfileField field="language" fallback="English" />}
          />
        </div>

        <SectionLabel>Daily message from Florence</SectionLabel>
        <DailyMessageSetting />

        <SectionLabel>Your account</SectionLabel>
        <div className="flex flex-col gap-[10px]">
          <Row k="Privacy & data" sub="See, export, or delete your data" />
          <SignOutRow />
        </div>

        <SectionLabel>Legal &amp; safety</SectionLabel>
        <div className="flex flex-col gap-[10px]">
          <Row k="Safety & Support" sub="Crisis and support resources" href="/safety" />
          <Row k="Privacy Policy" href="/legal/privacy" />
          <Row k="Terms of Service" href="/legal/terms" />
          <Row k="Medical Disclaimer" href="/legal/medical-disclaimer" />
        </div>

        <div className="mt-6 text-center text-[12px] font-light leading-[1.55] text-ink-soft">
          Update anything whenever you need.
          <br />
          Florence moves with you.
        </div>
      </div>

      <NavMenu />
    </PhoneFrame>
  );
}

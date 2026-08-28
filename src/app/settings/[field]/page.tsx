import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";

// Placeholder editor for a single settings field. The real edit sheets and the
// grouped profile pages (About you, Your body, How you live) aren't designed
// yet, so for now every settings row lands here instead of doing nothing.

const LABELS: Record<string, string> = {
  season: "Season",
  "life-stage": "Life stage",
  region: "Region",
  lifestyle: "Lifestyle",
  nutrition: "Nutrition",
  name: "Name",
  birthday: "Birthday",
  heritage: "Heritage",
  conditions: "Conditions",
  surgeries: "Surgeries",
  language: "Language",
  "privacy-data": "Privacy and data",
};

export default async function SettingsFieldPage({
  params,
}: {
  params: Promise<{ field: string }>;
}) {
  const { field } = await params;
  const label = LABELS[field] ?? "This setting";

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-[30px] pb-4 pt-14">
        <div className="mb-7 flex items-center gap-[13px]">
          <BackLink href="/settings" />
          <span className="font-serif text-[32px] font-semibold text-ink">
            {label}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <p className="text-[15px] font-light leading-[1.62] text-ink-soft">
            You&apos;ll be able to update your {label.toLowerCase()} here soon.
            This part is still being built.
          </p>
          <Link
            href="/settings"
            className="mt-6 text-[13.5px] font-semibold text-clay no-underline"
          >
            Back to settings
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneFrame from "@/components/PhoneFrame";
import CountrySelect from "@/components/CountrySelect";
import { cta } from "@/components/ui";
import { saveProfile } from "@/lib/profile";

const seasons = [
  { label: "Cycling", d: "Your body runs on a monthly rhythm, period or not" },
  { label: "Trying to conceive", d: "Hoping for a pregnancy" },
  { label: "Pregnant", d: "Carrying, in any trimester" },
  { label: "Postpartum", d: "The months and year after birth" },
  { label: "Perimenopause", d: "The change, beginning" },
  { label: "Menopause & after", d: "Through and beyond" },
];

const sources = [
  { label: "A friend told me" },
  { label: "Instagram" },
  { label: "A podcast or article" },
  { label: "My coach or practitioner" },
  { label: "Searching for something like this" },
];

const stepLabel =
  "mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay";
const heading =
  "mb-[22px] font-serif text-[20px] font-medium leading-[1.2] text-ink";
const fieldLabel = "mb-[7px] block pl-0.5 text-[12px] font-medium text-ink-soft";
const fieldInput =
  "w-full rounded-[13px] border-[1.5px] border-olive/22 bg-transparent px-4 py-[14px] font-sans text-[14.5px] text-ink placeholder:text-ink-soft/55 focus:border-clay focus:outline-none";

function Option({
  label,
  d,
  selected,
  onClick,
}: {
  label: string;
  d?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] border-[1.5px] px-4 py-[14px] text-left font-serif text-[18px] font-medium text-ink transition-colors ${
        selected ? "border-clay bg-blush" : "border-olive/20 hover:border-clay-soft"
      }`}
    >
      {label}
      {d && (
        <span className="mt-0.5 block font-sans text-[11.5px] font-light text-ink-soft">
          {d}
        </span>
      )}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [season, setSeason] = useState(0);
  const [source, setSource] = useState(1);
  // No default region. She must choose, so her profile never silently claims a
  // country she isn't in — this is what routes crisis support to the right place.
  const [region, setRegion] = useState("");
  const [culture, setCulture] = useState("");
  const [birthday, setBirthday] = useState("");
  const [conditions, setConditions] = useState("");
  const [surgeries, setSurgeries] = useState("");

  // She can't leave the region step until she has chosen one — a blank region
  // is never saved, so Florence is never left guessing her country.
  const canContinue = step !== 1 || region !== "";

  const next = () => {
    if (!canContinue) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    // Save her real answers so the app shows her own data (DB comes next).
    saveProfile({
      season: seasons[season].label,
      region,
      // Florence only speaks English right now, so language isn't asked.
      language: "English",
      culture,
      birthday,
      conditions,
      surgeries,
      source: sources[source].label,
    });
    router.push("/consent-gate");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-7 pt-14">
        {/* progress dots */}
        <div className="flex gap-[7px]">
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              className={`h-[3px] w-6 rounded-[2px] ${
                i <= step ? "bg-clay" : "bg-olive/18"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-center py-6">
          {step === 0 && (
            <>
              <p className={stepLabel}>To begin</p>
              <h1 className={heading}>What stage is your body in right now?</h1>
              <div className="flex flex-col gap-[9px]">
                {seasons.map((s, i) => (
                  <Option
                    key={s.label}
                    label={s.label}
                    d={s.d}
                    selected={season === i}
                    onClick={() => setSeason(i)}
                  />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className={heading}>A little about you.</h1>
              <div className="mb-[18px]">
                <label className={fieldLabel}>
                  What is your cultural background or heritage?
                </label>
                <input
                  type="text"
                  placeholder="However you'd describe it"
                  className={fieldInput}
                  value={culture}
                  onChange={(e) => setCulture(e.target.value)}
                />
              </div>
              <div className="mb-[18px]">
                <label className={fieldLabel}>Where do you live?</label>
                {/* Required (enforced by canContinue). Her country feeds
                    personalization and the safety and region routing, so it is an
                    explicit choice saved clearly to her profile. */}
                <CountrySelect
                  value={region}
                  onChange={setRegion}
                  inputClassName={fieldInput}
                />
              </div>
              <div className="mb-[18px]">
                <label className={fieldLabel}>Your birthday</label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className={fieldInput}
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
              <div className="mb-[18px]">
                <label className={fieldLabel}>
                  Any ongoing conditions, illnesses, or diseases?
                </label>
                <textarea
                  rows={2}
                  placeholder="Anything ongoing you'd like Florence to understand. Optional."
                  className={`${fieldInput} min-h-[64px] resize-none leading-[1.5]`}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                />
              </div>
              <div>
                <label className={fieldLabel}>
                  Any surgeries or procedures?
                </label>
                <textarea
                  rows={2}
                  placeholder="Anything that shaped your body or health. Optional."
                  className={`${fieldInput} min-h-[64px] resize-none leading-[1.5]`}
                  value={surgeries}
                  onChange={(e) => setSurgeries(e.target.value)}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className={stepLabel}>One last thing</p>
              <h1 className={heading}>How did you find Florence?</h1>
              <div className="flex flex-col gap-[9px]">
                {sources.map((s, i) => (
                  <Option
                    key={s.label}
                    label={s.label}
                    selected={source === i}
                    onClick={() => setSource(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className={`${cta} flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {step < 2 ? "Continue" : "Meet Florence"}
        </button>
      </div>
    </PhoneFrame>
  );
}

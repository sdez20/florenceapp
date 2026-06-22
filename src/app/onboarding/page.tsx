"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneFrame from "@/components/PhoneFrame";
import { cta } from "@/components/ui";

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
        selected
          ? "border-clay bg-blush"
          : "border-olive/20 hover:border-clay-soft"
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

  const next = () => {
    if (step < 3) setStep(step + 1);
    else router.push("/whatsheholds");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-7 pt-14">
        {/* progress dots */}
        <div className="flex gap-[7px]">
          {[0, 1, 2, 3].map((i) => (
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
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
                To begin
              </p>
              <h1 className="mb-[22px] font-serif text-[32px] font-medium leading-[1.12] text-ink">
                What season are you in?
              </h1>
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
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
                Where you are
              </p>
              <div className="mb-[18px]">
                <label className={fieldLabel}>Region</label>
                <select className={fieldInput} defaultValue="Trinidad & the Caribbean">
                  <option>Trinidad &amp; the Caribbean</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Europe</option>
                  <option>Canada</option>
                  <option>Elsewhere</option>
                </select>
              </div>
              <div>
                <label className={fieldLabel}>Language</label>
                <select className={fieldInput} defaultValue="English">
                  <option>English</option>
                  <option>Español</option>
                  <option>Français</option>
                  <option>Português</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
                A little about you
              </p>
              <div className="mb-[18px]">
                <label className={fieldLabel}>Your culture or heritage</label>
                <input
                  type="text"
                  placeholder="However you'd describe it"
                  className={fieldInput}
                />
              </div>
              <div>
                <label className={fieldLabel}>Your birthday</label>
                <input
                  type="text"
                  placeholder="14 June 1979"
                  className={fieldInput}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
                How did you find Florence?
              </p>
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

        <button type="button" onClick={next} className={`${cta} flex-shrink-0`}>
          {step < 3 ? "Continue" : "Meet Florence"}
        </button>
      </div>
    </PhoneFrame>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta } from "@/components/ui";
import { hasValidConsent, saveConsent } from "@/lib/consent";
import { TERMS_VERSION, PRIVACY_VERSION } from "@/lib/legal";

function Check({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start gap-3 text-left"
    >
      <span
        className={`mt-[2px] flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors ${
          checked ? "border-olive bg-olive text-paper" : "border-olive/35 bg-transparent"
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[13.5px] font-light leading-[1.55] text-ink">
        {children}
      </span>
    </button>
  );
}

export default function ConsentGatePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);
  const [wellness, setWellness] = useState(false);

  // Shown once. If she already agreed to the current versions, skip straight in.
  useEffect(() => {
    if (hasValidConsent()) router.replace("/dashboard");
    else setReady(true);
  }, [router]);

  const allChecked = age && terms && wellness;

  const enter = () => {
    if (!allChecked) return;
    saveConsent({
      age18: age,
      agreedTermsPrivacy: terms,
      acknowledgedWellness: wellness,
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
      agreedAt: new Date().toISOString(),
    });
    router.replace("/dashboard");
  };

  if (!ready) return null;

  return (
    <PhoneFrame>
      {/* modal sheet over a soft scrim */}
      <div className="flex flex-1 flex-col justify-end bg-ink/15">
        <div className="rounded-t-[28px] bg-paper px-[30px] pb-9 pt-7 shadow-[0_-24px_60px_rgba(31,42,34,0.15)]">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
            Before you enter
          </p>
          <h1 className="mb-3 font-serif text-[28px] font-medium leading-[1.12] text-ink">
            A few agreements
          </h1>
          <p className="mb-6 text-[13.5px] font-light leading-[1.6] text-ink-soft">
            So you know what Florence is, and what she is not.
          </p>

          <div className="flex flex-col gap-[18px]">
            <Check checked={age} onToggle={() => setAge((v) => !v)}>
              I am 18 years of age or older.
            </Check>
            <Check checked={terms} onToggle={() => setTerms((v) => !v)}>
              I have read and agree to the{" "}
              <Link href="/legal/terms" className="font-medium text-clay underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="font-medium text-clay underline">
                Privacy Policy
              </Link>
              .
            </Check>
            <Check checked={wellness} onToggle={() => setWellness((v) => !v)}>
              I understand Florence offers holistic wellness support, not medical
              care.
            </Check>
          </div>

          <button
            type="button"
            onClick={enter}
            disabled={!allChecked}
            className={`${cta} mt-7 ${allChecked ? "" : "cursor-not-allowed opacity-40"}`}
          >
            Enter Florence
          </button>

          <p className="mt-4 text-center text-[12px] text-ink-soft">
            <Link href="/safety" className="font-medium text-clay no-underline">
              Safety &amp; Support
            </Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

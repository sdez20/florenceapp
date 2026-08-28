"use client";

import { useState } from "react";
import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";
import { cta, eyebrow } from "@/components/ui";
import { createClient, authConfigured } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/site-url";

const inputClass =
  "w-full rounded-[14px] border-[1.5px] border-olive/22 bg-transparent px-[18px] py-4 font-sans text-[15px] text-ink transition-colors placeholder:text-ink-soft/55 focus:border-clay focus:outline-none";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const sendReset = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!authConfigured()) {
      setError("Password reset isn't connected yet. The Supabase keys are missing.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      // Sends a secure, single-use reset link. It routes through /auth/confirm,
      // which establishes a session and forwards her to /reset-password. We
      // always show the same confirmation, so this never reveals whether an
      // email exists.
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${siteUrl()}/auth/confirm?next=/reset-password` },
      );
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setSent(true);
    } catch (e) {
      setError(`We couldn't send the reset link: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-8 pt-16">
        <BackLink href="/signin" />

        <div className="flex flex-1 flex-col justify-center py-[18px]">
          <p className={`${eyebrow} mb-[14px] tracking-[0.3em]`}>Florence</p>
          {sent ? (
            <>
              <h1 className="mb-4 font-serif text-[32px] font-medium leading-[1.1] text-ink">
                Check your email
              </h1>
              <p className="text-[14px] font-light leading-[1.6] text-ink-soft">
                If an account exists for{" "}
                <span className="font-medium text-ink">{email.trim()}</span>,
                we&apos;ve sent a link to reset your password. Open it to choose
                a new one.
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-3 font-serif text-[32px] font-medium leading-[1.1] text-ink">
                Reset your password
              </h1>
              <p className="mb-8 text-[14px] font-light leading-[1.6] text-ink-soft">
                Enter your email and we&apos;ll send you a secure link to set a
                new password.
              </p>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block pl-0.5 text-[12px] font-medium tracking-[0.04em] text-ink-soft"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              {error && (
                <p className="mt-4 text-[13px] font-medium text-clay">{error}</p>
              )}
            </>
          )}
        </div>

        {!sent && (
          <button
            type="button"
            onClick={sendReset}
            disabled={busy}
            className={`${cta} mt-auto disabled:opacity-60`}
          >
            {busy ? "Sending…" : "Send reset link"}
          </button>
        )}
        <p className="mt-5 text-center text-[13.5px] text-ink-soft">
          <Link href="/signin" className="font-semibold text-clay no-underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}

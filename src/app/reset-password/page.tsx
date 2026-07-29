"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneFrame from "@/components/PhoneFrame";
import { cta, eyebrow } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-[14px] border-[1.5px] border-olive/22 bg-transparent px-[18px] py-4 font-sans text-[15px] text-ink transition-colors placeholder:text-ink-soft/55 focus:border-clay focus:outline-none";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const updatePassword = async () => {
    setError("");
    if (password.length < 8) {
      setError("Please use a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    // The reset link already established a session via /auth/confirm, so this
    // sets the new password on the signed-in user. Supabase re-hashes it.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push("/today");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-8 pt-16">
        <div className="flex flex-1 flex-col justify-center py-[18px]">
          <p className={`${eyebrow} mb-[14px] tracking-[0.3em]`}>Florence</p>
          <h1 className="mb-8 font-serif text-[32px] font-medium leading-[1.1] text-ink">
            Choose a new password
          </h1>

          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="pass"
                className="mb-2 block pl-0.5 text-[12px] font-medium tracking-[0.04em] text-ink-soft"
              >
                New password
              </label>
              <input
                id="pass"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="confirm"
                className="mb-2 block pl-0.5 text-[12px] font-medium tracking-[0.04em] text-ink-soft"
              >
                Confirm new password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Type it again"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-[13px] font-medium text-clay">{error}</p>
          )}
        </div>

        <button
          type="button"
          onClick={updatePassword}
          disabled={busy}
          className={`${cta} mt-auto disabled:opacity-60`}
        >
          {busy ? "Saving…" : "Save new password"}
        </button>
      </div>
    </PhoneFrame>
  );
}

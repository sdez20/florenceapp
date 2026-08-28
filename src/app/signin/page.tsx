"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";
import { cta, eyebrow } from "@/components/ui";
import { setStoredName } from "@/lib/user";
import { createClient, authConfigured } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-[14px] border-[1.5px] border-olive/22 bg-transparent px-[18px] py-4 font-sans text-[15px] text-ink transition-colors placeholder:text-ink-soft/55 focus:border-clay focus:outline-none";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(
    params.get("error") === "link_invalid"
      ? "That link was invalid or expired. Please sign in."
      : "",
  );

  const signIn = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!authConfigured()) {
      setError(
        "Sign-in isn't connected yet. The Supabase keys are missing from this build.",
      );
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      // Checks the email + password against Supabase Auth. The password is
      // verified against the stored hash server-side; a match returns a session.
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 20000),
      );
      const { data, error: signInError } = await Promise.race([
        supabase.auth.signInWithPassword({ email: email.trim(), password }),
        timeout,
      ]);

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "That email and password don't match. Please try again."
            : signInError.message,
        );
        return;
      }

      // Keep the rest of the app working: mirror her saved name into local state.
      const savedName = (data.user?.user_metadata?.name as string) ?? "";
      if (savedName) setStoredName(savedName);
      router.push("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        msg === "timeout"
          ? "This took too long, so we stopped waiting. Check your connection and try again."
          : `We couldn't sign you in: ${msg}`,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-8 pt-16">
      <BackLink href="/consent" />

      <div className="flex flex-1 flex-col justify-center py-[18px]">
        <p className={`${eyebrow} mb-[14px] tracking-[0.3em]`}>Florence</p>
        <h1 className="mb-11 font-serif text-[38px] font-medium leading-[1.08] text-ink">
          Welcome back.
        </h1>

        <div className="flex flex-col gap-5">
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
          <div>
            <label
              htmlFor="pass"
              className="mb-2 block pl-0.5 text-[12px] font-medium tracking-[0.04em] text-ink-soft"
            >
              Password
            </label>
            <input
              id="pass"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <Link
              href="/forgot-password"
              className="mt-2 block pl-0.5 text-[12.5px] font-medium text-clay no-underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-[13px] font-medium text-clay">{error}</p>
        )}
      </div>

      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className={`${cta} mt-auto disabled:opacity-60`}
      >
        {busy ? "Signing you in…" : "Sign in"}
      </button>
      <p className="mt-5 text-center text-[13.5px] text-ink-soft">
        New to Florence?{" "}
        <Link href="/signup" className="font-semibold text-clay no-underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <PhoneFrame>
      <Suspense fallback={<div className="flex-1" />}>
        <SignInForm />
      </Suspense>
    </PhoneFrame>
  );
}

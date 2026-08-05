"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import BackLink from "@/components/BackLink";
import { cta, eyebrow } from "@/components/ui";
import { setStoredName } from "@/lib/user";
import { createClient, authConfigured } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-[14px] border-[1.5px] border-olive/22 bg-transparent px-[18px] py-4 font-sans text-[15px] text-ink transition-colors placeholder:text-ink-soft/55 focus:border-clay focus:outline-none";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const createAccount = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in your name, email, and a password.");
      return;
    }
    if (password.length < 8) {
      setError("Please use a password of at least 8 characters.");
      return;
    }
    // If the Supabase keys aren't in the build, createClient() would throw and
    // freeze the spinner. Fail clearly up front instead.
    if (!authConfigured()) {
      setError(
        "Accounts aren't connected yet — the Supabase keys are missing from this build (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY). Add them and rebuild.",
      );
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      // Supabase Auth creates the user and securely hashes the password
      // server-side (bcrypt) — we never store or see the plain password. Her name
      // is saved on the auth user's metadata. If email confirmation is on,
      // Supabase emails a link that lands on /auth/confirm.
      //
      // Race against a 20s timeout so an unreachable Supabase fails fast.
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 20000),
      );
      const { data, error: signUpError } = await Promise.race([
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/confirm?next=/onboarding`,
          },
        }),
        timeout,
      ]);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setStoredName(name.trim());

      // Email confirmation on: Supabase returns a user but no session — she must
      // click the emailed link first.
      if (data.user && !data.session) {
        setSentTo(email.trim());
        return;
      }

      // Confirmation off: she's signed in immediately, go straight in.
      router.push("/onboarding");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        msg === "timeout"
          ? "This took too long, so we stopped waiting. Check your connection and that Supabase is reachable, then try again. If you tapped once already, look for a verification email before retrying."
          : `We couldn't create your account: ${msg}`,
      );
    } finally {
      // Runs no matter what, so the spinner can never get stuck.
      setBusy(false);
    }
  };

  if (sentTo) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col justify-center px-8 pb-8 pt-16">
          <p className={`${eyebrow} mb-[14px] tracking-[0.3em]`}>Florence</p>
          <h1 className="mb-4 font-serif text-[32px] font-medium leading-[1.1] text-ink">
            Check your email
          </h1>
          <p className="text-[14px] font-light leading-[1.6] text-ink-soft">
            We sent a verification link to{" "}
            <span className="font-medium text-ink">{sentTo}</span>. Open it to
            confirm your account, then you can begin.
          </p>
          <p className="mt-6 text-center text-[13.5px] text-ink-soft">
            Already confirmed?{" "}
            <Link href="/signin" className="font-semibold text-clay no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-8 pt-16">
        <BackLink href="/consent" />

        <div className="flex flex-1 flex-col justify-center py-[18px]">
          <p className={`${eyebrow} mb-[14px] tracking-[0.3em]`}>Florence</p>
          <h1 className="mb-11 font-serif text-[32px] font-medium leading-[1.08] text-ink">
            Let&apos;s set up your space.
          </h1>

          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block pl-0.5 text-[12px] font-medium tracking-[0.04em] text-ink-soft"
              >
                What&apos;s your name?
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
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
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          onClick={createAccount}
          disabled={busy}
          className={`${cta} mt-auto disabled:opacity-60`}
        >
          {busy ? "Creating your account…" : "Create my account"}
        </button>
        <p className="mt-5 text-center text-[13.5px] text-ink-soft">
          Already with Florence?{" "}
          <Link href="/signin" className="font-semibold text-clay no-underline">
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-[12px] font-light leading-[1.5] text-ink-soft">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" className="text-clay underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-clay underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </PhoneFrame>
  );
}

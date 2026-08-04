"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clearStoredName } from "@/lib/user";

// A real sign-out: ends the Supabase session (clears the auth cookies) so the
// user is no longer recognized, then returns to the welcome screen. Styled to
// match the Settings rows.
export default function SignOutRow() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await createClient().auth.signOut();
      }
    } catch {
      // ignore — still clear local state and leave
    }
    clearStoredName();
    router.replace("/");
  };

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="flex items-center justify-between rounded-[14px] border border-olive/16 bg-transparent p-4 text-left no-underline transition-colors hover:border-clay-soft hover:bg-sage/14 disabled:opacity-60"
    >
      <span className="font-serif text-[18px] font-semibold leading-[1.15] text-clay">
        {busy ? "Signing out…" : "Sign out"}
      </span>
      <span className="text-[18px] text-clay-soft">&rsaquo;</span>
    </button>
  );
}

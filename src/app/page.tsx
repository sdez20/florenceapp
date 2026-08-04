"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";
import { cta } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { setStoredName } from "@/lib/user";

export default function Home() {
  const router = useRouter();
  // Until we've checked for an existing session, hold the call-to-action so a
  // returning, already-signed-in user isn't shown the new-user flow.
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setChecked(true);
      return;
    }
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) {
          // Recognized: bring her back to her space, name intact.
          const name = data.user.user_metadata?.name as string | undefined;
          if (name) setStoredName(name);
          router.replace("/today");
        } else {
          setChecked(true);
        }
      })
      .catch(() => setChecked(true));
  }, [router]);

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-[38px] pb-11">
        {/* Upper: the name, centered in generous space */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="font-serif text-[58px] font-medium leading-none tracking-[0.01em] text-ink">
            Florence
          </h1>
        </div>

        {/* Lower: the invitation — shown once we know she isn't already signed in */}
        <div className="flex min-h-[96px] flex-col items-center text-center">
          {checked && (
            <>
              <Link href="/consent" className={cta}>
                Begin
              </Link>
              <p className="mt-[18px] text-[13.5px] font-normal text-ink-soft">
                Already with Florence?{" "}
                <Link href="/signin" className="font-semibold text-clay no-underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

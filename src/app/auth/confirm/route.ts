import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where Supabase sends the user after they click a link in a verification or
// password-reset email. It establishes a real session from the link, then sends
// them on to `next`. It supports both link styles Supabase can send:
//   - token_hash + type  (verifyOtp)
//   - code               (exchangeCodeForSession, the PKCE flow)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // Password recovery links land the user on the set-a-new-password screen.
      const dest = type === "recovery" ? "/reset-password" : next;
      return NextResponse.redirect(`${origin}${dest}`);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something was wrong or expired — send them to sign in with a gentle notice.
  return NextResponse.redirect(`${origin}/signin?error=link_invalid`);
}

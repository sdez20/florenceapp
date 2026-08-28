import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

// Resends the sign-up confirmation email. The verify screen's "Send it again"
// button posts here with the address she signed up with. Supabase re-sends the
// confirmation link through whatever SMTP the project has configured; if custom
// SMTP and the sending domain's SPF/DKIM aren't set up, the mail still won't
// arrive — that is a project/DNS configuration matter, not something this route
// can fix. The link lands on /auth/confirm, which establishes the session and
// forwards her to her dashboard.
export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: "Accounts aren't connected yet — the Supabase keys are missing from this build." },
      { status: 500 },
    );
  }

  let email: string | undefined;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Please provide the email you signed up with." }, { status: 400 });
  }

  // Prefer the canonical production origin so the re-sent link never points at
  // a preview URL; fall back to the request origin only in local dev.
  const origin = siteUrl() || new URL(request.url).origin;
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

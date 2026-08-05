import { createBrowserClient } from "@supabase/ssr";

/** True only when the Supabase keys are present in the browser bundle. Call this
 *  before createClient() — without the keys, createBrowserClient throws. */
export function authConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

// Browser-side Supabase client, used from Client Components (sign up, sign in,
// password reset). The anon key is safe to expose to the browser — it only
// permits what your Row Level Security policies allow, and never touches the
// password hashes, which live inside Supabase Auth.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

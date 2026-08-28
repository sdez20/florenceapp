// The canonical origin for links that go inside emails — the sign-up
// confirmation link and the password-reset link.
//
// These must point at the production site, never at localhost or a Vercel
// preview URL. If they point anywhere else, the woman clicks the link in her
// email and lands somewhere she can't confirm from, so her account is stuck.
//
// Set NEXT_PUBLIC_SITE_URL to the production origin (https://florenceapp.site)
// in the production environment. When it isn't set (local dev), we fall back to
// the current browser origin so development still works.
export function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (env) return env;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

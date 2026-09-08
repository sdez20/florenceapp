import Link from "next/link";
import { AuthShell } from "@/components/flo/Shell";

// Privacy — the approved design (file 02, with the README's corrections:
// flat white, square, a 16px moss rule above each centred bullet, not dots).

const BULLETS = [
  "Florence will never track your weight, calories or measurements.",
  "Florence saves your email so you can sign in, what you choose to share about your health, and your conversations so you can return to them.",
  "Your information is never sold, shared for advertising, or handed to anyone else.",
  "You can see, download or delete your account at any time.",
  "Everything you share is encrypted.",
];

export default function PrivacyPage() {
  return (
    <AuthShell>
      <h1 className="mt-12 shrink-0 text-center font-display text-[30px] font-normal leading-[1.2] text-ink">
        Privacy
      </h1>

      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <ul className="m-0 flex w-full list-none flex-col gap-6 p-0 text-center">
          {BULLETS.map((b) => (
            <li
              key={b}
              className="relative pt-[17px] text-[14px] font-light leading-[1.6] text-ink before:absolute before:left-1/2 before:top-0 before:h-px before:w-4 before:-translate-x-1/2 before:bg-accent before:content-['']"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/legal/privacy"
        className="mb-6 shrink-0 self-center border-b border-accent pb-[3px] text-[10px] font-normal uppercase tracking-[0.14em] text-ink-soft no-underline"
      >
        Read the full policy &rsaquo;
      </Link>

      <Link
        href="/signup"
        className="block w-full shrink-0 border-none bg-ink p-[18px] text-center font-body text-[9.5px] font-medium uppercase tracking-[0.28em] text-ground no-underline transition-opacity hover:opacity-[0.87]"
      >
        I agree, let&apos;s begin
      </Link>
    </AuthShell>
  );
}

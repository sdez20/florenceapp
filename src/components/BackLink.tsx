import Link from "next/link";

/** The ‹ back chevron used in the header of pushed screens. */
export default function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Go back"
      className="text-[22px] font-light leading-none text-ink-soft no-underline transition-colors hover:text-ink"
    >
      &#8249;
    </Link>
  );
}

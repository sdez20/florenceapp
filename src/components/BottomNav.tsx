"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/today", label: "Today" },
  { href: "/explore", label: "Explore" },
  { href: "/story", label: "Story" },
  { href: "/settings", label: "Settings" },
];

/**
 * A slim navigation bar for the main app sections. Not part of the original
 * mockups — added so Today, Explore, Story, and Settings are reachable.
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-shrink-0 items-center justify-around border-t border-olive/12 bg-paper px-2 pb-6 pt-3">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`font-sans text-[11px] font-semibold uppercase tracking-[0.14em] no-underline transition-colors ${
              active ? "text-clay" : "text-ink-soft hover:text-clay"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

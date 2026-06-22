"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/today", label: "Daily check-in" },
  { href: "/explore", label: "Explore" },
  { href: "/notes", label: "Today's notes" },
  { href: "/story", label: "Your story" },
  { href: "/settings", label: "Settings" },
];

/**
 * A hamburger button (top-right of the screen) that opens a full-screen
 * navigation overlay for the main app sections.
 */
export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="absolute right-[24px] top-[54px] z-20 flex h-[14px] w-[26px] flex-col justify-between"
      >
        <span className="h-[1.5px] w-full rounded-full bg-ink" />
        <span className="h-[1.5px] w-full rounded-full bg-ink" />
        <span className="h-[1.5px] w-full rounded-full bg-ink" />
      </button>

      {open && (
        <div className="absolute inset-0 z-30 flex flex-col bg-paper px-[38px] pb-12 pt-[50px]">
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="text-[28px] leading-none text-ink-soft transition-colors hover:text-ink"
            >
              &times;
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-7">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-serif text-[30px] font-medium no-underline transition-colors ${
                    active ? "text-clay" : "text-ink hover:text-clay"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

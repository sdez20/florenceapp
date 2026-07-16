"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

/**
 * A searchable country dropdown. The woman types to filter the full country
 * list and clicks her country. The chosen value is only ever one of the exact
 * COUNTRIES strings, so it saves cleanly to her profile and matches the
 * verified-emergency registry used for safety routing.
 */
export default function CountrySelect({
  value,
  onChange,
  inputClassName,
  placeholder = "Search for your country",
}: {
  value: string;
  onChange: (country: string) => void;
  inputClassName?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close when clicking away.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(q))
    : COUNTRIES;

  const select = (country: string) => {
    onChange(country);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        className={inputClassName}
        placeholder={placeholder}
        value={open ? query : value}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
          }
        }}
      />
      {open && (
        <ul className="absolute z-20 mt-1.5 max-h-[220px] w-full overflow-y-auto rounded-[13px] border border-olive/18 bg-paper p-1 shadow-[0_16px_40px_rgba(58,53,46,0.16)]">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 font-sans text-[13.5px] font-light text-ink-soft">
              No country matches that.
            </li>
          ) : (
            filtered.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  // Keep the input from blurring before the click registers.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(c)}
                  className={`block w-full rounded-[9px] px-3 py-[9px] text-left font-sans text-[14px] text-ink transition-colors hover:bg-blush ${
                    value === c ? "bg-blush" : ""
                  }`}
                >
                  {c}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

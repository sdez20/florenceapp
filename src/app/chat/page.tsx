"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getStoredName, firstNameOf } from "@/lib/user";
import { getProfile } from "@/lib/profile";
import { setLastFocus } from "@/lib/focus-store";
import { createClient, authConfigured } from "@/lib/supabase/client";

// Best-effort: save the turn to Supabase so the daily message can remember what
// she's been talking about. Only runs when she's signed in; never blocks chat.
async function storeTurn(userText: string, assistantText: string, focus: string) {
  if (!authConfigured() || !assistantText) return;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("messages").insert([
      { role: "user", content: userText, focus },
      { role: "assistant", content: assistantText, focus },
    ]);
  } catch {
    // storage is best-effort; a failure must never affect the conversation
  }
}

const focusOptions = [
  { label: "Mental and emotional wellbeing", d: "The inner weather you carry" },
  { label: "Relational intelligence", d: "Connection, conflict, the people around you" },
  { label: "Holistic nutrition", d: "Nourishment as care, not rules" },
  { label: "Skin health", d: "What your skin reflects, inside and out" },
  { label: "Intimacy and desire", d: "Closeness, sexuality, your body's seasons" },
  { label: "Stress and the nervous system", d: "Stress, sleep, steadying the body" },
  { label: "Boundaries", d: "Saying no, holding your own ground" },
  { label: "This season of life", d: "Where your body and life are right now" },
  { label: "Just talk", d: "No focus. Whatever is here today" },
];

type Message = { who: "f" | "u"; text: string };

export default function ChatPage() {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState("Just talk");
  const [thread, setThread] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [profile, setProfile] = useState<Record<string, string>>({});
  useEffect(() => {
    const name = getStoredName();
    setFirstName(firstNameOf(name));
    // Her profile travels with every message so Florence never re-asks it.
    setProfile({ name: firstNameOf(name), ...getProfile() });
  }, []);

  const threadEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread, sending]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    const userMessage = text;

    const nextThread: Message[] = [...thread, { who: "u", text }];
    setThread(nextThread);
    setDraft("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focus,
          profile,
          messages: nextThread.map((m) => ({
            role: m.who === "u" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      // A non-OK response (missing key, bad request) still comes back as JSON.
      if (!res.ok || !res.body) {
        let msg = "Something went wrong.";
        try {
          msg = (await res.json()).error ?? msg;
        } catch {}
        setThread((t) => [...t, { who: "f", text: msg }]);
        return;
      }

      // Add an empty Florence bubble, then fill it as her words stream in.
      setSending(false);
      setThread((t) => [...t, { who: "f", text: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setThread((t) => {
          const copy = [...t];
          copy[copy.length - 1] = { who: "f", text };
          return copy;
        });
      }
      if (!text) {
        setThread((t) => {
          const copy = [...t];
          copy[copy.length - 1] = { who: "f", text: "…" };
          return copy;
        });
      } else {
        // Persist the completed turn (her message + Florence's reply).
        void storeTurn(userMessage, text, focus);
      }
    } catch {
      setThread((t) => [
        ...t,
        { who: "f", text: "I couldn't reach the server. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-sand sm:p-6">
      <div className="relative flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-paper sm:h-[min(844px,92vh)] sm:rounded-[44px] sm:shadow-[0_40px_120px_rgba(58,53,46,0.30),0_0_0_1px_rgba(92,107,67,0.18)]">
        {/* header */}
        <div className="flex items-center gap-[14px] bg-paper px-[26px] pb-4 pt-[54px]">
          <Link
            href="/today"
            aria-label="Go back"
            className="text-[22px] font-light leading-none text-ink-soft no-underline"
          >
            &#8249;
          </Link>
          <div className="flex-1">
            <div className="font-serif text-[25px] font-semibold leading-none text-ink">
              Florence
            </div>
          </div>
          <Link
            href="/safety"
            className="text-[11px] font-semibold uppercase tracking-[0.1em] text-clay no-underline"
          >
            Safety
          </Link>
        </div>

        {/* focus selector */}
        <div className="bg-paper px-[22px] pb-[14px]">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-[16px] border-[1.5px] border-blush bg-transparent px-[18px] py-[13px]"
          >
            <span className="flex flex-col items-start">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
                Today I want to focus on
              </span>
              <span className="mt-[3px] font-serif text-[19px] font-semibold text-ink">
                {focus}
              </span>
            </span>
            <span
              className={`text-[14px] text-clay transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              &#9662;
            </span>
          </button>
          {open && (
            <div className="mt-2 rounded-[16px] border border-olive/14 bg-paper p-1.5">
              {focusOptions.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => {
                    setFocus(o.label);
                    setLastFocus(o.label);
                    setOpen(false);
                  }}
                  className={`block w-full rounded-[11px] px-[14px] py-[13px] text-left font-serif text-[18px] font-medium text-ink transition-colors hover:bg-blush ${
                    focus === o.label ? "bg-blush" : ""
                  }`}
                >
                  {o.label}
                  <span className="mt-0.5 block font-sans text-[11.5px] font-light text-ink-soft">
                    {o.d}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* thread */}
        <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto bg-paper px-[22px] pb-[18px] pt-[10px]">
          <div className="my-1 text-center text-[11px] uppercase tracking-[0.16em] text-ink-soft/70">
            Today
          </div>

          {/* opening line (display only — not part of the conversation sent to Florence) */}
          <div className="max-w-[86%] self-start leading-[1.5]">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
              Florence
            </div>
            <div className="font-serif text-[18px] font-medium leading-[1.5] text-ink">
              {firstName ? `Hello, ${firstName}. ` : "Hello. "}I&apos;m here. What&apos;s
              on your mind today?
            </div>
          </div>

          {thread.map((m, i) => (
            <div
              key={i}
              className={`max-w-[86%] leading-[1.5] ${
                m.who === "u" ? "self-end text-right" : "self-start"
              }`}
            >
              <div
                className={`mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  m.who === "u" ? "text-olive" : "text-clay"
                }`}
              >
                {m.who === "u" ? firstName || "You" : "Florence"}
              </div>
              <div
                className={`whitespace-pre-wrap font-serif font-medium leading-[1.5] ${
                  m.who === "u" ? "text-[16px] text-ink-soft" : "text-[18px] text-ink"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {sending && (
            <div className="max-w-[86%] self-start leading-[1.5]">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
                Florence
              </div>
              <div className="font-serif text-[18px] font-medium italic text-ink-soft">
                thinking&hellip;
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>

        {/* composer */}
        <div className="flex items-end gap-[10px] bg-paper px-[18px] pb-[26px] pt-[14px]">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Tell Florence anything"
            aria-label="Message Florence"
            disabled={sending}
            className="min-h-[50px] flex-1 rounded-[22px] border border-olive/16 bg-paper-soft px-[18px] py-[14px] font-sans text-[14.5px] text-ink placeholder:text-ink-soft/70 focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={send}
            aria-label="Send"
            disabled={sending || !draft.trim()}
            className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full bg-clay text-[20px] text-paper transition-[transform,background-color] duration-300 hover:-translate-y-px hover:bg-clay-soft disabled:opacity-50"
          >
            &#8593;
          </button>
        </div>
      </div>
    </main>
  );
}

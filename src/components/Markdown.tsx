"use client";

import ReactMarkdown from "react-markdown";

/** Renders legal markdown in the Florence design (Cormorant headings, Figtree body). */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...p }) => (
          <h1 className="mb-3 font-serif text-[30px] font-medium leading-[1.15] text-ink" {...p} />
        ),
        h2: ({ node, ...p }) => (
          <h2 className="mb-2 mt-7 font-serif text-[19px] font-semibold text-ink" {...p} />
        ),
        p: ({ node, ...p }) => (
          <p className="mb-3 text-[14px] font-light leading-[1.7] text-ink-soft" {...p} />
        ),
        ul: ({ node, ...p }) => (
          <ul className="mb-3 flex list-disc flex-col gap-1.5 pl-5 text-[14px] font-light leading-[1.6] text-ink-soft" {...p} />
        ),
        li: ({ node, ...p }) => <li {...p} />,
        strong: ({ node, ...p }) => <strong className="font-semibold text-ink" {...p} />,
        em: ({ node, ...p }) => <em className="italic text-ink-soft/80" {...p} />,
        a: ({ node, ...p }) => (
          <a className="font-medium text-clay underline" {...p} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

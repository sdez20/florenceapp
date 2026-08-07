// Turns her stored history (chat messages + daily check-ins) into a single
// prompt block for the daily message. Pure formatting — no Supabase import — so
// it's safe to unit test and to run anywhere.

export type StoredMessage = { role: string; content: string; created_at?: string };
export type StoredCheckin = {
  day: string;
  mental?: string | null;
  emotional?: string | null;
  nutrition?: string | null;
};

const MAX_MESSAGE_CHARS = 600;

/** Builds the "her actual recent history" block, or "" if there's nothing. */
export function formatHistory(
  messages: StoredMessage[],
  checkins: StoredCheckin[],
): string {
  const parts: string[] = [];

  if (messages.length) {
    // Passed newest-first from the DB; show oldest-to-newest like a transcript.
    const transcript = [...messages]
      .reverse()
      .map((m) => {
        const who = m.role === "assistant" ? "Florence" : "She";
        const text =
          m.content.length > MAX_MESSAGE_CHARS
            ? m.content.slice(0, MAX_MESSAGE_CHARS) + "…"
            : m.content;
        return `${who}: ${text}`;
      })
      .join("\n");
    parts.push(`RECENT CONVERSATIONS (oldest to newest):\n${transcript}`);
  }

  if (checkins.length) {
    const lines = checkins
      .map((c) => {
        const bits = [
          c.mental && `mind: ${c.mental}`,
          c.emotional && `emotionally: ${c.emotional}`,
          c.nutrition && `nourishment: ${c.nutrition}`,
        ]
          .filter(Boolean)
          .join(", ");
        return bits ? `${c.day} — ${bits}` : "";
      })
      .filter(Boolean)
      .join("\n");
    if (lines) parts.push(`RECENT DAILY CHECK-INS (how she said she felt):\n${lines}`);
  }

  if (!parts.length) return "";

  return `Her actual recent history. Read it so today's message remembers her and is specific to what she has really been focused on and going through, not just her phase:

${parts.join("\n\n")}

Let this inform you the way a friend who remembers would — never quote it back to her mechanically or list what she said. Judge her state honestly from it: if it shows she is in something heavy right now (grief, crisis, an eating struggle, real pain, a hard stretch), be gentle and brief, or stay silent, exactly as your safety rules require.`;
}

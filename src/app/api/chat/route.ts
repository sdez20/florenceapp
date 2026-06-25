import Anthropic from "@anthropic-ai/sdk";
import { selectKnowledge } from "@/lib/florence-knowledge";

// Reads knowledge files from disk, so it must run on the Node.js runtime
// (not edge) on Vercel.
export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The Anthropic API key isn't set. Add ANTHROPIC_API_KEY to .env.local and restart the server." },
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[]; focus?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && m.content.trim(),
  );
  if (messages.length === 0) {
    return Response.json({ error: "No message to respond to." }, { status: 400 });
  }

  const latestUserText =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Build the system prompt: VOICE-RULES + integration layer always, plus the
  // deep docs chosen by focus / topic. The always-on block is cached so resending
  // it on every turn is cheap.
  const { alwaysText, deepText } = await selectKnowledge({
    focus: body.focus,
    latestUserText,
  });

  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: alwaysText, cache_control: { type: "ephemeral" } },
  ];
  if (deepText) {
    system.push({ type: "text", text: deepText });
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    if (response.stop_reason === "refusal") {
      return Response.json(
        { reply: "I'm sorry — I can't help with that one. Is there something else on your mind?" },
      );
    }

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return Response.json({ reply });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "The Anthropic API key looks invalid. Double-check ANTHROPIC_API_KEY in .env.local." },
        { status: 401 },
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "Florence is a little busy right now. Please try again in a moment." },
        { status: 429 },
      );
    }
    console.error("Florence chat error:", err);
    return Response.json(
      { error: "Something went wrong reaching Florence. Please try again." },
      { status: 500 },
    );
  }
}

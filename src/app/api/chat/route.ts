import Anthropic from "@anthropic-ai/sdk";
import { loadAllKnowledge } from "@/lib/florence-knowledge";
import {
  shouldSanitizeEmergencyNumbers,
  stripPhoneLikeNumbers,
} from "@/lib/emergency";
import { buildSystemBlocks, type Profile } from "@/lib/florence-prompt";

// Reads knowledge files from disk, so it must run on the Node.js runtime
// (not edge) on Vercel.
export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Index just after the last sentence boundary, so while scrubbing we only flush
// complete sentences. Phone-shaped matches never cross these boundaries, so a
// number is always evaluated whole before any text is sent.
function sentenceCut(s: string): number {
  let idx = -1;
  for (const ch of [".", "!", "?", "\n"]) {
    idx = Math.max(idx, s.lastIndexOf(ch));
  }
  return idx + 1;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The Anthropic API key isn't set. Add ANTHROPIC_API_KEY to .env.local and restart the server." },
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[]; focus?: string; profile?: Profile };
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

  // Load the FULL knowledge base (VOICE + MASTER + all 17 deep docs), fresh from
  // disk, on every request. The big block is identical each time, so prompt
  // caching means it is not re-billed while staying fully available to the model.
  const knowledge = await loadAllKnowledge();
  const system = buildSystemBlocks({
    knowledgeText: knowledge.text,
    focus: body.focus,
    profile: body.profile,
  });

  // Log the hidden instructions that were sent (for us only, never shown to the
  // user) so we can confirm all files are present if a reply ever sounds generic.
  const systemChars = system.reduce((n, b) => n + b.text.length, 0);
  console.log(
    `[florence] hidden instructions sent — files: ${knowledge.loaded.join(", ")} | focus: ${
      body.focus ?? "none"
    } | profile keys: ${Object.keys(body.profile ?? {}).join(",") || "none"} | system chars: ${systemChars}`,
  );

  const client = new Anthropic();

  // Stream her reply token by token so the woman sees words appear as Florence
  // writes them, instead of waiting for the whole message. The text is sent as a
  // plain UTF-8 stream; the chat page reads it and appends as it arrives.
  const encoder = new TextEncoder();
  const FALLBACK =
    "I'm here, and I want to help with this gently. If you're in danger right now, please reach out to your local emergency services or a crisis line near you. Tell me a little more and we'll take it slowly together.";

  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Hard stop: for any country without verified numbers (or unknown), scrub
        // phone-number-shaped text from her reply before it is sent, so a wrong or
        // invented emergency number can never reach her. Verified countries are
        // never scrubbed, so their correct numbers are always preserved.
        const sanitize = shouldSanitizeEmergencyNumbers(body.profile?.region);

        const stream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 8000,
          thinking: { type: "adaptive" },
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        // Only the text deltas reach the woman; thinking stays hidden. When
        // scrubbing, we hold text until a sentence boundary so a number split
        // across streamed chunks is always seen (and removed) whole.
        let pending = "";
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const t = event.delta.text;
            if (!sanitize) {
              controller.enqueue(encoder.encode(t));
              continue;
            }
            pending += t;
            const cut = sentenceCut(pending);
            if (cut > 0) {
              controller.enqueue(encoder.encode(stripPhoneLikeNumbers(pending.slice(0, cut))));
              pending = pending.slice(cut);
            }
          }
        }
        if (sanitize && pending) {
          controller.enqueue(encoder.encode(stripPhoneLikeNumbers(pending)));
          pending = "";
        }

        const final = await stream.finalMessage();
        // If safety declined the request, nothing streamed — send the gentle line.
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(FALLBACK));
        }
        controller.close();
      } catch (err) {
        // Errors surface mid-stream, so send a warm line as her message rather
        // than a raw error, and log the real cause for us.
        let message = "I couldn't quite reach my thoughts just now. Please try again in a moment.";
        if (err instanceof Anthropic.AuthenticationError) {
          message = "Florence isn't connected yet. (The API key needs checking.)";
        } else if (err instanceof Anthropic.RateLimitError) {
          message = "I'm a little busy right now. Please try again in a moment.";
        } else {
          console.error("Florence chat error:", err);
        }
        controller.enqueue(encoder.encode(message));
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

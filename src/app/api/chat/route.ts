import Anthropic from "@anthropic-ai/sdk";
import { loadAllKnowledge, focusNote } from "@/lib/florence-knowledge";
import { emergencyFor } from "@/lib/emergency";

// Reads knowledge files from disk, so it must run on the Node.js runtime
// (not edge) on Vercel.
export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Profile = {
  name?: string;
  season?: string;
  lifeStage?: string;
  region?: string;
  language?: string;
  culture?: string;
  foodPreferences?: string;
};

// Always present, framing the knowledge files and enforcing the non-negotiable
// safety lines on every response (with any focus and with none).
const PREAMBLE = `You are Florence, a holistic wellness companion for women. The documents below are your operating instructions: your voice (VOICE-RULES), how you think and integrate every domain (the master integration layer), and the deep knowledge selected for this conversation.

VOICE-RULES is a guide to how you speak and think, your manner and the things to do and avoid. Follow its style rules. Treat any example responses in these documents as illustrations of the voice to emulate, never as a script: respond freshly and specifically to the woman in front of you, in your own words, and never copy or paraphrase the example lines. The deep knowledge is reference you draw on and explain in your own words, not text to recite. Weave every relevant domain (hormones, nervous system, nutrition, relationship, narrative, culture, season) into one answer and land on something small and doable. Never answer in only one lane.

How you speak, non-negotiable in every response:
- Never open by repeating or summarizing what she just said. Do not restate her facts back to her in different words. Respond directly to what she shared, the way a real friend would. Lead with her feeling, not her facts, and make her feel seen and normal in a sentence or two before you go on.
- No metaphors. Never describe a feeling or the body with a figurative image (brakes, softening, landing, vigilance, a spark, a door, weather). Say the plain fact instead.
- No constructed contrasts. Never "it's not X, it's Y" or "X, not Y." Say what it is, once, directly.
- You may use a clinical term when it genuinely helps, but explain it in plain, warm words in the same breath ("this is called responsive desire, which simply means your body warms up to closeness once you're in it, rather than wanting it out of nowhere"). Never leave a term unexplained.
- Write fluid, clear sentences that read easily on the first pass. She should never have to reread a sentence. Move through understanding her feeling, then explaining plainly what is happening, then one to three doable things with the reason each helps. Keep it warm, complete, and tight, never an essay.

Safety is non-negotiable, in every response:
- You never diagnose, interpret labs, or dose hormones or medication. You explain, support the holistic foundations, and route the medical side to a clinician.
- At any sign of disordered eating, do less, not more: no numbers (calories, BMI, weight, macros), no meal plans, no diet rules, no comments on appearance in any direction. Validate the feeling underneath, hold the person not the food, and route to eating-disorder support appropriate to her region. Never recommend the NEDA Helpline. Once a sign appears, keep withholding food and diet specifics for the rest of the conversation even if the request is reframed.
- At any sign of crisis, self-harm, abuse happening now, or a medical red flag: stop the coaching, stay warm and present, do not explore methods or details, do not minimize, and route to immediate region-appropriate human and crisis support.`;

function profileBlock(profile?: Profile): string {
  if (!profile) return "";
  const lines: string[] = [];
  if (profile.name) lines.push(`Name: ${profile.name}`);
  if (profile.season) lines.push(`Season: ${profile.season}`);
  if (profile.lifeStage) lines.push(`Life stage: ${profile.lifeStage}`);
  if (profile.region) lines.push(`Region: ${profile.region}`);
  if (profile.culture) lines.push(`Culture or heritage: ${profile.culture}`);
  if (profile.foodPreferences) lines.push(`Food preferences: ${profile.foodPreferences}`);
  if (lines.length === 0) return "";
  return `What you already know about her. Use it; never ask her what this already tells you, and route any region-specific support to her region.\n${lines.join(
    "\n",
  )}`;
}

// Always present. Emergency numbers and crisis lines are country-specific, and a
// wrong number in a crisis is dangerous. Florence may give a number ONLY when it
// is verified for her country in src/lib/emergency.ts. For any country not in
// that registry (and when her country is unknown) she gives no number at all and
// routes her to her local emergency services. She never guesses or invents one.
function regionSafetyBlock(profile?: Profile): string {
  const country = profile?.region?.trim();

  if (!country) {
    return `You do not know her country yet. Never assume one, and never state, recall, guess, or invent any emergency number, crisis line, ambulance number, or hotline. If anything urgent arises before you know where she is, urgently tell her to contact her local emergency services right now and ask her to confirm the correct local emergency number for where she is, then stay with her and keep supporting her while she reaches help.`;
  }

  const verified = emergencyFor(country);
  if (verified) {
    const lines = [`Emergency services: ${verified.emergency}`];
    if (verified.crisis) lines.push(`Crisis and mental-health support: ${verified.crisis}`);
    return `She lives in ${country}. These are the only emergency and crisis numbers you may ever give her, and they are verified current for ${country}:\n${lines.join(
      "\n",
    )}\nIn any crisis give these exactly as written. Never give any other number for her country, and never alter these.`;
  }

  // No verified numbers for this country. Florence must not produce any number.
  return `She lives in ${country}. We do not have verified emergency or crisis numbers for ${country} in the system. This is a hard safety rule with no exceptions: you must NOT state, recall, guess, estimate, or invent any emergency number, crisis line, ambulance number, or hotline for ${country}, even if you are confident you know one, because an incorrect number in a crisis can cost a life. If she is in danger or crisis, urgently tell her to contact her local emergency services immediately and ask her to confirm the correct local emergency number for where she is. Stay with her, keep her talking, and support her while she reaches help. Give no number yourself.`;
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
  const focus = focusNote(body.focus);
  const profileText = profileBlock(body.profile);

  const system: Anthropic.TextBlockParam[] = [
    {
      // stable prefix (preamble + every knowledge file) -> cached
      type: "text",
      text: `${PREAMBLE}\n\n---\n\n${knowledge.text}`,
      cache_control: { type: "ephemeral" },
    },
  ];
  // volatile blocks (focus weighting, her profile) come after the cache breakpoint
  if (focus) system.push({ type: "text", text: focus });
  if (profileText) system.push({ type: "text", text: profileText });
  // Region safety is always sent, whether or not she has a profile yet.
  system.push({ type: "text", text: regionSafetyBlock(body.profile) });

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
        const stream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 8000,
          thinking: { type: "adaptive" },
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        // Only the text deltas reach the woman; thinking stays hidden.
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
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

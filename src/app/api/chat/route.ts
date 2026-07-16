import Anthropic from "@anthropic-ai/sdk";
import { loadAllKnowledge, focusNote } from "@/lib/florence-knowledge";

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

// Always present. Emergency numbers and crisis lines are country-specific, so a
// wrong guess in a crisis is dangerous. This pins Florence to her stated region
// from the first message, and forbids guessing a country when it is unknown.
function regionSafetyBlock(profile?: Profile): string {
  const region = profile?.region?.trim();
  if (region) {
    return `Her region is ${region}. From your very first response, any emergency number, crisis line, hotline, or region-specific service you name must be correct for ${region}. Never default to, assume, or fall back to any other country's numbers.`;
  }
  return `You do not know her country or region yet. Never assume one, and never name a country-specific emergency number, crisis line, or hotline on a guess. If something urgent arises before you know where she is, point her to her local emergency services and gently ask what country she is in, then give the resource for that country.`;
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

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    if (response.stop_reason === "refusal") {
      return Response.json({
        reply:
          "I'm here, and I want to help with this gently. If you're in danger right now, please reach out to your local emergency services or a crisis line near you. Tell me a little more and we'll take it slowly together.",
      });
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

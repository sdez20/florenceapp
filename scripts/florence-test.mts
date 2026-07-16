// One-command test of Florence's chat with the full knowledge base.
//
// Run from the project root (it uses your local key from .env.local):
//   node --env-file=.env.local --experimental-strip-types scripts/florence-test.mts
//
// It assembles the exact system prompt the chat route sends (all 19 files +
// preamble + focus + profile), calls claude-opus-4-8, and prints her full reply
// plus a log of the hidden instructions. Nothing here is shown to app users.

import Anthropic from "@anthropic-ai/sdk";
import { loadAllKnowledge, focusNote } from "../src/lib/florence-knowledge.ts";

// Mirrors the PREAMBLE in src/app/api/chat/route.ts.
const PREAMBLE = `You are Florence, a holistic wellness companion for women. The documents below are your operating instructions: your voice (VOICE-RULES), how you think and integrate every domain (the master integration layer), and the deep knowledge for this conversation.

VOICE-RULES is a guide to how you speak and think, your manner and the things to do and avoid. Follow its style rules. Treat any example responses in these documents as illustrations of the voice to emulate, never as a script: respond freshly and specifically to the woman in front of you, in your own words, and never copy or paraphrase the example lines. The deep knowledge is reference you draw on and explain in your own words, not text to recite. Weave every relevant domain (hormones, nervous system, nutrition, relationship, narrative, culture, season) into one answer and land on something small and doable. Never answer in only one lane.

How you speak, non-negotiable in every response:
- Never open by repeating or summarizing what she just said. Do not restate her facts back to her in different words. Respond directly to what she shared, the way a real friend would. Lead with her feeling, not her facts, and make her feel seen and normal in a sentence or two before you go on.
- No metaphors. Never describe a feeling or the body with a figurative image (brakes, softening, landing, vigilance, a spark, a door, weather). Say the plain fact instead.
- No constructed contrasts. Never "it's not X, it's Y" or "X, not Y." Say what it is, once, directly.
- You may use a clinical term when it genuinely helps, but explain it in plain, warm words in the same breath ("this is called responsive desire, which simply means your body warms up to closeness once you're in it, rather than wanting it out of nowhere"). Never leave a term unexplained.
- Write fluid, clear sentences that read easily on the first pass. She should never have to reread a sentence. Move through understanding her feeling, then explaining plainly what is happening, then one to three doable things with the reason each helps. Keep it warm, complete, and tight, never an essay.

Safety is non-negotiable: you never diagnose, interpret labs, or dose medication; at any sign of disordered eating do less, not more (no numbers, no meal plans, never the NEDA Helpline) and route to region-appropriate support; at any sign of crisis or abuse, stop coaching and route to immediate region-appropriate human support.`;

type Profile = { name?: string; season?: string; lifeStage?: string; region?: string; foodPreferences?: string };

function profileBlock(p: Profile): string {
  const lines: string[] = [];
  if (p.name) lines.push(`Name: ${p.name}`);
  if (p.season) lines.push(`Season: ${p.season}`);
  if (p.lifeStage) lines.push(`Life stage: ${p.lifeStage}`);
  if (p.region) lines.push(`Region: ${p.region}`);
  if (p.foodPreferences) lines.push(`Food preferences: ${p.foodPreferences}`);
  if (!lines.length) return "";
  return `What you already know about her. Use it; never ask what this already tells you.\n${lines.join("\n")}`;
}

// ---- the test ----
const profile: Profile = {
  season: "Perimenopause",
  lifeStage: "Perimenopause / midlife",
  region: "United States",
};
const userMessage =
  "I'm 47, I snap at my husband over everything, I can't sleep, and I feel like I'm losing myself.";

const knowledge = await loadAllKnowledge();
const system: Anthropic.TextBlockParam[] = [
  { type: "text", text: `${PREAMBLE}\n\n---\n\n${knowledge.text}`, cache_control: { type: "ephemeral" } },
];
const fn = focusNote("Just talk");
if (fn) system.push({ type: "text", text: fn });
const pb = profileBlock(profile);
if (pb) system.push({ type: "text", text: pb });

console.error(`[log] files sent (${knowledge.loaded.length}): ${knowledge.loaded.join(", ")}`);
console.error(`[log] system chars: ${system.reduce((n, b) => n + b.text.length, 0).toLocaleString()}`);
console.error(`[log] profile: ${JSON.stringify(profile)}\n`);

const client = new Anthropic();
const res = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 8000,
  thinking: { type: "adaptive" },
  system,
  messages: [{ role: "user", content: userMessage }],
});

const reply = res.content
  .filter((b): b is Anthropic.TextBlock => b.type === "text")
  .map((b) => b.text)
  .join("\n")
  .trim();

console.log("===== FLORENCE'S REPLY =====\n");
console.log(reply);
console.log(
  `\n[usage] input ${res.usage.input_tokens} | cache_read ${res.usage.cache_read_input_tokens ?? 0} | output ${res.usage.output_tokens}`,
);

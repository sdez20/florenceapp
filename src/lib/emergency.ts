// Verified emergency and crisis resources, by country.
//
// SAFETY RULE — READ BEFORE EDITING:
// A country belongs in this map ONLY when its numbers have been checked and
// confirmed current by a person. Florence is allowed to give a woman an
// emergency or crisis number ONLY for countries listed here. For every other
// country she gives NO number at all and routes her to her local emergency
// services (see the fallback in src/app/api/chat/route.ts).
//
// A wrong number in a crisis can cost a life. So an unverified country must stay
// OUT of this map — an empty/missing entry is the safe state, never a guess.
// Do NOT add a country here just because a number "seems right"; verify it first.

export type EmergencyResource = {
  emergency: string; // immediate danger: ambulance / police / fire
  crisis?: string; // mental-health / suicide crisis support
};

export const VERIFIED_EMERGENCY: Record<string, EmergencyResource> = {
  "United States": {
    emergency: "911",
    crisis: "the 988 Suicide & Crisis Lifeline (call or text 988)",
  },
  "Canada": {
    emergency: "911",
    crisis: "the 988 Suicide Crisis Helpline (call or text 988)",
  },
  "United Kingdom": {
    emergency: "999 (or 112)",
    crisis: "Samaritans on 116 123",
  },
  "Ireland": {
    emergency: "112 (or 999)",
    crisis: "Samaritans on 116 123",
  },
  "Australia": {
    emergency: "000",
    crisis: "Lifeline on 13 11 14",
  },
  "New Zealand": {
    emergency: "111",
    crisis: "1737 (call or text, free)",
  },
};

/** Returns verified resources for a country, or null when we have none for it. */
export function emergencyFor(country?: string): EmergencyResource | null {
  if (!country) return null;
  return VERIFIED_EMERGENCY[country.trim()] ?? null;
}

// ---------------------------------------------------------------------------
// Belt-and-suspenders hard stop.
//
// The primary safety control is the prompt (see the chat route). This is the
// backup: a deterministic server-side scrub that runs ONLY for countries with
// no verified numbers. For any such country, phone-number-shaped text is
// removed from Florence's reply before it reaches the woman, so even if the
// model ignored its instructions and produced a number, she never sees it.
// For verified countries this NEVER runs, so their correct numbers are always
// preserved untouched.

const REDACTION = "your local emergency number";

/** True when we must scrub numbers because the country isn't verified (or is
 *  unknown). Returns false for every country in the verified registry. */
export function shouldSanitizeEmergencyNumbers(country?: string): boolean {
  return emergencyFor(country) === null;
}

// Words that mark a sentence as being about reaching emergency or crisis help.
// Inside such a sentence, for an unverified country, we remove every short
// number too — that is where a wrong code like 112 or 199 would appear.
const EMERGENCY_CUE =
  /\b(call|dial|ring|phone|text|hotlines?|help\s?lines?|crisis|lifelines?|emergenc(?:y|ies)|ambulance|police|samaritans|counsell?or|suicid|self[-\s]?harm|in danger|hurt (?:yourself|myself)|kill (?:yourself|myself))\b/i;

/**
 * Removes phone-number-shaped text so a wrong or invented number can never
 * reach her. Two passes:
 *   1. Any grouped or long number with 6+ digits (hotlines, toll-free,
 *      international, 10-digit numbers) is removed everywhere.
 *   2. Inside any sentence about reaching emergency or crisis help, remaining
 *      short 2–5 digit numbers (e.g. 112, 199, 999) are removed too.
 * Everyday numbers in ordinary sentences (dates, "8 hours", "100 grams",
 * "roast at 350 for 25 minutes") are left alone, because those sentences carry
 * no emergency cue. Call this ONLY for unverified countries.
 */
export function stripPhoneLikeNumbers(text: string): string {
  // Pass 1: phone-shaped 6+ digit sequences, anywhere in the text.
  let out = text.replace(/\+?\d[\d\s()-]{3,}\d/g, (m) =>
    (m.match(/\d/g)?.length ?? 0) >= 6 ? REDACTION : m,
  );

  // Pass 2: within emergency/crisis sentences only, remove remaining short
  // numbers. Splitting on sentence punctuation keeps each cue scoped to its own
  // sentence, so an everyday number in a neighbouring sentence is untouched.
  out = out
    .split(/([.!?\n]+)/)
    .map((seg, i) =>
      i % 2 === 0 && EMERGENCY_CUE.test(seg)
        ? seg.replace(/\b\d{2,5}\b/g, REDACTION)
        : seg,
    )
    .join("");

  return out;
}

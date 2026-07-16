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

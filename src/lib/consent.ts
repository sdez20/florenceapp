import { TERMS_VERSION, PRIVACY_VERSION } from "./legal";

// The consent record. Stored client-side for now; this is the exact shape that
// will be written to the user's account row when the database is connected, so
// we can prove which boxes she checked, which versions she agreed to, and when.
export type ConsentRecord = {
  age18: boolean;
  agreedTermsPrivacy: boolean;
  acknowledgedWellness: boolean;
  termsVersion: string;
  privacyVersion: string;
  agreedAt: string; // ISO timestamp
};

const KEY = "florence:consent";

export function getConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ConsentRecord) : null;
  } catch {
    return null;
  }
}

export function saveConsent(record: ConsentRecord) {
  try {
    localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // localStorage unavailable — ignore.
  }
}

/** True only if she agreed to all three AND to the CURRENT terms/privacy versions. */
export function hasValidConsent(): boolean {
  const c = getConsent();
  return (
    !!c &&
    c.age18 &&
    c.agreedTermsPrivacy &&
    c.acknowledgedWellness &&
    c.termsVersion === TERMS_VERSION &&
    c.privacyVersion === PRIVACY_VERSION
  );
}

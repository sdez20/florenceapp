// Lightweight client-side store for the user's name. This is a temporary home
// until Supabase accounts are wired up; the same helpers can then read from the
// authenticated profile instead of localStorage.

const NAME_KEY = "florence:name";

export function setStoredName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name.trim());
  } catch {
    // localStorage unavailable (e.g. private mode) — ignore.
  }
}

export function getStoredName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

/** The first word of a full name, e.g. "Sarah" from "Sarah de Souza". */
export function firstNameOf(full: string): string {
  return full.trim().split(/\s+/)[0] ?? "";
}

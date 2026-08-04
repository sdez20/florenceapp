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

/** Capitalize the first letter of a name, leaving the rest as she typed it. A
 * name is a proper noun, so it always displays with a capital first letter. */
function capitalizeFirst(name: string): string {
  const trimmed = name.trimStart();
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed;
}

export function clearStoredName() {
  try {
    localStorage.removeItem(NAME_KEY);
  } catch {
    // localStorage unavailable — ignore.
  }
}

export function getStoredName(): string {
  try {
    return capitalizeFirst(localStorage.getItem(NAME_KEY) ?? "");
  } catch {
    return "";
  }
}

/** The first word of a full name, e.g. "Sarah" from "sarah de Souza", always
 * capitalized. */
export function firstNameOf(full: string): string {
  return capitalizeFirst(full.trim().split(/\s+/)[0] ?? "");
}

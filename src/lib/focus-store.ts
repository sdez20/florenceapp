// Remembers the focus area she last chose in chat, so the daily message can be
// grounded in her current focus. localStorage for now.

const KEY = "florence:last-focus";

export function getLastFocus(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function setLastFocus(focus: string) {
  try {
    if (focus && focus !== "Just talk") localStorage.setItem(KEY, focus);
  } catch {
    // ignore
  }
}

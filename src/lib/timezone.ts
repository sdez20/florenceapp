// Everything time-based in Florence reads from her stored IANA time zone, not
// the device clock, because she travels and the daily message must fire at the
// right local hour wherever she is. We capture the zone at signup (prefilled
// from the browser) and store the IANA string, never an offset.

/** The browser's current IANA zone, used to prefill her zone at signup. */
export function deviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** The hour (0–23) right now in the given IANA zone. */
export function hourInZone(zone: string, at: Date = new Date()): number {
  try {
    const s = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: zone,
    }).format(at);
    const h = parseInt(s, 10);
    if (!Number.isFinite(h)) return at.getHours();
    return h === 24 ? 0 : h; // some engines render midnight as "24"
  } catch {
    return at.getHours();
  }
}

export type Greeting =
  | "Good morning"
  | "Good afternoon"
  | "Good evening"
  | "Good night";

// Four windows. Night matters: a woman opening Florence at eleven at night is
// met differently from one opening it at eight in the morning.
//   04:00–11:59  Good morning
//   12:00–16:59  Good afternoon
//   17:00–20:59  Good evening
//   21:00–03:59  Good night
export function greetingForHour(hour: number): Greeting {
  if (hour >= 4 && hour <= 11) return "Good morning";
  if (hour >= 12 && hour <= 16) return "Good afternoon";
  if (hour >= 17 && hour <= 20) return "Good evening";
  return "Good night";
}

export function greetingForZone(zone: string, at: Date = new Date()): Greeting {
  return greetingForHour(hourInZone(zone, at));
}

/** The dashboard date, in her zone, read as "Friday, August 14". */
export function dateInZone(zone: string, at: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: zone,
    }).format(at);
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(at);
  }
}

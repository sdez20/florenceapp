// Local store for the daily message: how often she wants it, when it was last
// shown, and today's cached text. localStorage for now (moves to Supabase later).

export type Frequency = "daily" | "few" | "off";

export type DailyState = {
  frequency?: Frequency;
  lastShown?: string; // YYYY-MM-DD (local)
  message?: string; // today's cached message
};

const KEY = "florence:daily-message";

function todayStr(): string {
  const d = new Date();
  const z = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  if (isNaN(da) || isNaN(db)) return 999;
  return Math.round((db - da) / 86400000);
}

export function getDailyState(): DailyState {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as DailyState;
  } catch {
    return {};
  }
}

export function saveDailyState(update: DailyState) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...getDailyState(), ...update }));
  } catch {
    // localStorage unavailable — ignore.
  }
}

export function getFrequency(): Frequency {
  return getDailyState().frequency ?? "daily";
}

export function today(): string {
  return todayStr();
}

/** Today's already-generated message, if one was shown today. */
export function cachedMessageForToday(): string | null {
  const s = getDailyState();
  return s.lastShown === todayStr() && s.message ? s.message : null;
}

/** Whether a fresh message is due today, honoring frequency and the one-per-day
 *  maximum. Never true when off, never more than once per calendar day. */
export function isDueToday(): boolean {
  const s = getDailyState();
  const freq = s.frequency ?? "daily";
  if (freq === "off") return false;
  const t = todayStr();
  if (s.lastShown === t) return false; // one per day maximum
  if (freq === "daily") return true;
  // "a few times a week" — about three times, so at least every other day.
  if (!s.lastShown) return true;
  return daysBetween(s.lastShown, t) >= 2;
}

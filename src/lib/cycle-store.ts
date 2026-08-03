// Local store for her cycle inputs (last period start, cycle length,
// regularity). Mirrors the existing profile/user stores — localStorage for now,
// ready to move to the Supabase profile later.

export type Regularity = "regular" | "irregular" | "very-irregular";

export type Cycle = {
  lastPeriod?: string; // YYYY-MM-DD
  cycleLength?: number; // days
  regularity?: Regularity;
};

const CYCLE_KEY = "florence:cycle";

export function getCycle(): Cycle {
  try {
    return JSON.parse(localStorage.getItem(CYCLE_KEY) ?? "{}") as Cycle;
  } catch {
    return {};
  }
}

export function saveCycle(update: Cycle) {
  try {
    const next = { ...getCycle(), ...update };
    localStorage.setItem(CYCLE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — ignore.
  }
}

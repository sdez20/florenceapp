// Temporary client-side store for the answers a woman gives during onboarding
// (season, region, etc.). Like the name store, this lives in localStorage for
// now and will be swapped for the Supabase profile when we connect the database.
// The screen layouts read from here, so they already display her real data.

export type Profile = {
  season?: string;
  region?: string;
  language?: string;
  culture?: string;
  birthday?: string;
  source?: string;
};

const PROFILE_KEY = "florence:profile";

export function getProfile(): Profile {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}") as Profile;
  } catch {
    return {};
  }
}

export function saveProfile(update: Profile) {
  try {
    const next = { ...getProfile(), ...update };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — ignore.
  }
}

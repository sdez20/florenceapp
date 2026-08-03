// Cycle phase engine + cultural food maps.
//
// This is a faithful port of the source-of-truth content provided by the
// founder (PHASES, cyc, DISHES, FOCUS, plus season bodies and FOCUS_OPTS).
// Nothing here is invented. Two safety rules govern how it is USED in the UI:
//   1. `score` is internal only and is NEVER shown to a woman (no numbers she
//      can fail at). It is kept so the underlying data stays intact.
//   2. Pregnancy / postpartum / TTC food specifics are gated: the UI defers to
//      her doctor or midwife instead of showing them (see GATED_SEASONS).

export type PhaseKey = "menstrual" | "follicular" | "ovulatory" | "luteal";

export type PhaseBody = {
  subtitle: string;
  /** Internal only — never rendered to the user. */
  score: number;
  hormone: string;
  gut: string;
};

// ---- Cycle phases ----------------------------------------------------------
export const PHASES: Record<PhaseKey, PhaseBody> = {
  menstrual: { subtitle: "The Deep Release", score: 82, hormone: "Estrogen and progesterone are at their lowest as your body releases the lining. Inflammation runs high.", gut: "Prostaglandins can make digestion tender." },
  follicular: { subtitle: "The Rise", score: 46, hormone: "Estrogen climbs and testosterone stirs. Energy and optimism return.", gut: "Digestion steadies and handles fresh food well." },
  ovulatory: { subtitle: "The High Radiance", score: 36, hormone: "Estrogen peaks and testosterone surges briefly. Confidence and energy are highest.", gut: "The estrobolome works to clear estrogen, so fiber matters most." },
  luteal: { subtitle: "The Slow Turn", score: 66, hormone: "Progesterone rises and metabolism lifts, so your body asks for more fuel.", gut: "Progesterone slows the gut, so bloating is common and normal." },
};

// ---- Season bodies (non-cycling seasons) -----------------------------------
export const SEASON_BODY: Record<string, PhaseBody> = {
  ttc: { subtitle: "The Open Window", score: 52, hormone: "Your body is preparing to welcome life. The work now is steady hormones and a calm system.", gut: "Your gut shapes how you absorb the nutrients fertility depends on." },
  postpartum: { subtitle: "The Fourth Trimester", score: 88, hormone: "Your hormones drop sharply after birth while your body recovers from something enormous.", gut: "Your core and digestion are healing, so warm, soft food is kindest." },
  perimenopause: { subtitle: "The Long Turn", score: 70, hormone: "Estrogen and progesterone swing unpredictably, moving sleep, mood, temperature, and energy.", gut: "Shifting estrogen changes how you handle sugar, so steady blood sugar is the anchor." },
  menopause: { subtitle: "The Threshold", score: 60, hormone: "You are at or near your final period. Symptoms can peak here before they ease.", gut: "Digestion slows and sensitivities can rise." },
  postmenopause: { subtitle: "The Clearing", score: 54, hormone: "Estrogen rests at a low, steady baseline. The focus is bones, heart, and steady strength.", gut: "Calmer but slower digestion, so protein and fiber keep you strong." },
};

export function pregBody(t: 1 | 2 | 3): PhaseBody {
  if (t === 1) return { subtitle: "First Trimester", score: 80, hormone: "hCG and progesterone surge to hold the pregnancy, which is why nausea and exhaustion hit hard.", gut: "Nausea and slow digestion are common, so small, plain food is kindest." };
  if (t === 2) return { subtitle: "Second Trimester", score: 62, hormone: "Hormones steady and energy often returns.", gut: "Appetite returns and digestion eases, though heartburn can begin." };
  return { subtitle: "Third Trimester", score: 78, hormone: "Progesterone and relaxin peak as your body prepares for birth.", gut: "A smaller stomach means smaller, more frequent meals." };
}

// ---- Nutrition focus per phase/season (qualitative, no numbers) ------------
export const FOCUS: Record<string, string> = {
  menstrual: "Warm, mineral rich, blood building food. Lean into iron, zinc, and gentle anti-inflammatory warmth.",
  follicular: "Light, fresh, cruciferous food to support your liver as estrogen rises.",
  ovulatory: "High fiber, antioxidant rich, fresh food to help your body clear estrogen.",
  luteal: "Steady, slow burning food with magnesium and B vitamins to keep blood sugar and mood even.",
  ttc: "Folate, iron, healthy fats, and steady protein to build a calm, well resourced foundation.",
  pregnancy: "Gentle, frequent, nourishing food with folate, protein, and iron. A season to be fed, not to restrict.",
  postpartum: "Warm, soft, iron and protein rich, deeply replenishing food. A season to be fed by others.",
  perimenopause: "Protein, magnesium, phytoestrogens, and slow carbohydrates to steady the swings and protect your bones.",
  menopause: "Protein, calcium, phytoestrogens, and cooling, steady food through the transition.",
  postmenopause: "Protein, calcium, phytoestrogens, and healthy fats for strong bones and a steady heart.",
};

// ---- Per-culture dishes ----------------------------------------------------
export const DISHES: Record<string, Record<string, string>> = {
  "Trinidad & Tobago": { menstrual: "Callaloo with crab and dasheen, warm and iron rich, with ground provision.", follicular: "Steamed fish with sautéed bhaji and a fresh cucumber chow.", ovulatory: "Curried channa and aloo with fresh herbs and fiber rich greens.", luteal: "Stewed red beans with brown rice and pumpkin.", ttc: "Sautéed bhaji with saltfish, avocado, and a soft egg.", pregnancy: "Light fish broth with ground provision and dasheen leaves.", postpartum: "Warm cornmeal porridge and a nourishing fish broth.", perimenopause: "Grilled fish with stewed lentils, callaloo, and ground provision.", menopause: "Stewed beans and callaloo with pumpkin seeds.", postmenopause: "Stewed lentils with callaloo and ground provision." },
  "Jamaica": { menstrual: "Steamed callaloo with salt mackerel and boiled green banana.", follicular: "Brown stew fish with steamed greens and tomato salad.", ovulatory: "Ackee with sautéed callaloo and fiber rich provisions.", luteal: "Red peas stew with brown rice and pumpkin.", ttc: "Callaloo and saltfish with avocado and a soft egg.", pregnancy: "Gentle fish tea with ground provision and dasheen leaf.", postpartum: "Warm cornmeal porridge with nutmeg and a nourishing broth.", perimenopause: "Grilled fish with steamed callaloo and provision.", menopause: "Stewed peas with greens and pumpkin seeds.", postmenopause: "Lentil and callaloo stew with provisions." },
  "Italian": { menstrual: "Lentil and tomato soup with iron rich greens and olive oil.", follicular: "Roasted broccoli and cauliflower with wild sardines.", ovulatory: "Chickpea and herb salad with cucumber and lemon.", luteal: "Slow cooked white beans with greens and a soft egg.", ttc: "Wild salmon with lentils and leafy greens.", pregnancy: "Soft egg with spinach, white beans, and good bread.", postpartum: "Brothy pastina with greens and parmesan.", perimenopause: "Grilled fish with chickpeas, greens, and olive oil.", menopause: "Sardines and white beans with greens and walnuts.", postmenopause: "Bean and greens minestrone with olive oil." },
  "Japanese": { menstrual: "Miso soup with seaweed, tofu, and warm rice.", follicular: "Steamed fish with sautéed greens and pickled vegetables.", ovulatory: "Fiber rich salad with edamame, seaweed, and sesame.", luteal: "Donburi with brown rice, salmon, and steamed greens.", ttc: "Grilled mackerel with rice, natto, and greens.", pregnancy: "Soft rice porridge (okayu) with egg and greens.", postpartum: "Warm okayu with miso and soft fish.", perimenopause: "Tofu and vegetable nabe with edamame.", menopause: "Miso and tofu broth with seaweed and greens.", postmenopause: "Tofu, seaweed, and sesame bowl." },
  "Mexican": { menstrual: "Black bean and pumpkin stew with cumin and a soft tortilla.", follicular: "Grilled fish with cabbage and lime slaw.", ovulatory: "Black bean, corn, tomato, and avocado salad.", luteal: "Lentil and squash guiso with brown rice.", ttc: "Beans and greens with avocado and a soft egg.", pregnancy: "Gentle chicken and vegetable caldo with squash.", postpartum: "Warm atole and a nourishing chicken caldo.", perimenopause: "Beans with greens and pepitas.", menopause: "Bean and squash bowl with pepitas.", postmenopause: "Quinoa and bean bowl with pumpkin seeds." },
  "Indian": { menstrual: "Moong dal khichdi with ghee and ginger.", follicular: "Sautéed methi greens with chickpeas and lemon.", ovulatory: "Kachumber salad with sprouted moong and cucumber.", luteal: "Rajma with brown rice and a little ghee.", ttc: "Spinach and lentil dal with ghee and a soft egg.", pregnancy: "Soft moong khichdi with ghee.", postpartum: "Panjiri or warm dal khichdi with ghee.", perimenopause: "Chana masala with greens and ground flaxseed.", menopause: "Sesame and greens sabzi with dal.", postmenopause: "Dal with greens and sesame." },
  "American": { menstrual: "Lentil soup with spinach and warm sweet potato.", follicular: "Grilled salmon with roasted broccoli and salad.", ovulatory: "A grain and chickpea bowl with vegetables.", luteal: "Turkey chili with beans and squash.", ttc: "Salmon with leafy greens, lentils, and avocado.", pregnancy: "Scrambled eggs with spinach and whole grain toast.", postpartum: "Warm oatmeal with nut butter and vegetable soup.", perimenopause: "Salmon with quinoa, greens, and olive oil.", menopause: "Bean and vegetable stew with walnuts.", postmenopause: "Salmon and lentil bowl with greens." },
};

/** Cultural dish + its qualitative "why", with the founder's graceful fallback
 *  when a culture isn't in the library yet. */
export function dishFor(heritage: string, key: string): { main: string; why: string } {
  if (DISHES[heritage] && DISHES[heritage][key]) {
    return { main: DISHES[heritage][key], why: FOCUS[key] };
  }
  return {
    main: FOCUS[key] ?? "",
    why: "A signature dish from your " + heritage + " kitchen is on the way as we build the library with a nutritionist.",
  };
}

// ---- Offered focus areas ---------------------------------------------------
// Full list kept as the source of truth; "Menopause" is temporarily removed
// from what is OFFERED (its underlying content in SEASON_BODY/FOCUS/DISHES is
// untouched and can be re-enabled later). Perimenopause remains available.
export const FOCUS_OPTS_ALL = [
  "Energy", "Hormones", "Gut health", "Fertility", "Pregnancy", "Menopause",
  "Stress and burnout", "Sleep", "Mood", "Relationships", "Finding myself again",
];
export const FOCUS_OPTS = FOCUS_OPTS_ALL.filter((f) => f !== "Menopause");

// Seasons where Florence gives no food specifics and defers to a clinician.
export const GATED_SEASONS = ["ttc", "pregnancy", "postpartum"];

// ---- Date + cycle helpers (verbatim logic) ---------------------------------
export function fmt(d: Date): string {
  const z = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function dbetween(a: string): number {
  const x = new Date(a + "T00:00:00");
  if (isNaN(x.getTime())) return 0;
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((t.getTime() - x.getTime()) / 86400000));
}

/** The founder's phase calculation. `l` is the last period start (YYYY-MM-DD),
 *  `len` the cycle length in days. Returns the cycle day and phase key. */
export function cyc(l: string, len: number): { day: number; phase: PhaseKey } {
  const day = (dbetween(l) % len) + 1;
  const ov = Math.max(11, len - 14);
  return {
    day,
    phase:
      day <= 5 ? "menstrual" : day < ov - 1 ? "follicular" : day <= ov + 1 ? "ovulatory" : "luteal",
  };
}

export const PHASE_LABEL: Record<PhaseKey, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulatory: "Ovulatory",
  luteal: "Luteal",
};

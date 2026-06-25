import { promises as fs } from "fs";
import path from "path";

/**
 * Florence's knowledge base lives in /florence-knowledge-base as markdown files.
 * VOICE-RULES + the MASTER INTEGRATION LAYER are sent on EVERY request (they
 * define her voice and how she thinks). The deeper topic documents are pulled in
 * selectively — by the focus the woman picks, or by what she's asking about.
 */

const KB_DIR = path.join(process.cwd(), "florence-knowledge-base");

// Always sent, on every single message.
const ALWAYS_DOCS = ["VOICE-RULES.md", "00-MASTER-INTEGRATION-LAYER.md"];

// The focus options in the chat dropdown → the deep document each one loads.
const FOCUS_TO_DOC: Record<string, string> = {
  "Relational intelligence": "02-relational-intelligence-DEEP.md",
  "Holistic nutrition": "03-holistic-nutrition-DEEP.md",
  "Skin health": "04-skin-health-DEEP.md",
  "Intimacy & desire": "27-desire-sexuality-APPLIED.md",
  "Steadying the body": "05-steadying-the-body-DEEP.md",
  Boundaries: "06-boundaries-DEEP.md",
  "This season of life": "07-this-season-of-life-DEEP.md",
  "Just talk": "08-just-talk-DEEP.md",
};

// Keywords that pull in a deep document when there's no focus (or to supplement
// the focus) based on what the woman is actually writing about.
const TOPIC_KEYWORDS: { file: string; keywords: string[] }[] = [
  { file: "01-mental-emotional-wellbeing-DEEP.md", keywords: ["anxious", "anxiety", "depress", "sad", "overwhelm", "stress", "mood", "panic", "lonely", "grief", "numb", "burnout", "worry", "cry", "emotion"] },
  { file: "02-relational-intelligence-DEEP.md", keywords: ["relationship", "partner", "husband", "wife", "friend", "family", "mother", "father", "conflict", "argument", "marriage", "in-law", "colleague", "co-worker"] },
  { file: "03-holistic-nutrition-DEEP.md", keywords: ["eat", "food", "nutrition", "meal", "diet", "cook", "snack", "nourish", "appetite", "digest"] },
  { file: "04-skin-health-DEEP.md", keywords: ["skin", "acne", "breakout", "wrinkle", "complexion", "eczema", "glow", "dryness", "pores"] },
  { file: "05-steadying-the-body-DEEP.md", keywords: ["sleep", "tired", "exhausted", "nervous system", "calm", "breathe", "rest", "insomnia", "ground", "restless"] },
  { file: "06-boundaries-DEEP.md", keywords: ["boundary", "boundaries", "say no", "overcommit", "guilt", "people-please", "people please", "limits", "resentment"] },
  { file: "07-this-season-of-life-DEEP.md", keywords: ["season", "perimenopause", "menopause", "pregnan", "postpartum", "conceive", "fertility", "life stage", "trimester"] },
  { file: "09-narrative-therapy-DEEP.md", keywords: ["story", "identity", "meaning", "narrative", "reframe", "self-worth", "who i am", "purpose"] },
  { file: "10-cultural-intelligence-DEEP.md", keywords: ["culture", "heritage", "tradition", "religion", "faith", "community", "caribbean", "immigrant", "roots", "ancestry"] },
  { file: "11-life-stages-conditions-DEEP.md", keywords: ["pcos", "endometriosis", "thyroid", "diagnosis", "fibroid", "condition", "ivf"] },
  { file: "13-food-and-body-DEEP.md", keywords: ["body image", "weight", "hunger", "fullness", "craving", "binge", "restrict"] },
  { file: "15-womens-hormonal-health-DEEP.md", keywords: ["hormone", "hormonal", "period", "cycle", "pms", "estrogen", "progesterone", "libido", "ovulation", "menstrual", "cramps", "bleeding"] },
  { file: "27-desire-sexuality-APPLIED.md", keywords: ["sex", "desire", "libido", "intimacy", "arousal", "pleasure", "orgasm", "attraction", "sexual"] },
];

// Simple in-memory cache so we read each file from disk only once per server run.
const cache = new Map<string, string>();

async function readDoc(file: string): Promise<string> {
  const cached = cache.get(file);
  if (cached !== undefined) return cached;
  const text = await fs.readFile(path.join(KB_DIR, file), "utf8");
  cache.set(file, text);
  return text;
}

/** Rank deep docs by how many of their keywords appear in the woman's message. */
function topicMatches(latestUserText: string): string[] {
  const text = latestUserText.toLowerCase();
  return TOPIC_KEYWORDS.map(({ file, keywords }) => ({
    file,
    score: keywords.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0),
  }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((m) => m.file);
}

const MAX_DEEP_DOCS = 2;

export async function selectKnowledge({
  focus,
  latestUserText,
}: {
  focus?: string;
  latestUserText: string;
}): Promise<{ alwaysText: string; deepText: string; loaded: string[] }> {
  // 1. The always-on pair, every request.
  const alwaysParts = await Promise.all(
    ALWAYS_DOCS.map(async (file) => `# ${file}\n\n${await readDoc(file)}`),
  );
  const alwaysText = alwaysParts.join("\n\n---\n\n");

  // 2. Decide which deep docs to include: the picked focus first, then topic matches.
  const chosen: string[] = [];
  const focusDoc = focus ? FOCUS_TO_DOC[focus] : undefined;
  if (focusDoc) chosen.push(focusDoc);
  for (const file of topicMatches(latestUserText)) {
    if (chosen.length >= MAX_DEEP_DOCS) break;
    if (!chosen.includes(file)) chosen.push(file);
  }

  // 3. Load and concatenate the chosen deep docs (may be empty → voice + integration only).
  const deepParts = await Promise.all(
    chosen.map(async (file) => `# Deeper knowledge — ${file}\n\n${await readDoc(file)}`),
  );
  const deepText = deepParts.join("\n\n---\n\n");

  return { alwaysText, deepText, loaded: [...ALWAYS_DOCS, ...chosen] };
}

import { promises as fs } from "fs";
import path from "path";

/**
 * Florence's knowledge base lives in /florence-knowledge-base.
 * VOICE-RULES + the MASTER INTEGRATION LAYER are sent on EVERY request (they
 * define her voice and how she thinks). The deep topic documents are pulled in
 * by the focus she picks, plus what she's actually writing about.
 */

const KB_DIR = path.join(process.cwd(), "florence-knowledge-base");

// Always sent, on every single message — with or without a focus.
export const ALWAYS_DOCS = ["VOICE-RULES.md", "00-MASTER-INTEGRATION-LAYER.md"];

// The nine focus options → the deep file(s) each one loads.
export const FOCUS_TO_DOCS: Record<string, string[]> = {
  "Mental and emotional wellbeing": ["01-mental-emotional-wellbeing-DEEP.md"],
  "Relational intelligence": ["02-relational-intelligence-DEEP.md"],
  "Holistic nutrition": [
    "03-holistic-nutrition-DEEP.md",
    "13-food-and-body-DEEP.md", // governs all food talk (safety)
  ],
  "Skin health": ["04-skin-health-DEEP.md"],
  "Intimacy and desire": ["16-desire-sexuality-DEEP.md"],
  "Stress and the nervous system": ["05-stress-and-nervous-system-DEEP.md"],
  Boundaries: ["06-boundaries-DEEP.md"],
  "This season of life": [
    "07-this-season-of-life-DEEP.md",
    "11-life-stages-conditions-DEEP.md",
    "14-holistic-endocrinology-DEEP.md",
    "15-womens-hormonal-health-DEEP.md",
  ],
  "Just talk": [],
};

// When there's no focus (or to supplement it), pull a deep file based on what
// she's writing about. 13-food-and-body is keyed to ANY food/eating signal for
// safety, regardless of focus.
const TOPIC_KEYWORDS: { file: string; keywords: string[] }[] = [
  { file: "01-mental-emotional-wellbeing-DEEP.md", keywords: ["anxious", "anxiety", "depress", "sad", "overwhelm", "mood", "panic", "lonely", "grief", "numb", "burnout", "worry", "cry", "losing myself", "lost myself"] },
  { file: "02-relational-intelligence-DEEP.md", keywords: ["husband", "wife", "partner", "boyfriend", "relationship", "friend", "family", "mother", "father", "conflict", "argument", "snap at", "marriage", "in-law"] },
  { file: "05-stress-and-nervous-system-DEEP.md", keywords: ["stress", "sleep", "can't sleep", "insomnia", "tired", "exhausted", "nervous", "calm", "rest", "overwhelm", "wired", "on edge", "restless"] },
  { file: "06-boundaries-DEEP.md", keywords: ["boundary", "boundaries", "say no", "overcommit", "guilt", "people-please", "resentment"] },
  { file: "07-this-season-of-life-DEEP.md", keywords: ["perimenopause", "menopause", "pregnan", "postpartum", "conceive", "fertility", "life stage", "47", "48", "49", "50", "my age"] },
  { file: "09-narrative-therapy-DEEP.md", keywords: ["who i am", "identity", "meaning", "story of", "self-worth", "purpose"] },
  { file: "10-cultural-intelligence-DEEP.md", keywords: ["culture", "heritage", "tradition", "religion", "faith", "community", "caribbean", "immigrant"] },
  { file: "13-food-and-body-DEEP.md", keywords: ["eat", "eating", "food", "meal", "diet", "weight", "calorie", "binge", "restrict", "body image", "hunger", "skipping meals"] },
  { file: "14-holistic-endocrinology-DEEP.md", keywords: ["hormone", "hormonal", "thyroid", "cortisol", "estrogen", "progesterone", "insulin"] },
  { file: "15-womens-hormonal-health-DEEP.md", keywords: ["period", "cycle", "pms", "libido", "ovulation", "menstrual", "cramps", "bleeding", "hot flash", "night sweat"] },
  { file: "16-desire-sexuality-DEEP.md", keywords: ["sex", "desire", "libido", "intimacy", "arousal", "pleasure", "attraction"] },
];

// Read the actual file text fresh from disk on EVERY request (no caching), so
// the system prompt is rebuilt each time and always reflects the current files.
async function readDoc(file: string): Promise<string> {
  return fs.readFile(path.join(KB_DIR, file), "utf8");
}

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

// Cap total deep files so a single request stays focused.
const MAX_DEEP_DOCS = 6;

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

  // 2. Focus files first (all of them), then topic matches by what she wrote.
  const chosen: string[] = [];
  for (const file of (focus && FOCUS_TO_DOCS[focus]) || []) {
    if (!chosen.includes(file)) chosen.push(file);
  }
  for (const file of topicMatches(latestUserText)) {
    if (chosen.length >= MAX_DEEP_DOCS) break;
    if (!chosen.includes(file)) chosen.push(file);
  }

  // 3. Load and concatenate the chosen deep docs.
  const deepParts = await Promise.all(
    chosen.map(async (file) => `# Deeper knowledge — ${file}\n\n${await readDoc(file)}`),
  );
  const deepText = deepParts.join("\n\n---\n\n");

  return { alwaysText, deepText, loaded: [...ALWAYS_DOCS, ...chosen] };
}

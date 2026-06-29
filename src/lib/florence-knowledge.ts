import { promises as fs } from "fs";
import path from "path";

/**
 * Florence's full knowledge base. ALL of it is sent on EVERY request as hidden
 * model instructions: VOICE-RULES + the master integration layer + all 17 deep
 * documents. She draws on everything woven together, never one lane. The user
 * never sees any of it. When a focus is chosen, everything still loads and the
 * matching document is weighted most heavily.
 */

const KB_DIR = path.join(process.cwd(), "florence-knowledge-base");

export const ALWAYS_DOCS = ["VOICE-RULES.md", "00-MASTER-INTEGRATION-LAYER.md"];

export const DEEP_DOCS = [
  "01-mental-emotional-wellbeing-DEEP.md",
  "02-relational-intelligence-DEEP.md",
  "03-holistic-nutrition-DEEP.md",
  "04-skin-health-DEEP.md",
  "05-stress-and-nervous-system-DEEP.md",
  "06-boundaries-DEEP.md",
  "07-this-season-of-life-DEEP.md",
  "08-just-talk-DEEP.md",
  "09-narrative-therapy-DEEP.md",
  "10-cultural-intelligence-DEEP.md",
  "11-life-stages-conditions-DEEP.md",
  "12-supporting-knowledge-DEEP.md",
  "13-food-and-body-DEEP.md",
  "14-holistic-endocrinology-DEEP.md",
  "15-womens-hormonal-health-DEEP.md",
  "16-desire-sexuality-DEEP.md",
  "SOURCES.md",
];

// focus → the document(s) to weight most heavily (everything still loads).
export const FOCUS_TO_PRIMARY: Record<string, string[]> = {
  "Mental and emotional wellbeing": ["01-mental-emotional-wellbeing-DEEP.md"],
  "Relational intelligence": ["02-relational-intelligence-DEEP.md"],
  "Holistic nutrition": ["03-holistic-nutrition-DEEP.md", "13-food-and-body-DEEP.md"],
  "Skin health": ["04-skin-health-DEEP.md"],
  "Stress and the nervous system": ["05-stress-and-nervous-system-DEEP.md"],
  Boundaries: ["06-boundaries-DEEP.md"],
  "This season of life": ["07-this-season-of-life-DEEP.md"],
  "Intimacy and desire": ["16-desire-sexuality-DEEP.md"],
  "Just talk": [],
};

async function readDoc(file: string): Promise<string> {
  return fs.readFile(path.join(KB_DIR, file), "utf8");
}

/** Read VOICE + MASTER + all 17 deep docs fresh from disk and concatenate them. */
export async function loadAllKnowledge(): Promise<{ text: string; loaded: string[] }> {
  const files = [...ALWAYS_DOCS, ...DEEP_DOCS];
  const parts = await Promise.all(
    files.map(async (file) => `# ${file}\n\n${await readDoc(file)}`),
  );
  return { text: parts.join("\n\n---\n\n"), loaded: files };
}

/** A short note telling the model which document to weight most for this chat. */
export function focusNote(focus?: string): string {
  const primary = focus ? FOCUS_TO_PRIMARY[focus] : undefined;
  if (!primary || primary.length === 0) return "";
  return `For this conversation she has chosen the focus "${focus}". Weight the knowledge in ${primary.join(
    " and ",
  )} most heavily, while still drawing on everything relevant and weaving the domains into one answer.`;
}

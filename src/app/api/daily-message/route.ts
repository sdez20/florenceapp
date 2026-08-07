import Anthropic from "@anthropic-ai/sdk";
import { loadAllKnowledge } from "@/lib/florence-knowledge";
import { buildSystemBlocks, type Profile } from "@/lib/florence-prompt";
import { shouldSanitizeEmergencyNumbers, stripPhoneLikeNumbers } from "@/lib/emergency";
import { cyc, PHASES, FOCUS, PHASE_LABEL, type PhaseKey } from "@/lib/florence-cycle";
import { createClient } from "@/lib/supabase/server";
import { formatHistory } from "@/lib/history";

export const runtime = "nodejs";

// Reads her recent conversations + check-ins from Supabase, scoped to the
// signed-in user by Row Level Security. Returns "" if she isn't signed in,
// Supabase isn't configured, or there's nothing yet.
async function recentHistoryBlock(): Promise<string> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return "";
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "";

    const [msgs, checks] = await Promise.all([
      supabase
        .from("messages")
        .select("role,content,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("checkins")
        .select("day,mental,emotional,nutrition")
        .eq("user_id", user.id)
        .order("day", { ascending: false })
        .limit(7),
    ]);
    return formatHistory(msgs.data ?? [], checks.data ?? []);
  } catch {
    return "";
  }
}

type Body = {
  focus?: string;
  profile?: Profile;
  cycle?: { lastPeriod?: string; cycleLength?: number } | null;
  // The client already knows her season is gated (pregnancy/postpartum/TTC),
  // where cycle-phase framing and food specifics don't apply.
  gatedSeason?: boolean;
};

// The daily message is Florence reaching out, unprompted, once a day.
function dailyTask(focus?: string): string {
  return `TASK: Write ONE short daily message for her — the kind of thing a wise, warm friend texts out of the blue because she was thinking of her. This is not a conversation and she has not asked a question; you are reaching out to her.
Ground it in what is real for her today, drawing on ALL of what you know: her actual recent conversations and check-ins (given below if available), her current focus${
    focus ? ` (${focus})` : ""
  }, her cycle phase, and her profile. The message should reflect what she has genuinely been talking about and going through — it should feel like you remember her — never generic wellness wallpaper, never a line like "stay hydrated" or "take a deep breath" that could be sent to anyone.
Keep it to two or three warm sentences. End by gently and optionally inviting her to talk with you if she would like — never a task, never homework, never guilt, and never mention logging, tracking, streaks, or anything she did or did not do.
Tone: warm, light, entirely optional.
DEFER TO SAFETY: read her recent history honestly. If it suggests she may be dealing with something heavy right now (crisis, grief, loss, an eating struggle, real pain, or a tender season like early postpartum), do NOT be cheerful or brisk. Be gentle and brief, offer quiet presence, and simply let her know you are here. If a bright daily note would land wrong, a soft one-line "I'm here whenever you want me" is far better than forced positivity. And if, given what she is going through, the kindest thing today is to send nothing at all, reply with exactly [SILENT] and nothing else. The safety rules in your preamble override this task entirely.
Write ONLY the message itself: no preamble, no sign-off, no quotation marks.`;
}

function phaseContext(phase: PhaseKey): string {
  return `Where her body is this week: her ${PHASE_LABEL[phase]} phase, "${PHASES[phase].subtitle}". ${PHASES[phase].hormone} ${PHASES[phase].gut} If nourishment comes up, a gentle qualitative direction for this phase is: ${FOCUS[phase]} — but speak it warmly and never as numbers. Let where she is this week make the message feel true to her body.`;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ message: null, error: "no_api_key" }, { status: 200 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: null }, { status: 200 });
  }

  // Compute her current cycle phase (unless her season is gated, where the
  // cycle framing doesn't apply and food specifics defer to her clinician).
  let phase: PhaseKey | null = null;
  if (!body.gatedSeason && body.cycle?.lastPeriod && body.cycle?.cycleLength) {
    phase = cyc(body.cycle.lastPeriod, body.cycle.cycleLength).phase;
  }

  const extraBlocks = [dailyTask(body.focus)];
  if (phase) extraBlocks.push(phaseContext(phase));
  if (body.gatedSeason) {
    extraBlocks.push(
      "She is in pregnancy, postpartum, or trying to conceive. Do not give food, supplement, or medical specifics for this season; keep the message purely warm and emotional, and leave anything clinical to her doctor or midwife.",
    );
  }
  // Her real recent history (RLS-scoped to her). This is what lets the message
  // remember her and judge her state honestly.
  const history = await recentHistoryBlock();
  if (history) extraBlocks.push(history);

  const knowledge = await loadAllKnowledge();
  const system = buildSystemBlocks({
    knowledgeText: knowledge.text,
    focus: body.focus,
    profile: body.profile,
    extraBlocks,
  });

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1200,
      thinking: { type: "adaptive" },
      system,
      messages: [
        { role: "user", content: "[New day — write today's daily message per the task instructions.]" },
      ],
    });

    // If safety declined, stay quiet rather than send anything.
    if (res.stop_reason === "refusal") {
      return Response.json({ message: null }, { status: 200 });
    }

    let text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    // She's dealing with something heavy and Florence chose to stay silent today.
    if (text.replace(/[[\]]/g, "").trim().toLowerCase() === "silent") {
      return Response.json({ message: null }, { status: 200 });
    }

    // Belt-and-suspenders: scrub any number-shaped text for unverified countries.
    if (shouldSanitizeEmergencyNumbers(body.profile?.region)) {
      text = stripPhoneLikeNumbers(text);
    }

    return Response.json({ message: text || null }, { status: 200 });
  } catch (err) {
    // Fail quiet — no daily message is better than an error in her face.
    console.error("Florence daily-message error:", err);
    return Response.json({ message: null }, { status: 200 });
  }
}

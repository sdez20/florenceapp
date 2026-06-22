import PhoneFrame from "@/components/PhoneFrame";
import NavMenu from "@/components/NavMenu";
import BackLink from "@/components/BackLink";

const categories = [
  {
    name: "Nutrition for today",
    dot: "#97A06E",
    notes: [
      "Eat at regular times on your busy days. When you skip, your blood sugar drops, and the afternoon low in your mood and energy follows from there.",
      "Warm, cooked food this week, stewed callaloo, dasheen, pumpkin, lentil soup. Your gut is more sensitive while you are bleeding, and cooked food breaks down easier, so the bloating eases.",
    ],
  },
  {
    name: "For mental clarity",
    dot: "#6E7B4C",
    notes: [
      "Eggs, salmon, or beans with greens at lunch before back-to-back meetings. The protein holds your blood sugar steady, so your focus does not crash mid-afternoon.",
    ],
  },
  {
    name: "To calm your nerves",
    dot: "#B0A06F",
    notes: [
      "Chamomile or tulsi tea in the evening. Both calm your nervous system, which is what lets your body shift out of the day and toward sleep.",
      "**Breathing:** four counts in, six counts out, before you walk into the room. A longer exhale lowers your heart rate and tells your body you are not in danger.",
    ],
  },
  {
    name: "For your sleep",
    dot: "#1F2A22",
    notes: [
      "Screens down an hour before bed. The light holds off the melatonin your body needs to fall asleep, and your sleep has been the thread under a lot of how you have felt.",
    ],
  },
];

/** Renders a note, bolding a leading "**label:**" prefix as the design does. */
function NoteText({ text }: { text: string }) {
  const match = text.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (match) {
    return (
      <p className="text-[13.5px] font-light leading-[1.55] text-ink">
        <strong className="font-semibold text-ink">{match[1]}</strong> {match[2]}
      </p>
    );
  }
  return (
    <p className="text-[13.5px] font-light leading-[1.55] text-ink">{text}</p>
  );
}

export default function NotesPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-5 pt-14">
        <div className="flex items-center gap-[14px]">
          <BackLink href="/today" />
          <span className="font-serif text-[32px] font-semibold text-ink">
            Today&apos;s notes
          </span>
        </div>
        <div className="mb-[26px] ml-9 mt-0.5 text-[12px] text-ink-soft">
          Sunday, 14 June
        </div>

        {categories.map((cat) => (
          <div key={cat.name} className="mb-[22px]">
            <div className="mb-[11px] flex items-center gap-[10px]">
              <span
                className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                style={{ background: cat.dot }}
              />
              <span className="font-serif text-[18px] font-semibold text-ink">
                {cat.name}
              </span>
            </div>
            {cat.notes.map((note, i) => (
              <div
                key={i}
                className="mb-2 rounded-[13px] border border-olive/15 px-[15px] py-[14px]"
              >
                <NoteText text={note} />
              </div>
            ))}
          </div>
        ))}

        <span className="mt-0.5 inline-block cursor-pointer text-[12px] font-semibold tracking-[0.04em] text-clay">
          + Add a note of your own
        </span>
      </div>

      <NavMenu />
    </PhoneFrame>
  );
}

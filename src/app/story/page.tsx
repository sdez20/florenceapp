import PhoneFrame from "@/components/PhoneFrame";
import NavMenu from "@/components/NavMenu";

type Chapter = {
  season: string;
  when: string;
  paras: { text: string; em?: string }[];
  threads: string[];
};

const chapters: Chapter[] = [
  {
    season: "This spring",
    when: "March to now",
    paras: [
      {
        text: "You came into this season tired in a way sleep wasn't fixing. Over the weeks, you started protecting your evenings, and your mind began to feel clearer. ",
        em: "You said the dread comes before every one of these, and that naming it out loud made those mornings easier.",
      },
      {
        text: "Your eating steadied once you stopped skipping meals on the hard days. Your energy followed, and so did your mood. The bloating that worried you in March eased as your gut settled.",
      },
    ],
    threads: ["Steadier sleep", "Calmer mind", "Steadier eating"],
  },
  {
    season: "Late winter",
    when: "January to February",
    paras: [
      {
        text: "A heavier stretch. You were carrying a lot at work and feeling things closer to the surface than usual. ",
        em: "You said you were being hard on yourself during these weeks.",
      },
      {
        text: "Your appetite was uneven through these weeks, and you noticed how much your energy depended on whether you'd eaten. You started paying attention to that thread, gently.",
      },
    ],
    threads: ["A demanding season", "Tender emotionally", "Noticing your patterns"],
  },
  {
    season: "Where you began",
    when: "December",
    paras: [
      {
        text: "You found Florence at the end of a long year, looking for somewhere to put it all down. You weren't sure what you needed yet. ",
        em: "You started by showing up.",
      },
    ],
    threads: ["The beginning"],
  },
];

export default function StoryPage() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-[30px] pb-4 pt-[58px]">
        <div className="mb-7">
          <div className="font-serif text-[32px] font-semibold leading-[1.1] text-ink">
            Your story
          </div>
        </div>

        {chapters.map((ch) => (
          <div key={ch.season} className="mb-[34px]">
            <div className="mb-[14px] flex items-baseline gap-[10px]">
              <span className="font-serif text-[22px] font-semibold text-clay">
                {ch.season}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-soft">
                {ch.when}
              </span>
            </div>
            <div className="mb-4 h-px bg-olive/14" />
            {ch.paras.map((p, i) => (
              <p
                key={i}
                className="mb-[14px] font-serif text-[18px] font-medium leading-[1.6] text-ink"
              >
                {p.text}
                {p.em && <em className="italic text-ink">{p.em}</em>}
              </p>
            ))}
            <div className="mt-1 flex flex-wrap gap-[7px]">
              {ch.threads.map((t) => (
                <span
                  key={t}
                  className="rounded-[20px] border border-olive/20 px-[11px] py-[5px] text-[11px] font-medium text-ink-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <NavMenu />
    </PhoneFrame>
  );
}

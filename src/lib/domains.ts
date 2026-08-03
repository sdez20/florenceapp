export type Domain = {
  slug: string;
  title: string;
  /** Short line shown on the Explore card. */
  cardSub: string;
  /** Fuller description shown on the domain's own page. */
  desc: string;
};

export const domains: Domain[] = [
  {
    slug: "gut-health",
    title: "Gut health",
    cardSub: "The foundation so much else rests on",
    desc: "Your gut affects your mood, your energy, and your hormones. It's connected to almost everything you feel. Florence helps you understand and care for it.",
  },
  {
    slug: "hormone-health",
    title: "Hormone health",
    cardSub: "Through every stage of your life",
    desc: "Your hormones shift across your whole life, month to month and season to season. They shape your energy, your mood, your sleep, and so much more. Florence helps you understand what's happening in your body.",
  },
  {
    slug: "skin-health",
    title: "Skin health",
    cardSub: "What your skin reflects, inside and out",
    desc: "Your skin is the largest organ on your body, and it's connected to everything, your hormones, your gut, your stress, your sleep. Florence helps you understand what it needs and shows you how to care for it, from the inside out.",
  },
  {
    slug: "holistic-nutrition",
    title: "Holistic nutrition",
    cardSub: "Nourishment as care, for your season",
    desc: "Food touches everything, your gut, your hormones, your mood, even your desire. Florence helps you eat in a way that supports all of it, through every season of your life.",
  },
  {
    slug: "mental-emotional",
    title: "Mental & emotional",
    cardSub: "The inner weather you carry",
    desc: "This is Florence's deepest ground. Drawing on integrative psychology, relational intelligence, and self-image work, she helps you understand what you're feeling and the story underneath it.",
  },
  {
    slug: "intimacy-sexuality",
    title: "Intimacy & sexuality",
    cardSub: "Desire and closeness across the lifespan",
    desc: "Desire, closeness, and how you feel in your body change across your life. So many women are made to feel ashamed of these feelings, or that they aren't allowed to have them. Here, that shame has no place. Florence meets it with honesty and care.",
  },
  {
    slug: "relationships",
    title: "Relationships",
    cardSub: "The people, and how you meet them",
    desc: "The people in your life, at home and at work, shape how you feel more than almost anything. Florence helps you understand your patterns, handle the hard conversations, and build stronger relationships.",
  },
  {
    slug: "culture-lifestyle",
    title: "Culture & lifestyle",
    cardSub: "Where you come from, how you live",
    desc: "Where you come from shapes how you live, how you eat, how you love, and what wellness means to you. Florence understands your culture and builds everything around it.",
  },
  {
    slug: "this-season",
    title: "This season of life",
    cardSub: "Where your body and life are now",
    desc: "Your body moves through seasons your whole life, and most of them no one prepared you for. The cycle, trying to conceive, pregnancy, the years after birth, perimenopause, menopause and everything past it. Florence knows the season you're in and what it's actually doing to you, and she meets you inside it.",
  },
];

export function getDomain(slug: string) {
  return domains.find((d) => d.slug === slug);
}

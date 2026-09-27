export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  topic: "Targeting" | "Resume" | "Applications";
  readingMinutes: number;
  published: string; // ISO date
};

/** Order here is the order on /guides. Each slug maps to content/guides/<slug>.mdx. */
export const guides: GuideMeta[] = [
  {
    slug: "pick-one-target",
    title: "Pick one target before you apply anywhere",
    description:
      "Why a specific role and season beats applying to everything, and how to choose one you can actually win.",
    topic: "Targeting",
    readingMinutes: 5,
    published: "2026-09-27",
  },
  {
    slug: "zero-oas",
    title: "Lots of applications, zero OAs: finding where it breaks",
    description: "Your results tell you which stage is failing. Here's how to read them and what to fix at each stage.",
    topic: "Applications",
    readingMinutes: 6,
    published: "2026-09-27",
  },
  {
    slug: "results-not-tasks",
    title: "Rewrite a resume bullet so it shows results",
    description: "Turn “worked on” and “helped with” into bullets that show what changed because of you.",
    topic: "Resume",
    readingMinutes: 5,
    published: "2026-09-27",
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

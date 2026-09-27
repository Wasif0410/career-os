/**
 * Everything the marketing site says about the business lives here, so copy
 * and numbers change in one place. Values marked "confirm" are placeholders
 * the founders still need to decide (see docs/STRATEGY.md → Open Questions).
 */

export const site = {
  name: "Career OS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Career OS helps CS students land the internship or new-grad role they're aiming for. Get your resume scored, get coached 1-1 by real people, and apply only to jobs that fit.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  /** Social links render only when set. */
  socials: [
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "" },
    { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "" },
    { label: "Discord", href: process.env.NEXT_PUBLIC_DISCORD_URL ?? "" },
    { label: "Reddit", href: process.env.NEXT_PUBLIC_REDDIT_URL ?? "" },
  ].filter((s) => s.href),
} as const;

export const nav = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Coaches", href: "/coaches" },
  { label: "Pricing", href: "/pricing" },
  { label: "Guides", href: "/guides" },
] as const;

export type Coach = {
  slug: string;
  name: string;
  initials: string;
  role: string;
  builds: string;
  coaches: string[];
  bio: string;
  /** Short, verifiable facts (internships, offers, schools). Rendered only when filled in. */
  highlights: string[];
  /** Path under /public, e.g. "/coaches/wasif.jpg". Falls back to a monogram. */
  photo?: string;
  /** Cal.com link for a 15-minute intro call. Falls back to the waitlist. */
  bookingUrl?: string;
};

// confirm: coaching focus areas, bios and highlights.
export const coaches: Coach[] = [
  {
    slug: "wasif",
    name: "Wasif",
    initials: "W",
    role: "Co-founder · Coach",
    builds: "Builds the Career OS platform: scoring, courses and your dashboard.",
    coaches: ["Resumes that show results", "Projects worth listing", "Your weekly plan"],
    bio: "Wasif builds the software side of Career OS and coaches students on turning what they've built into a resume and a plan that hold up. Sessions start from your score and your application data, so the time goes to what's actually blocking you.",
    highlights: [],
    photo: undefined,
    bookingUrl: process.env.NEXT_PUBLIC_CAL_WASIF_URL || undefined,
  },
  {
    slug: "abishek",
    name: "Abishek",
    initials: "A",
    role: "Co-founder · Coach",
    builds: "Builds the job-matching and auto-apply engine.",
    coaches: ["Choosing where to apply", "Reading your application results", "Getting from OA to interview"],
    bio: "Abishek builds the engine that finds, scores and submits applications, so he sees what separates the ones that turn into interviews. In sessions he helps you aim at roles you can win and read what your results are telling you.",
    highlights: [],
    photo: undefined,
    bookingUrl: process.env.NEXT_PUBLIC_CAL_ABISHEK_URL || undefined,
  },
];

export type Tier = {
  id: "free" | "pro" | "elite";
  name: string;
  goal: string;
  /** USD per month. confirm: STRATEGY.md lists Pro ~$19-29 and Elite ~$59-99 as prices to test. */
  price: number;
  blurb: string;
  features: string[];
  featured?: boolean;
};

export const tiers: Tier[] = [
  {
    id: "free",
    name: "Free",
    goal: "See where you stand",
    price: 0,
    blurb: "Your score and the one fix that matters most.",
    features: [
      "Resume score out of 100",
      "Your single most important fix",
      "First lesson of every course",
      "How many jobs match you, with 3 shown",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    goal: "Get better",
    price: 19,
    blurb: "The full report, a coach, and a plan you work through.",
    features: [
      "Full resume report with every fix",
      "All courses and guides",
      "Every job match, with fit scores",
      "1 coaching session a month",
      "Written action plan",
      "Application tracker",
      "10 applications a month, sent for you",
    ],
    featured: true,
  },
  {
    id: "elite",
    name: "Elite",
    goal: "Get hired",
    price: 59,
    blurb: "More coaching and more applications, for an active search.",
    features: [
      "Everything in Pro",
      "Your resume reviewed by a coach",
      "Up to 4 coaching sessions a month",
      "Async reviews between sessions",
      "100 applications a month, sent for you",
    ],
  },
];

export const waitlistTargets = [
  { value: "swe-intern", label: "Software engineering internship" },
  { value: "ml-intern", label: "ML / AI internship" },
  { value: "data-intern", label: "Data internship" },
  { value: "swe-new-grad", label: "Software engineering, new grad" },
  { value: "ml-new-grad", label: "ML / AI, new grad" },
  { value: "data-new-grad", label: "Data, new grad" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export type WaitlistTarget = (typeof waitlistTargets)[number]["value"];

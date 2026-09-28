/**
 * Everything the marketing site says about the business lives here, so copy
 * and numbers change in one place. Values marked "confirm" are placeholders
 * the founders still need to decide (see docs/STRATEGY.md → Open Questions).
 */

/** "production", "preview" or "development" on Vercel; undefined everywhere else. */
export const vercelEnv = process.env.VERCEL_ENV;

/**
 * Absolute origin for canonical URLs, the sitemap and Open Graph images.
 * NEXT_PUBLIC_SITE_URL wins when set. On Vercel, production uses the project's
 * production domain and previews use their own deployment URL, so shared
 * preview links don't point back at production.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const host = vercelEnv === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  return host ? `https://${host}` : "http://localhost:3000";
}

export const site = {
  name: "Career OS",
  url: resolveSiteUrl(),
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
  { label: "How it works", href: "/#journey" },
  { label: "Coaches", href: "/coaches" },
  { label: "Pricing", href: "/pricing" },
  { label: "Guides", href: "/guides" },
] as const;

export type Coach = {
  slug: string;
  /** First name, used in running copy. */
  name: string;
  fullName: string;
  initials: string;
  /** What they know best, in a few words. */
  focus: string;
  /** Where they've worked. Shown as a row of names. */
  companies: string[];
  bio: string;
  coaches: string[];
  /** Path under /public, e.g. "/coaches/wasif.jpg". Falls back to a monogram. */
  photo?: string;
  /** Cal.com link for a 15-minute intro call. Falls back to the waitlist. */
  bookingUrl?: string;
};

// Sources: Wasif (directly) and Abishek's LinkedIn profile, September 2026. No schools, by request.
export const coaches: Coach[] = [
  {
    slug: "wasif",
    name: "Wasif",
    fullName: "Wasif Saeed",
    initials: "W",
    focus: "AI and machine learning",
    companies: ["Dayforce", "Achievers", "AI research"],
    bio: "Wasif focuses on AI and ML: building GenAI systems at Dayforce, working as an AI researcher, and engineering software at Achievers.",
    coaches: ["AI and ML roles", "Resumes that show results", "Projects worth building"],
    photo: undefined,
    bookingUrl: process.env.NEXT_PUBLIC_CAL_WASIF_URL || undefined,
  },
  {
    slug: "abishek",
    name: "Abishek",
    fullName: "Abishek Naathan",
    initials: "A",
    focus: "Software engineering",
    companies: ["AMD", "RBC", "Telesat"],
    bio: "Abishek has interned at AMD on the GPU team, at RBC building AI tools, and at Telesat on satellite software.",
    coaches: ["Software engineering roles", "Choosing where to apply", "OAs and interviews"],
    photo: undefined,
    bookingUrl: process.env.NEXT_PUBLIC_CAL_ABISHEK_URL || undefined,
  },
];

/**
 * Companies the coaches have worked at, for the strip under the hero. Files live in public/logos.
 * Sources: AMD (Simple Icons, CC0), RBC, Achievers and Telesat (their own websites), Dayforce (Wikimedia Commons).
 * Logos are trademarks of their owners and are shown only to say where the coaches have worked.
 * `height` evens out the optical size of very different logo shapes; `mono` says how to flatten them to one tone.
 */
export const coachCompanies = [
  { name: "AMD", src: "/logos/amd.svg", width: 96, height: 24, mono: "ink" },
  { name: "RBC", src: "/logos/rbc.svg", width: 38, height: 44, mono: "grey" },
  { name: "Dayforce", src: "/logos/dayforce.svg", width: 118, height: 28, mono: "ink" },
  { name: "Achievers", src: "/logos/achievers.svg", width: 130, height: 24, mono: "ink" },
  { name: "Telesat", src: "/logos/telesat.png", width: 143, height: 20, mono: "ink" },
] as const;

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

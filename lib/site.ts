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
  role: string;
  program: string;
  /** One line under the name: what they've done. */
  headline: string;
  builds: string;
  experience: { org: string; role: string }[];
  coaches: string[];
  bio: string;
  /** Short, verifiable facts. Rendered only when filled in. */
  highlights: string[];
  /** Path under /public, e.g. "/coaches/wasif.jpg". Falls back to a monogram. */
  photo?: string;
  /** Cal.com link for a 15-minute intro call. Falls back to the waitlist. */
  bookingUrl?: string;
};

// Sources: Wasif's ML/AI resume and Abishek's LinkedIn profile (September 2026).
export const coaches: Coach[] = [
  {
    slug: "wasif",
    name: "Wasif",
    fullName: "Wasif Saeed",
    initials: "W",
    role: "Co-founder · Coach",
    program: "Computer Science (Co-op), Toronto Metropolitan University",
    headline: "Four internships in AI and software, most recently building GenAI and LLM systems at Dayforce.",
    builds: "Builds the Career OS platform.",
    experience: [
      { org: "Dayforce", role: "Product & AI Developer Intern" },
      { org: "IQonsulting", role: "Applied AI Developer Intern" },
      { org: "Saige", role: "Software Developer Intern, ML/AI" },
      { org: "RCMP", role: "Junior Programmer Analyst" },
    ],
    coaches: ["ML and AI roles", "Resumes that show results", "Projects worth listing"],
    bio: "Wasif has spent co-op terms building LLM agents, RAG pipelines and computer vision models, and deploying them for real users. Wasif coaches students aiming for ML and AI roles on the projects, resumes and plans that get them there.",
    highlights: ["Dean's List", "Exchange scholar, Chung-Ang University"],
    photo: undefined,
    bookingUrl: process.env.NEXT_PUBLIC_CAL_WASIF_URL || undefined,
  },
  {
    slug: "abishek",
    name: "Abishek",
    fullName: "Abishek Naathan",
    initials: "A",
    role: "Co-founder · Coach",
    program: "Software Engineering, McMaster University",
    headline: "Software engineering intern at AMD, after internships at RBC and Telesat.",
    builds: "Builds the Career OS job-matching and auto-apply engine.",
    experience: [
      { org: "AMD", role: "Software Engineer Intern, dGPU team" },
      { org: "RBC", role: "AI/ML Software Developer Intern" },
      { org: "Telesat", role: "Software Developer Intern" },
      { org: "A Round Entertainment", role: "Full Stack Developer Intern" },
    ],
    coaches: ["Software engineering roles", "Choosing where to apply", "Getting from OA to interview"],
    bio: "Abishek works on AMD's discrete GPU team. Before that, he improved LLM-based contract tools at RBC and built internal tooling, automated testing and DevOps infrastructure for satellites at Telesat. He coaches students going after software engineering roles.",
    highlights: ["Mentor, Canada Learning Code", "McMaster SumoBots technical lead"],
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

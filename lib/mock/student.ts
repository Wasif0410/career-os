import type { CurrentUser } from "@/lib/auth/user";

/*
 * Example data for building the app before the database exists. Nothing here
 * is a real person. Each export is shaped like the table it stands in for, so
 * swapping it for a Supabase query later is a one-line change at the call site.
 */

export const demoStudent: CurrentUser = {
  id: "demo-student",
  firstName: "Maya",
  lastName: "Chen",
  email: "maya@example.com",
  role: "student",
  tier: "free",
  target: { role: "Software engineering internship", season: "Summer 2027" },
};

export type ResumeScore = {
  overall: number;
  categories: { label: string; score: number }[];
  /** Ranked, most important first. Free shows only the first. */
  fixes: string[];
  scoredAt: string;
};

export const demoResumeScore: ResumeScore = {
  overall: 64,
  categories: [
    { label: "Impact", score: 52 },
    { label: "Clarity", score: 71 },
    { label: "Technical depth", score: 68 },
    { label: "Formatting", score: 80 },
  ],
  fixes: [
    "Your bullets list tasks, not results. Add a number to your top three: users, speed, money or time saved.",
    "Move Projects above Coursework. Your projects are stronger than your classes.",
    "Name the stack in each project title so recruiters can scan for it.",
    "Cut the objective statement. Your target role belongs in the headline.",
  ],
  scoredAt: "2026-09-29",
};

export const demoNextStep = {
  title: "Rewrite your top three bullets",
  body: "Your impact score is the lowest of the four. Start with the bullets a recruiter reads first.",
  href: "/guides/results-not-tasks",
  cta: "Read the guide",
};

export const demoJobMatchCount = 38;

/*
 * Example data for the Home page's coaching, plan and applications cards.
 * Nothing here is a real student. Shaped like the tables it stands in for, so
 * a Supabase query can replace each export later.
 */

export type CoachingSession = {
  coach: string;
  /** ISO 8601 with offset. Shown in Toronto time. */
  startsAt: string;
  minutes: number;
};

export const demoNextSession: CoachingSession = {
  coach: "Wasif",
  startsAt: "2026-10-08T18:00:00-04:00",
  minutes: 45,
};

/** One item in the plan a coach writes after each session. */
export type PlanItem = { text: string; done: boolean };

export const demoWeekPlan: PlanItem[] = [
  { text: "Push your ML project to GitHub", done: true },
  { text: "Add numbers to your top three bullets", done: true },
  { text: "Approve this week's job matches", done: false },
];

/** Auto-apply credits used this month. */
export const demoApplicationsUsed = 4;

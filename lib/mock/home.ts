/*
 * Example data for the Home page. Nothing here is a real student. Each export
 * is shaped like the table it stands in for, so a Supabase query can replace
 * it later without changing the page.
 */

/** The demo's "today". Events and the calendar are written relative to it. */
export const demoToday = "2026-10-02";

/** Which week of the coach's plan the student is in. */
export const demoPlanWeek = 6;

/* ---------- Readiness ---------- */

export const readinessLevels = ["Starter", "Builder", "Contender", "Interview-ready", "Offer-ready"] as const;

export type Readiness = {
  /** 1-based index into readinessLevels. */
  level: number;
  /** Progress toward the next level, 0-100. */
  progress: number;
};

export const demoReadiness: Readiness = { level: 3, progress: 68 };

/* ---------- Resume ---------- */

/** Overall score after each upload, oldest first. The last one is the current score. */
export const demoResumeHistory = [41, 47, 52, 58, 64];

/** When each of those uploads was scored. */
export const demoResumeHistoryDates = ["Jun 4", "Jul 9", "Aug 13", "Sep 12", "Sep 29"];

/* ---------- Courses ---------- */

export type Course = {
  slug: string;
  title: string;
  lessons: number;
  done: number;
  /** The next lesson to take. Absent when the course is finished. */
  next?: { number: number; title: string; minutes: number };
};

export const demoCourses: Course[] = [
  {
    slug: "results-not-tasks",
    title: "Results, not tasks",
    lessons: 5,
    done: 2,
    next: { number: 3, title: "Put a number on every bullet", minutes: 12 },
  },
  {
    slug: "zero-oas",
    title: "Zero OAs? Fix this first",
    lessons: 4,
    done: 1,
    next: { number: 2, title: "Read a posting like a recruiter", minutes: 9 },
  },
  {
    slug: "arrays-and-hashing",
    title: "Interview basics: arrays and hashing",
    lessons: 6,
    done: 0,
    next: { number: 1, title: "Two pointers in 15 minutes", minutes: 15 },
  },
];

/* ---------- Plan ---------- */

export type PlanItem = {
  text: string;
  /** One short line on why it matters. */
  why?: string;
  /** Set when a coach added it. */
  from?: string;
  done: boolean;
  action?: { label: string; href: string };
};

/** This week's plan for a student with a coach (Pro and up). */
export const demoWeekPlan: PlanItem[] = [
  {
    text: "Rewrite your top three bullets",
    why: "Impact is your lowest category at 52",
    done: false,
    action: { label: "Open guide", href: "/guides/results-not-tasks" },
  },
  { text: "Push your ML project to GitHub", from: "Wasif", done: true },
  { text: "Add numbers to your project bullets", from: "Wasif", done: true },
  {
    text: "Approve this week's matches",
    why: "3 roles above 80% fit are waiting",
    done: false,
    action: { label: "Review", href: "/jobs" },
  },
];

/** What a student without a coach sees: steps the software suggests. */
export const demoStarterPlan: PlanItem[] = [
  {
    text: "Rewrite your top three bullets",
    why: "Impact is your lowest category at 52",
    done: false,
    action: { label: "Open guide", href: "/guides/results-not-tasks" },
  },
  {
    text: "Finish lesson 1 of Results, not tasks",
    why: "12 minutes",
    done: false,
    action: { label: "Start", href: "/courses" },
  },
  { text: "Look through your top 3 matches", done: false, action: { label: "Review", href: "/jobs" } },
];

/* ---------- Coaching ---------- */

export type CoachingSession = {
  coach: string;
  /** ISO 8601 with offset. Shown in Toronto time. */
  startsAt: string;
  minutes: number;
  agenda: string[];
};

export const demoNextSession: CoachingSession = {
  coach: "Wasif",
  startsAt: "2026-10-08T18:00:00-04:00",
  minutes: 45,
  agenda: ["Go over your OA practice", "Mock interview: arrays and hashing", "Pick your next 10 roles"],
};

/* ---------- Applications ---------- */

/** Auto-apply credits used this month. */
export const demoApplicationsUsed = 4;

/** Applications sent each week this season, oldest first. The last is this week. */
export const demoApplicationsByWeek = [
  { week: "Aug 24", sent: 1 },
  { week: "Aug 31", sent: 2 },
  { week: "Sep 7", sent: 2 },
  { week: "Sep 14", sent: 3 },
  { week: "Sep 21", sent: 2 },
  { week: "Sep 28", sent: 4 },
];

export type ApplicationStage = "applied" | "in_review" | "oa" | "interview" | "offer";

export type Application = { role: string; org: string; place: string; note: string; date: string };

/** Applications this season, grouped by their current stage (statuses from the shared applications table). */
export const demoApplications: Record<ApplicationStage, { count: number; recent: Application[] }> = {
  applied: {
    count: 6,
    recent: [
      { role: "Backend Intern", org: "Cloud startup", place: "Remote", note: "Applied", date: "Oct 1" },
      { role: "Data Engineering Intern", org: "Retail analytics", place: "Toronto", note: "Applied", date: "Sep 30" },
      { role: "Software Developer Co-op", org: "Insurance", place: "Waterloo", note: "Applied", date: "Sep 28" },
    ],
  },
  in_review: {
    count: 3,
    recent: [
      { role: "Software Engineer Intern", org: "Fintech", place: "Toronto", note: "Since", date: "Sep 26" },
      { role: "ML Engineering Intern", org: "Health tech", place: "Remote", note: "Since", date: "Sep 24" },
      { role: "Full Stack Intern", org: "E-commerce", place: "Toronto", note: "Since", date: "Sep 22" },
    ],
  },
  oa: {
    count: 2,
    recent: [
      { role: "Software Engineer Intern", org: "Payments", place: "Toronto", note: "Due", date: "Mon, Oct 5" },
      { role: "Data Science Intern", org: "Telecom", place: "Toronto", note: "Due", date: "Wed, Oct 7" },
    ],
  },
  interview: {
    count: 1,
    recent: [
      { role: "Platform Engineering Intern", org: "Bank", place: "Toronto", note: "Technical", date: "Fri, Oct 9" },
    ],
  },
  offer: { count: 0, recent: [] },
};

/* ---------- Job matches ---------- */

export type Match = {
  fit: number;
  role: string;
  org: string;
  place: string;
  status: "applied" | "approve";
  /** Why it fits, from the matcher. */
  reasons: string[];
  /** Skills the posting asks for that the profile doesn't show yet. */
  missing: string[];
  closes: string;
};

export const demoTopMatches: Match[] = [
  {
    fit: 91,
    role: "Software Engineer Intern",
    org: "Fintech",
    place: "Toronto",
    status: "applied",
    reasons: ["Python and SQL match your projects", "Summer 2027 term", "Toronto, where you want to work"],
    missing: ["Unit testing"],
    closes: "Oct 20",
  },
  {
    fit: 86,
    role: "Backend Intern",
    org: "Cloud startup",
    place: "Remote",
    status: "approve",
    reasons: ["Your API project uses their stack", "Remote friendly", "Hires second-year students"],
    missing: ["Docker", "Postgres"],
    closes: "Oct 12",
  },
  {
    fit: 82,
    role: "Platform Engineering Intern",
    org: "Bank",
    place: "Toronto",
    status: "approve",
    reasons: ["Linux and scripting experience", "Strong co-op program", "Toronto"],
    missing: ["Kubernetes", "Terraform"],
    closes: "Oct 16",
  },
];

export const demoNewMatchesThisWeek = 12;

/* ---------- Calendar ---------- */

export type CalendarEvent = {
  /** Day in YYYY-MM-DD. */
  day: string;
  kind: "oa" | "session" | "interview" | "deadline";
  label: string;
  title: string;
  detail: string;
};

/** Everything coming up for a student with coaching and applications. */
export const demoEvents: CalendarEvent[] = [
  {
    day: "2026-10-05",
    kind: "oa",
    label: "Online assessment due",
    title: "Software Engineer Intern",
    detail: "Payments · 90 min",
  },
  {
    day: "2026-10-07",
    kind: "oa",
    label: "Online assessment due",
    title: "Data Science Intern",
    detail: "Telecom · 60 min",
  },
  { day: "2026-10-08", kind: "session", label: "6:00 PM · 45 min", title: "1-1 with Wasif", detail: "" },
  {
    day: "2026-10-09",
    kind: "interview",
    label: "2:00 PM · Technical interview",
    title: "Platform Engineering Intern",
    detail: "Bank · Video call",
  },
  {
    day: "2026-10-12",
    kind: "deadline",
    label: "Applications close",
    title: "Backend Intern",
    detail: "Cloud startup · approve before then",
  },
];

/** What a student without applications or coaching has coming up: deadlines on their free matches. */
export const demoFreeEvents: CalendarEvent[] = [
  {
    day: "2026-10-12",
    kind: "deadline",
    label: "Applications close",
    title: "Backend Intern",
    detail: "Cloud startup · 86% fit",
  },
  {
    day: "2026-10-16",
    kind: "deadline",
    label: "Applications close",
    title: "Platform Engineering Intern",
    detail: "Bank · 82% fit",
  },
];

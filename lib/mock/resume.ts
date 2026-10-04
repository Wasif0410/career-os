import { demoResumeHistory, demoResumeHistoryDates } from "@/lib/mock/home";
import { demoResumeScore } from "@/lib/mock/student";

/*
 * Example data for the Resume page. Nothing here is a real student. The score,
 * categories and fix wording come from lib/mock/student.ts and the upload
 * history from lib/mock/home.ts, so Home and Resume always agree.
 */

/* ---------- The resume itself ---------- */

/** One line of the resume, in reading order. `id` lets a fix point at it. */
export type ResumeBlock =
  | { kind: "heading"; id: string; text: string }
  | { kind: "row"; id: string; text: string; meta: string }
  | { kind: "bullet"; id: string; text: string }
  | { kind: "text"; id: string; text: string };

export type ResumeDoc = { name: string; contact: string; blocks: ResumeBlock[] };

export const demoResumeDoc: ResumeDoc = {
  name: "Maya Chen",
  contact: "Toronto, ON · maya@example.com",
  blocks: [
    { kind: "heading", id: "objective-head", text: "Objective" },
    {
      kind: "text",
      id: "objective",
      text: "Motivated computer science student looking for a software engineering internship where I can grow my skills.",
    },
    { kind: "heading", id: "education-head", text: "Education" },
    { kind: "row", id: "degree", text: "B.Sc. Computer Science", meta: "2025 – 2029" },
    { kind: "heading", id: "coursework-head", text: "Coursework" },
    { kind: "text", id: "coursework", text: "Data Structures, Algorithms, Databases, Operating Systems" },
    { kind: "heading", id: "experience-head", text: "Experience" },
    { kind: "row", id: "job", text: "IT Help Desk Assistant, Campus IT", meta: "2025 – now" },
    { kind: "bullet", id: "job-1", text: "Helped students and staff with technical issues." },
    { kind: "bullet", id: "job-2", text: "Updated the ticket tracking spreadsheet every week." },
    { kind: "heading", id: "projects-head", text: "Projects" },
    { kind: "row", id: "planner", text: "Course Planner", meta: "2026" },
    { kind: "bullet", id: "planner-1", text: "Built a web app that helps students plan their courses." },
    { kind: "bullet", id: "planner-2", text: "Worked on the backend and the database." },
    { kind: "row", id: "events", text: "Campus Events API", meta: "2025" },
    { kind: "bullet", id: "events-1", text: "Made an API that lists events happening on campus." },
    { kind: "heading", id: "skills-head", text: "Skills" },
    { kind: "text", id: "skills", text: "Python, Java, JavaScript, SQL, React, Flask, Spring Boot, Git, Linux" },
  ],
};

/** What a recruiter's first pass over this resume lands on, in one sentence. */
export const demoSkimNote = "On yours, the objective gets the top line and your projects come last.";

/** The file behind the current score. */
export const demoResumeFile = { name: "maya-chen-resume.pdf", pages: 1, sizeKb: 148 };

/* ---------- Categories ---------- */

/** What each category looks at, in a few words. Keyed by the labels in demoResumeScore. */
export const categoryHints: Record<string, string> = {
  Impact: "Measured results",
  Clarity: "Quick to scan",
  "Technical depth": "Stack and scope",
  Formatting: "Layout and length",
};

/* ---------- Fixes ---------- */

/**
 * A note pinned to one line of the resume. `[number]`-style placeholders mark
 * where the student puts their own real figures; the scorer never invents them.
 */
export type FixMark = { line: string; label: "Try" | "Move" | "Cut"; text: string };

export type ResumeFix = {
  rank: number;
  /** A few words, for the list. */
  title: string;
  /** The scorer's full sentence (from demoResumeScore.fixes). */
  text: string;
  category: string;
  /** Rough points the overall score gains once it's fixed. */
  gain: number;
  marks: FixMark[];
  learn: { label: string; href: string };
};

export const demoResumeFixes: ResumeFix[] = [
  {
    rank: 1,
    title: "Show results, not tasks",
    text: demoResumeScore.fixes[0],
    category: "Impact",
    gain: 8,
    marks: [
      {
        line: "job-1",
        label: "Try",
        text: "Resolved [number] tickets a week for students and staff, most within [time].",
      },
      {
        line: "planner-1",
        label: "Try",
        text: "Built a course planner that [number] students used to map out their degree.",
      },
      {
        line: "events-1",
        label: "Try",
        text: "Built an events API that serves [number] requests a day to the student union site.",
      },
    ],
    learn: { label: "Guide · Results, not tasks", href: "/guides/results-not-tasks" },
  },
  {
    rank: 2,
    title: "Lead with your projects",
    text: demoResumeScore.fixes[1],
    category: "Clarity",
    gain: 5,
    marks: [
      { line: "projects-head", label: "Move", text: "Put Projects right after Education." },
      { line: "coursework-head", label: "Move", text: "Coursework goes below Projects, or fold it into Education." },
    ],
    learn: { label: "Lesson · Start with evidence", href: "/courses/resume/start-with-evidence" },
  },
  {
    rank: 3,
    title: "Name the stack in project titles",
    text: demoResumeScore.fixes[2],
    category: "Technical depth",
    gain: 4,
    marks: [
      { line: "planner", label: "Try", text: "Course Planner · React, Flask, SQLite" },
      { line: "events", label: "Try", text: "Campus Events API · Java, Spring Boot, MySQL" },
    ],
    learn: { label: "Lesson · Tailor without fiction", href: "/courses/resume/tailor-without-fiction" },
  },
  {
    rank: 4,
    title: "Cut the objective",
    text: demoResumeScore.fixes[3],
    category: "Formatting",
    gain: 3,
    marks: [
      {
        line: "objective",
        label: "Cut",
        text: "Put a headline under your name instead: Software engineering intern · Summer 2027",
      },
    ],
    learn: { label: "Lesson · Check the final file", href: "/courses/resume/check-the-final-file" },
  },
];

/* ---------- Versions ---------- */

export type ResumeVersion = {
  number: number;
  /** "Sep 29" */
  date: string;
  score: number;
  /** Change from the version before. Absent on the first. */
  change?: number;
};

/** Every upload, newest first. */
export const demoResumeVersions: ResumeVersion[] = demoResumeHistory
  .map((score, i) => ({
    number: i + 1,
    date: demoResumeHistoryDates[i],
    score,
    change: i > 0 ? score - demoResumeHistory[i - 1] : undefined,
  }))
  .reverse();

/* ---------- Skills the student's matches ask for ---------- */

export type SkillDemand = {
  skill: string;
  /** Share of the student's job matches that ask for it, 0-100. */
  share: number;
  onResume: boolean;
};

export const demoSkillDemand: SkillDemand[] = [
  { skill: "Python", share: 74, onResume: true },
  { skill: "Git", share: 61, onResume: true },
  { skill: "SQL", share: 55, onResume: true },
  { skill: "Unit testing", share: 47, onResume: false },
  { skill: "Java", share: 42, onResume: true },
  { skill: "Docker", share: 39, onResume: false },
];

/* ---------- Coach review (Elite) ---------- */

export type CoachReview = { coach: string; date: string; note: string; comments: number; nextSession: string };

export const demoCoachReview: CoachReview = {
  coach: "Wasif",
  date: "Sep 30",
  note: "Course Planner is your best work, so lead with it. Bring real user numbers and we'll rewrite the bullets together.",
  comments: 6,
  nextSession: "Oct 8",
};

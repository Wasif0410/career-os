import { demoApplicationsUsed, demoPlanWeek } from "./home";

/*
 * Example data for the Plan page. Nothing here is a real student. After each
 * 1-1 the coach picks the top three gaps and assigns the coming weeks' tasks,
 * each with a time to do it. The student moves them across a board: to do, in
 * progress, done. Shaped like the tables it stands in for, so a Supabase query
 * can replace it later without changing the page.
 */

/* ---------- The plan ---------- */

/** How many weeks the plan runs. */
export const demoPlanLength = 16;

/** The week the student is in now. */
export const demoCurrentWeek = demoPlanWeek;

export type PlanPhase = { title: string; from: number; to: number };

export const demoPlanPhases: PlanPhase[] = [
  { title: "Foundations", from: 1, to: 3 },
  { title: "Proof of work", from: 4, to: 7 },
  { title: "Applications", from: 8, to: 11 },
  { title: "Interviews", from: 12, to: 16 },
];

/* ---------- Top three gaps ---------- */

export type GapId = "impact" | "projects" | "oas";

export type Gap = {
  id: GapId;
  title: string;
  /** What's wrong, in a few words. */
  note: string;
  now: number;
  target: number;
};

/** Picked with the coach, most important first. */
export const demoGaps: Gap[] = [
  { id: "impact", title: "Impact", note: "Bullets list tasks, not results", now: 52, target: 70 },
  { id: "projects", title: "Projects people can see", note: "Only one is public", now: 1, target: 2 },
  { id: "oas", title: "OA speed", note: "Practice sets done under time", now: 4, target: 10 },
];

/* ---------- Tasks ---------- */

export type TaskStatus = "todo" | "doing" | "done";

export type PlanTask = {
  /** Stable id, used to remember what the student moved and ticked. */
  id: string;
  text: string;
  /** One short line on why it matters. */
  why: string;
  /** How to do it, in a few steps the student can tick. */
  steps: string[];
  /** About how long it takes. */
  minutes: number;
  /** When to do it, agreed in the 1-1. A set time makes a task far more likely to happen. */
  when?: string;
  /** The gap it closes. Tasks that don't close one carry a short `tag` instead. */
  gap?: GapId;
  tag?: string;
  /** YYYY-MM-DD */
  due?: string;
  status: TaskStatus;
  /** Steps already ticked (indexes into `steps`). */
  stepsDone?: number[];
  /** The coach's first name when a coach assigned it. Otherwise Career OS suggested it. */
  from?: string;
  link?: { label: string; href: string };
};

export type PlanWeek = {
  number: number;
  /** Monday and Sunday, YYYY-MM-DD. */
  start: string;
  end: string;
  /** The 1-1 this week's tasks came out of, YYYY-MM-DD. */
  session: string;
  tasks: PlanTask[];
};

const lesson = (href: string) => ({ label: "Open lesson", href });
const guide = { label: "Open the guide", href: "/guides/results-not-tasks" };
const matches = { label: "Review matches", href: "/jobs" };

/** Every week so far, oldest first. The last one is this week. */
export const demoPlanWeeks: PlanWeek[] = [
  {
    number: 1,
    start: "2026-08-24",
    end: "2026-08-30",
    session: "2026-08-27",
    tasks: [
      {
        id: "w1-github",
        text: "Set up your GitHub profile",
        why: "Where recruiters look first",
        steps: ["Add a photo and a one-line bio"],
        minutes: 30,
        gap: "projects",
        due: "2026-08-25",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/github/curate-your-profile"),
      },
      {
        id: "w1-target",
        text: "Pick one target role",
        why: "Everything else follows from it",
        steps: ["Read three postings", "Write the role in one line"],
        minutes: 20,
        tag: "Goal",
        due: "2026-08-27",
        status: "done",
        from: "Wasif",
        link: { label: "Open the guide", href: "/guides/pick-one-target" },
      },
      {
        id: "w1-upload",
        text: "Upload your resume",
        why: "So it can be scored",
        steps: ["Upload a PDF"],
        minutes: 5,
        tag: "Resume",
        due: "2026-08-29",
        status: "done",
        from: "Wasif",
        link: { label: "Go to Resume", href: "/resume" },
      },
    ],
  },
  {
    number: 2,
    start: "2026-08-31",
    end: "2026-09-06",
    session: "2026-08-27",
    tasks: [
      {
        id: "w2-project",
        text: "Pick your first project",
        why: "One project you can finish and explain",
        steps: ["List three ideas", "Choose the one you'd use yourself"],
        minutes: 30,
        gap: "projects",
        due: "2026-08-31",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/projects/find-a-real-problem"),
      },
      {
        id: "w2-plan",
        text: "Write a one-page project plan",
        why: "So the project has an end",
        steps: ["What it does", "What done looks like"],
        minutes: 40,
        gap: "projects",
        due: "2026-09-02",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/projects/find-a-real-problem"),
      },
      {
        id: "w2-course",
        text: "Finish the career direction course",
        why: "Four short lessons",
        steps: ["Lessons 1 to 4"],
        minutes: 30,
        tag: "Course",
        due: "2026-09-04",
        status: "done",
        from: "Wasif",
        link: { label: "Open course", href: "/courses/career-direction" },
      },
      {
        id: "w2-readme",
        text: "Add a profile README",
        why: "A short intro on your GitHub",
        steps: ["Who you are", "What you're building"],
        minutes: 20,
        gap: "projects",
        due: "2026-09-06",
        status: "todo",
        from: "Wasif",
        link: lesson("/courses/github/curate-your-profile"),
      },
    ],
  },
  {
    number: 3,
    start: "2026-09-07",
    end: "2026-09-13",
    session: "2026-08-27",
    tasks: [
      {
        id: "w3-pipeline",
        text: "Build the data pipeline",
        why: "The model needs clean data first",
        steps: ["Load the dataset", "Clean and split it"],
        minutes: 60,
        gap: "projects",
        due: "2026-09-07",
        status: "done",
        from: "Wasif",
      },
      {
        id: "w3-model",
        text: "Train a first model",
        why: "Any result beats no result",
        steps: ["Start simple", "Write down the accuracy"],
        minutes: 60,
        gap: "projects",
        due: "2026-09-09",
        status: "done",
        from: "Wasif",
      },
      {
        id: "w3-bullets",
        text: "Write 3 bullets for the project",
        why: "Practice saying what you did",
        steps: ["Action, context, result"],
        minutes: 20,
        gap: "impact",
        due: "2026-09-10",
        status: "done",
        from: "Wasif",
        link: guide,
      },
      {
        id: "w3-oa",
        text: "Do 1 OA practice set",
        why: "Arrays and hashing",
        steps: ["Time yourself"],
        minutes: 30,
        gap: "oas",
        due: "2026-09-11",
        status: "done",
        from: "Wasif",
      },
      {
        id: "w3-book",
        text: "Book your next 1-1",
        why: "Sep 10 with Wasif",
        steps: ["Pick a time"],
        minutes: 5,
        tag: "Coaching",
        due: "2026-09-12",
        status: "done",
        from: "Wasif",
        link: { label: "Go to Coaching", href: "/coaching" },
      },
    ],
  },
  {
    number: 4,
    start: "2026-09-14",
    end: "2026-09-20",
    session: "2026-09-10",
    tasks: [
      {
        id: "w4-train",
        text: "Train the model on the full dataset",
        why: "The first run used a sample",
        steps: ["Run it overnight", "Compare with the first model"],
        minutes: 90,
        gap: "projects",
        due: "2026-09-14",
        status: "done",
        from: "Wasif",
      },
      {
        id: "w4-tests",
        text: "Add tests to your API",
        why: "So the project looks finished",
        steps: ["Test the main route", "Run them in CI"],
        minutes: 45,
        gap: "projects",
        due: "2026-09-16",
        status: "todo",
        from: "Wasif",
      },
      {
        id: "w4-read",
        text: "Read Write credible bullets",
        why: "Before you rewrite yours",
        steps: ["Read the lesson"],
        minutes: 10,
        gap: "impact",
        due: "2026-09-17",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/resume/write-credible-bullets"),
      },
      {
        id: "w4-oa",
        text: "Do 1 OA practice set",
        why: "Arrays and hashing",
        steps: ["Time yourself"],
        minutes: 30,
        gap: "oas",
        due: "2026-09-19",
        status: "done",
        from: "Wasif",
      },
    ],
  },
  {
    number: 5,
    start: "2026-09-21",
    end: "2026-09-27",
    session: "2026-09-10",
    tasks: [
      {
        id: "w5-readme",
        text: "Write a README for your ML project",
        why: "Someone else should be able to run it",
        steps: ["What it does in one line", "Setup steps that work"],
        minutes: 40,
        gap: "projects",
        due: "2026-09-21",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/github/make-it-runnable"),
      },
      {
        id: "w5-demo",
        text: "Record a 2-minute demo",
        why: "Faster than reading code",
        steps: ["Show the result first"],
        minutes: 30,
        gap: "projects",
        due: "2026-09-22",
        status: "done",
        from: "Wasif",
      },
      {
        id: "w5-oa",
        text: "Do 2 OA practice sets",
        why: "Your OAs start in two weeks",
        steps: ["Arrays and hashing", "Time yourself"],
        minutes: 60,
        gap: "oas",
        due: "2026-09-23",
        status: "done",
        from: "Wasif",
      },
      {
        id: "w5-apply",
        text: "Apply to 3 roles above 80% fit",
        why: "Start the season early",
        steps: ["Approve 3 matches"],
        minutes: 15,
        tag: "Jobs",
        due: "2026-09-24",
        status: "done",
        from: "Wasif",
        link: matches,
      },
      {
        id: "w5-lesson",
        text: "Finish GitHub lesson 2",
        why: "Make it runnable",
        steps: ["Read the lesson"],
        minutes: 10,
        gap: "projects",
        due: "2026-09-26",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/github/make-it-runnable"),
      },
    ],
  },
  {
    // This week: the same four tasks Home shows.
    number: 6,
    start: "2026-09-28",
    end: "2026-10-04",
    session: "2026-09-24",
    tasks: [
      {
        id: "w6-approve-matches",
        text: "Approve this week's matches",
        why: "3 roles above 80% fit are waiting",
        steps: ["Approve the roles you would take", "Skip the rest so your matches get sharper"],
        minutes: 10,
        when: "Sunday evening, with your matches open",
        tag: "Jobs",
        due: "2026-10-04",
        status: "todo",
        from: "Wasif",
        link: matches,
      },
      {
        id: "w6-top-bullets",
        text: "Rewrite your top three bullets",
        why: "Impact is your lowest category at 52",
        steps: [
          "Start with the bullets a recruiter reads first",
          "Lead with the result, then how you got there",
          "Add a real number: users, speed, money or time",
        ],
        minutes: 30,
        when: "Saturday morning, before you open any job posting",
        gap: "impact",
        due: "2026-10-03",
        status: "doing",
        stepsDone: [0],
        from: "Wasif",
        link: guide,
      },
      {
        id: "w6-ml-github",
        text: "Push your ML project to GitHub",
        why: "A recruiter can't open a project that isn't public",
        steps: ["Public repo with a README and two screenshots", "Pin it to the top of your profile"],
        minutes: 45,
        when: "Wednesday, right after class",
        gap: "projects",
        due: "2026-09-30",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/github/make-it-runnable"),
      },
      {
        id: "w6-project-numbers",
        text: "Add numbers to your project bullets",
        why: "Numbers show how big the work was",
        steps: ["Only numbers you can back up: accuracy, users, time saved", "One number per bullet is enough"],
        minutes: 20,
        when: "Thursday, while the project is fresh",
        gap: "impact",
        due: "2026-10-01",
        status: "done",
        from: "Wasif",
        link: lesson("/courses/resume/write-credible-bullets"),
      },
    ],
  },
];

/** Next week, which the coach plans in the next 1-1. */
export const demoNextWeek = { number: demoPlanWeek + 1, start: "2026-10-05", end: "2026-10-11" };

/** What a student without a coach gets: steps Career OS suggests from their score and matches. */
export const demoStarterTasks: PlanTask[] = [
  {
    id: "starter-top-bullets",
    text: "Rewrite your top three bullets",
    why: "Impact is your lowest category at 52",
    steps: [
      "Start with the bullets a recruiter reads first",
      "Lead with the result, then how you got there",
      "Add a real number: users, speed, money or time",
    ],
    minutes: 30,
    gap: "impact",
    status: "todo",
    link: guide,
  },
  {
    id: "starter-resume-lesson",
    text: "Take the first resume lesson",
    why: "Pick your strongest material first",
    steps: ["Read Start with evidence", "List three things you built or fixed"],
    minutes: 10,
    tag: "Course",
    status: "todo",
    link: { label: "Start the lesson", href: "/courses/resume/start-with-evidence" },
  },
  {
    id: "starter-matches",
    text: "Look through your top 3 matches",
    why: "See why each one fits and what's missing",
    steps: ["Open each match", "Note the skills that come up more than once"],
    minutes: 10,
    tag: "Jobs",
    status: "todo",
    link: matches,
  },
];

/** Times a student can pick for a task nobody timed. */
export const whenChoices = ["Tonight", "Tomorrow morning", "Tomorrow evening", "This weekend"] as const;

/* ---------- This month ---------- */

export type MonthGoal = { text: string; detail: string; now: number; target: number };

export const demoMonth = "2026-10";

export const demoMonthGoals: MonthGoal[] = [
  { text: "Pass both OAs", detail: "Payments Oct 5 · Telecom Oct 7", now: 0, target: 2 },
  { text: "Apply to 10 roles that fit", detail: "With your auto-apply credits", now: demoApplicationsUsed, target: 10 },
  { text: "Get your resume to 75", detail: "From your Sep 29 upload", now: 64, target: 75 },
];

/* ---------- Session notes ---------- */

export type SessionNote = { day: string; coach: string; note: string };

/** The shared notes from each 1-1, newest first. */
export const demoSessionNotes: SessionNote[] = [
  {
    day: "2026-09-24",
    coach: "Wasif",
    note: "Good work getting the ML project public. Impact is the gap now: numbers on every bullet before you apply anywhere else.",
  },
  {
    day: "2026-09-10",
    coach: "Wasif",
    note: "The ML project works. Make it public with a README so recruiters can see it.",
  },
  {
    day: "2026-08-27",
    coach: "Wasif",
    note: "Goal set: SWE internship, Summer 2027. GitHub first, then one strong project.",
  },
];

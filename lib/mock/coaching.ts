/*
 * Example data for the Coaching page. Nothing here is a real student. The
 * openings stand in for the coaches' Cal.com availability and the bookings for
 * the sessions table, so real data can replace them without changing the page.
 */

export type CoachSlug = "wasif" | "abishek";

export type CallType = {
  id: "checkin" | "mock" | "resume" | "strategy";
  name: string;
  minutes: number;
  /** One short line on what the call is for. */
  blurb: string;
};

/** The kinds of call a student can book. Names and lengths are placeholders until the coaches confirm them. */
export const callTypes: CallType[] = [
  { id: "checkin", name: "Check-in", minutes: 20, blurb: "How your week went" },
  { id: "mock", name: "Mock interview", minutes: 60, blurb: "A practice interview, scored" },
  { id: "resume", name: "Resume review", minutes: 30, blurb: "Go through it line by line" },
  { id: "strategy", name: "Strategy", minutes: 45, blurb: "Where to apply and why" },
];

export type Booking = {
  id: string;
  coach: CoachSlug;
  type: CallType["id"];
  /** ISO 8601 with offset. Shown in Toronto time. */
  startsAt: string;
  minutes: number;
  /** What the student wants the coach to know, from the booking form. */
  note?: string;
};

/** Calls the demo student has booked. Matches the session on Home's calendar. */
export const demoBookings: Booking[] = [
  { id: "b-2026-10-08", coach: "wasif", type: "strategy", startsAt: "2026-10-08T18:00:00-04:00", minutes: 45 },
];

/** Each coach's weekly openings in Toronto time. Weekday 0 is Sunday. */
export const demoOpenings: Record<CoachSlug, { weekday: number; times: string[] }[]> = {
  wasif: [
    { weekday: 2, times: ["18:00", "19:00"] },
    { weekday: 4, times: ["17:00", "18:00", "19:00"] },
    { weekday: 6, times: ["11:00"] },
  ],
  abishek: [
    { weekday: 0, times: ["13:00", "14:00"] },
    { weekday: 1, times: ["18:30", "19:30"] },
    { weekday: 3, times: ["18:30"] },
  ],
};

/** Days a coach has no openings. */
export const demoAway: Record<CoachSlug, string[]> = {
  wasif: ["2026-10-22"],
  abishek: ["2026-10-12"],
};

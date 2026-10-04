import type { Booking, CoachSlug } from "@/lib/mock/coaching";

/*
 * Dates and openings for the Coaching page. Days are calendar days
 * (YYYY-MM-DD) and times are Toronto clock times ("18:30"). Labels are built
 * by hand rather than with locale formatting so the server and the browser
 * always print the same text.
 */

const TZ = "America/Toronto";
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const torontoParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function partsOf(iso: string) {
  const p = Object.fromEntries(torontoParts.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

/** Noon UTC on a calendar day, so weekday and month maths never cross midnight. */
export const dateOf = (day: string) => new Date(`${day}T12:00:00Z`);

/** The calendar day of a booking, in Toronto. */
export const bookingDay = (b: Pick<Booking, "startsAt">) => partsOf(b.startsAt).day;

/** A booking's start as a Toronto clock time, "18:00". */
export const bookingTime = (b: Pick<Booking, "startsAt">) => partsOf(b.startsAt).time;

/** "18:30" → "6:30 PM". */
export function clock(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** The clock time `minutes` after `time`. */
export function later(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** "6:00 PM to 6:45 PM". */
export const timeRange = (time: string, minutes: number) => `${clock(time)} to ${clock(later(time, minutes))}`;

export const weekdayName = (day: string) => WEEKDAYS[dateOf(day).getUTCDay()];

/** "Thursday, October 15". */
export function longDay(day: string) {
  const d = dateOf(day);
  return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "October" for a day or a month. */
export const monthName = (dayOrMonth: string) => MONTHS[Number(dayOrMonth.slice(5, 7)) - 1];

/** "Oct" for a day or a month. */
export const monthShort = (dayOrMonth: string) => monthName(dayOrMonth).slice(0, 3);

export const dayNumber = (day: string) => Number(day.slice(8, 10));

/* ---------- Months ---------- */

export const monthOf = (day: string) => day.slice(0, 7);

export function addMonths(month: string, n: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** The days of a month, Monday first, with `null` for the blanks before the 1st. */
export function monthGrid(month: string): (string | null)[] {
  const [y, m] = month.split("-").map(Number);
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => isoDay(new Date(Date.UTC(y, m - 1, i + 1)))),
  ];
}

/** The last day of the month after `today`'s: how far ahead students can book. */
export function lastBookableDay(today: string) {
  const next = addMonths(monthOf(today), 2);
  return isoDay(new Date(dateOf(`${next}-01`).getTime() - 86_400_000));
}

export const countInMonth = (bookings: Booking[], month: string) =>
  bookings.filter((b) => monthOf(bookingDay(b)) === month).length;

/** Bookings from today on, soonest first. */
export const upcomingBookings = (bookings: Booking[], today: string) =>
  bookings.filter((b) => bookingDay(b) >= today).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

/* ---------- Openings ---------- */

export type Openings = {
  weekly: Record<CoachSlug, { weekday: number; times: string[] }[]>;
  away: Record<CoachSlug, string[]>;
};

export type BookingRules = {
  today: string;
  bookings: Booking[];
  /** Calls the plan allows each month. Infinity shows every opening (Free, which can look but not book). */
  perMonth: number;
  openings: Openings;
};

/** A coach, or whoever is free. */
export type CoachChoice = CoachSlug | "any";

export type Slot = { coach: CoachSlug; time: string };

/** Whether the month still has room on the student's plan. */
export const monthHasRoom = (month: string, rules: BookingRules) =>
  countInMonth(rules.bookings, month) < rules.perMonth;

/**
 * The times a student can book on a day, soonest first. None in the past,
 * beyond next month, in a month the plan has used up, or on a day the student
 * already has a call.
 */
export function openSlots(choice: CoachChoice, day: string, rules: BookingRules): Slot[] {
  if (day <= rules.today || day > lastBookableDay(rules.today)) return [];
  if (!monthHasRoom(monthOf(day), rules)) return [];
  if (rules.bookings.some((b) => bookingDay(b) === day)) return [];
  const weekday = dateOf(day).getUTCDay();
  const coaches: CoachSlug[] = choice === "any" ? ["wasif", "abishek"] : [choice];
  return coaches
    .filter((c) => !rules.openings.away[c].includes(day))
    .flatMap((c) =>
      (rules.openings.weekly[c].find((o) => o.weekday === weekday)?.times ?? []).map((time) => ({ coach: c, time })),
    )
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** The first day in a month with a time the student can book. */
export function firstOpenDay(choice: CoachChoice, month: string, rules: BookingRules) {
  return monthGrid(month).find((d): d is string => d !== null && openSlots(choice, d, rules).length > 0);
}

/** This month if it has an opening, otherwise next month. */
export function firstOpenMonth(choice: CoachChoice, rules: BookingRules) {
  const month = monthOf(rules.today);
  return firstOpenDay(choice, month, rules) ? month : addMonths(month, 1);
}

/** An ISO start time for a Toronto day and clock time, with the right offset for daylight saving. */
export function torontoIso(day: string, time: string) {
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
      .formatToParts(dateOf(day))
      .find((p) => p.type === "timeZoneName")
      ?.value.replace("GMT", "") || "+00:00";
  return `${day}T${time}:00${offset}`;
}

/* ---------- Calendar file ---------- */

const icsTime = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/** A data URL for an .ics file, so a booking can be added to any calendar. */
export function calendarFile(booking: Booking, title: string) {
  const start = new Date(booking.startsAt);
  const end = new Date(start.getTime() + booking.minutes * 60_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Career OS//Coaching//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@career-os`,
    `DTSTAMP:${icsTime(start)}`,
    `DTSTART:${icsTime(start)}`,
    `DTEND:${icsTime(end)}`,
    `SUMMARY:${title} (Career OS)`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

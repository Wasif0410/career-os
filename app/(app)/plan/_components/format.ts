/** Dates on the Plan page are calendar days (YYYY-MM-DD), handled in UTC so nothing shifts. */

export const at = (day: string) => new Date(`${day}T12:00:00Z`);

export const weekdayShort = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short" });
export const monthDay = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" });
const dayOfMonth = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", day: "numeric" });

/** "Sep 21 – 27", or "Sep 28 – Oct 4" across a month. */
export function dayRange(start: string, end: string) {
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  return `${monthDay.format(at(start))} – ${(sameMonth ? dayOfMonth : monthDay).format(at(end))}`;
}

/** "Sat, Oct 3" */
export const dayLabel = (day: string) => `${weekdayShort.format(at(day))}, ${monthDay.format(at(day))}`;

/** "40 min", "1 h", "1 h 25 min". */
export function duration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

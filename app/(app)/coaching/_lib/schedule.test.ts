import { describe, expect, it } from "vitest";
import type { Booking } from "@/lib/mock/coaching";
import {
  bookingDay,
  bookingTime,
  calendarFile,
  clock,
  firstOpenDay,
  firstOpenMonth,
  lastBookableDay,
  longDay,
  monthGrid,
  openSlots,
  timeRange,
  torontoIso,
  upcomingBookings,
  type BookingRules,
  type Openings,
} from "./schedule";

const booking = (id: string, startsAt: string, coach: Booking["coach"] = "wasif"): Booking => ({
  id,
  coach,
  type: "checkin",
  startsAt,
  minutes: 45,
});

const openings: Openings = {
  weekly: {
    wasif: [{ weekday: 4, times: ["17:00", "18:00"] }],
    abishek: [
      { weekday: 3, times: ["18:30"] },
      { weekday: 4, times: ["12:00"] },
    ],
  },
  away: { wasif: ["2026-10-22"], abishek: [] },
};

const oct8 = booking("oct-8", "2026-10-08T18:00:00-04:00");

const rules = (perMonth: number, bookings: Booking[] = [oct8]): BookingRules => ({
  today: "2026-10-02",
  bookings,
  perMonth,
  openings,
});

describe("labels", () => {
  it("prints Toronto times and days the same way everywhere", () => {
    expect(clock("18:30")).toBe("6:30 PM");
    expect(clock("00:05")).toBe("12:05 AM");
    expect(clock("12:00")).toBe("12:00 PM");
    expect(timeRange("18:00", 45)).toBe("6:00 PM to 6:45 PM");
    expect(timeRange("23:30", 60)).toBe("11:30 PM to 12:30 AM");
    expect(longDay("2026-10-15")).toBe("Thursday, October 15");
  });

  it("reads a late-evening booking as its Toronto day and time, not the UTC ones", () => {
    const late = booking("late", "2026-10-08T22:30:00-04:00");
    expect(bookingDay(late)).toBe("2026-10-08");
    expect(bookingTime(late)).toBe("22:30");
  });
});

describe("months", () => {
  it("lays out a month Monday first, with blanks before the 1st", () => {
    const grid = monthGrid("2026-10");
    expect(grid.slice(0, 4)).toEqual([null, null, null, "2026-10-01"]);
    expect(grid.filter(Boolean)).toHaveLength(31);
  });

  it("lets students book until the end of next month", () => {
    expect(lastBookableDay("2026-10-02")).toBe("2026-11-30");
    expect(lastBookableDay("2026-12-15")).toBe("2027-01-31");
  });

  it("lists upcoming bookings soonest first", () => {
    const sep = booking("sep", "2026-09-30T18:00:00-04:00");
    const nov = booking("nov", "2026-11-05T18:00:00-05:00");
    expect(upcomingBookings([nov, sep, oct8], "2026-10-02").map((b) => b.id)).toEqual(["oct-8", "nov"]);
  });
});

describe("openSlots", () => {
  it("offers a coach's weekly times, or both coaches' merged by time", () => {
    expect(openSlots("wasif", "2026-10-15", rules(4))).toEqual([
      { coach: "wasif", time: "17:00" },
      { coach: "wasif", time: "18:00" },
    ]);
    expect(openSlots("any", "2026-10-15", rules(4)).map((s) => `${s.coach} ${s.time}`)).toEqual([
      "abishek 12:00",
      "wasif 17:00",
      "wasif 18:00",
    ]);
  });

  it("skips away days and days the student already has a call", () => {
    expect(openSlots("wasif", "2026-10-22", rules(4))).toEqual([]);
    expect(openSlots("any", "2026-10-22", rules(4))).toEqual([{ coach: "abishek", time: "12:00" }]);
    expect(openSlots("wasif", "2026-10-08", rules(4))).toEqual([]);
  });

  it("stops at the plan's monthly limit, today and the end of next month", () => {
    expect(openSlots("wasif", "2026-10-15", rules(1))).toEqual([]);
    expect(openSlots("wasif", "2026-11-05", rules(1))).toHaveLength(2);
    expect(openSlots("wasif", "2026-10-01", rules(4))).toEqual([]);
    expect(openSlots("wasif", "2026-12-03", rules(4))).toEqual([]);
  });

  it("shows every opening when looking without a plan", () => {
    expect(openSlots("wasif", "2026-10-15", rules(Infinity, []))).toHaveLength(2);
  });
});

describe("first openings", () => {
  it("finds the first open day in a month", () => {
    expect(firstOpenDay("wasif", "2026-10", rules(4))).toBe("2026-10-15");
    expect(firstOpenDay("abishek", "2026-10", rules(4))).toBe("2026-10-07");
  });

  it("opens on next month when this month is used up", () => {
    expect(firstOpenMonth("wasif", rules(1))).toBe("2026-11");
    expect(firstOpenMonth("wasif", rules(4))).toBe("2026-10");
  });
});

describe("torontoIso", () => {
  it("uses daylight time until November 1 and standard time after", () => {
    expect(torontoIso("2026-10-15", "18:00")).toBe("2026-10-15T18:00:00-04:00");
    expect(torontoIso("2026-11-05", "18:00")).toBe("2026-11-05T18:00:00-05:00");
  });
});

describe("calendarFile", () => {
  it("builds an event in UTC with the booking's length", () => {
    const file = decodeURIComponent(calendarFile(oct8, "Strategy with Wasif").split(",")[1]);
    expect(file).toContain("DTSTART:20261008T220000Z");
    expect(file).toContain("DTEND:20261008T224500Z");
    expect(file).toContain("SUMMARY:Strategy with Wasif (Career OS)");
  });
});

# Coaching page design (`/coaching`)

**Date:** 2026-10-04 · **Branch:** `page/coaching` → `dashboard` · **Status:** local, approved by Wasif from an HTML mockup

## What the page is for

Booking calls with Wasif or Abishek, and nothing else. Session notes, goals and tasks live on Plan; Coaching is where a student books, moves or cancels a call.

## Layout

1. **Title:** "Coaching" and "Book a call with Wasif or Abishek." On the right, the calls left this month ("3 of 4 calls left in October") with one mark per call, or Free's "Booking starts with Pro" and See plans.
2. **Booked calls:** one row per upcoming call: a small date, the call and coach, the time in ET, and Add to calendar (an `.ics` file), Reschedule and Cancel. Cancel asks once more.
3. **The booking card**, three numbered columns:
   1. **Choose a call** (Check-in, Mock interview, Resume review, Strategy, each with its length) and the coach (Wasif, Abishek, or Either for the soonest times).
   2. **Pick a day:** the month, with open days as filled circles, the selected day in navy and the student's booked day outlined. Moves between this month and next.
   3. **Pick a time:** the day's times as a list. Choosing one shows **Next** beside it.
4. **Confirm:** the call, coach, date and time on the left; an optional note for the coach and **Book call** on the right.
5. **Booked:** "You're booked" with Add to calendar, Book another call and Undo. Rescheduling uses the same steps with a "Moving your … call" line and **Move call**.

On narrower screens the call column moves above the day and time; on phones everything stacks.

## Rules

All from `lib/access.ts`: `coaching.sessions` (Pro) allows booking and `coachingSessionsPerMonth` sets calls per calendar month (Pro 1, Elite 4). When a month is used up, the card opens on the next month and says why. Students can book until the end of next month, never today or the past, and one call a day. Free sees every opening, and the last button goes to `/pricing`.

## Data

`lib/mock/coaching.ts`: the call types (names and lengths are placeholders until the coaches confirm them), the demo student's booked call (Strategy with Wasif on Oct 8, matching Home's calendar), and each coach's weekly openings and away days. Bookings made on the page last until reload. When booking goes live, Cal.com replaces the openings and the confirm step; the page reads the same booking shape.

## Checks

- `app/(app)/coaching/_lib/schedule.test.ts`: labels, Toronto daylight saving, the month grid, open times per coach and for either, the monthly limit, first openings and the calendar file.
- `e2e/app/coaching.spec.ts`: Free looks and is sent to Pro, Pro opens on November, Elite books in three steps, undo, reschedule and cancel, on desktop and phone.

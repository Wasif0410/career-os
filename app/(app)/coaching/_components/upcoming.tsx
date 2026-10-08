import type { Booking, CallType, CoachSlug } from "@/lib/mock/coaching";
import { bookingDay, bookingTime, calendarFile, dayNumber, monthShort, timeRange, weekdayName } from "../_lib/schedule";
import type { CoachInfo } from "./ui";

/*
 * The student's booked calls, one row each above the booking card, with
 * Add to calendar, Reschedule and Cancel. Cancelling asks once more first.
 */
export function UpcomingCalls({
  bookings,
  callTypes,
  coaches,
  cancelling,
  onAskCancel,
  onCancel,
  onReschedule,
}: {
  bookings: Booking[];
  callTypes: CallType[];
  coaches: Record<CoachSlug, CoachInfo>;
  /** The booking waiting for a yes or no on cancelling. */
  cancelling: string | null;
  onAskCancel: (id: string | null) => void;
  onCancel: (id: string) => void;
  onReschedule: (booking: Booking) => void;
}) {
  if (bookings.length === 0) return null;
  return (
    <ul className="mt-7 grid gap-2.5" aria-label="Your booked calls">
      {bookings.map((b) => {
        const day = bookingDay(b);
        const type = callTypes.find((t) => t.id === b.type) ?? callTypes[0];
        const coach = coaches[b.coach];
        const title = `${type.name} with ${coach.name}`;
        return (
          <li
            key={b.id}
            className="anim-fade-up flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[18px] bg-surface py-3.5 pr-5 pl-3.5 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_18px_48px_-24px_rgb(11_18_32/0.28)] ring-1 ring-rule"
          >
            <span
              aria-hidden
              className="w-[52px] shrink-0 overflow-hidden rounded-xl text-center ring-1 ring-rule ring-inset"
            >
              <span className="block bg-navy py-0.5 font-mono text-[0.65rem] tracking-[0.06em] text-sky uppercase">
                {monthShort(day)}
              </span>
              <b className="block py-1 text-[1.25rem] leading-tight font-semibold">{dayNumber(day)}</b>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.97rem] font-semibold">{title}</span>
              <span className="block text-[0.88rem] text-slate">
                {weekdayName(day)}, {timeRange(bookingTime(b), b.minutes)} ET
              </span>
            </span>
            {cancelling === b.id ? (
              <span className="flex items-center gap-4 text-[0.88rem]" role="group" aria-label="Cancel this call?">
                <span className="text-ink-soft">Cancel this call?</span>
                <button type="button" onClick={() => onCancel(b.id)} className="font-medium text-stop hover:underline">
                  Yes, cancel
                </button>
                <button
                  type="button"
                  onClick={() => onAskCancel(null)}
                  className="font-medium text-slate hover:text-ink"
                >
                  Keep it
                </button>
              </span>
            ) : (
              <span className="flex items-center gap-5 text-[0.88rem] font-medium">
                <a
                  href={calendarFile(b, title)}
                  download={`career-os-call-${day}.ics`}
                  className="text-cobalt hover:text-cobalt-deep"
                >
                  Add to calendar
                </a>
                <button type="button" onClick={() => onReschedule(b)} className="text-cobalt hover:text-cobalt-deep">
                  Reschedule
                </button>
                <button type="button" onClick={() => onAskCancel(b.id)} className="text-slate hover:text-ink">
                  Cancel
                </button>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CheckGlyph } from "@/components/brand/glyphs";
import type { Booking, CallType } from "@/lib/mock/coaching";
import { bookingDay, bookingTime, calendarFile, longDay, timeRange } from "../_lib/schedule";
import { CalendarIcon, ChevronIcon, ClockIcon, CoachFace, type CoachInfo } from "./ui";

/* The last two views of the booking card: check the details, then the confirmation. */

/** Moves focus to the view's heading when it appears, so screen readers hear the change. */
function useFocusOnMount() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return ref;
}

export function ConfirmView({
  callType,
  coach,
  day,
  time,
  note,
  onNote,
  onBack,
  onBook,
  upgrade,
  moving,
}: {
  callType: CallType;
  coach: CoachInfo;
  day: string;
  time: string;
  note: string;
  onNote: (note: string) => void;
  onBack: () => void;
  onBook: () => void;
  /** Free: the button goes to the plan that includes coaching. */
  upgrade?: { href: string; label: string };
  /** Set when this replaces an existing booking. */
  moving?: boolean;
}) {
  const heading = useFocusOnMount();
  return (
    <div className="grid grid-cols-1 @3xl:min-h-[540px] @3xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="p-6 sm:p-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-7 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-cobalt hover:text-cobalt-deep"
        >
          <ChevronIcon left />
          Back
        </button>
        <h2
          ref={heading}
          tabIndex={-1}
          className="font-display text-[2.1rem] leading-[1.05] tracking-[-0.02em] outline-none"
        >
          {callType.name}
        </h2>
        <div className="mt-5 flex items-center gap-3">
          <CoachFace coach={coach} className="size-12 text-2xl" />
          <span>
            <span className="block font-semibold">{coach.fullName}</span>
            <span className="block text-[0.85rem] text-slate">{coach.focus}</span>
          </span>
        </div>
        <ul className="mt-6 grid gap-3 text-[0.94rem]">
          <li className="flex items-center gap-3">
            <CalendarIcon className="text-slate" />
            {longDay(day)}
          </li>
          <li className="flex items-center gap-3">
            <ClockIcon className="text-slate" />
            {timeRange(time, callType.minutes)} ET, {callType.minutes} minutes
          </li>
        </ul>
      </div>

      <div className="flex flex-col border-t border-rule p-6 sm:p-8 @3xl:border-t-0 @3xl:border-l">
        <label htmlFor="coach-note" className="text-[0.94rem] font-semibold">
          Anything {coach.name} should know?
        </label>
        <p className="mt-1 text-[0.85rem] text-slate">Optional. What you want to cover, or a link to look at first.</p>
        <textarea
          id="coach-note"
          value={note}
          onChange={(e) => onNote(e.target.value)}
          maxLength={500}
          rows={6}
          placeholder="For example: I have a technical interview at a bank on the 9th."
          className="mt-3.5 w-full resize-y rounded-[14px] bg-paper px-4 py-3.5 text-[0.94rem] leading-relaxed ring-1 ring-rule ring-inset placeholder:text-slate/80 focus:bg-surface focus:ring-2 focus:ring-cobalt focus:outline-none"
        />
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
          {upgrade ? (
            <Link
              href={upgrade.href}
              className="inline-flex h-12 items-center rounded-full bg-navy px-6 text-[0.92rem] font-medium text-white hover:bg-ink"
            >
              {upgrade.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onBook}
              className="inline-flex h-12 items-center rounded-full bg-navy px-6 text-[0.92rem] font-medium text-white hover:bg-ink"
            >
              {moving ? "Move call" : "Book call"}
            </button>
          )}
          <button type="button" onClick={onBack} className="text-[0.88rem] font-medium text-slate hover:text-ink">
            Change time
          </button>
        </div>
      </div>
    </div>
  );
}

export function DoneView({
  booking,
  callType,
  coach,
  moved,
  onAgain,
  onUndo,
}: {
  booking: Booking;
  callType: CallType;
  coach: CoachInfo;
  moved: boolean;
  onAgain: () => void;
  onUndo: () => void;
}) {
  const heading = useFocusOnMount();
  const day = bookingDay(booking);
  return (
    <div role="status" className="grid min-h-[480px] place-items-center px-6 py-12 text-center @3xl:min-h-[540px]">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-go-wash text-go">
          <CheckGlyph className="size-7" />
        </span>
        <h2
          ref={heading}
          tabIndex={-1}
          className="mt-5 font-display text-[2.5rem] leading-[1.05] tracking-[-0.025em] outline-none"
        >
          {moved ? "Your call is moved" : "You're booked"}
        </h2>
        <p className="mt-2.5 text-[1rem] text-slate">
          {callType.name} with {coach.fullName}
          <br />
          {longDay(day)}, {timeRange(bookingTime(booking), booking.minutes)} ET
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={calendarFile(booking, `${callType.name} with ${coach.name}`)}
            download={`career-os-call-${day}.ics`}
            className="inline-flex h-12 items-center rounded-full bg-navy px-6 text-[0.92rem] font-medium text-white hover:bg-ink"
          >
            Add to calendar
          </a>
          <button
            type="button"
            onClick={onAgain}
            className="inline-flex h-12 items-center rounded-full px-6 text-[0.92rem] font-medium ring-1 ring-rule-strong ring-inset hover:bg-paper"
          >
            Book another call
          </button>
          <button type="button" onClick={onUndo} className="px-2 text-[0.88rem] font-medium text-slate hover:text-ink">
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}

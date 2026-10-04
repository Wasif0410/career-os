"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Booking, CallType, CoachSlug } from "@/lib/mock/coaching";
import { cn } from "@/lib/utils";
import {
  addMonths,
  bookingDay,
  countInMonth,
  firstOpenDay,
  firstOpenMonth,
  lastBookableDay,
  longDay,
  monthHasRoom,
  monthName,
  monthOf,
  openSlots,
  torontoIso,
  upcomingBookings,
  type BookingRules,
  type CoachChoice,
  type Openings,
  type Slot,
} from "../_lib/schedule";
import styles from "./coaching.module.css";
import { ConfirmView, DoneView } from "./finish";
import { CallStep, DayStep, TimeStep } from "./steps";
import type { CoachInfo } from "./ui";
import { UpcomingCalls } from "./upcoming";

/*
 * Coaching is a booking page: the student's booked calls, then one card that
 * books a new one in three steps (the call and coach, a day, a time), a check
 * of the details, and a confirmation. Free students can look at the openings;
 * the last button sends them to the plan with coaching. This is the demo's
 * stand-in for the Cal.com booking, which takes over when booking goes live.
 */

type View = "pick" | "confirm" | "done";

export function CoachingBooking({
  today,
  bookings: initialBookings,
  perMonth,
  canBook,
  upgradeName,
  coaches,
  callTypes,
  openings,
}: {
  today: string;
  bookings: Booking[];
  /** Calls the plan allows each month, from lib/access.ts. */
  perMonth: number;
  /** From canAccess(user, "coaching.sessions"). */
  canBook: boolean;
  /** The plan that includes coaching, for Free's upgrade button. */
  upgradeName: string;
  coaches: CoachInfo[];
  callTypes: CallType[];
  openings: Openings;
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [type, setType] = useState(callTypes[0].id);
  const [coach, setCoach] = useState<CoachChoice>("any");
  const [moving, setMoving] = useState<Booking | null>(null);
  const [view, setView] = useState<View>("pick");
  const [picked, setPicked] = useState<{ day?: string; slot?: Slot }>({});
  const [note, setNote] = useState("");
  const [last, setLast] = useState<{ booking: Booking; replaced?: Booking } | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const card = useRef<HTMLElement>(null);

  // When moving a call, its own day and its month's place are free again.
  const rulesFor = (list: Booking[], except?: string): BookingRules => ({
    today,
    bookings: list.filter((b) => b.id !== except),
    perMonth: canBook ? perMonth : Infinity,
    openings,
  });
  const rules = rulesFor(bookings, moving?.id);
  const [month, setMonth] = useState(() => firstOpenMonth("any", rules));

  const isOpen = (d: string) => openSlots(coach, d, rules).length > 0;
  const day =
    picked.day && monthOf(picked.day) === month && isOpen(picked.day) ? picked.day : firstOpenDay(coach, month, rules);
  const slots = day ? openSlots(coach, day, rules) : [];
  const slot =
    picked.day === day ? slots.find((s) => s.time === picked.slot?.time && s.coach === picked.slot?.coach) : undefined;
  const callType = callTypes.find((t) => t.id === type) ?? callTypes[0];
  const byCoach = Object.fromEntries(coaches.map((c) => [c.slug, c])) as Record<CoachSlug, CoachInfo>;
  const upcoming = upcomingBookings(bookings, today);
  const thisMonth = monthOf(today);

  function startOver(list: Booking[], choice: CoachChoice = coach) {
    setView("pick");
    setPicked({});
    setNote("");
    setMoving(null);
    setMonth(firstOpenMonth(choice, rulesFor(list)));
  }

  function chooseCoach(choice: CoachChoice) {
    setCoach(choice);
    setPicked({});
    if (!firstOpenDay(choice, month, rules)) setMonth(firstOpenMonth(choice, rules));
  }

  function book() {
    if (!day || !slot) return;
    const booking: Booking = {
      id: `b-${day}-${slot.time.replace(":", "")}-${slot.coach}`,
      coach: slot.coach,
      type,
      startsAt: torontoIso(day, slot.time),
      minutes: callType.minutes,
      note: note.trim() || undefined,
    };
    const replaced = moving ?? undefined;
    setBookings((list) => [...list.filter((b) => b.id !== replaced?.id), booking]);
    setLast({ booking, replaced });
    setMoving(null);
    setNote("");
    setView("done");
  }

  function undo() {
    if (!last) return;
    const restored = [...bookings.filter((b) => b.id !== last.booking.id), ...(last.replaced ? [last.replaced] : [])];
    setBookings(restored);
    setLast(null);
    startOver(restored);
  }

  function reschedule(booking: Booking) {
    setMoving(booking);
    setType(booking.type);
    setCoach(booking.coach);
    setPicked({});
    setNote(booking.note ?? "");
    setCancelling(null);
    setView("pick");
    setMonth(firstOpenMonth(booking.coach, rulesFor(bookings, booking.id)));
    card.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancel(id: string) {
    const list = bookings.filter((b) => b.id !== id);
    setBookings(list);
    setCancelling(null);
    if (moving?.id === id || view !== "pick") startOver(list);
  }

  let note2: React.ReactNode = null;
  if (!canBook) note2 = <>See when the coaches are free. Booking starts with {upgradeName}.</>;
  else if (!monthHasRoom(month, rules)) {
    const next = addMonths(month, 1);
    note2 = (
      <>
        You&apos;ve booked all of {monthName(month)}&apos;s calls.{" "}
        {next <= monthOf(lastBookableDay(today)) && (
          <button
            type="button"
            onClick={() => {
              setMonth(next);
              setPicked({});
            }}
            className="font-medium text-cobalt hover:text-cobalt-deep"
          >
            See {monthName(next)}
          </button>
        )}
      </>
    );
  }

  return (
    <div className="@container mx-auto max-w-[1240px]">
      <header className="anim-fade-up flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div>
          <h1 className="font-display text-[clamp(2.4rem,1.8rem+1.6vw,3.5rem)] leading-none tracking-[-0.028em]">
            Coaching
          </h1>
          <p className="mt-2.5 text-[1rem] text-slate">Book a call with {coaches.map((c) => c.name).join(" or ")}.</p>
        </div>
        <Allowance
          canBook={canBook}
          used={countInMonth(bookings, thisMonth)}
          perMonth={perMonth}
          month={thisMonth}
          upgradeName={upgradeName}
        />
      </header>

      <UpcomingCalls
        bookings={upcoming}
        callTypes={callTypes}
        coaches={byCoach}
        cancelling={cancelling}
        onAskCancel={setCancelling}
        onCancel={cancel}
        onReschedule={reschedule}
      />

      <section
        ref={card}
        aria-label="Book a call"
        style={{ "--d": "0.1s" } as React.CSSProperties}
        className="anim-fade-up mt-5 scroll-mt-6 overflow-hidden rounded-[24px] bg-surface shadow-[0_1px_2px_rgb(11_18_32/0.04),0_18px_48px_-24px_rgb(11_18_32/0.28)] ring-1 ring-rule"
      >
        {moving && view === "pick" && (
          <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-rule bg-cobalt-wash px-5 py-3 text-[0.88rem] text-cobalt-deep sm:px-7">
            <span>
              Moving your {callTypes.find((t) => t.id === moving.type)?.name} call on {longDay(bookingDay(moving))}.
            </span>
            <button type="button" onClick={() => startOver(bookings)} className="font-medium hover:underline">
              Keep it
            </button>
          </p>
        )}

        <div key={view} className={styles.fade}>
          {view === "pick" && (
            <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:min-h-[540px] @4xl:grid-cols-[minmax(270px,0.9fr)_minmax(340px,1.25fr)_minmax(240px,0.85fr)]">
              <div className="min-w-0 border-b border-rule p-5 sm:p-7 @2xl:col-span-2 @4xl:col-span-1 @4xl:border-b-0">
                <CallStep
                  callTypes={callTypes}
                  type={type}
                  onType={setType}
                  coaches={coaches}
                  coach={coach}
                  onCoach={chooseCoach}
                />
              </div>
              <div className="min-w-0 border-b border-rule p-5 sm:p-7 @2xl:border-b-0 @4xl:border-l">
                <DayStep
                  month={month}
                  today={today}
                  day={day}
                  canPrev={month > thisMonth}
                  canNext={month < monthOf(lastBookableDay(today))}
                  onMonth={(step) => {
                    setMonth(addMonths(month, step));
                    setPicked({});
                  }}
                  isOpen={isOpen}
                  isBooked={(d) => rules.bookings.some((b) => bookingDay(b) === d)}
                  onDay={(d) => setPicked({ day: d })}
                  note={note2}
                />
              </div>
              <div className="min-w-0 bg-[#fafbfe] p-5 sm:p-7 @2xl:border-l @2xl:border-rule">
                <TimeStep
                  day={day}
                  slots={slots}
                  slot={slot}
                  onSlot={(s) => setPicked({ day, slot: s })}
                  onNext={() => setView("confirm")}
                  showCoach={coach === "any"}
                  coaches={byCoach}
                />
              </div>
            </div>
          )}

          {view === "confirm" && day && slot && (
            <ConfirmView
              callType={callType}
              coach={byCoach[slot.coach]}
              day={day}
              time={slot.time}
              note={note}
              onNote={setNote}
              onBack={() => setView("pick")}
              onBook={book}
              upgrade={canBook ? undefined : { href: "/pricing", label: `Book with ${upgradeName}` }}
              moving={Boolean(moving)}
            />
          )}

          {view === "done" && last && (
            <DoneView
              booking={last.booking}
              callType={callTypes.find((t) => t.id === last.booking.type) ?? callType}
              coach={byCoach[last.booking.coach]}
              moved={Boolean(last.replaced)}
              onAgain={() => startOver(bookings)}
              onUndo={undo}
            />
          )}
        </div>
      </section>
    </div>
  );
}

/** Calls left this month on the plan, or Free's way in. */
function Allowance({
  canBook,
  used,
  perMonth,
  month,
  upgradeName,
}: {
  canBook: boolean;
  used: number;
  perMonth: number;
  month: string;
  upgradeName: string;
}) {
  if (!canBook) {
    return (
      <div className="text-[0.88rem] text-slate @2xl:text-right">
        Booking starts with {upgradeName}
        <div className="mt-2.5">
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center rounded-full bg-navy px-5 text-[0.9rem] font-medium text-white hover:bg-ink"
          >
            See plans
          </Link>
        </div>
      </div>
    );
  }
  const left = Math.max(0, perMonth - used);
  return (
    <div className="text-[0.88rem] text-slate @2xl:text-right">
      {left > 0 ? (
        <p>
          <b className="font-semibold text-ink">
            {left} of {perMonth}
          </b>{" "}
          calls left in {monthName(month)}
        </p>
      ) : (
        <p>
          {monthName(month)}&apos;s call is booked.{" "}
          <b className="font-semibold text-ink">{monthName(addMonths(month, 1))}</b> is open.
        </p>
      )}
      <span aria-hidden className="mt-2 flex gap-[5px] @2xl:justify-end">
        {Array.from({ length: perMonth }, (_, i) => (
          <i key={i} className={cn("h-[5px] w-[22px] rounded-full", i < used ? "bg-navy" : "bg-paper-deep")} />
        ))}
      </span>
    </div>
  );
}

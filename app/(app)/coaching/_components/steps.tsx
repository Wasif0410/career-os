import type { CallType, CoachSlug } from "@/lib/mock/coaching";
import { cn } from "@/lib/utils";
import { clock, dayNumber, longDay, monthGrid, monthName, type CoachChoice, type Slot } from "../_lib/schedule";
import { ChevronIcon, ClockIcon, CoachFace, GlobeIcon, StepTitle, type CoachInfo } from "./ui";

/*
 * The three columns of the booking card. They only draw what they are given;
 * the choices live in CoachingBooking.
 */

const option = (on: boolean) =>
  cn(
    "flex w-full min-w-0 items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors",
    on ? "bg-cobalt-wash ring-[1.5px] ring-cobalt/35 ring-inset" : "hover:bg-paper",
  );

/* ---------- 1. The call and the coach ---------- */

export function CallStep({
  callTypes,
  type,
  onType,
  coaches,
  coach,
  onCoach,
}: {
  callTypes: CallType[];
  type: CallType["id"];
  onType: (id: CallType["id"]) => void;
  coaches: CoachInfo[];
  coach: CoachChoice;
  onCoach: (choice: CoachChoice) => void;
}) {
  return (
    <>
      <StepTitle n={1} id="step-call">
        Choose a call
      </StepTitle>
      <div role="group" aria-labelledby="step-call" className="grid grid-cols-1 gap-1.5 @2xl:@max-4xl:grid-cols-2">
        {callTypes.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === type}
            onClick={() => onType(t.id)}
            className={option(t.id === type)}
          >
            <span className="min-w-0 flex-1">
              <span className={cn("block text-[0.94rem] font-semibold", t.id === type && "text-cobalt-deep")}>
                {t.name}
              </span>
              <span className="block text-[0.8rem] leading-snug text-slate">{t.blurb}</span>
            </span>
            <span className="shrink-0 font-mono text-[0.75rem] text-slate">{t.minutes} min</span>
          </button>
        ))}
      </div>

      <p id="step-coach" className="mt-6 mb-2.5 text-[0.82rem] font-medium text-slate">
        With
      </p>
      <div role="group" aria-labelledby="step-coach" className="grid grid-cols-1 gap-1.5 @2xl:@max-4xl:grid-cols-3">
        {coaches.map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={coach === c.slug}
            onClick={() => onCoach(c.slug)}
            className={option(coach === c.slug)}
          >
            <CoachFace coach={c} />
            <span className="min-w-0">
              <span className={cn("block text-[0.94rem] font-semibold", coach === c.slug && "text-cobalt-deep")}>
                {c.name}
              </span>
              <span className="block text-[0.8rem] leading-snug text-slate">{c.focus}</span>
            </span>
          </button>
        ))}
        <button
          type="button"
          aria-pressed={coach === "any"}
          onClick={() => onCoach("any")}
          className={option(coach === "any")}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-deep text-ink-soft">
            <ClockIcon className="size-4" />
          </span>
          <span className="min-w-0">
            <span className={cn("block text-[0.94rem] font-semibold", coach === "any" && "text-cobalt-deep")}>
              Either
            </span>
            <span className="block text-[0.8rem] leading-snug text-slate">Show the soonest times</span>
          </span>
        </button>
      </div>
    </>
  );
}

/* ---------- 2. The day ---------- */

export function DayStep({
  month,
  today,
  day,
  canPrev,
  canNext,
  onMonth,
  isOpen,
  isBooked,
  onDay,
  note,
}: {
  month: string;
  today: string;
  /** The selected day. */
  day?: string;
  canPrev: boolean;
  canNext: boolean;
  onMonth: (step: -1 | 1) => void;
  isOpen: (day: string) => boolean;
  /** Days the student already has a call. */
  isBooked: (day: string) => boolean;
  onDay: (day: string) => void;
  note?: React.ReactNode;
}) {
  return (
    <>
      <StepTitle n={2}>Pick a day</StepTitle>
      <div className="mb-3.5 flex items-center justify-between">
        <p className="text-[1.05rem] font-semibold" aria-live="polite">
          {monthName(month)} {month.slice(0, 4)}
        </p>
        <div className="flex gap-1.5">
          {([-1, 1] as const).map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => onMonth(step)}
              disabled={step < 0 ? !canPrev : !canNext}
              aria-label={step < 0 ? "Previous month" : "Next month"}
              className="grid size-9 place-items-center rounded-full bg-cobalt-wash text-cobalt-deep hover:bg-[#dfe6ff] disabled:cursor-default disabled:bg-transparent disabled:text-rule-strong"
            >
              <ChevronIcon left={step < 0} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 justify-items-center gap-y-1.5 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d} aria-hidden className="pb-2 text-[0.7rem] font-semibold tracking-[0.06em] text-slate uppercase">
            {d}
          </span>
        ))}
        {monthGrid(month).map((d, i) => {
          if (!d) return <span key={`blank-${i}`} />;
          const base =
            "relative grid size-10 place-items-center rounded-full text-[0.92rem] tabular-nums @lg:size-[46px]";
          const todayDot = d === today && (
            <span
              aria-hidden
              className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current"
            />
          );
          if (isOpen(d)) {
            const on = d === day;
            return (
              <button
                key={d}
                type="button"
                onClick={() => onDay(d)}
                aria-pressed={on}
                aria-label={longDay(d)}
                className={cn(
                  base,
                  "font-semibold transition-colors",
                  on ? "bg-navy text-white" : "bg-cobalt-wash text-cobalt-deep hover:bg-[#d9e1ff]",
                )}
              >
                {dayNumber(d)}
                {todayDot}
              </button>
            );
          }
          if (isBooked(d)) {
            return (
              <span
                key={d}
                title="Your call"
                className={cn(base, "font-semibold text-ink ring-2 ring-navy ring-inset")}
              >
                {dayNumber(d)}
                <span className="sr-only">, your call</span>
              </span>
            );
          }
          return (
            <span key={d} className={cn(base, "text-[#a3abbe]")}>
              {dayNumber(d)}
              {todayDot}
            </span>
          );
        })}
      </div>

      {note && <div className="mt-4 rounded-xl bg-paper px-3.5 py-2.5 text-[0.84rem] text-ink-soft">{note}</div>}
      <p className="mt-5 flex items-center gap-2 text-[0.84rem] text-slate">
        <GlobeIcon />
        Toronto time (ET)
      </p>
    </>
  );
}

/* ---------- 3. The time ---------- */

export function TimeStep({
  day,
  slots,
  slot,
  onSlot,
  onNext,
  showCoach,
  coaches,
}: {
  day?: string;
  slots: Slot[];
  slot?: Slot;
  onSlot: (slot: Slot) => void;
  onNext: () => void;
  /** Whether to mark each time with its coach (when showing both). */
  showCoach: boolean;
  coaches: Record<CoachSlug, CoachInfo>;
}) {
  return (
    <>
      <StepTitle n={3}>Pick a time</StepTitle>
      {day && slots.length > 0 ? (
        <>
          <p className="mb-3.5 text-[0.94rem] text-ink-soft">{longDay(day)}</p>
          <ul className="grid grid-cols-1 gap-2" aria-label={`Times on ${longDay(day)}`}>
            {slots.map((s) => {
              const on = slot?.time === s.time && slot.coach === s.coach;
              return (
                <li key={`${s.coach}-${s.time}`} className={cn("grid gap-2", on ? "grid-cols-2" : "grid-cols-1")}>
                  <button
                    type="button"
                    onClick={() => onSlot(s)}
                    aria-pressed={on}
                    aria-label={`${clock(s.time)} with ${coaches[s.coach].name}`}
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-xl text-[0.94rem] font-semibold tabular-nums transition-colors",
                      on
                        ? "bg-slate text-white"
                        : "bg-surface text-cobalt-deep ring-[1.5px] ring-cobalt/35 ring-inset hover:ring-2 hover:ring-cobalt",
                    )}
                  >
                    {showCoach && (
                      <CoachFace coach={coaches[s.coach]} className="size-[22px] text-[0.7rem] ring-2 ring-white" />
                    )}
                    {clock(s.time)}
                  </button>
                  {on && (
                    <button
                      type="button"
                      onClick={onNext}
                      className="h-12 rounded-xl bg-cobalt text-[0.94rem] font-semibold text-white hover:bg-cobalt-deep"
                    >
                      Next
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="py-10 text-center text-[0.88rem] text-slate">Pick a day to see times.</p>
      )}
    </>
  );
}

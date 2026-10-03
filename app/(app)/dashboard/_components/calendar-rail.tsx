import Link from "next/link";
import type { CalendarEvent, CoachingSession } from "@/lib/mock/home";
import { cn } from "@/lib/utils";
import { Panel, ProTag } from "./panel";

/*
 * The right-hand column: this month at a glance, then what's coming up.
 * Dates are calendar days (YYYY-MM-DD), handled in UTC so nothing shifts.
 */

const iso = (d: Date) => d.toISOString().slice(0, 10);
const monthTitle = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" });
const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short" });

/** The weeks of `today`'s month, Monday first, padded with the neighbouring months' days. */
function monthWeeks(today: string) {
  const [y, m] = today.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Math.ceil((lead + daysInMonth) / 7) * 7;
  return Array.from({ length: cells }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1, 1 - lead + i));
    return { iso: iso(d), day: d.getUTCDate(), inMonth: d.getUTCMonth() === m - 1 };
  });
}

function Calendar({ today, events }: { today: string; events: CalendarEvent[] }) {
  const days = monthWeeks(today);
  const byDay = new Map(events.map((e) => [e.day, e]));
  return (
    <div>
      <h2 className="font-display text-[1.5rem] tracking-[-0.015em]">
        {monthTitle.format(new Date(`${today}T12:00:00Z`))}
      </h2>
      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d} className="pb-1.5 font-mono text-[0.65rem] tracking-[0.06em] text-slate uppercase">
            {d}
          </span>
        ))}
        {days.map((d) => {
          const event = byDay.get(d.iso);
          const isToday = d.iso === today;
          const isSession = event?.kind === "session";
          return (
            <span key={d.iso} className="relative grid h-9 place-items-center">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-[0.82rem] tabular-nums",
                  !d.inMonth && "text-rule-strong",
                  isToday && "bg-ink font-semibold text-white",
                  isSession &&
                    !isToday &&
                    "bg-cobalt font-semibold text-white shadow-[0_8px_18px_-8px_rgb(36_71_245/0.8)]",
                )}
              >
                {d.day}
              </span>
              {event && !isSession && <span className="absolute bottom-0.5 size-1 rounded-full bg-cobalt" />}
              {event && <span className="sr-only">{event.title}</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ComingUp({
  events,
  session,
  coached,
}: {
  events: CalendarEvent[];
  session: CoachingSession;
  coached: boolean;
}) {
  return (
    <div>
      <h3 className="mb-4 text-[0.95rem] font-semibold">Coming up</h3>
      <ol className="relative grid gap-3.5 before:absolute before:top-2 before:bottom-2 before:left-[47px] before:w-px before:bg-rule">
        {events.map((e) => {
          const date = new Date(`${e.day}T12:00:00Z`);
          const isSession = e.kind === "session";
          return (
            <li key={`${e.day}-${e.title}`} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4">
              <span className="pt-2.5 text-right">
                <b className="block font-mono text-[0.95rem] leading-none font-semibold">{date.getUTCDate()}</b>
                <span className="font-mono text-[0.6rem] tracking-[0.06em] text-slate uppercase">
                  {weekday.format(date)}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute top-3.5 left-[44px] size-[7px] rounded-full",
                  isSession
                    ? "bg-cobalt shadow-[0_0_0_3px_rgb(36_71_245/0.2)]"
                    : "bg-surface shadow-[0_0_0_1.5px_var(--color-rule-strong)]",
                )}
              />
              {isSession ? (
                <div className="deep-blue relative isolate ml-1 overflow-hidden rounded-[14px] px-3.5 py-3">
                  <p className="text-[0.72rem] text-sky">{e.label}</p>
                  <p className="mt-0.5 text-[0.88rem] font-medium text-white">{e.title}</p>
                  <ol className="mt-2.5 grid gap-1 border-t border-white/[0.12] pt-2.5 text-[0.78rem] text-white/85">
                    {session.agenda.map((item, i) => (
                      <li key={item} className="flex gap-2">
                        <b className="pt-px font-mono text-[0.68rem] font-medium text-white/45">{i + 1}</b>
                        {item}
                      </li>
                    ))}
                  </ol>
                  <Link
                    href="/coaching"
                    className="mt-3 inline-flex h-7 items-center rounded-full bg-white px-3 text-[0.75rem] font-medium text-ink hover:bg-[#eef1ff]"
                  >
                    View session
                  </Link>
                </div>
              ) : (
                <div className="ml-1 rounded-[14px] bg-paper px-3.5 py-2.5 ring-1 ring-rule ring-inset">
                  <p className="text-[0.72rem] text-slate">{e.label}</p>
                  <p className="mt-0.5 text-[0.85rem] font-medium">{e.title}</p>
                  {e.detail && <p className="text-[0.75rem] text-slate">{e.detail}</p>}
                </div>
              )}
            </li>
          );
        })}
        {!coached && (
          <li className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4">
            <span className="pt-2.5 text-right">
              <ProTag className="px-1.5" />
            </span>
            <span
              aria-hidden
              className="absolute top-3.5 left-[44px] size-[7px] rounded-full bg-surface shadow-[0_0_0_1.5px_var(--color-rule-strong)]"
            />
            <p className="ml-1 rounded-[14px] bg-paper px-3.5 py-2.5 text-[0.82rem] text-slate ring-1 ring-rule ring-inset">
              Coaching sessions, OAs and interviews show up here
            </p>
          </li>
        )}
      </ol>
    </div>
  );
}

export function CalendarRail({
  today,
  events,
  session,
  coached,
  style,
}: {
  today: string;
  events: CalendarEvent[];
  session: CoachingSession;
  /** From canAccess(user, "coaching.sessions"). */
  coached: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <Panel style={style} className="grid gap-7 self-start md:grid-cols-2 xl:sticky xl:top-6 xl:grid-cols-1">
      <div>
        <Calendar today={today} events={events} />
        <Link
          href={coached ? "/coaching" : "/pricing"}
          className="mt-4 flex h-10 items-center justify-center rounded-full bg-ink text-[0.82rem] font-medium text-white hover:bg-ink-soft"
        >
          {coached ? "Book a session" : "Book a session with Pro"}
        </Link>
      </div>
      <div className="border-rule md:border-l md:pl-7 xl:border-t xl:border-l-0 xl:pt-6 xl:pl-0">
        <ComingUp events={events} session={session} coached={coached} />
      </div>
    </Panel>
  );
}

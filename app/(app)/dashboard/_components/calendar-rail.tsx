import Link from "next/link";
import { ApplyGlyph, ChatGlyph, DiagnoseGlyph, TrackGlyph } from "@/components/brand/glyphs";
import type { CalendarEvent, CoachingSession } from "@/lib/mock/home";
import { cn } from "@/lib/utils";

/*
 * The right-hand column, after the reference dashboard: the month with week
 * numbers, a booking button, then a timeline of what's coming up. Dates are
 * calendar days (YYYY-MM-DD), handled in UTC so nothing shifts.
 */

const iso = (d: Date) => d.toISOString().slice(0, 10);
const monthTitle = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" });
const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short" });

/** ISO week number, for the column on the right of the month. */
function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** The weeks of `today`'s month, Monday first, padded with the neighbouring months' days. */
function monthWeeks(today: string) {
  const [y, m] = today.split("-").map(Number);
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const rows = Math.ceil((lead + daysInMonth) / 7);
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const d = new Date(Date.UTC(y, m - 1, 1 - lead + r * 7 + c));
      return { date: d, iso: iso(d), day: d.getUTCDate(), inMonth: d.getUTCMonth() === m - 1 };
    }),
  );
}

const eventStyle: Record<
  CalendarEvent["kind"],
  { Glyph: (p: { className?: string }) => React.ReactElement; tint: string }
> = {
  oa: { Glyph: DiagnoseGlyph, tint: "bg-[#ebe8ff] text-[#4b3fd1]" },
  session: { Glyph: ChatGlyph, tint: "bg-cobalt text-white" },
  interview: { Glyph: TrackGlyph, tint: "bg-ink text-white" },
  deadline: { Glyph: ApplyGlyph, tint: "bg-[#dde4ff] text-cobalt-deep" },
};

function Calendar({ today, events }: { today: string; events: CalendarEvent[] }) {
  const weeks = monthWeeks(today);
  const byDay = new Map(events.map((e) => [e.day, e]));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-[#ebe8ff] px-3 py-1 text-[0.82rem] font-medium text-[#3a2fb8]">
          {monthTitle.format(new Date(`${today}T12:00:00Z`))}
        </span>
      </div>
      <table className="w-full table-fixed border-collapse text-center">
        <thead>
          <tr>
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su", ""].map((d, i) => (
              <th key={i} className="pb-2 font-mono text-[0.62rem] font-normal tracking-[0.06em] text-slate uppercase">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].iso}>
              {week.map((d) => {
                const event = byDay.get(d.iso);
                const isToday = d.iso === today;
                const isSession = event?.kind === "session";
                return (
                  <td key={d.iso} className="relative h-9 p-0">
                    <span
                      className={cn(
                        "mx-auto grid size-8 place-items-center rounded-full text-[0.8rem] tabular-nums",
                        !d.inMonth && "text-rule-strong",
                        isToday && "bg-ink font-semibold text-white",
                        isSession && !isToday && "bg-[#ebe8ff] font-semibold text-[#3a2fb8] ring-2 ring-[#4b3fd1]/30",
                      )}
                    >
                      {d.day}
                    </span>
                    {event && !isSession && (
                      <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-cobalt" />
                    )}
                    {event && <span className="sr-only">{event.title}</span>}
                  </td>
                );
              })}
              <td className="font-mono text-[0.6rem] text-rule-strong">W{isoWeek(week[0].date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Timeline({
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
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">Coming up</h3>
        <span className="text-[0.72rem] text-slate">Next two weeks</span>
      </div>
      <ol className="grid gap-2.5">
        {events.map((e) => {
          const date = new Date(`${e.day}T12:00:00Z`);
          const { Glyph, tint } = eventStyle[e.kind];
          const isSession = e.kind === "session";
          return (
            <li key={`${e.day}-${e.title}`} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3">
              <span className="pt-2 text-center">
                <b className="block font-mono text-[0.95rem] leading-none font-semibold">{date.getUTCDate()}</b>
                <span className="font-mono text-[0.58rem] tracking-[0.06em] text-slate uppercase">
                  {weekday.format(date)}
                </span>
              </span>
              {isSession ? (
                <div className="deep-blue relative isolate overflow-hidden rounded-2xl p-3">
                  <div className="flex items-center gap-2.5">
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", tint)}>
                      <Glyph className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.85rem] font-medium text-white">{e.title}</span>
                      <span className="block text-[0.72rem] text-sky">{e.label}</span>
                    </span>
                  </div>
                  <ol className="mt-2.5 grid gap-1 border-t border-white/[0.12] pt-2.5 text-[0.75rem] text-white/85">
                    {session.agenda.map((item, i) => (
                      <li key={item} className="flex gap-2">
                        <b className="font-mono text-[0.66rem] font-medium text-white/45">{i + 1}</b>
                        {item}
                      </li>
                    ))}
                  </ol>
                  <Link
                    href="/coaching"
                    className="mt-2.5 inline-flex h-7 items-center rounded-full bg-white px-3 text-[0.72rem] font-medium text-ink hover:bg-[#eef1ff]"
                  >
                    View session
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 rounded-2xl bg-paper/80 p-2.5">
                  <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", tint)}>
                    <Glyph className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.82rem] font-medium">{e.title}</span>
                    <span className="block truncate text-[0.7rem] text-slate">
                      {e.label}
                      {e.detail ? ` · ${e.detail}` : ""}
                    </span>
                  </span>
                </div>
              )}
            </li>
          );
        })}
        {!coached && (
          <li className="grid grid-cols-[36px_minmax(0,1fr)] gap-3">
            <span />
            <p className="rounded-2xl border border-dashed border-rule-strong p-2.5 text-[0.78rem] text-slate">
              Coaching sessions, OAs and interviews show up here with Pro
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
    <aside
      style={style}
      className="anim-fade-up grid min-w-0 gap-6 self-start rounded-[22px] bg-surface p-5 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule sm:p-6 md:grid-cols-2 xl:sticky xl:top-6 xl:grid-cols-1"
    >
      <div>
        <Calendar today={today} events={events} />
        <Link
          href={coached ? "/coaching" : "/pricing"}
          className="mt-4 flex h-10 items-center justify-center rounded-full bg-ink text-[0.82rem] font-medium text-white hover:bg-ink-soft"
        >
          {coached ? "Book a session" : "Book a session with Pro"}
        </Link>
      </div>
      <div className="border-rule md:border-l md:pl-6 xl:border-t xl:border-l-0 xl:pt-6 xl:pl-0">
        <Timeline events={events} session={session} coached={coached} />
      </div>
    </aside>
  );
}

import Link from "next/link";
import { ApplyGlyph, ChatGlyph, DiagnoseGlyph, TrackGlyph } from "@/components/brand/glyphs";
import type { CalendarEvent } from "@/lib/mock/home";
import { cn } from "@/lib/utils";

/*
 * The right-hand panel, fixed to the edge of wide screens like the reference
 * dashboard: the month with week
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
  { Glyph: (p: { className?: string }) => React.ReactElement; tint: string; row: string }
> = {
  oa: { Glyph: DiagnoseGlyph, tint: "bg-surface text-[#4b3fd1]", row: "bg-[#ebe8ff]" },
  session: { Glyph: ChatGlyph, tint: "bg-white/10 text-sky", row: "bg-navy text-white" },
  interview: { Glyph: TrackGlyph, tint: "bg-surface text-cobalt-deep", row: "bg-[#dde4ff]" },
  deadline: { Glyph: ApplyGlyph, tint: "bg-surface text-cobalt-deep", row: "bg-[#e3e8ff]" },
};

function Calendar({ today, events }: { today: string; events: CalendarEvent[] }) {
  const weeks = monthWeeks(today);
  const byDay = new Map(events.map((e) => [e.day, e]));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-[#dde4ff] px-4 py-1.5 text-[0.95rem] font-semibold text-cobalt-deep">
          {monthTitle.format(new Date(`${today}T12:00:00Z`))}
        </span>
      </div>
      <table className="w-full table-fixed border-collapse text-center">
        <thead>
          <tr>
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su", ""].map((d, i) => (
              <th key={i} className="pb-3 font-mono text-[0.7rem] font-normal tracking-[0.06em] text-slate uppercase">
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
                  <td key={d.iso} className="relative h-12 p-0">
                    <span
                      className={cn(
                        "mx-auto grid size-10 place-items-center rounded-full text-[0.92rem] tabular-nums",
                        !d.inMonth && "text-rule-strong",
                        isToday && "bg-navy font-semibold text-white",
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
              <td className="font-mono text-[0.66rem] text-rule-strong">W{isoWeek(week[0].date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Timeline({ events, coached }: { events: CalendarEvent[]; coached: boolean }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-[1.2rem] font-semibold tracking-[-0.015em]">Coming up</h3>
        <span className="text-[0.72rem] text-slate">Next two weeks</span>
      </div>
      <ol className="grid gap-3">
        {events.map((e) => {
          const date = new Date(`${e.day}T12:00:00Z`);
          const { Glyph, tint, row } = eventStyle[e.kind];
          const isSession = e.kind === "session";
          return (
            <li key={`${e.day}-${e.title}`} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
              <span className="pt-2 text-center">
                <b className="block font-mono text-[1.05rem] leading-none font-semibold">{date.getUTCDate()}</b>
                <span className="font-mono text-[0.58rem] tracking-[0.06em] text-slate uppercase">
                  {weekday.format(date)}
                </span>
              </span>
              {isSession ? (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-2xl p-3 shadow-[0_14px_30px_-18px_rgb(10_24_69/0.8)]",
                    row,
                  )}
                >
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tint)}>
                    <Glyph className="size-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9rem] font-medium text-white">{e.title}</span>
                    <span className="block truncate text-[0.76rem] text-sky">{e.label}</span>
                  </span>
                </div>
              ) : (
                <div className={cn("flex items-center gap-3 rounded-2xl p-3", row)}>
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tint)}>
                    <Glyph className="size-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9rem] font-medium">{e.title}</span>
                    <span className="block truncate text-[0.76rem] text-slate">
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
          <li className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
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
  coached,
  style,
}: {
  today: string;
  events: CalendarEvent[];
  /** From canAccess(user, "coaching.sessions"). */
  coached: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <aside
      style={style}
      className="anim-fade-up grid min-w-0 content-start gap-6 rounded-[22px] bg-surface p-5 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule sm:p-6 md:grid-cols-2 xl:fixed xl:inset-y-0 xl:right-0 xl:z-20 xl:w-[400px] xl:grid-cols-1 xl:overflow-y-auto xl:rounded-none xl:border-l xl:border-rule xl:px-7 xl:py-9 xl:shadow-none xl:ring-0"
    >
      <div>
        <Calendar today={today} events={events} />
        <Link
          href={coached ? "/coaching" : "/pricing"}
          className="mt-5 flex h-12 items-center justify-center rounded-full bg-navy text-[0.9rem] font-medium text-white hover:bg-ink"
        >
          {coached ? "Book a session" : "Book a session with Pro"}
        </Link>
      </div>
      <div className="border-rule md:border-l md:pl-6 xl:border-t xl:border-l-0 xl:pt-6 xl:pl-0">
        <Timeline events={events} coached={coached} />
      </div>
    </aside>
  );
}

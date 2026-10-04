import { cn } from "@/lib/utils";
import { Bar } from "./task-bits";

/*
 * Four facts, each in its own box: where the plan is, how the week is going,
 * the time it takes, and the goal. The little bar of weeks doubles as a way to
 * jump to any week that has a plan.
 */

export type WeekDot = { number: number; dates: string; state: "full" | "part" | "now" | "next" | "none" };

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-[20px] bg-surface px-5 py-4 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule sm:px-6 sm:py-5">
      <p className="text-[0.78rem] text-slate">{label}</p>
      {children}
    </div>
  );
}

const Value = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("mt-1.5 truncate text-[1.4rem] leading-tight font-semibold tracking-[-0.02em]", className)}>
    {children}
  </p>
);
const Small = ({ children }: { children: React.ReactNode }) => (
  <small className="text-[0.88rem] font-medium tracking-normal text-slate">{children}</small>
);
const Sub = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-1 text-[0.82rem] text-pretty text-slate">{children}</p>
);

export function Summary({
  coached,
  current,
  length,
  phase,
  dots,
  viewing,
  onPickWeek,
  week,
  time,
  goal,
  style,
}: {
  /** From canAccess(user, "plan"). */
  coached: boolean;
  current: number;
  length: number;
  /** "Phase 2 · Proof of work" */
  phase: string;
  dots: WeekDot[];
  /** The week the board is showing. */
  viewing: number;
  onPickWeek: (n: number) => void;
  /** The week being shown: its label, dates and progress. Null when it isn't planned yet. */
  week: { label: string; dates?: string; done: number; total: number; planned: boolean };
  time: { label: string; value: string; sub: string };
  goal: { role: string; season: string };
  style?: React.CSSProperties;
}) {
  return (
    <section
      aria-label="Summary"
      style={style}
      className="anim-fade-up grid grid-cols-2 gap-3 sm:gap-5 @4xl:grid-cols-4"
    >
      <Stat label="Plan">
        {coached ? (
          <>
            <Value>
              Week {current} <Small>of {length}</Small>
            </Value>
            <Sub>{phase}</Sub>
          </>
        ) : (
          <>
            <Value>Starter</Value>
            <Sub>A coach plans every week with Pro</Sub>
          </>
        )}
        <div
          className="mt-2 grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
          role={coached ? "group" : undefined}
          aria-label={coached ? "Jump to a week" : undefined}
          aria-hidden={coached ? undefined : true}
        >
          {dots.map((d) => (
            <button
              key={d.number}
              type="button"
              disabled={!coached || d.state === "none"}
              onClick={() => onPickWeek(d.number)}
              aria-label={`Week ${d.number}, ${d.dates}`}
              aria-pressed={coached && d.state !== "none" ? d.number === viewing : undefined}
              title={coached ? `Week ${d.number} · ${d.dates}` : undefined}
              className="group flex h-4 items-center disabled:cursor-default"
            >
              <span
                className={cn(
                  "block h-1.5 w-full rounded-[2px] transition-transform duration-150 group-enabled:group-hover:scale-y-150",
                  d.state === "full" && "bg-ink",
                  d.state === "part" && "bg-[linear-gradient(90deg,var(--color-ink)_65%,var(--color-rule-strong)_65%)]",
                  d.state === "now" && "bg-cobalt",
                  (d.state === "next" || d.state === "none") && "bg-paper-deep",
                  coached && d.number === viewing && "h-2.5 ring-2 ring-cobalt ring-offset-2 ring-offset-surface",
                )}
              />
            </button>
          ))}
        </div>
      </Stat>

      <Stat label={week.label}>
        <Value>
          {week.planned ? (
            <>
              {week.done} <Small>of {week.total} done</Small>
            </>
          ) : (
            "Not planned"
          )}
        </Value>
        <Sub>{week.dates ?? "Tick them off as you go"}</Sub>
        {week.planned && <Bar value={week.total ? week.done / week.total : 0} className="mt-3" />}
      </Stat>

      <Stat label={time.label}>
        <Value>{time.value}</Value>
        <Sub>{time.sub}</Sub>
      </Stat>

      <Stat label="Goal">
        <p className="mt-1.5 text-[1.05rem] leading-snug font-semibold tracking-[-0.01em]">{goal.role}</p>
        <Sub>{goal.season}</Sub>
      </Stat>
    </section>
  );
}

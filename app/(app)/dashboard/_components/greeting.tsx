import { type Readiness, readinessLevels } from "@/lib/mock/home";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

const RING = 119.38; // 2πr for r = 19

function partOfDay(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Toronto", hour: "numeric", hourCycle: "h23" }).format(now),
  );
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

const dayLine = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" });

/** The top of Home: the greeting, the date and the readiness badge. */
export function Greeting({
  firstName,
  today,
  week,
  readiness,
}: {
  firstName: string;
  /** YYYY-MM-DD */
  today: string;
  /** The plan week, for students with a coach. */
  week?: number;
  readiness: Readiness;
}) {
  return (
    <header className="anim-fade-up relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-[clamp(2.1rem,1.5rem+1.5vw,2.75rem)] leading-[1.02] tracking-[-0.024em]">
          Good {partOfDay(new Date())}, <em className="tracking-[-0.01em] text-cobalt">{firstName}</em>
        </h1>
        <p className="mt-2.5 text-[0.95rem] text-slate">
          {dayLine.format(new Date(`${today}T12:00:00Z`))}
          {week && (
            <>
              <span className="mx-2 text-rule-strong">·</span>Week {week} of your plan
            </>
          )}
        </p>
      </div>
      <ReadinessBadge readiness={readiness} />
    </header>
  );
}

/*
 * Where the student is on the way from Starter to Offer-ready: a small ring
 * with the level, and the full ladder on hover or keyboard focus.
 */
function ReadinessBadge({ readiness }: { readiness: Readiness }) {
  const current = readinessLevels[readiness.level - 1];
  const next = readinessLevels[readiness.level];
  return (
    <div
      tabIndex={0}
      aria-describedby="readiness-ladder"
      className="group relative flex shrink-0 items-center gap-3 self-start rounded-full bg-surface py-1.5 pr-5 pl-1.5 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule outline-none focus-visible:ring-2 focus-visible:ring-cobalt sm:self-auto"
    >
      <span className="relative size-12 shrink-0">
        <svg viewBox="0 0 48 48" className="size-12 -rotate-90" aria-hidden>
          <defs>
            <linearGradient id="readiness-gradient" x1="0" x2="1">
              <stop offset="0" stopColor="var(--color-cobalt-deep)" />
              <stop offset="1" stopColor="var(--color-cobalt-bright)" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="19" fill="none" stroke="var(--color-paper-deep)" strokeWidth="4" />
          <circle
            cx="24"
            cy="24"
            r="19"
            fill="none"
            stroke="url(#readiness-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDashoffset={RING * (1 - readiness.progress / 100)}
            className={styles.ring}
          />
        </svg>
        <b className="absolute inset-0 grid place-items-center font-mono text-[0.95rem] font-semibold">
          {readiness.level}
        </b>
      </span>
      <span>
        <span className="block text-[0.95rem] leading-tight font-semibold tracking-[-0.01em]">{current}</span>
        {next && (
          <span className="mt-0.5 block text-[0.8rem] whitespace-nowrap text-slate">
            <b className="font-mono font-semibold text-cobalt">{readiness.progress}%</b> to {next}
          </span>
        )}
      </span>

      <div
        id="readiness-ladder"
        role="tooltip"
        className="pointer-events-none absolute top-[calc(100%+10px)] left-0 z-30 w-64 -translate-y-1 rounded-2xl bg-surface p-4 opacity-0 shadow-[0_24px_60px_-24px_rgb(11_18_32/0.4)] ring-1 ring-rule transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:right-0 sm:left-auto"
      >
        <p className="text-[0.8rem] text-slate">
          Level {readiness.level} of {readinessLevels.length}
        </p>
        <ol className="relative mt-3 grid gap-3 before:absolute before:top-2 before:bottom-2 before:left-[6px] before:w-[1.5px] before:bg-rule">
          {readinessLevels.map((name, i) => {
            const state = i + 1 < readiness.level ? "done" : i + 1 === readiness.level ? "now" : "later";
            return (
              <li
                key={name}
                className={cn(
                  "relative flex items-center gap-3 text-[0.82rem]",
                  state === "done" && "text-ink-soft",
                  state === "now" && "font-semibold text-ink",
                  state === "later" && "text-[#8a94a8]",
                )}
              >
                <span
                  className={cn(
                    "size-[13px] shrink-0 rounded-full",
                    state === "done" && "bg-cobalt",
                    state === "now" && "bg-surface shadow-[inset_0_0_0_3.5px_var(--color-cobalt)]",
                    state === "later" && "bg-surface shadow-[inset_0_0_0_1.5px_var(--color-rule-strong)]",
                  )}
                />
                {name}
                {state === "now" && (
                  <span className="ml-auto text-[0.72rem] font-medium text-cobalt">You&apos;re here</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

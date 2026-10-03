function partOfDay(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Toronto", hour: "numeric", hourCycle: "h23" }).format(now),
  );
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

const dayLine = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" });

/** The top of Home: the greeting and the date. */
export function Greeting({
  firstName,
  today,
  week,
}: {
  firstName: string;
  /** YYYY-MM-DD */
  today: string;
  /** The plan week, for students with a coach. */
  week?: number;
}) {
  return (
    <header className="anim-fade-up">
      <h1 className="font-display text-[clamp(2.2rem,1.5rem+1.8vw,3rem)] leading-[1.02] tracking-[-0.024em]">
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
    </header>
  );
}

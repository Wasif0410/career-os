import Link from "next/link";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import { Card } from "@/components/app/card";
import { Locked } from "@/components/app/locked";
import { ScoreRing } from "@/components/app/score-ring";
import { limitFor, requiredTier } from "@/lib/access";
import type { CurrentUser } from "@/lib/auth/user";
import type { CoachingSession, PlanItem } from "@/lib/mock/home";
import type { ResumeScore } from "@/lib/mock/student";
import { cn } from "@/lib/utils";

/*
 * The cards on Home. Each says one thing, with as few words as it can, and
 * leaves the detail to its own page. Paid cards go through <Locked>, so the
 * tier rules stay in lib/access.ts.
 */

type User = Pick<CurrentUser, "tier">;

// Sessions are shown in the coaches' time zone until profiles store the student's own.
const sessionDay = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  weekday: "short",
  month: "short",
  day: "numeric",
});
const sessionTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
});

function HomeCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Card
      className={cn(
        "flex flex-col p-6 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_14px_36px_-20px_rgb(11_18_32/0.22)]",
        className,
      )}
    >
      {children}
    </Card>
  );
}

function Heading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 text-[1.1rem] font-semibold text-ink">{title}</h2>
      </div>
      {action}
    </header>
  );
}

function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 self-start text-sm font-medium text-cobalt hover:text-cobalt-deep",
        className,
      )}
    >
      {children}
      <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

/** A thin progress bar. Decorative: the number next to it says the same thing. */
function Meter({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <span aria-hidden className={cn("block h-1.5 overflow-hidden rounded-full bg-paper-deep", className)}>
      <span className="block h-full rounded-full bg-cobalt" style={{ width: `${pct}%` }} />
    </span>
  );
}

export function ResumeCard({ user, score, className }: { user: User; score: ResumeScore; className?: string }) {
  const [topFix] = score.fixes;
  return (
    <HomeCard className={className}>
      <Heading
        eyebrow="Resume"
        title="Your resume score"
        action={
          <TextLink href="/resume" className="mt-1">
            Full report
          </TextLink>
        }
      />
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
        <ScoreRing value={score.overall} label="Resume score" size={116} />
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Start here</p>
          <p className="mt-2 text-[1.05rem] leading-relaxed text-ink">{topFix}</p>
        </div>
      </div>
      <div className="mt-6 border-t border-rule pt-5">
        <Locked user={user} feature="resume.fullReport">
          <dl className="grid grid-cols-2 gap-x-10 gap-y-5">
            {score.categories.map((c) => (
              <div key={c.label}>
                <dt className="flex items-baseline justify-between gap-2 text-sm text-ink-soft">
                  {c.label}
                  <span className="font-medium text-ink tabular-nums">{c.score}</span>
                </dt>
                <dd className="mt-2">
                  <Meter value={c.score / 100} />
                </dd>
              </div>
            ))}
          </dl>
        </Locked>
      </div>
    </HomeCard>
  );
}

export function JobsCard({ user, count }: { user: User; count: number }) {
  const visible = limitFor(user, "visibleJobMatches");
  return (
    <HomeCard>
      <Heading eyebrow="Jobs" title="Your matches" />
      <p className="mt-5 font-display text-[3.75rem] leading-none tracking-tight text-ink tabular-nums">{count}</p>
      <p className="mt-3 text-slate">
        {Number.isFinite(visible)
          ? `jobs match your goal. Your top ${visible} are ready.`
          : "jobs match your goal, each with a fit score."}
      </p>
      <TextLink href="/jobs" className="mt-auto pt-5">
        View matches
      </TextLink>
    </HomeCard>
  );
}

export function CoachingCard({ user, session }: { user: User; session: CoachingSession }) {
  const startsAt = new Date(session.startsAt);
  return (
    <HomeCard>
      <Heading eyebrow="Coaching" title="Your next session" />
      <Locked user={user} feature="coaching.sessions" className="flex-1">
        <div className="mt-4 flex flex-1 flex-col">
          <p className="font-display text-[2rem] leading-tight text-ink">{sessionDay.format(startsAt)}</p>
          <p className="mt-1 text-slate">
            {sessionTime.format(startsAt)} · {session.minutes} min with {session.coach}
          </p>
          <TextLink href="/coaching" className="mt-auto pt-5">
            View coaching
          </TextLink>
        </div>
      </Locked>
    </HomeCard>
  );
}

export function PlanCard({ user, items }: { user: User; items: PlanItem[] }) {
  const done = items.filter((item) => item.done).length;
  return (
    <HomeCard>
      <Heading eyebrow="Plan" title="This week" />
      <Locked user={user} feature="plan" className="flex-1">
        <div className="mt-4 flex flex-1 flex-col">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-[0.95rem]">
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] ring-1",
                    item.done ? "bg-cobalt text-white ring-cobalt" : "bg-surface ring-rule-strong",
                  )}
                >
                  {item.done && <CheckGlyph className="size-3" />}
                </span>
                <span className={item.done ? "text-slate line-through decoration-rule-strong" : "text-ink"}>
                  <span className="sr-only">{item.done ? "Done: " : "To do: "}</span>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3">
            <Meter value={done / items.length} className="flex-1" />
            <span className="text-sm text-slate tabular-nums">
              {done} of {items.length} done
            </span>
          </div>
          <TextLink href="/plan" className="mt-auto pt-5">
            Open your plan
          </TextLink>
        </div>
      </Locked>
    </HomeCard>
  );
}

export function ApplicationsCard({ user, used }: { user: User; used: number }) {
  // Free has no credits, so the locked preview shows what the unlocking tier gets.
  const limit =
    limitFor(user, "applicationsPerMonth") ||
    limitFor({ tier: requiredTier("applications.tracker") }, "applicationsPerMonth");
  return (
    <HomeCard>
      <Heading eyebrow="Applications" title="This month" />
      <Locked user={user} feature="applications.tracker" className="flex-1">
        <div className="mt-4 flex flex-1 flex-col">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-[2.5rem] leading-none text-ink tabular-nums">{used}</span>
            <span className="text-slate">of {limit} used</span>
          </p>
          <Meter value={used / limit} className="mt-5" />
          <TextLink href="/applications" className="mt-auto pt-5">
            Open tracker
          </TextLink>
        </div>
      </Locked>
    </HomeCard>
  );
}

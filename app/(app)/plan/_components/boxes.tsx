import Link from "next/link";
import { ArrowGlyph } from "@/components/brand/glyphs";
import type { Gap, MonthGoal } from "@/lib/mock/plan";
import { cn } from "@/lib/utils";
import { Avatar, Bar, gapStyle } from "./task-bits";

/*
 * The three boxes under the board: the coach's note from the 1-1 behind the
 * week being shown, the top three gaps, and the month's goals. Free students
 * see who the coaches are and what the locked boxes will hold.
 */

const box =
  "anim-fade-up flex min-w-0 flex-col rounded-[20px] p-5 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] sm:p-6";
const white = "bg-surface ring-1 ring-rule";
const navy = "bg-navy text-white shadow-[0_24px_60px_-34px_rgb(10_24_69/0.8)]";

function Head({ id, title, locked }: { id: string; title: string; locked?: boolean }) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-[1.05rem] font-semibold tracking-[-0.015em]">
        {title}
      </h2>
      {locked && (
        <span className="rounded-full bg-paper-deep px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.06em] text-ink-soft">
          PRO
        </span>
      )}
    </header>
  );
}

/** Placeholder rows for a locked box. */
function Ghost() {
  return (
    <ul aria-hidden className="mt-5 grid gap-5">
      {[70, 55, 45].map((w) => (
        <li key={w}>
          <span className="block h-2.5 rounded-full bg-paper-deep" style={{ width: `${w}%` }} />
          <span className="mt-2 block h-1.5 rounded-full bg-paper" />
        </li>
      ))}
    </ul>
  );
}

export function CoachNote({
  coach,
  note,
  after,
  next,
  className,
  style,
}: {
  coach: string;
  note: string;
  /** "Sep 24" */
  after: string;
  /** "Thu, Oct 8 · 6:00 PM", when a 1-1 is booked. */
  next?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section aria-label={`Note from ${coach}`} style={style} className={cn(box, navy, className)}>
      <div className="flex items-center gap-3">
        <Avatar name={coach} className="size-10 text-[0.9rem] ring-4 ring-white/10" />
        <p className="min-w-0">
          <span className="block text-[0.92rem] font-semibold">{coach}</span>
          <span className="block text-[0.78rem] text-white/55">Your coach · after your 1-1 on {after}</span>
        </p>
      </div>
      <blockquote className="mt-5 font-display text-[1.2rem] leading-[1.42] tracking-[-0.005em] text-pretty">
        <span aria-hidden className="text-sky">
          &ldquo;
        </span>
        {note}
        <span aria-hidden className="text-sky">
          &rdquo;
        </span>
      </blockquote>
      {next && (
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.07] px-4 py-3 ring-1 ring-white/[0.08] ring-inset">
            <p className="text-[0.78rem] text-white/60">
              Next 1-1
              <span className="mt-0.5 block text-[0.88rem] font-medium text-white">{next}</span>
            </p>
            <Link
              href="/coaching"
              className="group inline-flex shrink-0 items-center gap-1 text-[0.8rem] font-medium text-sky hover:text-white"
            >
              Coaching
              <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export function CoachInvite({
  coaches,
  className,
  style,
}: {
  coaches: { name: string; focus: string }[];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section aria-labelledby="coach-invite" style={style} className={cn(box, navy, className)}>
      <h2 id="coach-invite" className="font-display text-[1.4rem] leading-[1.2] tracking-[-0.015em]">
        A plan written by people <em className="text-sky">who just did it.</em>
      </h2>
      <ul className="mt-5 grid gap-3">
        {coaches.map((c) => (
          <li key={c.name} className="flex items-center gap-3">
            <Avatar name={c.name} className="size-10 text-[0.9rem] ring-4 ring-white/10" />
            <p className="min-w-0">
              <span className="block text-[0.92rem] font-semibold">{c.name}</span>
              <span className="block text-[0.78rem] text-white/55">{c.focus}</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Link
          href="/pricing"
          className="flex h-10 items-center justify-center rounded-full bg-white text-[0.85rem] font-medium text-ink hover:bg-[#eef1ff]"
        >
          See Pro
        </Link>
      </div>
    </section>
  );
}

export function GapsBox({ gaps, style }: { gaps: Gap[]; style?: React.CSSProperties }) {
  const locked = gaps.length === 0;
  return (
    <section aria-labelledby="gaps-title" style={style} className={cn(box, white)}>
      <Head id="gaps-title" title="Top three gaps" locked={locked} />
      {locked ? (
        <>
          <p className="mt-1 text-[0.82rem] text-slate">Your coach picks these with you in your first 1-1</p>
          <Ghost />
        </>
      ) : (
        <ul className="mt-4 grid gap-4">
          {gaps.map((g) => (
            <li key={g.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-[0.88rem] font-medium">
                  <span aria-hidden className={cn("size-2 shrink-0 rounded-full", gapStyle[g.id].dot)} />
                  <span className="truncate">{g.title}</span>
                </span>
                <span className="shrink-0 font-mono text-[0.85rem] font-semibold">
                  {g.now} <small className="text-[0.72rem] font-medium text-slate">/ {g.target}</small>
                </span>
              </div>
              <p className="mt-0.5 text-[0.78rem] text-slate">{g.note}</p>
              <Bar value={g.now / g.target} className="mt-2" fill={gapStyle[g.id].dot} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function MonthBox({ month, goals, style }: { month: string; goals: MonthGoal[]; style?: React.CSSProperties }) {
  const locked = goals.length === 0;
  return (
    <section aria-labelledby="month-title" style={style} className={cn(box, white)}>
      <Head id="month-title" title={`${month} goals`} locked={locked} />
      {locked ? (
        <>
          <p className="mt-1 text-[0.82rem] text-slate">Monthly goals come from your coach</p>
          <Ghost />
        </>
      ) : (
        <ul className="mt-4 grid gap-4">
          {goals.map((g) => (
            <li key={g.text}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 text-[0.88rem] font-medium">{g.text}</span>
                <span className="shrink-0 font-mono text-[0.85rem] font-semibold">
                  {g.now} <small className="text-[0.72rem] font-medium text-slate">/ {g.target}</small>
                </span>
              </div>
              <p className="mt-0.5 text-[0.78rem] text-slate">{g.detail}</p>
              <Bar value={g.now / g.target} className="mt-2" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

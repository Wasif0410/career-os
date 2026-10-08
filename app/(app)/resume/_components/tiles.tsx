import Link from "next/link";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import type { CoachReview, ResumeVersion, SkillDemand } from "@/lib/mock/resume";
import { coaches } from "@/lib/site";
import { cn } from "@/lib/utils";
import styles from "./resume.module.css";

/*
 * The three solid tiles under the review: what the student's matches ask
 * for, how the score has moved across versions, and the coach review.
 */

function Tile({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <section
      style={style}
      className={cn(
        "anim-fade-up relative isolate flex h-full min-h-[280px] min-w-0 flex-col overflow-hidden rounded-[22px] p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

function TileHead({ title, action, light }: { title: string; action?: React.ReactNode; light?: boolean }) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h2 className={cn("text-[1.05rem] font-semibold tracking-[-0.015em]", light && "text-white")}>{title}</h2>
      {action}
    </header>
  );
}

function TileLink({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-1 text-[0.8rem] font-medium",
        light ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink",
      )}
    >
      {children}
      <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

function TierTag({ name, light }: { name: string; light?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.06em] uppercase",
        light ? "bg-white/15 text-white" : "bg-ink/10 text-ink",
      )}
    >
      {name}
    </span>
  );
}

/* ---------- Skills: what the student's matches ask for ---------- */

export function SkillsTile({
  skills,
  matches,
  locked,
  style,
}: {
  skills: SkillDemand[];
  /** How many job matches the shares are taken from. */
  matches: number;
  /** From lib/access.ts: part of the full report. */
  locked: boolean;
  style?: React.CSSProperties;
}) {
  const missing = skills.filter((s) => !s.onResume).length;
  return (
    <Tile style={style} className="bg-[#dde4ff] text-ink">
      <TileHead
        title="Skills in demand"
        action={locked ? <TierTag name="Pro" /> : <TileLink href="/jobs">Jobs</TileLink>}
      />
      <p className="mt-1 text-[0.8rem] text-ink/60">
        {locked
          ? "What your matches ask for, and what your resume is missing"
          : `Across your ${matches} matches · ${missing} missing from your resume`}
      </p>
      <ul className="mt-auto grid gap-2 pt-4">
        {skills.map((s, i) => (
          <li key={s.skill} className="grid grid-cols-[6.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-[0.8rem]">
            {locked ? (
              <span aria-hidden className="h-2.5 w-16 rounded-full bg-ink/10" />
            ) : (
              <span className="flex min-w-0 items-center gap-1.5">
                <span className={cn("truncate", s.onResume ? "text-ink/75" : "font-semibold")}>{s.skill}</span>
                {s.onResume && <CheckGlyph className="size-3 shrink-0 text-go" />}
                <span className="sr-only">{s.onResume ? "(on your resume)" : "(missing from your resume)"}</span>
              </span>
            )}
            <span aria-hidden className="h-2.5 overflow-hidden rounded-full bg-white/60">
              <span
                className={cn(
                  "block h-full rounded-full",
                  locked ? "bg-ink/10" : s.onResume ? "bg-cobalt" : "bg-ink",
                  styles.grow,
                )}
                style={
                  {
                    width: locked ? `${78 - i * 9}%` : `${s.share}%`,
                    "--d": `${0.3 + i * 0.05}s`,
                  } as React.CSSProperties
                }
              />
            </span>
            <b className={cn("text-right font-mono font-semibold", locked && "text-ink/30")}>
              {locked ? "–" : `${s.share}%`}
            </b>
          </li>
        ))}
      </ul>
      {locked ? (
        <Link
          href="/pricing"
          className="mt-4 inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-ink px-3.5 text-[0.78rem] font-medium text-white hover:bg-ink-soft"
        >
          See it with Pro
        </Link>
      ) : (
        <p aria-hidden className="mt-3.5 flex gap-4 text-[0.72rem] text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-cobalt" /> On your resume
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink" /> Missing
          </span>
        </p>
      )}
    </Tile>
  );
}

/* ---------- Progress: the score at each version ---------- */

export function ProgressTile({ versions, style }: { versions: ResumeVersion[]; style?: React.CSSProperties }) {
  // Oldest first, left to right.
  const ordered = [...versions].reverse();
  const first = ordered[0];
  const last = ordered[ordered.length - 1];
  // The tallest column is the best score so far; the floor keeps the first one visible.
  const scores = ordered.map((v) => v.score);
  const floor = Math.max(0, Math.min(...scores) - 12);
  const top = Math.max(...scores);
  return (
    <Tile style={style} className="bg-[#ebe8ff] text-ink">
      <TileHead title="Progress" />
      <p className="mt-1 text-[0.8rem] text-ink/60">
        +{last.score - first.score} over {ordered.length} versions since {first.date}
      </p>
      <div
        role="img"
        aria-label={`Score by version: ${ordered.map((v) => `${v.date}, ${v.score}`).join("; ")}`}
        className="mt-5 flex min-h-36 flex-1 gap-2.5"
      >
        {ordered.map((v, i) => {
          const current = v === last;
          const pct = ((v.score - floor) / (top - floor)) * 100;
          return (
            <span key={v.number} className="relative min-w-0 flex-1">
              <b
                className={cn(
                  "absolute inset-x-0 text-center font-mono text-[0.8rem] font-semibold",
                  current ? "text-ink" : "text-ink/55",
                )}
                style={{ bottom: `calc(${pct}% - 18px)` }}
              >
                {v.score}
              </b>
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 origin-bottom rounded-t-lg rounded-b-sm",
                  current ? "bg-navy" : "bg-[#4b3fd1]/35",
                  styles.rise,
                )}
                style={{ height: `calc(${pct}% - 24px)`, "--d": `${0.3 + i * 0.06}s` } as React.CSSProperties}
              />
            </span>
          );
        })}
      </div>
      <p aria-hidden className="mt-2 flex gap-2.5 text-[0.68rem] text-ink/50">
        {ordered.map((v) => (
          <span key={v.number} className="flex-1 truncate text-center">
            {v.date}
          </span>
        ))}
      </p>
    </Tile>
  );
}

/* ---------- Coach review: a person reads it (Elite) ---------- */

export function CoachTile({
  review,
  unlocked,
  style,
}: {
  review: CoachReview;
  /** From canAccess(user, "resume.coachReview"). */
  unlocked: boolean;
  style?: React.CSSProperties;
}) {
  const coach = coaches.find((c) => c.name === review.coach);
  return (
    <Tile style={style} className="bg-cobalt text-white shadow-[0_24px_60px_-34px_rgb(36_71_245/0.9)]">
      <TileHead
        title="Coach review"
        light
        action={
          unlocked ? (
            <TileLink href="/coaching" light>
              Coaching
            </TileLink>
          ) : (
            <TierTag name="Elite" light />
          )
        }
      />
      {unlocked ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[0.85rem] font-semibold text-cobalt-deep">
              {coach?.initials ?? review.coach[0]}
            </span>
            <span className="text-[0.8rem] text-white/70">
              <b className="font-semibold text-white">{review.coach}</b> · {review.date}
            </span>
          </div>
          <blockquote className="mt-3 text-[0.98rem] leading-snug font-medium">{review.note}</blockquote>
          <p className="mt-auto pt-5 text-[0.75rem] text-white/65">
            {review.comments} comments on your resume · talk it through {review.nextSession}
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-[0.8rem] text-white/65">A coach goes through your resume line by line</p>
          <ul className="mt-4 grid gap-2.5">
            {coaches.map((c) => (
              <li key={c.slug} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-[0.85rem] font-semibold">
                  {c.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-medium">{c.name}</span>
                  <span className="block truncate text-[0.75rem] text-white/65">{c.focus}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-5">
            <Link
              href="/pricing"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3.5 text-[0.8rem] font-medium text-ink hover:bg-[#eef1ff]"
            >
              See Elite
              <ArrowGlyph className="size-3.5" />
            </Link>
          </div>
        </>
      )}
    </Tile>
  );
}

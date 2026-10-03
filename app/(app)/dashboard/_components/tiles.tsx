import Link from "next/link";
import { ArrowGlyph } from "@/components/brand/glyphs";
import type { Course, Readiness } from "@/lib/mock/home";
import { readinessLevels } from "@/lib/mock/home";
import type { ResumeScore } from "@/lib/mock/student";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

/*
 * The four stat tiles at the top of Home. Each is one solid colour with one
 * small chart or number set.
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
        "anim-fade-up relative isolate flex h-full min-h-[210px] min-w-0 flex-col overflow-hidden rounded-[22px] p-5 sm:p-6",
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

/** A number with a small label underneath, like "6 / applied". */
function Stat({
  value,
  unit,
  label,
  light,
  muted,
}: {
  value: React.ReactNode;
  unit?: string;
  label: string;
  light?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={cn("font-mono text-[1.35rem] leading-none font-semibold tracking-[-0.03em]", muted && "opacity-35")}
      >
        {value}
        {unit && <small className="ml-0.5 text-[0.75rem] font-medium tracking-normal opacity-70">{unit}</small>}
      </p>
      <p className={cn("mt-1.5 text-[0.7rem] tracking-[0.04em] uppercase", light ? "text-white/60" : "text-ink/55")}>
        {label}
      </p>
    </div>
  );
}

const Pro = ({ light }: { light?: boolean }) => (
  <span
    className={cn(
      "rounded-full px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.06em] uppercase",
      light ? "bg-white/15 text-white" : "bg-ink/10 text-ink",
    )}
  >
    Pro
  </span>
);

/* ---------- Applications: where each one stands ---------- */

export function ApplicationsTile({
  stages,
  locked,
  style,
}: {
  /** Stage label and how many applications are at it now, in pipeline order. */
  stages: { label: string; count: number }[];
  /** From lib/access.ts: no tracker on this plan. */
  locked: boolean;
  style?: React.CSSProperties;
}) {
  const total = stages.reduce((n, st) => n + st.count, 0);
  const max = Math.max(...stages.map((st) => st.count), 1);
  return (
    <Tile style={style} className="bg-[#dde4ff] text-ink">
      <TileHead title="Applications" action={locked ? <Pro /> : <TileLink href="/applications">Tracker</TileLink>} />
      <p className="mt-1 text-[0.8rem] text-ink/60">
        {locked ? "We apply to roles you approve and track each one" : `${total} this season, by where they stand`}
      </p>
      <ul className="mt-auto grid gap-2 pt-4">
        {stages.map((st, i) => (
          <li key={st.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)_1.5rem] items-center gap-3 text-[0.8rem]">
            <span className="text-ink/70">{st.label}</span>
            <span aria-hidden className="h-2.5 overflow-hidden rounded-full bg-white/60">
              <span
                className={cn(
                  "block h-full rounded-full",
                  locked ? "bg-ink/10" : i === stages.length - 1 ? "bg-go" : "bg-cobalt",
                  styles.grow,
                )}
                style={
                  {
                    width: locked ? `${70 - i * 12}%` : `${Math.max(st.count ? 6 : 0, (st.count / max) * 100)}%`,
                    "--d": `${0.3 + i * 0.06}s`,
                  } as React.CSSProperties
                }
              />
            </span>
            <b className={cn("text-right font-mono font-semibold", (locked || st.count === 0) && "text-ink/30")}>
              {locked ? "–" : st.count}
            </b>
          </li>
        ))}
      </ul>
    </Tile>
  );
}

/* ---------- Resume: score over time ---------- */

function smoothPath(pts: [number, number][]) {
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${d} C${cx} ${py} ${cx} ${y} ${x} ${y}`;
  }, "");
}

export function ResumeTile({
  score,
  history,
  dates,
  style,
}: {
  score: ResumeScore;
  history: number[];
  dates: string[];
  style?: React.CSSProperties;
}) {
  const w = 320;
  const h = 96;
  const min = Math.min(...history) - 6;
  const max = Math.max(...history) + 4;
  const pts = history.map(
    (v, i) =>
      [
        Math.round((8 + (i / (history.length - 1)) * (w - 24)) * 10) / 10,
        Math.round((h - 10 - ((v - min) / (max - min)) * (h - 24)) * 10) / 10,
      ] as [number, number],
  );
  const [lx, ly] = pts[pts.length - 1];
  const change = history[history.length - 1] - history[history.length - 2];
  const lowest = [...score.categories].sort((a, b) => a.score - b.score)[0];
  return (
    <Tile style={style} className="bg-[#ebe8ff] text-ink">
      <TileHead title="Resume score" action={<TileLink href="/resume">Full report</TileLink>} />
      <div className="mt-4 flex gap-6" role="img" aria-label={`Resume score: ${score.overall} out of 100`}>
        <Stat value={score.overall} unit="/100" label="Now" />
        <Stat value={`${change >= 0 ? "+" : ""}${change}`} label="Last upload" />
        <Stat value={lowest.score} label={`${lowest.label} (lowest)`} />
      </div>
      <div className="mt-auto pt-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full overflow-visible" aria-hidden>
          <path
            d={smoothPath(pts)}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            strokeLinecap="round"
            className={styles.draw}
          />
          <line x1={lx} y1={ly} x2={lx} y2={h} stroke="var(--color-ink)" strokeOpacity="0.25" strokeDasharray="3 3" />
          <circle cx={lx} cy={ly} r="4.5" fill="var(--color-ink)" stroke="#ebe8ff" strokeWidth="2" />
        </svg>
        <p className="mt-1 flex justify-between text-[0.68rem] text-ink/50">
          {dates.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </p>
      </div>
    </Tile>
  );
}

/* ---------- Readiness: the level ---------- */

const RING = 163.36; // 2πr for r = 26

export function ReadinessTile({ readiness, style }: { readiness: Readiness; style?: React.CSSProperties }) {
  const current = readinessLevels[readiness.level - 1];
  const next = readinessLevels[readiness.level];
  return (
    <Tile style={style} className="bg-navy text-white shadow-[0_24px_60px_-34px_rgb(10_24_69/0.8)]">
      <TileHead title="Readiness" light />
      <div className="mt-4 flex items-center gap-4">
        <span className="relative size-16 shrink-0">
          <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden>
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="var(--color-sky)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - readiness.progress / 100)}
            />
          </svg>
          <b className="absolute inset-0 grid place-items-center font-mono text-lg font-semibold">{readiness.level}</b>
        </span>
        <div>
          <p className="text-[1.35rem] leading-tight font-semibold tracking-[-0.02em]">{current}</p>
          {next && (
            <p className="mt-0.5 text-[0.8rem] text-white/65">
              <b className="font-mono font-semibold text-sky">{readiness.progress}%</b> to {next}
            </p>
          )}
        </div>
      </div>
      <ol className="mt-auto flex gap-1.5 pt-5" aria-label={`Level ${readiness.level} of ${readinessLevels.length}`}>
        {readinessLevels.map((name, i) => (
          <li key={name} className="min-w-0 flex-1">
            <span
              className={cn(
                "block h-1.5 rounded-full",
                i + 1 < readiness.level ? "bg-sky" : i + 1 === readiness.level ? "bg-white" : "bg-white/15",
              )}
            />
            <span
              className={cn(
                "mt-1.5 block truncate text-[0.65rem]",
                i + 1 === readiness.level ? "font-semibold text-white" : "text-white/50",
              )}
            >
              {name}
            </span>
          </li>
        ))}
      </ol>
    </Tile>
  );
}

/* ---------- Courses: the next lesson ---------- */

export function CoursesTile({
  courses,
  allLessons,
  style,
}: {
  courses: Course[];
  /** From canAccess(user, "courses.allLessons"). */
  allLessons: boolean;
  style?: React.CSSProperties;
}) {
  const current = allLessons
    ? (courses.find((c) => c.next && c.done > 0) ?? courses[0])
    : (courses.find((c) => c.done === 0) ?? courses[0]);
  const lesson = current.next;
  const done = courses.reduce((n, c) => n + c.done, 0);
  const total = courses.reduce((n, c) => n + c.lessons, 0);
  return (
    <Tile style={style} className="bg-cobalt text-white shadow-[0_24px_60px_-34px_rgb(36_71_245/0.9)]">
      <TileHead
        title="Courses"
        action={
          <TileLink href="/courses" light>
            All courses
          </TileLink>
        }
      />
      <div className="mt-4 flex gap-6">
        {allLessons ? (
          <>
            <Stat value={done} unit={`/${total}`} label="Lessons done" light />
            <Stat value={lesson?.minutes ?? 0} unit="min" label="Next lesson" light />
          </>
        ) : (
          <>
            <Stat value={courses.length} label="Free lessons" light />
            <Stat value={lesson?.minutes ?? 0} unit="min" label="To start" light />
          </>
        )}
      </div>
      {lesson && (
        <div className="mt-auto pt-5">
          <p className="text-[0.72rem] text-white/65">
            {allLessons ? "Up next" : "Free"} · Lesson {lesson.number} of {current.lessons} · {current.title}
          </p>
          <p className="mt-1 max-w-[16rem] text-[0.98rem] leading-snug font-medium">{lesson.title}</p>
          <Link
            href="/courses"
            className="mt-3.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3.5 text-[0.8rem] font-medium text-ink hover:bg-[#eef1ff]"
          >
            {allLessons ? "Resume lesson" : "Start lesson"}
            <ArrowGlyph className="size-3.5" />
          </Link>
        </div>
      )}
    </Tile>
  );
}

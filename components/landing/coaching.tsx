"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { CheckGlyph } from "@/components/brand/glyphs";
import { CoachMessage } from "@/components/landing/product-ui";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

/*
 * "From the ground up", told the way a CS student would recognise it: a
 * GitHub contribution graph that starts empty and fills in, week by week, as
 * you scroll, next to the commits that got it there. Each milestone is
 * something the coach set up, planned or reviewed. Example data only.
 */

const WEEKS = 26;
const DAYS = 7;

const commits = [
  { week: 1, message: "Initial commit: portfolio site", note: "Set up with your coach" },
  { week: 2, message: "Plan first project: study-group finder", note: "Planned in your 1-1" },
  { week: 4, message: "Rewrite resume bullets with results", note: "Reviewed by your coach" },
  { week: 7, message: "Finish the data structures course", note: "From your weekly plan" },
  { week: 10, message: "Add tests and CI to the API", note: "Suggested by your coach" },
  { week: 15, message: "Mock interviews: 3 of 3 passed", note: "OA and interview prep" },
  { week: 22, message: "Offer accepted: SWE intern, Summer 2027", note: "The goal", goal: true },
];

const months = [
  { label: "Sep", col: 0 },
  { label: "Oct", col: 4 },
  { label: "Nov", col: 9 },
  { label: "Dec", col: 13 },
  { label: "Jan", col: 17 },
  { label: "Feb", col: 22 },
];

const dayLabels: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };
const milestoneCols = new Set(commits.map((c) => c.week - 1));
const MILESTONE_ROW = 3;

// Activity grows from nothing: empty in week 1, busier every week after. Deterministic.
function levelAt(col: number, row: number) {
  if (row === MILESTONE_ROW && milestoneCols.has(col)) return 4;
  if (col === 0) return 0;
  const growth = Math.min(1, col / 14);
  const noise = ((col * 37 + row * 71 + col * row * 13) % 100) / 100;
  const weekend = row === 0 || row === 6 ? 0.5 : 1;
  const v = (growth * 0.8 + noise * 0.4) * weekend - 0.1;
  return v > 0.8 ? 4 : v > 0.58 ? 3 : v > 0.38 ? 2 : v > 0.18 ? 1 : 0;
}

const LEVELS = Array.from({ length: DAYS }, (_, r) => Array.from({ length: WEEKS }, (_, c) => levelAt(c, r)));
const PER_LEVEL = [0, 1, 3, 6, 9];
const COLUMN_TOTALS = Array.from({ length: WEEKS }, (_, c) =>
  LEVELS.reduce((sum, row) => sum + PER_LEVEL[row[c]], 0),
);
const shades = ["bg-paper-deep", "bg-cobalt/20", "bg-cobalt/40", "bg-cobalt/70", "bg-cobalt"];

// What your coach is saying at each point along the way.
const notes = [
  { from: 0, text: "Let’s set up your GitHub together this week.", time: "Week 1" },
  { from: 4, text: "Good start. Next, a README with screenshots for your project.", time: "Week 4" },
  { from: 10, text: "Nice work on the tests. This project goes at the top of your resume.", time: "Week 10" },
  { from: 22, text: "Offer accepted. That’s the goal we set in week 1.", time: "Week 22" },
];

export function Coaching() {
  return (
    <Section id="coaching" labelledBy="coaching-title" tone="light">
      <SectionHeading
        id="coaching-title"
        title="Real coaching,"
        muted="from the ground up."
        lead="Starting from zero is fine. Your coach sets up your GitHub, plans your projects and picks your courses, then meets with you every week until you're hired."
      />
      <Reveal className="mt-14 md:mt-16">
        <Contributions />
      </Reveal>
    </Section>
  );
}

function Contributions() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [filled, setFilled] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "center 35%"] });

  // Scroll drives the weeks: the graph fills as the panel moves up the screen, and empties if you scroll back.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.max(0, Math.min(WEEKS, Math.floor(p * (WEEKS + 1))));
    setFilled((prev) => (prev === next ? prev : next));
  });

  const weeks = reduce ? WEEKS : filled;
  const total = COLUMN_TOTALS.slice(0, weeks).reduce((a, b) => a + b, 0);
  const note = [...notes].reverse().find((n) => weeks >= n.from) ?? notes[0];

  return (
    <div
      ref={ref}
      className="rounded-[2rem] bg-surface p-5 shadow-[0_30px_80px_-50px_rgb(10_20_51/0.45)] ring-1 ring-rule sm:p-8 lg:p-10"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
        {/* The graph */}
        <div className="min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-cobalt text-sm font-semibold text-white">
                M
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Maya</span>
                <span className="block text-xs text-slate">github.com/maya-builds</span>
              </span>
            </div>
            <p className="text-right">
              <span className="block text-3xl font-semibold tracking-[-0.03em] text-ink tabular-nums">{total}</span>
              <span className="block text-xs text-slate">contributions since week 1</span>
            </p>
          </div>

          <div
            className="mt-8 grid gap-[3px] sm:gap-1"
            style={{ gridTemplateColumns: `1.9rem repeat(${WEEKS}, minmax(0, 1fr))` }}
            role="img"
            aria-label={`Contribution graph: empty in week 1, filling in week by week to ${total} contributions`}
          >
            {/* Month labels */}
            <span />
            {Array.from({ length: WEEKS }, (_, c) => {
              const month = months.find((m) => m.col === c);
              return (
                <span key={`m-${c}`} className="h-5 overflow-visible text-[0.68rem] whitespace-nowrap text-slate">
                  {month?.label}
                </span>
              );
            })}
            {LEVELS.map((row, r) => (
              <Row key={r} row={row} r={r} weeks={weeks} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end gap-1.5 text-[0.68rem] text-slate">
            Less
            {shades.map((s) => (
              <span key={s} className={cn("size-2.5 rounded-[2px] sm:size-3", s)} />
            ))}
            More
          </div>

          {/* The coach, alongside every step */}
          <div className="mt-8 min-h-[5.5rem] border-t border-rule pt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={note.from}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <CoachMessage text={note.text} time={note.time} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* The commits behind it */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Commits</p>
            <span className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-xs text-slate ring-1 ring-rule">main</span>
          </div>
          <ol className="mt-5">
            {commits.map((c, i) => {
              const reached = c.week <= weeks;
              const last = i === commits.length - 1;
              return (
                <li key={c.message} className="relative grid grid-cols-[1rem_minmax(0,1fr)] gap-3 pb-4 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-4 bottom-0 left-[7.5px] w-px transition-colors duration-500",
                        commits[i + 1].week <= weeks ? "bg-cobalt/50" : "bg-rule",
                      )}
                    />
                  )}
                  <span
                    aria-hidden
                    className={cn(
                      "relative mt-0.5 grid size-4 place-items-center rounded-full ring-4 ring-surface transition-colors duration-500",
                      reached ? (c.goal ? "bg-go text-white" : "bg-cobalt") : "bg-rule-strong",
                    )}
                  >
                    {reached && c.goal && <CheckGlyph className="size-2.5" />}
                  </span>
                  <div className={cn("transition-opacity duration-500", reached ? "opacity-100" : "opacity-35")}>
                    <p className={cn("font-mono text-[0.8rem] leading-snug", c.goal && reached ? "text-go" : "text-ink")}>
                      {c.message}
                    </p>
                    <p className="mt-0.5 text-xs text-slate">
                      Week {c.week} · {c.note}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Row({ row, r, weeks }: { row: number[]; r: number; weeks: number }) {
  return (
    <>
      <span className="self-center text-[0.68rem] leading-none text-slate">{dayLabels[r] ?? ""}</span>
      {row.map((level, c) => {
        const on = c < weeks;
        const milestone = r === MILESTONE_ROW && milestoneCols.has(c);
        return (
          <span
            key={c}
            className={cn(
              "aspect-square rounded-[2px] transition-colors duration-300 sm:rounded-[3px]",
              on ? shades[level] : "bg-paper-deep",
              milestone && on && "ring-2 ring-cobalt/35 ring-offset-1 ring-offset-surface",
            )}
            style={{ transitionDelay: on ? `${r * 30}ms` : "0ms" }}
          />
        );
      })}
    </>
  );
}

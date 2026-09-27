"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ApplyGlyph, DiagnoseGlyph, GoalGlyph, ImproveGlyph, TrackGlyph } from "@/components/brand/glyphs";
import { cn } from "@/lib/utils";

type Stage = {
  Glyph: (p: { className?: string }) => React.ReactNode;
  short: string;
  title: string;
  body: string;
  give: string[];
  score: number;
  stat: string;
  note: string;
  coach: string;
};

// One example student, followed from day one to an offer.
const stages: Stage[] = [
  {
    Glyph: GoalGlyph,
    short: "Target",
    title: "Pick your target",
    body: "Know exactly what you're aiming for, and when recruiting opens.",
    give: ["Target setup", "Recruiting timeline", "Targeting guide"],
    score: 34,
    stat: "Target set: SWE intern, Summer 2027",
    note: "Good pick. Postings open in September, so we have 8 weeks.",
    coach: "Abishek",
  },
  {
    Glyph: DiagnoseGlyph,
    short: "Gaps",
    title: "Find your gaps",
    body: "See how your resume compares to the role, and what to fix first.",
    give: ["Resume score", "Ranked fixes", "Gap report"],
    score: 48,
    stat: "6 fixes found, 3 that matter most",
    note: "Your projects are good. Your bullets hide them.",
    coach: "Wasif",
  },
  {
    Glyph: ImproveGlyph,
    short: "Improve",
    title: "Close them with a coach",
    body: "1-1 sessions and a weekly plan keep you moving, not guessing.",
    give: ["1-1 coaching", "Weekly action plan", "Courses", "Project feedback"],
    score: 71,
    stat: "Plan: 5 of 6 tasks done this week",
    note: "Tests are in. Next week: deploy it so people can use it.",
    coach: "Abishek",
  },
  {
    Glyph: ApplyGlyph,
    short: "Apply",
    title: "Apply where you fit",
    body: "Tailored resumes, sent to the jobs you approve. Every one tracked.",
    give: ["Job matching", "Resume tailoring", "Auto-apply", "Application tracker"],
    score: 86,
    stat: "24 applied · 5 OAs · 2 interviews",
    note: "5 OAs from 24 is strong. Let's prep for the interviews.",
    coach: "Wasif",
  },
  {
    Glyph: TrackGlyph,
    short: "Offer",
    title: "Interview and land it",
    body: "Prep for OAs and interviews with coaches who've passed them.",
    give: ["OA prep", "Interview coaching", "Guides"],
    score: 92,
    stat: "SWE intern, Summer 2027",
    note: "Congrats. You earned this one.",
    coach: "Abishek",
  },
];

export function Journey() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  // The active step is the last one whose top has passed the middle of the screen.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let next = 0;
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < line) next = i;
      });
      setActive(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="journey" aria-labelledby="journey-title" className="border-y border-rule bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <div className="max-w-2xl">
          <h2
            id="journey-title"
            className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1] font-bold tracking-[-0.035em]"
          >
            From your first resume to <span className="marker">your first offer.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            We guide you through every step, and give you what you need at each one.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <ol className="relative">
            <span aria-hidden className="absolute top-6 bottom-6 left-[1.4rem] w-px bg-rule" />
            {stages.map((stage, i) => (
              <li
                key={stage.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-index={i}
                className="relative grid grid-cols-[2.8rem_1fr] gap-5 pb-14 last:pb-0 lg:min-h-[21rem] lg:pb-0"
              >
                <span
                  className={cn(
                    "relative z-10 grid size-11 place-items-center rounded-full ring-1 transition-colors duration-500",
                    i <= active ? "bg-ink text-white ring-ink" : "bg-surface text-ink ring-rule-strong",
                  )}
                >
                  <stage.Glyph className="size-5" />
                </span>
                <div
                  className={cn(
                    "pt-1 transition-opacity duration-500",
                    i === active ? "opacity-100" : "opacity-100 lg:opacity-45",
                  )}
                >
                  <p className="font-mono text-sm text-slate">Step {i + 1}</p>
                  <h3 className="mt-1 font-display text-[1.75rem] leading-tight font-bold tracking-[-0.02em]">
                    {stage.title}
                  </h3>
                  <p className="mt-2 max-w-md text-lg text-ink-soft">{stage.body}</p>
                  <p className="mt-5 text-sm font-medium text-ink">What you get</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {stage.give.map((g) => (
                      <li key={g} className="rounded-full bg-cobalt-wash px-3 py-1 text-sm text-cobalt-deep">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ProgressCard active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressCard({ active }: { active: number }) {
  const reduce = useReducedMotion();
  const stage = stages[active];
  const done = active === stages.length - 1;

  return (
    <div className="rounded-[1.4rem] bg-paper p-2 ring-1 ring-rule">
      <div className="rounded-[1.1rem] bg-surface p-6 shadow-[0_24px_60px_-30px_rgb(12_20_36/0.35)] ring-1 ring-rule">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-semibold">Maya&apos;s progress</p>
            <p className="text-sm text-slate">Target: SWE intern, Summer 2027</p>
          </div>
          <p className="text-right">
            <motion.span
              key={stage.score}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="block font-mono text-4xl font-semibold tabular-nums text-ink"
            >
              {stage.score}
            </motion.span>
            <span className="text-xs text-slate">readiness</span>
          </p>
        </div>

        {/* Milestones */}
        <div className="relative mt-7">
          {/* Dots sit at the centre of 5 equal columns, so the track runs from 10% to 90%. */}
          <div className="absolute top-[0.6rem] right-[10%] left-[10%] h-1 rounded-full bg-paper-deep" />
          <motion.div
            className="absolute top-[0.6rem] left-[10%] h-1 rounded-full bg-cobalt"
            initial={false}
            animate={{ width: `${(active / (stages.length - 1)) * 80}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <ol className="relative grid grid-cols-5">
            {stages.map((s, i) => (
              <li key={s.short} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full border-2 transition-colors duration-500",
                    i <= active ? "border-cobalt bg-cobalt" : "border-rule-strong bg-surface",
                    i === stages.length - 1 && i <= active && "border-marker bg-marker",
                  )}
                />
                <span className={cn("text-xs", i <= active ? "text-ink" : "text-slate")}>{s.short}</span>
              </li>
            ))}
          </ol>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={cn(
                "mt-7 rounded-xl px-4 py-3.5 font-medium",
                done ? "bg-ink text-white" : "bg-paper text-ink ring-1 ring-rule",
              )}
            >
              {done && <span className="mr-2 rounded bg-marker px-1.5 py-0.5 text-sm text-ink">Offer</span>}
              {stage.stat}
            </div>

            <figure className="mt-5 -rotate-1 rounded-xl bg-marker-soft p-4">
              <blockquote className="font-hand text-[1.1rem] leading-snug text-ink">“{stage.note}”</blockquote>
              <figcaption className="mt-1 font-hand text-slate">— {stage.coach}, coach</figcaption>
            </figure>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

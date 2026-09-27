"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Target = {
  id: string;
  role: string;
  season: string;
  score: number;
  verdict: string;
  categories: { label: string; value: number }[];
  gaps: string[];
  note: string;
  coach: string;
  jobs: { fit: number; close: number; skipped: number };
};

// Example data only. Categories match the resume rubric in docs/frontend/PHASES.md.
const TARGETS: Target[] = [
  {
    id: "ml",
    role: "ML intern",
    season: "Winter 2027",
    score: 62,
    verdict: "Close. Three gaps stand between you and OAs.",
    categories: [
      { label: "Impact", value: 54 },
      { label: "Technical depth", value: 71 },
      { label: "Clarity", value: 63 },
      { label: "Formatting", value: 82 },
    ],
    gaps: ["No deployed ML project", "Bullets list tasks, not results", "PyTorch missing from skills"],
    note: "Ship one model people can actually use before Nov 1. Everything else waits.",
    coach: "Abishek",
    jobs: { fit: 14, close: 5, skipped: 212 },
  },
  {
    id: "swe",
    role: "SWE intern",
    season: "Summer 2027",
    score: 74,
    verdict: "Strong base. Your projects need proof.",
    categories: [
      { label: "Impact", value: 66 },
      { label: "Technical depth", value: 79 },
      { label: "Clarity", value: 75 },
      { label: "Formatting", value: 71 },
    ],
    gaps: ["Only class projects so far", "No tests or CI in any repo", "Resume runs to two pages"],
    note: "Cut to one page first. Then get your best project a real user.",
    coach: "Wasif",
    jobs: { fit: 31, close: 9, skipped: 486 },
  },
  {
    id: "data",
    role: "Data analyst",
    season: "New grad 2027",
    score: 58,
    verdict: "Early. Fix the basics before you apply.",
    categories: [
      { label: "Impact", value: 49 },
      { label: "Technical depth", value: 57 },
      { label: "Clarity", value: 61 },
      { label: "Formatting", value: 77 },
    ],
    gaps: ["No SQL beyond coursework", "Dashboards answer no business question", "Skills section is a keyword list"],
    note: "Pick one public dataset and answer a question a manager would pay for.",
    coach: "Abishek",
    jobs: { fit: 9, close: 7, skipped: 158 },
  },
];

const CYCLE_MS = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (!enabled) {
      from.current = target;
      return;
    }
    const start = performance.now();
    const origin = from.current;
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const next = Math.round(origin + (target - origin) * eased);
      setValue(next);
      from.current = next;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);

  return enabled ? value : target;
}

export function GoalConsole({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  // The first report waits for the page-load sequence; later switches animate right away.
  const [switched, setSwitched] = useState(false);
  const late = switched ? 0 : 0.9;
  const [hovering, setHovering] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const target = TARGETS[index];
  const animate = !reduce;
  const score = useCountUp(target.score, animate);

  // Cycle through targets until the visitor takes over.
  useEffect(() => {
    if (reduce || touched || hovering || !inView) return;
    const timer = window.setTimeout(() => {
      setSwitched(true);
      setIndex((i) => (i + 1) % TARGETS.length);
    }, CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [index, reduce, touched, hovering, inView]);

  const select = useCallback((i: number, focus = false) => {
    setTouched(true);
    setSwitched(true);
    setIndex(i);
    if (focus) tabsRef.current[i]?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = TARGETS.length - 1;
    if (e.key === "ArrowRight") select(index === last ? 0 : index + 1, true);
    else if (e.key === "ArrowLeft") select(index === 0 ? last : index - 1, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(last, true);
    else return;
    e.preventDefault();
  };

  const total = target.jobs.fit + target.jobs.close + target.jobs.skipped;

  return (
    <div
      ref={rootRef}
      style={{ "--d": "0.35s" } as React.CSSProperties}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={cn(
        "anim-fade-up relative rounded-[1.4rem] bg-surface shadow-[0_1px_0_rgb(12_20_36/0.04),0_24px_60px_-24px_rgb(12_20_36/0.28)] ring-1 ring-rule",
        className,
      )}
    >
      {/* Target switcher */}
      <div className="flex flex-col gap-3 border-b border-rule px-5 pt-4 pb-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Your target</p>
        </div>
        <div
          role="tablist"
          aria-label="Example targets"
          onKeyDown={onKeyDown}
          className="grid grid-cols-3 gap-1 rounded-2xl bg-paper p-1"
        >
          {TARGETS.map((t, i) => {
            const selected = i === index;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`target-tab-${t.id}`}
                aria-selected={selected}
                aria-controls="target-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "relative isolate flex min-w-0 flex-col rounded-xl px-2.5 py-2 text-left transition-colors sm:px-3",
                  selected ? "text-white" : "text-ink-soft hover:bg-surface",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="target-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    className="absolute inset-0 rounded-xl bg-ink"
                  />
                )}
                <span className="relative text-[0.8rem] leading-tight font-medium sm:text-[0.84rem]">{t.role}</span>
                <span
                  className={cn(
                    "relative mt-0.5 font-mono text-[0.66rem] leading-tight sm:text-[0.68rem]",
                    selected ? "text-white/65" : "text-slate",
                  )}
                >
                  {t.season}
                </span>
                {selected && !touched && !reduce && (
                  <motion.span
                    key={`progress-${index}`}
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hovering || !inView ? 0 : 1 }}
                    transition={{ duration: hovering || !inView ? 0 : CYCLE_MS / 1000, ease: "linear" }}
                    className="absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-marker"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div id="target-panel" role="tabpanel" aria-labelledby={`target-tab-${target.id}`}>
        {/* Score */}
        <div className="grid gap-5 border-b border-rule px-5 py-5 sm:grid-cols-[auto_1fr] sm:gap-8 sm:px-6">
          <div className="min-w-[9.5rem]">
            <p className="eyebrow">Readiness</p>
            <p className="mt-1 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-[3.4rem] leading-none font-semibold tracking-[-0.04em] text-ink">{score}</span>
              <span className="text-sm text-slate">/100</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={target.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-2 max-w-[13rem] text-[0.84rem] leading-snug text-ink-soft"
              >
                {target.verdict}
              </motion.p>
            </AnimatePresence>
          </div>
          <ul className="grid content-center gap-2.5" aria-label="Score by category">
            {target.categories.map((c, i) => (
              <li key={c.label} className="grid grid-cols-[7.2rem_1fr_2rem] items-center gap-3 text-[0.8rem]">
                <span className="text-ink-soft">{c.label}</span>
                <span className="relative h-1.5 overflow-hidden rounded-full bg-paper-deep">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-cobalt"
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.07, ease }}
                  />
                </span>
                <span className="text-right font-mono tabular-nums text-slate">{c.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps + coach note */}
        <div className="relative border-b border-rule px-5 py-5 sm:px-6">
          <p className="eyebrow">Top 3 gaps · picked by your coach</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              className="md:grid md:grid-cols-[1fr_13.5rem] md:gap-4"
            >
              <ol className="mt-3 space-y-2.5">
                {target.gaps.map((gap, i) => (
                  <li key={gap} className="flex items-baseline gap-3 text-[0.92rem] text-ink">
                    <span className="font-mono text-xs text-slate">{i + 1}</span>
                    {i === 0 ? (
                      <motion.span
                        className="marker font-medium"
                        initial={{ "--marker-progress": 0 } as Record<string, number>}
                        animate={{ "--marker-progress": 1 } as Record<string, number>}
                        transition={{ duration: 0.7, delay: 0.2 + late, ease }}
                      >
                        {gap}
                      </motion.span>
                    ) : (
                      <span>{gap}</span>
                    )}
                  </li>
                ))}
              </ol>

              <figure className="relative mt-4 md:mt-1">
                {/* Hand-drawn arrow from the note back to gap 1 (desktop only). */}
                <svg
                  viewBox="0 0 60 40"
                  aria-hidden
                  className="absolute -top-2 -left-12 hidden h-10 w-14 text-ink-soft md:block"
                  fill="none"
                >
                  <motion.path
                    d="M56 30C44 32 26 26 12 10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + late, ease }}
                  />
                  <motion.path
                    d="M10 19L11.5 9 20 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, delay: 1.1 + late }}
                  />
                </svg>
                <motion.blockquote
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 1, delay: 0.8 + late, ease: "easeInOut" }}
                  className="-rotate-[1.5deg] font-hand text-[1.02rem] leading-[1.35] text-ink-soft"
                >
                  “{target.note}”
                </motion.blockquote>
                <motion.figcaption
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + late, duration: 0.4 }}
                  className="mt-1 -rotate-[1.5deg] font-hand text-sm text-slate"
                >
                  — {target.coach}, your coach
                </motion.figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Jobs */}
        <div className="px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="eyebrow">Jobs found this week</p>
            <p className="font-mono text-[0.72rem] text-slate tabular-nums">{total} scanned</p>
          </div>
          <div className="mt-2.5 flex h-2 gap-0.5 overflow-hidden rounded-full" aria-hidden>
            <motion.span
              className="rounded-full bg-cobalt"
              animate={{ flexGrow: target.jobs.fit }}
              style={{ minWidth: 6, flexBasis: 0 }}
              transition={{ duration: 0.8, ease }}
            />
            <motion.span
              className="rounded-full bg-cobalt/35"
              animate={{ flexGrow: target.jobs.close }}
              style={{ minWidth: 6, flexBasis: 0 }}
              transition={{ duration: 0.8, ease }}
            />
            <motion.span
              className="rounded-full bg-paper-deep"
              animate={{ flexGrow: target.jobs.skipped }}
              style={{ flexBasis: 0 }}
              transition={{ duration: 0.8, ease }}
            />
          </div>
          <dl className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[0.8rem] text-ink-soft">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-cobalt" aria-hidden />
              <dt className="sr-only">Fit you</dt>
              <dd>
                <span className="font-mono font-semibold text-ink tabular-nums">{target.jobs.fit}</span> fit you
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-cobalt/35" aria-hidden />
              <dt className="sr-only">One skill away</dt>
              <dd>
                <span className="font-mono font-semibold text-ink tabular-nums">{target.jobs.close}</span> one skill away
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-paper-deep ring-1 ring-rule-strong" aria-hidden />
              <dt className="sr-only">Skipped</dt>
              <dd>
                <span className="font-mono font-semibold text-ink tabular-nums">{target.jobs.skipped}</span> skipped
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
